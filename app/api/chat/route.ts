import { OpenAI } from "openai"
import { NextResponse } from "next/server"
import { toFile } from "openai/uploads"

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
})

// Initialize Grok (xAI) client
const xai = new OpenAI({
    apiKey: process.env.XAI_API_KEY || "",
    baseURL: "https://api.x.ai/v1",
})

import axios from "axios"
import * as cheerio from "cheerio"

// Helper to perform internal knowledge search + smart link generation
async function performWebSearch(query: string) {
    const q = query.toLowerCase();

    // 1. Direct Knowledge Base (Hardcoded Official Links)
    const GOV_LINKS: Record<string, string> = {
        "passport": "https://passportindia.gov.in",
        "pan": "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
        "aadhaar": "https://uidai.gov.in",
        "voter": "https://voters.eci.gov.in",
        "upsc": "https://upsc.gov.in",
        "ssc": "https://ssc.nic.in",
        "railway": "https://indianrailways.gov.in",
        "ncs": "https://www.ncs.gov.in",
        "career": "https://www.ncs.gov.in",
        "job": "https://www.ncs.gov.in",
        "pm kisan": "https://pmkisan.gov.in",
        "epfo": "https://www.epfindia.gov.in",
        "itr": "https://www.incometax.gov.in",
        "gst": "https://www.gst.gov.in",
        "digilocker": "https://www.digilocker.gov.in",
        "umang": "https://web.umang.gov.in",
        "ayushman": "https://pmjay.gov.in",
        "ration": "https://nfsa.gov.in",
        "scholarship": "https://scholarships.gov.in",
        "driving": "https://parivahan.gov.in",
        "scheme": "https://www.myscheme.gov.in"
    };

    const results: string[] = [];

    // Check for matches in knowledge base
    for (const [key, url] of Object.entries(GOV_LINKS)) {
        if (q.includes(key)) {
            results.push(`- **Official ${key.toUpperCase()} Portal**: [${url}](${url})`);
        }
    }

    if (results.length > 0) {
        return results.join("\n");
    }

    // 2. Fallback: Generate a helpful Search Link for ANY query
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + " india")}`;
    return `GENERAL_SEARCH_LINK: [Click here to search Google for "${query}"](${searchUrl})`;
}

// Helper to process attachments (files and URLs)
async function processAttachments(attachments: any[]) {
    const processed = {
        textContext: "",
        imageUrls: [] as string[]
    };

    if (!attachments || attachments.length === 0) return processed;

    for (const att of attachments) {
        if (att.type === "url" && att.url) {
            try {
                // Fetch URL content
                const response = await axios.get(att.url, {
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                const $ = cheerio.load(response.data);

                // Extract text content (remove scripts, styles)
                $('script, style, nav, footer, header').remove();
                const textContent = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 2000);

                processed.textContext += `\n**Content from URL (${att.name}):**\n${textContent}\n`;
            } catch (error) {
                processed.textContext += `\n**URL (${att.name}):** Unable to fetch content. URL: ${att.url}\n`;
            }
        } else if (att.type === "file") {
            // Check MIME types
            if (att.mimeType?.startsWith("image/")) {
                // Collect image URLs (base64) for Vision API
                processed.imageUrls.push(att.data);
                processed.textContext += `\n[Image Attached: ${att.name}]\n`;
            } else if (att.mimeType?.startsWith("audio/")) {
                // Audio Transcription via Whisper
                try {
                    // Convert base64 to buffer
                    const base64Data = att.data.split(';base64,').pop();
                    const buffer = Buffer.from(base64Data, 'base64');

                    // Create a File object for OpenAI API
                    const file = await toFile(buffer, "audio.mp3", { type: "audio/mpeg" });

                    const transcription = await openai.audio.transcriptions.create({
                        file: file,
                        model: "whisper-1",
                    });

                    processed.textContext += `\n[Audio Transcription (${att.name})]: "${transcription.text}"\n`;
                } catch (err: any) {
                    console.error("Whisper Error:", err);
                    processed.textContext += `\n[Audio Error]: Could not transcribe audio file: ${att.name}\n`;
                }
            } else if (att.mimeType === "application/pdf") {
                // Basic placeholder for PDF - full PDF parsing requires pdf-parse or similar lib not installed
                // Inform the AI to ask the user for details
                processed.textContext += `\n**PDF File Attached:** ${att.name}\n(Note to AI: You cannot currently read the contents of this PDF file directly. Please ask the user to copy-paste relevant text or summarize the document if they need help with it.)\n`;
            } else {
                // Plain text files
                if (att.mimeType === "text/plain") {
                    try {
                        const base64Data = att.data.split(';base64,').pop();
                        const text = Buffer.from(base64Data, 'base64').toString('utf-8');
                        processed.textContext += `\n**File Content (${att.name}):**\n${text.slice(0, 2000)}\n`;
                    } catch (e) {
                        processed.textContext += `\n**File:** ${att.name} (Unable to read text)\n`;
                    }
                } else {
                    processed.textContext += `\n**File:** ${att.name} (Type: ${att.mimeType})\n`;
                }
            }
        }
    }

    return processed;
}

export async function POST(req: Request) {
    try {
        const { messages, provider = "openai", language = "en" } = await req.json()

        // Extract the latest user message
        const lastUserMsgIndex = messages.length - 1;
        const lastUserMessageObj = messages[lastUserMsgIndex];
        const lastUserContent = lastUserMessageObj.content;
        const lastMessageAttachments = lastUserMessageObj.attachments;

        console.log("Analyzing Query:", lastUserContent, "Language:", language)

        // 1. Perform Live Search (Always useful for context)
        const liveSearchResults = await performWebSearch(lastUserContent)

        // 2. Process Attachments (Images, Audio, Docs)
        let processedData = { textContext: "", imageUrls: [] as string[] };
        if (lastMessageAttachments && lastMessageAttachments.length > 0) {
            console.log("Processing attachments:", lastMessageAttachments.length);
            processedData = await processAttachments(lastMessageAttachments);
        }

        // 3. Construct System Prompt
        const systemPrompt = {
            role: "system",
            content: `You are GovAssist, an AI assistant for Indian Citizens.
      
      **CORE INSTRUCTIONS:**
      1.  **Language**: Respond in ${language === 'hi' ? "**HINDI (Devanagari)**" : "English"}.
      2.  **Be Detailed & Helpful**: The user wants an EXPLANATION, not just a link. Explain processes step-by-step.
      3.  **Use Context Wisely**: Use the provided live web context to ensure your facts are accurate, but do not just list links. Integrate them into your explanation.
      4.  **Creative Tasks**: If asked to write a letter, essay, or code, do it fully and creatively.
      5.  **Format**: Use Markdown (bolding, lists) for readability.
      6.  **Visuals**: If images are provided, analyze them in detail. If audio is provided, read the transcription and respond to it.
      
      **LIVE WEB CONTEXT:**
      ${liveSearchResults}
      
      ${processedData.textContext ? `**ATTACHMENT CONTEXT:**\n${processedData.textContext}\n` : ""}
      
      Time: ${new Date().toLocaleString()}`
        }

        let response;
        let isMock = false;
        let apiErrorDetail = null;

        // 4. Construct Final Messages for API
        // Sanitize history: strip 'attachments' and 'id' from old messages to keep API clean
        // Also ensure content is string for history, unless we want to support multi-turn vision history (simplifying for now)
        const apiMessages = messages.slice(0, -1).map((m: any) => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) // Fallback for complex content in history
        }));

        // Construct the *current* message with multimodal support
        let currentUserMessageContent: any = lastUserContent;

        // If we have images, switch to array format
        if (processedData.imageUrls.length > 0) {
            currentUserMessageContent = [
                { type: "text", text: lastUserContent + (processedData.textContext ? `\n\n${processedData.textContext}` : "") },
                ...processedData.imageUrls.map(url => ({
                    type: "image_url",
                    image_url: { url: url }
                }))
            ];
        } else {
            // Appending context to text if no images forced format change
            currentUserMessageContent = lastUserContent + (processedData.textContext ? `\n\n${processedData.textContext}` : "");
        }

        apiMessages.push({
            role: "user",
            content: currentUserMessageContent
        });

        // DYNAMIC PROVIDER SELECTION
        try {
            const isGrok = provider === "grok";
            const client = isGrok ? xai : openai;
            // Use gpt-4o-mini for best balance of cost/speed/vision
            const model = isGrok ? "grok-beta" : "gpt-4o-mini";

            console.log(`Attempting AI Call with ${provider} (${model})...`);

            const completion = await client.chat.completions.create({
                model: model,
                messages: [systemPrompt, ...apiMessages],
                temperature: 0.7,
                max_tokens: 1500,
            });

            response = completion.choices[0].message.content;
            console.log(`${provider} Explanation Success!`);
            isMock = false;
        } catch (aiError: any) {
            console.error(`AI API Error (${provider}):`, aiError.message);
            apiErrorDetail = aiError.code || aiError.message;
            isMock = true;

            // Handle Insufficient Quota expressly
            if (aiError.code === 'insufficient_quota') {
                console.error("CRITICAL: OPENAI QUOTA EXCEEDED. Please check billing.");
                apiErrorDetail = "insufficient_quota";
            }

            // FALLBACK - Generate mock response
            response = generateMockResponse(messages, liveSearchResults, language, lastMessageAttachments);
        }

        return NextResponse.json({
            content: response,
            isMock,
            debugError: apiErrorDetail
        })

    } catch (error: any) {
        console.error("AI API Error:", error)
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        )
    }
}

function generateMockResponse(messages: any[], webResults: string = "", language: string = "en", attachments: any[] = []) {
    const lastMessage = messages[messages.length - 1].content.toLowerCase();

    // 0. Handle Attachments (Mock Acknowledgment)
    if (attachments && attachments.length > 0) {
        const attNames = attachments.map((a: any) => a.name).join(", ");
        return `I have received your attachment(s): **${attNames}**. 
        
