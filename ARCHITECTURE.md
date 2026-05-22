# CodeSage Architecture

This document describes the technical architecture of the CodeSage platform.

## 🏗️ System Overview

CodeSage is a client-side web application built with React, TypeScript, and TailwindCSS. It demonstrates an AI-powered code analysis and security intelligence platform with real-time web data integration.

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Application                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   React Router                        │   │
│  │  ┌──────────┬──────────┬──────────┬──────────────┐   │   │
│  │  │Dashboard │ Scanner  │ Analysis │  Settings    │   │   │
│  │  └──────────┴──────────┴──────────┴──────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Component Layer                          │   │
│  │  - Charts (Recharts)                                 │   │
│  │  - Code Editor (Monaco)                              │   │
│  │  - UI Components (Radix UI)                          │   │
│  │  - Animations (Motion)                               │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Data Layer                               │   │
│  │  - Mock Data (Development)                           │   │
│  │  - API Clients (Production)                          │   │
│  │  - State Management                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌─────────────┬──────────────────┬──────────────────────┐  │
│  │  OpenAI API │  Bright Data API │  GitHub API          │  │
│  │  (Analysis) │  (Threat Intel)  │  (Repositories)      │  │
│  └─────────────┴──────────────────┴──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Core Modules

### 1. Routing Layer (`/src/app/routes.tsx`)

Multi-page application using React Router 7 with data mode:

```typescript
- / (Dashboard)
- /scanner (Repository Upload)
- /repository/:id (File Structure)
- /analysis/:id (Detailed Analysis)
- /settings (Configuration)
```

### 2. Layout Components

#### Root Layout (`/src/app/components/Root.tsx`)
- Sidebar navigation
- User profile
- Persistent layout across routes
- Animated background effects
- Glassmorphism styling

#### Page Components
Each page is a self-contained module with:
- Data fetching logic
- UI state management
- Component composition
- Responsive design

### 3. UI Component Library

Built on Radix UI primitives with custom styling:

**Location**: `/src/app/components/ui/`

**Components**:
- **Card**: Glassmorphic containers
- **Button**: Action triggers with gradients
- **Input/Select**: Form controls
- **Badge**: Status indicators
- **Progress**: Score visualizations
- **Tabs**: Content organization
- **Dialog**: Modal interactions
- **Scroll Area**: Custom scrollbars
- **Tooltip**: Contextual information

### 4. Data Visualization

#### Recharts Integration
```typescript
- Area Charts: Security trends over time
- Bar Charts: Issue distribution by type
- Pie Charts: Severity breakdown
- Radial Bars: Score indicators
```

#### Monaco Editor Integration
```typescript
- Syntax highlighting for multiple languages
- Read-only code display
- Diff view for before/after comparisons
- Line number indicators
- Error highlighting
```

### 5. Animation Layer

Using Motion (Framer Motion):

```typescript
- Page transitions
- Stagger animations for lists
- Hover effects
- Loading states
- Progress indicators
- Blob animations (background)
```

## 📊 Data Flow

### Scan Workflow

```
1. User uploads repository
   ↓
2. Scanner component validates input
   ↓
3. Progress tracker simulates scanning phases
   ↓
4. Mock AI analysis generates issues
   ↓
5. Results stored in state
   ↓
6. Navigate to analysis view
   ↓
7. Display findings with visualizations
```

### Real-time Intelligence Flow (Production)

```
1. Project scanned → Extract dependencies
   ↓
2. Bright Data SERP API → Search CVE databases
   ↓
3. Web Unlocker → Access security advisories
   ↓
4. Scraping Browser → Gather exploit data
   ↓
5. Aggregate findings → Generate threat report
   ↓
6. AI correlates → Match with code issues
   ↓
7. Update dashboard → Real-time metrics
```

## 🎨 Design System

### Color Palette

```css
Primary: Violet (violet-400 to violet-600)
Secondary: Fuchsia (fuchsia-400 to fuchsia-600)
Accent: Cyan (cyan-400 to cyan-600)
Success: Emerald (emerald-400 to emerald-600)
Warning: Yellow (yellow-400 to yellow-600)
Danger: Red (red-400 to red-600)

Backgrounds:
- Slate-950 (darkest)
- Slate-900 (dark)
- Slate-800 (medium)

Text:
- White (primary text)
- Slate-400 (secondary text)
- Slate-500 (tertiary text)
```

### Typography

```css
Headings: Inter font family
Body: Inter font family
Code: Monaco, Consolas, monospace

Sizes:
- Display: 3xl-4xl
- Heading: xl-2xl
- Body: base
- Caption: sm-xs
```

### Spacing

Following Tailwind's 4px base scale:
- Micro: 1-2 (4-8px)
- Small: 3-4 (12-16px)
- Medium: 6-8 (24-32px)
- Large: 12-16 (48-64px)

## 🔧 State Management

### Local State (useState)

Used for:
- Form inputs
- UI toggles
- Modal visibility
- Component-specific data

### URL State (React Router)

Used for:
- Active page
- Project ID
- Analysis view
- Filter parameters

### Mock Data Store

Location: `/src/app/lib/mockData.ts`

Contains:
- Project listings
- Issue details
- Scan history
- Activity logs
- Threat intelligence

## 🚀 Performance Optimizations

