# QuickJPG - Privacy-First Image Converter

Convert HEIC, WEBP, and PNG images to JPG format entirely in your browser. No files uploaded to servers.

## Features

- **Privacy-First**: All processing happens locally in your browser
- **Fast & Free**: Instant conversion without server delays
- **Multiple Formats**: Support for HEIC, WEBP, and PNG to JPG conversion
- **Batch Processing**: Convert up to 5 files free, 20 files with Pro
- **No Sign-up Required**: Start converting immediately

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure Stripe (optional, for Pro features):
   - Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Set `VITE_STRIPE_PUBLIC_KEY` (starts with `pk_`)
   - Set `STRIPE_SECRET_KEY` (starts with `sk_`)
   - Set `STRIPE_PRICE_ID` (starts with `price_`)

5. Start development server:
   ```bash
   pnpm dev
   