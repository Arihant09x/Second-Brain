# Second Brain App Backend

This is the backend server for the Second Brain App, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication (signup/signin)
- Content management (YouTube, Twitter, Links)
- AI conversations with Gemini integration
- Document upload and management
- File storage with multer
- JWT-based authentication

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/second-brain-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# AI Configuration (Optional - for real Gemini AI integration)
GEMINI_API_KEY=your-gemini-api-key-here
```

3. Build and run the server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/v1/signup` - User registration
- `POST /api/v1/signin` - User login

### Content Management

- `POST /api/v1/content` - Create content
- `GET /api/v1/content` - Get user's content
- `DELETE /api/v1/content` - Delete content

### Links

- `POST /api/v1/links` - Create link
- `GET /api/v1/links` - Get user's links
- `DELETE /api/v1/links/:id` - Delete link

### AI Conversations

- `POST /api/v1/ai/ask` - Ask AI a question
- `GET /api/v1/ai/conversations` - Get user's conversations

### Documents

- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents` - Get user's documents
- `GET /api/v1/documents/:id/download` - Download document
- `DELETE /api/v1/documents/:id` - Delete document

### Sharing

- `POST /api/v1/brain/share` - Share brain
- `GET /api/v1/brain/:shareLink` - Get shared brain

## File Upload

The server supports uploading the following file types:

- PDF files
- PowerPoint presentations (PPT, PPTX)
- Word documents (DOC, DOCX)
- Excel spreadsheets (XLS, XLSX)
- Text files (TXT)

Files are stored in the `uploads/` directory and served statically.

## AI Integration

The AI feature currently returns mock responses. To enable real Gemini AI integration:

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the API key to your `.env` file
3. Install the Google AI SDK: `npm install @google/generative-ai`
4. Update the `askGeminiAI` function in `src/index.ts` to use the actual SDK

## Database Models

- **User**: User accounts and authentication
- **Content**: YouTube, Twitter, and other content
- **Links**: User's saved links
- **AIConversation**: AI chat history
- **Document**: Uploaded documents
- **Link**: Sharing links for brains
