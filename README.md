# Research Portfolio

A production-quality, interactive research portfolio website built with React, TypeScript, and Vite. Features a minimalist design with 3D accents, comprehensive search, filterable content, and interactive API demos.

## Features

- **Global Search (Cmd+K)**: Fast, keyboard-accessible search across all content types with URL-shareable filters
- **Standardized Templates**: Consistent layouts for publications, projects, and APIs with artifacts, tags, and metadata
- **Interactive API Playgrounds**: Live demos with safe defaults, code examples, and comprehensive documentation
- **3D Visual Accents**: Subtle, accessible 3D hero with automatic fallbacks for reduced motion preferences
- **Responsive Design**: Mobile-first, accessible design with semantic HTML and keyboard navigation
- **Performance Optimized**: Code splitting, lazy loading, and optimized asset handling

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Fast build tool
- **React Router v6** - Client-side routing
- **TailwindCSS** - Utility-first styling
- **react-three-fiber + drei** - 3D graphics
- **cmdk** - Command palette/search
- **Zustand** - State management
- **Zod** - Runtime validation
- **Vitest + React Testing Library** - Testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Lint code
npm run lint

# Format code
npm run format
```

The development server will start at `http://localhost:5173`.

## Project Structure

```
portfolio/
├── src/
│   ├── api/                 # API clients and types
│   │   └── text-classification/
│   │       ├── client.ts    # API implementation
│   │       └── types.ts     # Type definitions
│   ├── components/
│   │   ├── 3d/              # 3D components
│   │   │   └── Hero3D.tsx
│   │   ├── api/             # API playground components
│   │   │   └── APIPlayground.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageLayout.tsx
│   │   ├── publications/    # Publication components
│   │   │   ├── PublicationCard.tsx
│   │   │   ├── ArtifactLinks.tsx
│   │   │   └── BibTeXBlock.tsx
│   │   ├── search/          # Search components
│   │   │   ├── SearchModal.tsx
│   │   │   └── FilterPanel.tsx
│   │   └── ui/              # Design system components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Tag.tsx
│   │       ├── Modal.tsx
│   │       ├── CodeBlock.tsx
│   │       ├── Toast.tsx
│   │       ├── Skeleton.tsx
│   │       ├── ErrorState.tsx
│   │       └── Link.tsx
│   ├── content/             # Data files
│   │   ├── publications.ts
│   │   ├── projects.ts
│   │   ├── apis.ts
│   │   └── talks.ts
│   ├── hooks/               # Custom hooks
│   │   └── useToast.tsx
│   ├── lib/                 # Utilities
│   │   ├── utils.ts
│   │   ├── search.ts
│   │   └── urlState.ts
│   ├── pages/               # Page components
│   │   ├── Home.tsx
│   │   ├── Research.tsx
│   │   ├── Publications.tsx
│   │   ├── PublicationDetail.tsx
│   │   ├── APIs.tsx
│   │   ├── APIDetail.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── stores/              # State management
│   │   └── searchStore.ts
│   ├── styles/              # Global styles
│   │   └── index.css
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
└── tests/                   # Test files
```

## Content Management

### Adding a Publication

Edit `src/content/publications.ts` and add a new entry:

```typescript
{
  id: 'unique-id',
  title: 'Paper Title',
  authors: ['Author One', 'Author Two'],
  year: 2024,
  status: 'published', // or 'working-paper', 'under-review'
  venue: 'Conference/Journal Name',
  abstract: 'Paper abstract...',
  artifacts: [
    { type: 'pdf', url: 'https://...' },
    { type: 'code', url: 'https://github.com/...' },
    { type: 'data', url: 'https://...' },
  ],
  tags: ['tag1', 'tag2'],
  relatedIds: ['related-pub-id'],
  bibtex: `@inproceedings{...}`,
  lastUpdated: '2024-12-01',
}
```

### Adding a Project

Edit `src/content/projects.ts`:

