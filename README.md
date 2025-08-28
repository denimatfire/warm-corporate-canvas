# 🌟 Warm Corporate Canvas - Modern Portfolio Website

A sophisticated, responsive portfolio website built with React, TypeScript, and Tailwind CSS, featuring advanced article management, photo galleries, and professional presentation capabilities. Powered by Supabase for robust backend functionality with automatic fallback support.

## ✨ **Key Features**

- 🎨 **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS and Shadcn/UI
- 📝 **Advanced Content Management** - Enhanced Quill and TipTap rich text editors
- 🖼️ **Professional Photo Gallery** - Organized categories with lightbox functionality
- 🔐 **Secure Authentication** - Supabase-powered user management
- 📱 **Mobile-First Design** - Touch-friendly interactions and responsive layouts
- 🚀 **Real-time Updates** - Live content synchronization with offline fallback
- 🎭 **Smooth Animations** - Framer Motion-powered interactions
- 📊 **Analytics Dashboard** - Content statistics and performance metrics

## 🛠️ **Tech Stack**

- **Frontend**: React 18.3.1, TypeScript 5.8.3, Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.17, Shadcn/UI, Radix UI
- **Backend**: Supabase (PostgreSQL + Real-time), LocalStorage fallback
- **Editors**: Enhanced Quill (with image editing), TipTap
- **State Management**: React Query, Custom Hooks
- **Animations**: Framer Motion 12.23.12
- **Deployment**: Netlify

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend functionality)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd warm-corporate-canvas

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup

Create a `.env.local` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 📁 **Project Structure**

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/UI components
│   ├── ArticleEditor.tsx    # Enhanced Quill editor
│   ├── TipTapEditor.tsx     # TipTap editor
│   ├── Navigation.tsx       # Main navigation
│   └── ...                 # Other components
├── pages/              # Page components
├── lib/                # Utilities and API
├── hooks/              # Custom React hooks
├── data/               # Data management
└── assets/             # Static assets
```

## 🔧 **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📚 **Documentation**

- [Setup Guide](SETUP_GUIDE.md) - Development environment setup
- [Project Structure](PROJECT_STRUCTURE.md) - Comprehensive architecture guide
- [Supabase Setup](SUPABASE_SETUP.md) - Backend configuration
- [Article Management](ARTICLE_MANAGEMENT_README.md) - Content system guide
- [Quill Enhancements](QUILL_ENHANCEMENTS.md) - Editor features
- [TipTap Editor](TIPTAP_EDITOR_README.md) - Alternative editor
- [Keyboard Shortcuts](KEYBOARD_SHORTCUTS.md) - Complete shortcut reference
- [Quick Reference Card](KEYBOARD_SHORTCUTS_QUICK_REFERENCE.md) - Print-friendly shortcuts

## 🌐 **Deployment**

The project is configured for Netlify deployment. Simply connect your repository and the build will be handled automatically.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🆘 **Support**

For questions or issues:
1. Check the documentation files
2. Review the troubleshooting guides
3. Open an issue on GitHub

---

**Built with ❤️ using modern web technologies**
