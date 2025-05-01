# SnipStash Client

A modern React frontend for managing and organizing code snippets. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 User authentication (login/signup)
- 📝 Create and manage code snippets
- 🎨 Syntax highlighting for multiple programming languages
- 🏷️ Automatic tag generation based on code content
- 🔍 Search snippets by title, content, or tags
- 📱 Responsive design for all screen sizes

## Tech Stack

- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Prism.js for syntax highlighting
- Axios for API requests
- Heroicons for icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd client
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/         # React context providers
├── pages/           # Route components
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
