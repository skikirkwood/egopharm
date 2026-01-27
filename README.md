# Ego Pharmaceuticals Website

A modern website for Ego Pharmaceuticals built with Next.js, Contentful CMS, and deployed on Vercel.

## Features

- **Content Management**: Powered by Contentful CMS
- **Modern Stack**: Next.js 13 with React 18 and TypeScript
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dynamic Content**: Modular content types for flexible page building
- **Personalization**: Ninetailed integration for audience-based experiences
- **Live Preview**: Contentful Live Preview for real-time editing
- **Static Generation**: ISR (Incremental Static Regeneration) for fast page loads

## Content Model

The website uses the following Contentful content types:

- **Page**: Main page content type with navigation and modules
- **Navigation**: Site navigation structure
- **NavigationItem**: Individual navigation links
- **Hero**: Hero banner section with background image and CTA
- **Infoblock**: Information section with title, body, and optional image
- **ImageTriplex**: Three-column image grid with hover effects
- **FeaturedNews**: News section with multiple news items
- **DuplexContainer**: Two-column layout with image on one side, content on the other

## Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Contentful account with a space
- Ninetailed account (for personalization features)

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
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN`: Your Content Preview API token
- `CONTENTFUL_MANAGEMENT_TOKEN`: Your Content Management API token (for migrations)
- `CONTENTFUL_ENVIRONMENT`: Environment name (defaults to 'master')
- `CONTENTFUL_PREVIEW_SECRET`: Secret for preview mode
- `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`: Public space ID for preview widget links
- `NEXT_PUBLIC_NINETAILED_API_KEY`: Ninetailed API key
- `NEXT_PUBLIC_NINETAILED_ENVIRONMENT`: Ninetailed environment (main or development)

### Contentful Migration

Run the migration scripts to create all content types in your Contentful space:

```bash
# Create base content types
npm run contentful:migrate

# Create Featured News content type
npm run contentful:migrate:featured-news

# Create Duplex Container content type
npm run contentful:migrate:duplex-container
```

This will create:
- Navigation content type
- NavigationItem content type
- Hero content type
- Infoblock content type
- ImageTriplex content type
- ImageTriplexItem content type
- FeaturedNews content type
- FeaturedNewsItem content type
- DuplexContainer content type
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
   - `CONTENTFUL_PREVIEW_ACCESS_TOKEN`
   - `CONTENTFUL_MANAGEMENT_TOKEN` (optional, only needed for migrations)
   - `CONTENTFUL_ENVIRONMENT` (defaults to "master")
   - `CONTENTFUL_PREVIEW_SECRET`
   - `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
   - `NEXT_PUBLIC_NINETAILED_API_KEY`
   - `NEXT_PUBLIC_NINETAILED_ENVIRONMENT`

4. Deploy!

## Content Structure

After running the migration, create content in Contentful:

1. **Create a Navigation entry** with navigation items
2. **Create module entries** (Hero, Infoblock, ImageTriplex, FeaturedNews, DuplexContainer)
3. **Create a Page entry** with:
   - Slug: "home" (for the homepage)
   - Link to your Navigation
   - Add modules in the desired order

## Project Structure

```
├── pages/                  # Next.js pages directory (Pages Router)
│   ├── _app.tsx           # App wrapper with providers
│   ├── index.tsx          # Home page
│   ├── [slug].tsx         # Dynamic page routing
│   └── api/               # API routes
│       ├── draft.ts       # Enable preview mode
│       └── disable-draft.ts # Disable preview mode
├── components/            # React components
│   ├── Hero.tsx
│   ├── Infoblock.tsx
│   ├── ImageTriplex.tsx
│   ├── FeaturedNews.tsx
│   ├── DuplexContainer.tsx
│   ├── Navigation.tsx
│   ├── TopBanner.tsx
│   ├── Footer.tsx
│   └── ModuleRenderer.tsx
├── contentful/            # Contentful migration scripts
│   ├── migrate.ts
│   ├── migrate-featured-news.ts
│   └── migrate-duplex-container.ts
├── lib/                   # Utility functions
│   ├── contentful.ts      # Contentful client
│   └── ninetailed.ts      # Ninetailed utilities
├── styles/                # Stylesheets
│   └── globals.css        # Global styles
└── types/                 # TypeScript types
    └── contentful.ts      # Contentful type definitions
```

## Live Preview

This project supports Contentful Live Preview for real-time content editing:

1. Configure the preview URL in Contentful to use `/api/draft?secret=YOUR_SECRET&slug={entry.fields.slug}`
2. When editing in Contentful, changes appear instantly in the preview
3. Click on elements in the preview to navigate directly to the field in Contentful

## Personalization

The website uses Ninetailed for personalization:

- Create audiences in Contentful using the Ninetailed content types
- Attach experiences to modules for A/B testing or personalization
- The preview widget shows active experiences during development

## License

MIT
