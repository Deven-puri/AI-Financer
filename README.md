# AI Financer - Smart Financial Management System

## https://ai-financer-zbbp.vercel.app

AI Financer is a modern, intelligent financial management application built with React and TypeScript. It helps users track income, expenses, and provides AI-powered financial insights through GROQ AI integration.

### Technologies & Frameworks

### Core Technologies
- **React 18.2.0** - UI library for building user interfaces
- **TypeScript 5.9.3** - Type-safe JavaScript for better code quality
- **Node.js & NPM** - Package management and runtime environment

### Styling & UI
- **Tailwind CSS 3.4.19** - Utility-first CSS framework for rapid UI development
- **PostCSS 8.5.6** - CSS processing tool
- **Autoprefixer 10.4.23** - Automatic vendor prefixing for CSS

### Authentication & Backend
- **Firebase 10.14.1** - Authentication and backend services
  - Firebase Authentication (Email/Password & Google Sign-In)
  - Firebase Analytics

### Data Visualization
- **Chart.js 4.4.1** - Interactive charts and graphs
- **react-chartjs-2 5.2.0** - React wrapper for Chart.js
- **chartjs-adapter-date-fns 3.0.0** - Date adapter for Chart.js

### AI Integration
- **GROQ AI API** - AI-powered financial advisor integration

### Routing & Navigation
- **React Router DOM 6.22.0** - Client-side routing
- **React Router Bootstrap 0.26.2** - Bootstrap components for React Router

### UI Components & Icons
- **FontAwesome 6.5.1** - Icon library
  - @fortawesome/react-fontawesome
  - @fortawesome/free-solid-svg-icons
  - @fortawesome/free-brands-svg-icons
- **Framer Motion 11.0.5** - Animation library for React

### Data Management
- **XLSX 0.18.5** - Excel file generation and export
- **Local Storage API** - Client-side data persistence

### Build Tools
- **React Scripts 5.0.1** - Build tooling for Create React App
- **TypeScript Compiler** - Type checking and compilation

### Development Dependencies
- **@types/react, @types/react-dom, @types/node** - TypeScript type definitions
- **@types/jest** - Testing type definitions
- **gh-pages 6.1.1** - GitHub Pages deployment

## 📁 Project Structure

```
ai-financer/
├── public/
│   ├── images/
│   │   ├── Logo/
│   │   │   └── NEW AI Financer.png
│   │   └── User/
│   │       └── User.png
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── AIAssistant/
│   │   │   └── AIAssistant.tsx          # AI chat interface
│   │   ├── BreadcrumbAndProfile/
│   │   │   └── BreadcrumbAndProfile.tsx # Navigation breadcrumbs & user profile
│   │   ├── Contact/
│   │   │   └── Contact.tsx              # Contact page with GitHub integration
│   │   ├── Dashboard/
│   │   │   └── Dashboard.tsx            # Main dashboard with financial overview
│   │   ├── Expenses/
│   │   │   └── Expenses.tsx             # Expense management with photo upload
│   │   ├── Incomes/
│   │   │   └── Incomes.tsx              # Income management
│   │   ├── InfoCard/
│   │   │   └── InfoCard.tsx             # Reusable info card component
│   │   ├── Shimmer/
│   │   │   └── Shimmer.tsx              # Loading shimmer effects
│   │   ├── SignIn/
│   │   │   └── SignIn.tsx               # Authentication page
│   │   ├── SignOut/
│   │   │   └── SignOut.tsx              # Sign out confirmation
│   │   ├── TopNav/
│   │   │   └── TopNav.tsx               # Top navigation bar
│   │   └── GROQAI.tsx                   # GROQ AI service integration
│   │
│   ├── types/
│   │   └── index.ts                     # TypeScript type definitions
│   │
│   ├── App.tsx                          # Main application component
│   ├── index.tsx                        # Application entry point
│   ├── index.css                        # Global styles & Tailwind imports
│   ├── firebase_config.ts               # Firebase configuration
│   └── reportWebVitals.ts              # Performance monitoring
│
├── package.json                         # Dependencies and scripts
├── tsconfig.json                        # TypeScript configuration
├── tailwind.config.js                  # Tailwind CSS configuration
└── README.md                           # Project documentation
```