```typescript
{
  id: 'project-id',
  title: 'Project Title',
  description: 'Project description...',
  tags: ['tag1', 'tag2'],
  publicationIds: ['pub-id-1', 'pub-id-2'],
  artifacts: [
    { type: 'code', url: 'https://github.com/...' },
  ],
  year: 2024,
  lastUpdated: '2024-12-01',
}
```

### Adding an API/Demo

1. Edit `src/content/apis.ts` to add metadata
2. Create API client in `src/api/<api-name>/client.ts`
3. Add playground configuration in `src/pages/APIDetail.tsx`

Example API client:

```typescript
// src/api/my-api/client.ts
export interface MyAPIRequest {
  input: string;
}

export interface MyAPIResponse {
  output: string;
}

export async function callMyAPI(request: MyAPIRequest): Promise<MyAPIResponse> {
  const response = await fetch('https://api.example.com/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return response.json();
}
```

Then update `APIDetail.tsx` to handle your API in the `handleAPIExecution` function.

## Search & Filters

### How Search Works

The global search (Cmd+K or click search button) indexes all publications, projects, APIs, and talks. It searches across:

- Titles
- Descriptions/abstracts
- Tags
- Authors

### URL-Shareable Filters

All filters are synced to the URL query parameters, making filter states shareable. Example:

```
/publications?q=neural&years=2024&tags=deep-learning&status=published
```

### Filter Types

- **Query**: Free-text search
- **Years**: Publication year
- **Tags**: Topic tags
- **Status**: Publication status (published, working-paper, under-review)
- **Authors**: Author names
- **Artifact Types**: Resource types (pdf, code, data, etc.)

## Customization

### Theme & Design Tokens

Edit `src/styles/index.css` to customize the color palette:

```css
:root {
  --primary: 240 5.9% 10%;
  --secondary: 240 4.8% 95.9%;
  /* ... other tokens */
}
```

Also update `tailwind.config.js` for typography and spacing.

### Fonts

Edit `index.html` to change fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet" />
```

Then update `tailwind.config.js`:

```js
fontFamily: {
  sans: ['Your Font', 'system-ui', 'sans-serif'],
}
```

### Navigation

Edit `src/components/layout/Header.tsx` to add/remove nav items.

### 3D Hero

Customize the 3D scene in `src/components/3d/Hero3D.tsx`. The component:

- Automatically detects WebGL support
- Respects `prefers-reduced-motion`
- Shows gradient fallback when 3D is unavailable

## Accessibility

- Semantic HTML throughout
- Keyboard navigation support (Tab, Enter, Escape, Cmd+K)
- Focus indicators on all interactive elements
- ARIA labels where appropriate
- Respects `prefers-reduced-motion`
- Color contrast meets WCAG AA standards

## Performance

- Code splitting by route
- Lazy loading for 3D components
- Optimized images and assets
- Minimal bundle size with tree-shaking
- Fast development server with HMR

## Testing

Run tests:

```bash
npm test           # Run all tests
npm run test:ui    # Run tests with UI
npm run coverage   # Generate coverage report
```

Key test files:

- `src/lib/__tests__/utils.test.ts` - Utility functions
- `src/lib/__tests__/search.test.ts` - Search logic
- `src/components/ui/__tests__/Button.test.tsx` - Component tests

## Deployment

### Build for Production

```bash
npm run build
```

Outputs to `dist/` directory.

### Deploy to Vercel/Netlify

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Deploy to GitHub Pages

```bash
npm run build
# Then push dist/ to gh-pages branch
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### 3D not rendering

- Check browser WebGL support at https://get.webgl.org/
- Check browser console for errors
- Verify `@react-three/fiber` and `@react-three/drei` are installed

### Search not working

- Verify `cmdk` is installed
- Check browser console for errors
- Ensure search store is properly initialized

### Styles not applying

- Run `npm run dev` to ensure Tailwind is processing
- Check `tailwind.config.js` content paths
- Verify `postcss.config.js` is present

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

For issues or questions, please open an issue on GitHub.
