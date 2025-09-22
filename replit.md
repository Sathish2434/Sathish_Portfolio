# Alex Morgan - AI-Powered Portfolio

## Overview

This is a modern, production-ready React portfolio website with integrated AI assistant capabilities. The application showcases a professional developer portfolio while providing interactive AI-powered features for enhanced user engagement. Built with React 18, TypeScript, and TailwindCSS, it features a complete dark/light theme system, responsive design, and seamless AI integration powered by OpenAI's latest models.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18 with TypeScript** for type safety and modern React features
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router
- **TailwindCSS** with custom CSS variables for theming and responsive design
- **Framer Motion** for smooth animations and micro-interactions
- **Shadcn/ui** component library for consistent, accessible UI components

### State Management & Data Fetching
- **React Query (@tanstack/react-query)** for server state management and caching
- **Local Storage** for persisting user preferences (theme, chat history)
- **React Context** for theme management and global state

### Backend Architecture
- **Express.js** server with TypeScript
- **Serverless function architecture** with OpenAI proxy endpoint
- **Vite development middleware** for seamless full-stack development
- **In-memory storage** with extensible interface for future database integration

### AI Integration
- **OpenAI GPT-5** integration through secure proxy endpoint
- **Streaming responses** for real-time chat experience
- **Conversation history** persistence in localStorage
- **Multiple response styles** (concise, technical, friendly, balanced)
- **Dual chat interfaces**: floating widget and full-page experience

### Styling & Theming
- **CSS Custom Properties** for comprehensive theming system
- **Dark/Light mode** with localStorage persistence
- **Responsive design** with mobile-first approach
- **Inter and JetBrains Mono** fonts for professional typography
- **Gradient effects and glassmorphism** for modern visual appeal

### Database Schema
- **Drizzle ORM** configured for PostgreSQL with extensible schema
- **User management** schema ready for authentication features
- **Migration system** for database version control

## External Dependencies

### Core Technologies
- **OpenAI API** for AI assistant functionality (requires OPENAI_API_KEY)
- **EmailJS** for contact form submissions (requires EmailJS configuration)
- **Neon Database** configured as PostgreSQL provider

### Development Tools
- **TypeScript** for type safety across the entire stack
- **ESBuild** for fast production builds
- **PostCSS & Autoprefixer** for CSS processing

### UI/Animation Libraries
- **Radix UI** primitives for accessible component foundations
- **Framer Motion** for advanced animations and gestures
- **Lucide React** for consistent iconography

### Deployment Configuration
- **Vercel/Netlify** ready serverless function structure
- **Environment variables** for API keys and configuration
- **CORS-safe headers** for production deployment