Since I am currently in basic mode, I cannot deeply analyze the file contents yet. However, I can still help you with general procedures related to your query about **"${lastMessage}"** if you ask specific questions.

*For example: "What documents do I need for this form?"*`;
    }

    // DETAILED PRE-WRITTEN RESPONSES (The "Brain")
    const knowledgeBase: Record<string, string> = {
        "passport": `**How to Apply for a Passport:**\n\n1. **Register**: Visit the [Passport Seva Portal](https://passportindia.gov.in) and create an account.\n2. **Fill Application**: Login and choose "Apply for Fresh Passport". Fill in your details carefully.\n3. **Pay & Schedule**: You must pay the fee online (approx ₹1500) to book an appointment.\n4. **Visit Kendra**: Go to your PSK (Passport Seva Kendra) with original documents (Aadhaar, PAN, Voter ID).\n5. **Police Verification**: After the visit, the police will verify your address.\n\n*Pro Tip: Keep your Aadhaar linked to your mobile for faster processing.*`,

        "pan": `**Applying for a PAN Card:**\n\n1. **Visit NSDL or UTIITSL**: [NSDL Portal](https://www.onlineservices.nsdl.com) is the most common.\n2. **Form 49A**: Select "New PAN - Indian Citizen" (Form 49A).\n3. **KYC**: You can use Aadhaar e-KYC for instant applications (no physical docs needed).\n4. **Payment**: The fee is ₹101 for physical cards.\n5. **Delivery**: It will be delivered to your Aadhaar address in 15-20 days.\n\n*Instant PAN: You can get an e-PAN in 10 minutes if your mobile is linked to Aadhaar.*`,

        "aadhaar": `**Aadhaar Services:**\n\nTo update your Aadhaar:\n1. Visit [myAadhaar](https://myaadhaar.uidai.gov.in).\n2. Login with OTP.\n3. You can update Address online easily.\n4. For **Biometrics** (Photo, Fingerprint) or **Mobile Number** update, you MUST visit an Aadhaar Center nearby.\n\n*Check Status: You can also track your update request on the same portal.*`,

        "voter": `**Voter ID Registration (Form 6):**\n\n1. Go to the [Voter Service Portal](https://voters.eci.gov.in).\n2. Sign up and select "New Registration for General Electors" (Form 6).\n3. Upload your photo and an address proof (Aadhaar is best).\n4. Submit. A BLO (Booth Level Officer) may visit for verification.\n5. You will get your EPIC number via SMS.`,

        "driving": `**Driving License (DL) Process:**\n\n1. **Learner's License (LL)**: Apply on [Parivahan Sarathi](https://sarathi.parivahan.gov.in). Take the online test from home.\n2. **Wait 30 Days**: You must hold an LL for at least 30 days.\n3. **Book Slot**: Apply for "New Driving License" and book a track test slot.\n4. **Test**: Pass the driving test at the RTO.\n5. **Dispatch**: The DL will arrive by speed post.`,

        "ration": `**Ration Card Application:**\n\nRation cards are managed by State Governments.\n1. Visit [NFSA.gov.in](https://nfsa.gov.in) to find your state portal.\n2. Look for "Apply for New Ration Card".\n3. You need Income Certificate and Aadhaar of the head of family.\n4. Submit online or at a Common Service Center (CSC).`,

        "income": `**Income Certificate:**\n\nUsed for scholarships and EWS reservation.\n1. Go to your **State e-District Portal**.\n2. Register and fill the Income Certificate form.\n3. Upload an affidavit declaring your income.\n4. Approval usually takes 7-14 days signed by the Tehsildar.`,

        // EXPANDED KNOWLEDGE BASE
        "caste": `**Caste Certificate (SC/ST/OBC):**\n\n1. Visit your **State e-District Portal**.\n2. Apply for "Issuance of Caste Certificate".\n3. **Documents**: Aadhaar, Father's Caste Certificate, Address Proof.\n4. **Verification**: A local Patwari or SDM will verify the details.\n5. **Timeline**: usually 14-21 days.`,
        "domicile": `**Domicile/Residence Certificate:**\n\nProof that you live in a specific state.\n1. Apply on the state e-District website.\n2. **Proof**: Ration Card, Aadhaar, Electricity Bill, or School Certificates showing residence for 3+ years.\n3. Essential for state quotas in jobs and education.`,
        "marriage": `**Marriage Registration:**\n\n1. Visit the Civil Registrar's office or state portal.\n2. Both partners must fill the form.\n3. **Witnesses**: You usually need 2-3 witnesses with ID proof.\n4. **Fee**: Nominal (around ₹100-500).\n5. Certificate is issued same-day or within a week.`,
        "birth": `**Birth Certificate:**\n\n1. **Within 21 Days**: Apply at the local Municipality/Panchayat for free.\n2. **Late Registration**: Requires an affidavit and sometimes a court order.\n3. **Online**: Most states (like Delhi, UP, Kerala) allow online application via their e-Municipal portals.`,
        "death": `**Death Certificate:**\n\n1. Must be reported to the local Registrar (Municipality/Panchayat) within 21 days.\n2. **Documents**: Doctor's proof of death, ID of the deceased, and Cremation/Burial receipt.\n3. Apply online on the state's Civil Registration System (CRS).`,
        "job": `**Government Jobs:**\n\nKey portals to check:\n1. **NCS (National Career Service)**: [www.ncs.gov.in](https://www.ncs.gov.in)\n2. **UPSC**: For IAS, IPS, IFS exams.\n3. **SSC**: For staff selection roles.\n4. **Employment News**: Weekly newspaper for all central/state listings.`,
        "scholarship": `**Scholarships:**\n\nVisit the **National Scholarship Portal (NSP)**: [scholarships.gov.in](https://scholarships.gov.in)\n1. Register as a student.\n2. Browse schemes for your category (Pre-Matric, Post-Matric, Merit-cum-Means).\n3. Apply nicely before the deadline (usually Aug-Nov).`,
        "complaint": `**File a Consumer Complaint:**\n\nitem defect? Service issue?\n1. Call **1915** (National Consumer Helpline).\n2. Register online at [consumerhelpline.gov.in](https://consumerhelpline.gov.in).\n3. Or use the **INGRAM** portal to file a grievance against any company.`,

        // CONVERSATIONAL & GENERAL KNOWLEDGE
        "hello": "Namaste! I am GovAssist. I am here to help you with Indian Government Services. How can I assist you?",
        "hi": "Hello! How can I help you today?",
        "how are you": "I am an AI, so I don't have feelings, but I am functioning perfectly to help you!",
        "who are you": "I am GovAssist, an AI assistant designed to help Indian citizens navigate government services and schemes.",
        "what can you do": "I can help you with:\n- Applying for documents (PAN, Passport, etc.)\n- Finding Government Schemes\n- Drafting Applications\n- Answering queries about eligibility.",
        "thank": "You're most welcome! Let me know if you need anything else.",
        "help": "I am here to help! specificy your query, like 'How to apply for Ration Card' or 'Post Office Schemes'.",
        "good morning": "Good Morning! How can I assist you with your applications today?",
        "good evening": "Good Evening! How can I help you?",
        "good night": "Good Night! Feel free to ask me anything anytime.",
        "namaste": "Namaste! 🙏 How can I help you regarding government services?",
        "bye": "Goodbye! Have a great day ahead.",

        "joke": "Why did the scarecrow win an award? Because he was outstanding in his field! 😄",
        "weather": "I cannot check live weather yet, but you can check it on the [IMD Website](https://mausam.imd.gov.in/).",
        "time": `The current time is ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}.`,
        "date": `Today's date is ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}.`,
        "india": "India is a federal union comprising 28 states and 8 union territories, for a total of 36 entities. It is the world's most populous democracy.",
        "prime minister": "The Prime Minister of India is the head of government. You can find more details at [pmindia.gov.in](https://www.pmindia.gov.in).",
        "president": "The President of India is the head of state. You can find more details at [presidentofindia.nic.in](https://presidentofindia.nic.in).",
        "capital": "The capital of India is New Delhi.",
    };

    // 1. Search Knowledge Base (Fuzzy Match)
    // Check if ANY keyword from the key phrase exists in the user message
    for (const [key, answer] of Object.entries(knowledgeBase)) {
        // Simple check: if the key is explicitly in the message
        if (lastMessage.includes(key)) {
            return answer;
        }

        // Split key into words (e.g. "prime minister")
        const keyWords = key.split(" ");
        if (keyWords.length > 1) {
            // If all words of the key are present (e.g. "who is prime minister")
            if (keyWords.every(word => lastMessage.includes(word))) {
                return answer;
            }
        }
    }

    // 2. Fallback to Web Results if beneficial
    if (webResults && !webResults.includes("GENERAL_SEARCH_LINK") && !webResults.includes("No live results")) {
        const formattedResults = webResults.replace(/- \*\*(.*?)\*\*: \[(.*?)\]\((.*?)\)/g, "👉 **$1**: [Click Here to Open]($3)");
        return `I found these official resources for you:\n\n${formattedResults}\n\n*Please visit the link for specific forms.*`;
    }

    // 3. Smart Generic & Confident Response
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(lastMessage + " government of india process")}`;

    // If query is very short/unclear
    if (lastMessage.length < 5) {
        return "Could you please provide more details? I can offer tailored help for queries like 'How to apply for Ration Card' or 'Check PNR status'.";
    }

    return `I am currently operating in **Basic Mode** (Offline) as the advanced AI server is busy.

However, I can guide you! regarding **"${lastMessage}"**:

1.  **Search Official Portal**: The best source is usually **India.gov.in** or your state's **e-District** portal.
2.  **Google Search**: You can find the exact direct link here:
👉 [Click to Search for "${lastMessage}"](${searchUrl})

*Tip: Try asking about specific documents like 'Passport', 'PAN', or 'Income Certificate' for a detailed guide.*`;
}
