# File & URL Attachment Feature

## Overview
The GovAssist AI chat now supports file uploads and URL attachments. The AI can analyze and explain the content of uploaded files and web pages.

## Features

### 1. **File Upload**
- **Supported File Types:**
  - Images (JPG, PNG, GIF, etc.)
  - PDF documents
  - Text files (.txt, .doc, .docx)
  
- **How to Use:**
  1. Click the **📎 Paperclip** icon in the chat input area
  2. Select one or multiple files from your computer
  3. Files will appear as chips above the input box
  4. Type your question or leave it blank
  5. Click Send

### 2. **URL Attachment**
- **What it does:** Fetches and analyzes content from any web page
  
- **How to Use:**
  1. Click the **🔗 Link** icon in the chat input area
  2. Enter the URL (e.g., `https://example.com`)
  3. Press Enter or click "Add"
  4. The URL will appear as a chip above the input box
  5. Type your question about the URL content
  6. Click Send

### 3. **Attachment Management**
- **Preview:** All attachments show as chips with icons:
  - 🖼️ Blue icon for images
  - 📄 Green icon for documents
  - 🔗 Purple icon for URLs
  
- **Remove:** Click the ❌ icon on any attachment chip to remove it

## Example Use Cases

### Government Document Analysis
```
User: [Uploads PDF of application form]
"Can you explain what documents I need for this form?"

AI: Analyzes the PDF and lists required documents
```

### Website Content Explanation
```
User: [Adds URL: https://passportindia.gov.in]
"What are the steps to apply for a passport?"

AI: Reads the website and provides step-by-step instructions
```

### Image Analysis (Coming Soon)
```
User: [Uploads image of government notice]
"What does this notice say?"

AI: Will analyze and explain the image content
```

## Technical Details

### File Processing
- Files are converted to **base64** format on the client side
- Sent to the API along with metadata (name, type, size)
- Currently supports text extraction from URLs
- PDF and image analysis coming in future updates

### URL Processing
- Uses **axios** to fetch web page content
- Uses **cheerio** to parse HTML and extract text
- Removes navigation, scripts, and styling
- Limits content to 2000 characters for efficiency

### Privacy & Security
- Files are processed in-memory only
- No files are permanently stored on the server
- URL content is fetched server-side for security

## Limitations (Current Version)

1. **File Size:** Large files (>5MB) may take longer to upload
2. **PDF Text Extraction:** Not yet implemented (shows file received)
3. **Image Analysis:** Not yet implemented (shows file received)
4. **URL Timeout:** 5 seconds max for fetching URL content
5. **Protected URLs:** Cannot access pages requiring login

## Future Enhancements

- [ ] PDF text extraction using pdf-parse
- [ ] Image analysis using OpenAI Vision API
- [ ] Support for Excel/CSV files
- [ ] Drag-and-drop file upload
- [ ] File size validation and compression
- [ ] Multiple language support for extracted content
