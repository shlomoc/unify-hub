# Dani Github Analyzer

A modern web application for analyzing GitHub repositories, built with React, TypeScript, and Supabase. The application provides insights into repositories through a user-friendly interface with API key management capabilities.

## Features

- **GitHub Repository Analysis**: Fetch and analyze README content from any public GitHub repository
- **API Key Management**: Create, view, and manage API keys with usage limits
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Authentication**: Secure user authentication powered by Supabase
- **Responsive Design**: Fully responsive layout that works on all devices

## Project Structure

```
src/
├── components/         # React components
│   ├── api-key/       # API key management components
│   ├── ui/            # shadcn/ui components
│   └── Sidebar.tsx    # Main navigation sidebar
├── lib/               # Utility libraries
├── pages/             # Page components
└── utils/             # Utility functions
```

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or bun package manager
- A Supabase account and project

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

## Key Features and Usage

### Authentication
- Users can sign in using email/password
- Protected routes ensure secure access to dashboard and API playground

### Dashboard
- View and manage API keys
- Monitor usage statistics
- Create new API keys with custom limits

### API Playground
- Test GitHub repository analysis
- Input repository URLs to fetch README content
- View formatted results in real-time

## Technologies Used

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend/Auth**: Supabase
- **State Management**: TanStack Query
- **Icons**: Lucide React
- **Build Tool**: Vite

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.