
# GovAssist - AI for Government Services

GovAssist is a generative AI assistant designed to guide citizens through government services. It simplifies access to public schemes, assists with form filling, and answers procedural questions in natural language.

## Features

- **AI Chat Assistant**: Ask questions like "How to apply for a passport?" or "Am I eligible for PM-KISAN?".
- **Scheme Explorer**: Browse and search government schemes with eligibility checks.
- **Form Filling Guide**: Step-by-step assistance for complex forms.
- **Multi-language Ready**: Designed for accessibility.
- **Modern UI**: Clean, responsive, and trustworthy design.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Components**: Radix UI / Shadcn primitives
- **Language**: TypeScript

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Configure API Keys**:
    Create a `.env.local` file in the root directory (use `.env.local.example` as a template) and add your API keys:
    ```bash
    OPENAI_API_KEY=your_openai_key
    XAI_API_KEY=your_xai_key
    
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
    If keys are missing, the assistant will show a friendly error message.

3.  **Running the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI and feature-specific components.
- `lib/`: Utility functions.
- `public/`: Static assets.

## Future Roadmap

- Integration with real LLM (OpenAI/Gemini/Anthropic).
- Backend connectivity to legitimate government APIs (Mocked currently).
- Document upload and verification.
- Voice interaction support.