##  File Descriptions

### Core Application Files

**`src/App.tsx`**
- Main application component
- Manages global state (incomes, expenses)
- Implements protected routes with Firebase authentication
- Handles routing with React Router

**`src/index.tsx`**
- Application entry point
- Initializes React root and renders App component
- Sets up performance monitoring

**`src/firebase_config.ts`**
- Firebase initialization and configuration
- Exports authentication and Google provider instances

### Component Files

**`src/components/TopNav/TopNav.tsx`**
- Top navigation bar component
- Horizontal navigation menu
- Logo display and user actions
- Responsive mobile menu

**`src/components/Dashboard/Dashboard.tsx`**
- Main dashboard displaying financial overview
- Shows total, incomes, and expenses cards
- Reload functionality

**`src/components/Incomes/Incomes.tsx`**
- Income management component
- CRUD operations for income entries
- Chart visualization with Chart.js
- Search, pagination, and Excel export

**`src/components/Expenses/Expenses.tsx`**
- Expense management component
- CRUD operations for expense entries
- Photo upload functionality with base64 storage
- Chart visualization, search, pagination, Excel export

**`src/components/AIAssistant/AIAssistant.tsx`**
- AI chat interface component
- Integrates with GROQ AI service
- Displays financial insights and recommendations
- Message history and formatted responses

**`src/components/Contact/Contact.tsx`**
- Contact information page
- Displays name and email
- GitHub profile integration with API calls
- Contribution graph visualization

**`src/components/SignIn/SignIn.tsx`**
- Authentication page
- Email/password and Google sign-in
- Sign-up toggle functionality
- Form validation and error handling

**`src/components/SignOut/SignOut.tsx`**
- Sign out confirmation page
- Handles user logout

**`src/components/BreadcrumbAndProfile/BreadcrumbAndProfile.tsx`**
- Breadcrumb navigation component
- User profile display with Firebase auth
- Dynamic welcome messages

**`src/components/InfoCard/InfoCard.tsx`**
- Reusable info card component
- Displays title, value, and optional link
- Used in Dashboard for financial summaries

**`src/components/Shimmer/Shimmer.tsx`**
- Loading shimmer effects
- Multiple shimmer variants (card, list, form, page)
- Smooth loading animations

**`src/components/GROQAI.tsx`**
- GROQ AI service integration
- Financial data analysis and AI responses
- Monthly/weekly trend calculations
- API communication with GROQ

### Configuration Files

**`src/types/index.ts`**
- TypeScript type definitions
- Interfaces for Income, Expense, Props, etc.

**`tailwind.config.js`**
- Tailwind CSS configuration
- Custom color palette (black/white theme)
- Custom gradient utilities

**`tsconfig.json`**
- TypeScript compiler configuration
- Module resolution settings

**`package.json`**
- Project dependencies and scripts
- Build and deployment configuration

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
```

### Run Development Server

```bash
npm start
```

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## ✨ Key Features

- **Financial Tracking**: Complete income and expense management with real-time calculations
- **AI Assistant**: GROQ AI-powered financial advisor for personalized insights
- **Data Visualization**: Interactive charts with Chart.js showing income and expense trends
- **Photo Upload**: Expense entries with image support (base64 storage)
- **Excel Export**: Export financial data to Excel for external analysis
- **Firebase Auth**: Secure authentication with Email/Password and Google Sign-In
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile
- **TypeScript**: Full type safety throughout the application for better code quality

## 📝 License

This project is private and proprietary.

## 👤 Author

**Deven Puri**
- GitHub: [@Deven-puri](https://github.com/Deven-puri)
- Email: devenpuri29@gmail.com