### Code Splitting

```typescript
// Automatic route-based splitting via React Router
// Monaco Editor loaded on-demand
// Chart libraries loaded per page
```

### Lazy Loading

```typescript
// Images loaded with lazy attribute
// Components rendered on visibility
// Monaco Editor deferred initialization
```

### Memoization

```typescript
// Chart data memoized with useMemo
// Callback functions with useCallback
// Expensive computations cached
```

### Asset Optimization

```typescript
// SVG icons from Lucide (tree-shakeable)
// CSS purged with Tailwind
// Vite optimizes bundle size
```

## 🔌 API Integration Points

### OpenAI API (Code Analysis)

```typescript
Endpoint: https://api.openai.com/v1/chat/completions
Purpose: AI code analysis and fix generation
Models: GPT-4, GPT-3.5-turbo
Rate Limits: Handled with exponential backoff
```

### Bright Data APIs

#### 1. SERP API
```typescript
Endpoint: https://api.brightdata.com/serp
Purpose: Search CVE databases and security sites
Parameters: Query, filters, pagination
```

#### 2. Web Unlocker
```typescript
Endpoint: https://api.brightdata.com/unlocker
Purpose: Access protected security resources
Features: JavaScript rendering, cookie handling
```

#### 3. Scraping Browser
```typescript
Endpoint: https://api.brightdata.com/scraper
Purpose: Automated browser for threat intelligence
Capabilities: Full page rendering, anti-bot bypass
```

#### 4. MCP Server
```typescript
Endpoint: https://api.brightdata.com/mcp
Purpose: Multi-channel proxy management
Features: Rotating IPs, geo-targeting
```

### GitHub API

```typescript
Endpoint: https://api.github.com
Purpose: Repository cloning and metadata
Authentication: Personal Access Token
Rate Limits: 5000 requests/hour (authenticated)
```

## 🛡️ Security Architecture

### API Key Management

```typescript
// Never expose keys in client code
// Use server-side proxy in production
// Implement key rotation
// Monitor usage and anomalies
```

### Data Privacy

```typescript
// No PII stored in client
// Scan results kept in memory only
// No persistent local storage
// Session-based state management
```

### Content Security Policy

```typescript
// Restrict script sources
// Allow only trusted CDNs
// Block inline scripts (except allowlist)
// Enforce HTTPS
```

## 📱 Responsive Design

### Breakpoints

```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Adaptive Layouts

```typescript
- Sidebar: Collapsible on mobile
- Charts: Responsive containers
- Tables: Horizontal scroll
- Cards: Grid to stack transition
```

## 🧪 Testing Strategy (Future)

### Unit Tests
```typescript
// Component rendering
// Utility functions
// Data transformations
// Mock API responses
```

### Integration Tests
```typescript
// User workflows
// API integration
// State management
// Navigation flows
```

### E2E Tests
```typescript
// Complete scan workflow
// Settings configuration
// Report generation
// Multi-page navigation
```

## 📦 Build Pipeline

### Development

```bash
Vite Dev Server
- Hot Module Replacement (HMR)
- Fast refresh for React
- Source maps
- Mock API responses
```

### Production

```bash
Vite Build
- Minification
- Tree shaking
- Code splitting
- Asset hashing
- Bundle analysis
```

## 🔄 Future Enhancements

### Backend Integration

```typescript
- PostgreSQL database for scan history
- Prisma ORM for type-safe queries
- WebSocket for live updates
- Redis for caching
```

### Advanced Features

```typescript
- Vector search for code similarity
- RAG over codebases
- Dependency graph visualization
- Team collaboration features
- Scheduled scans
- Email notifications
```

### Scalability

```typescript
- Worker threads for analysis
- Queue system for scans
- Horizontal scaling
- CDN for assets
- Edge caching
```

## 📚 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | React 18 | UI rendering |
| Language | TypeScript | Type safety |
| Styling | TailwindCSS v4 | Utility-first CSS |
| Animation | Motion (Framer Motion) | Smooth transitions |
| Routing | React Router 7 | Multi-page navigation |
| Charts | Recharts | Data visualization |
| Editor | Monaco Editor | Code display |
| Icons | Lucide React | Icon library |
| UI Primitives | Radix UI | Accessible components |
| Build Tool | Vite | Fast development |
| Package Manager | pnpm | Efficient dependencies |

## 🎓 Design Patterns

### Component Composition

```typescript
// Atomic design approach
- Atoms: Button, Input, Badge
- Molecules: StatsCard, FileTreeItem
- Organisms: Dashboard, Scanner
- Templates: Root layout
- Pages: Route components
```

### Separation of Concerns

```typescript
- Components: UI rendering
- Hooks: Business logic
- Utils: Pure functions
- Data: Mock/API layer
```

### Progressive Enhancement

```typescript
- Core functionality works without JS
- Enhanced with animations
- Optimized for modern browsers
- Graceful degradation
```

## 📖 References

- [React Documentation](https://react.dev)
- [TailwindCSS v4](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Radix UI](https://radix-ui.com)
- [Recharts](https://recharts.org)
- [Monaco Editor](https://microsoft.github.io/monaco-editor)
- [Bright Data](https://brightdata.com)

---

**Last Updated**: May 22, 2026
**Version**: 1.0.0
