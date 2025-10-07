# i-Intern - Unified Internship Platform

A comprehensive internship platform built with React, TypeScript, and Vite that combines multiple independent applications into a single, cohesive system.

## 🏗️ Project Structure

```
i-intern/
├── src/
│   ├── apps/                          # Individual application modules
│   │   ├── landing/                   # Landing page and marketing site
│   │   ├── interns-dashboard/         # Student/intern dashboard
│   │   ├── company-dashboard/         # Company/employer dashboard
│   │   ├── admin-dashboard/           # Admin management dashboard
│   │   ├── build-resume/              # Resume builder application
│   │   ├── iva/                       # IVA chat assistant
│   │   └── aura/                      # AURA AI interface
│   ├── shared/                        # Shared components and utilities
│   │   ├── components/                # Reusable UI components
│   │   │   └── ui/                    # Base UI component library
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── lib/                       # Utility functions
│   │   ├── types/                     # TypeScript type definitions
│   │   └── data/                      # Mock data and constants
│   ├── App.tsx                        # Main application with routing
│   ├── main.tsx                       # Application entry point
│   └── index.css                      # Global styles
├── public/                            # Static assets
├── backend/                           # Backend services (Python FastAPI)
└── assets/                            # Additional assets
```

## 🚀 Features

### Landing Page
- Marketing website with hero section, features, testimonials
- User authentication (login, registration)
- Student and company registration flows
- Pricing and contact information

### Interns Dashboard
- Personalized dashboard for students/interns
- Application tracking and management
- Job recommendations and search
- Profile management and resume building

### Company Dashboard
- Employer dashboard for managing internship postings
- Applicant tracking and management
- Analytics and reporting
- Company profile management

### Admin Dashboard
- Administrative interface for platform management
- User management (students, companies, admins)
- Internship posting oversight
- Platform analytics and reporting

### Build Resume
- Step-by-step resume builder
- Professional templates
- Real-time preview
- PDF export functionality

### IVA (Intelligent Virtual Assistant)
- Chat interface for user support
- AI-powered assistance for platform navigation
- FAQ and help system

### AURA (AI-Powered Interface)
- Advanced AI features
- Enhanced user experience
- Intelligent recommendations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router v6+ with lazy loading
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Animation**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Backend**: Python FastAPI (for resume builder)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd i-intern
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. (Optional) Start the backend for resume builder:
   ```bash
   npm run backend
   ```

## 🎯 Routes

- `/` - Landing page
- `/interns/*` - Interns dashboard
- `/company/*` - Company dashboard  
- `/admin/*` - Admin dashboard
- `/resume/*` - Resume builder
- `/iva/*` - IVA chat assistant
- `/aura/*` - AURA AI interface

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run backend` - Start Python backend (resume builder)

### Project Architecture

The project uses a modular architecture where each application (`landing`, `interns-dashboard`, etc.) is self-contained with its own components and pages, while sharing common UI components, hooks, and utilities through the `shared` directory.

### Lazy Loading

All major application modules are lazy-loaded using React's `lazy()` function to optimize initial bundle size and improve performance.

### Shared Components

Common components are centralized in `src/shared/components/` to avoid duplication and ensure consistency across all applications.

## 🎨 Design System

The project uses a unified design system based on:
- **Colors**: Professional blue and slate theme
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components with variants
- **Animations**: Smooth transitions and micro-interactions

## 🔄 Migration Notes

This project is a unified version of multiple independent React applications:
- Landing Page
- Interns Dashboard  
- Company Dashboard
- Admin Dashboard
- Build Resume
- I.V.A
- A.U.R.A

All import paths have been updated to use the shared component library, and routing has been restructured to work within a single application.

## 🐛 Troubleshooting

If you encounter issues:

1. **Missing dependencies**: Run `npm install`
2. **Import errors**: Check that paths use `@/shared/` prefix
3. **Build errors**: Ensure all TypeScript types are properly imported
4. **Route issues**: Verify route paths match the new structure

## 📄 License

This project is part of the i-Intern platform. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This is a unified codebase combining multiple previously independent applications. Some manual configuration may be required for full functionality.