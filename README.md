# Ego Pharmaceuticals Website

A modern website for Ego Pharmaceuticals built with Next.js, Contentful CMS, and deployed on Vercel.

## Features

- **Content Management**: Powered by Contentful CMS
- **Modern Stack**: Next.js 14 with React 18 and TypeScript
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dynamic Content**: Modular content types for flexible page building

## Content Model

The website uses the following Contentful content types:

- **Page**: Main page content type with navigation and modules
- **Navigation**: Site navigation structure
- **Hero**: Hero banner section with background image and CTA
- **Infoblock**: Information section with title, body, and optional image
- **ImageTriplex**: Three-column image grid with hover effects

## Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Contentful account with a space

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd egopharm-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Copy the example environment file and fill in your Contentful credentials:
```bash
cp env.example .env.local
```

Then edit `.env.local` with your actual values:
- `CONTENTFUL_SPACE_ID`: Your Space ID from Contentful Settings
- `CONTENTFUL_ACCESS_TOKEN`: Your Content Delivery API token
- `CONTENTFUL_MANAGEMENT_TOKEN`: Your Content Management API token (for migrations)
- `CONTENTFUL_ENVIRONMENT`: Environment name (defaults to 'master')

### Contentful Migration

Run the migration script to create all content types in your Contentful space:

```bash
npm run contentful:migrate
```

This will create:
- Navigation content type
- NavigationItem content type
- Hero content type
- Infoblock content type
- ImageTriplex content type
- ImageTriplexItem content type
- Page content type

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository

3. Add environment variables in Vercel:
   - `CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN`
   - `CONTENTFUL_MANAGEMENT_TOKEN` (optional, only needed for migrations)
   - `CONTENTFUL_ENVIRONMENT` (defaults to "master")

4. Deploy!

## Content Structure

After running the migration, create content in Contentful:

1. **Create a Navigation entry** with navigation items
2. **Create module entries** (Hero, Infoblock, ImageTriplex)
3. **Create a Page entry** with:
   - Slug: "home"
   - Link to your Navigation
   - Add modules in the desired order

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Hero.tsx
│   ├── Infoblock.tsx
│   ├── ImageTriplex.tsx
│   ├── Navigation.tsx
│   └── ModuleRenderer.tsx
├── contentful/            # Contentful migration scripts
│   └── migrate.ts
├── lib/                   # Utility functions
│   └── contentful.ts      # Contentful client
└── types/                 # TypeScript types
    └── contentful.ts
```

## License

Copyright © Ego Pharmaceuticals. All Rights Reserved.

