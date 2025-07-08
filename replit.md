# QuickJPG - Privacy-First Image Converter

## Overview

QuickJPG is a privacy-focused, client-side image converter that transforms HEIC, WEBP, and PNG files to JPG format entirely in the user's browser. The application operates on a freemium model with a free tier (up to 5 files) and a Pro subscription (up to 20 files). All image processing happens locally in the browser, ensuring complete privacy and security.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design tokens and dark neutral theme
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Image Processing**: Client-side conversion using browser APIs and HTML5 Canvas

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL storage
- **Payment Processing**: Stripe integration for Pro subscriptions
- **Development Storage**: In-memory storage for development environment

### Deployment Architecture
- **Hosting**: Cloudflare Pages for static frontend
- **Functions**: Cloudflare Workers for serverless backend functions
- **Database**: Neon Database (PostgreSQL) for production
- **Storage**: Cloudflare KV for Pro user status tracking

## Key Components

### Image Conversion Engine
- **HEIC Processing**: Mock implementation (requires `browser-heic-convert` library)
- **WEBP/PNG Processing**: Native HTML5 Canvas for format conversion
- **Batch Processing**: Support for multiple file conversion with progress tracking
- **Local Processing**: All conversions happen in browser without server upload
- **Zip Export**: Download all converted images as a single ZIP file using JSZip library

### User Interface Components
- **FileUploadZone**: Drag-and-drop interface with file validation
- **FileConverter**: Batch conversion with progress tracking and download management
- **Header**: Navigation with Pro status indicator
- **Footer**: Links to legal pages and support

### Subscription System
- **Free Tier**: Up to 5 files per conversion
- **Pro Tier**: Up to 20 files per conversion with ad removal
- **Payment Flow**: Stripe Checkout integration
- **Status Tracking**: Local storage and server-side tracking

## Data Flow

1. **File Upload**: User drags/drops files into upload zone
2. **Validation**: Client-side validation of file types and quantity limits
3. **Conversion**: Local processing using browser APIs
4. **Progress Tracking**: Real-time progress updates during conversion
5. **Download**: Generated JPG files available for download via blob URLs
6. **Subscription**: Pro upgrade through Stripe Checkout with webhook handling

## External Dependencies

### Core Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Framework**: Radix UI primitives, Tailwind CSS
- **Build Tools**: Vite, TypeScript, PostCSS
- **State Management**: TanStack Query, Zustand (via hooks)

### Payment & Analytics
- **Stripe**: Payment processing (`@stripe/stripe-js`, `@stripe/react-stripe-js`)
- **AdSense**: Advertisement integration (placeholder implementation)

### Database & Storage
- **Drizzle ORM**: Type-safe database queries
- **Neon Database**: PostgreSQL database provider
- **Cloudflare KV**: Key-value storage for Pro user tracking

### Development Tools
- **Testing**: Vitest, React Testing Library, Playwright
- **Linting**: ESLint, Prettier
- **Deployment**: Wrangler CLI for Cloudflare deployment

## Deployment Strategy

### Development Environment
- **Local Server**: Express server with Vite middleware
- **Database**: In-memory storage for development
- **Hot Reload**: Vite HMR for fast development cycles

### Production Deployment
- **Frontend**: Cloudflare Pages with automatic GitHub deployments
- **Backend**: Cloudflare Workers for serverless functions
- **Database**: Neon PostgreSQL with connection pooling
- **CDN**: Cloudflare edge network for global distribution

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Build Process**: Vite build with esbuild for server bundle
- **Environment Variables**: Stripe keys and database URLs via environment

## Cloudflare Pages Deployment

### Prerequisites
1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository**: Push your code to a GitHub repository
3. **Wrangler CLI**: Install globally with `npm install -g wrangler`

### Step-by-Step Deployment

#### 1. Setup Cloudflare Pages
1. Log into Cloudflare Dashboard
2. Go to **Pages** in the sidebar
3. Click **Create a project**
4. Choose **Connect to Git**
5. Select your GitHub repository
6. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty)

#### 2. Environment Variables
Set these environment variables in Cloudflare Pages:
```
NODE_ENV=production
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
DATABASE_URL=your_neon_database_url
```

#### 3. Build Configuration
The project includes a `wrangler.toml` file configured for Cloudflare Pages:
```toml
name = "quickjpg"
compatibility_date = "2023-12-01"

[build]
command = "npm run build"
cwd = "."

[[pages_build_output_dir]]
directory = "dist"
```

#### 4. Functions Setup
Cloudflare Pages Functions are located in the `functions/` directory:
- `stripe-webhook.ts` - Handles Stripe webhook events
- Automatically deployed as serverless functions

#### 5. Database Setup (Neon)
1. Create account at [neon.tech](https://neon.tech)
2. Create a new database
3. Copy connection string to `DATABASE_URL` environment variable
4. Run database migrations using Drizzle

#### 6. Stripe Integration
1. Create Stripe account at [stripe.com](https://stripe.com)
2. Get API keys from Stripe Dashboard
3. Set up webhook endpoint pointing to your Cloudflare Pages domain
4. Configure webhook secret in environment variables

### Custom Domain (Optional)
1. In Cloudflare Pages, go to your project
2. Click **Custom domains**
3. Add your domain
4. Update DNS records as instructed
5. SSL certificate will be automatically provisioned

### Monitoring and Logs
- **Real-time Logs**: Available in Cloudflare Dashboard > Pages > Functions
- **Analytics**: Built-in analytics for page views and performance
- **Error Tracking**: Function errors appear in the Functions tab

### Performance Optimizations
- **Edge Caching**: Static assets cached globally
- **Minification**: Automatic HTML, CSS, and JS minification
- **Image Optimization**: Automatic image compression and format conversion
- **HTTP/3**: Enabled by default for fastest loading

### Deployment Commands
```bash
# Deploy manually using Wrangler
wrangler pages publish dist

# Deploy with environment
wrangler pages publish dist --env production
```

### Troubleshooting
- **Build Failures**: Check build logs in Cloudflare Dashboard
- **Function Errors**: Monitor Functions tab for runtime errors
- **Environment Issues**: Verify all required environment variables are set
- **Database Connections**: Ensure DATABASE_URL is properly configured

## Changelog

Changelog:
- July 08, 2025. Initial setup
- July 08, 2025. Added zip export functionality using JSZip library for batch download of converted images
- July 08, 2025. Updated theme to white background with yellow, black, and white color scheme for clean modern appearance
- July 08, 2025. Reverted to black theme with yellow accents per user preference
- July 08, 2025. Added light/dark mode toggle with theme persistence and improved privacy text visibility
- July 08, 2025. Set light mode as default theme with improved contrast and visibility
- July 08, 2025. Added comprehensive Cloudflare Pages deployment instructions

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred color scheme: Yellow, black, and white theme with light mode as default.