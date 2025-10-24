# Portfolio Project Rules & Guidelines

## 🎯 Project Objective
Create a super design portfolio for job applications showcasing mastery in development with:
- 3D animations using React Three Fiber
- Scroll-based animations using Framer Motion
- Simulated terminal interface
- Modern, responsive design with shadcn/ui

## 🏗️ Architecture & Technology Stack

### Core Technologies (MANDATORY)
- **Framework**: Next.js 15+ (App Router)
- **UI Library**: shadcn/ui with Tailwind CSS v4
- **Animation**: Anime.js for scroll & UI animations
- **3D Graphics**: React Three Fiber (@react-three/fiber) + Three.js
- **Typography**: Geist Sans & Geist Mono fonts
- **Language**: TypeScript (strict mode)

### Required Dependencies
```json
{
  "animejs": "^4.2.2",
  "@react-three/drei": "^9.0.0",
  "@react-three/postprocessing": "^2.0.0",
  "xterm": "^5.0.0",
  "xterm-addon-fit": "^0.8.0",
  "leva": "^0.9.0"
}
```

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── (sections)/
│       ├── hero/
│       ├── about/
│       ├── projects/
│       ├── skills/
│       └── contact/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── 3d/              # React Three Fiber components
│   │   ├── Scene.tsx
│   │   ├── Models/
│   │   └── Effects/
│   ├── animations/      # Anime.js components
   │   ├── ScrollReveal.tsx
   │   ├── PageTransition.tsx
   │   └── Parallax.tsx
│   ├── terminal/        # Terminal simulation
│   │   ├── Terminal.tsx
│   │   └── TerminalCommands.ts
│   └── layout/          # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Navigation.tsx
├── lib/
│   ├── utils.ts
│   ├── animations.ts
│   ├── three-utils.ts
│   └── terminal-utils.ts
├── hooks/
│   ├── useScrollAnimation.ts
│   ├── useTerminal.ts
│   └── use3DScene.ts
└── public/
    ├── models/          # 3D models (.glb, .gltf)
    ├── textures/        # 3D textures
    └── assets/          # Images, icons
```

## 🎨 Design System & UI Guidelines

### Color Palette
- Use shadcn/ui CSS variables for theming
- Support both light and dark modes
- Primary: `hsl(var(--primary))`
- Accent colors for 3D elements and highlights

### Typography
- **Headers**: Geist Sans (--font-geist-sans)
- **Body**: Geist Sans
- **Code/Terminal**: Geist Mono (--font-geist-mono)

### Component Standards
- All UI components MUST use shadcn/ui as base
- Custom components MUST extend shadcn/ui patterns
- Use `cn()` utility for conditional classes
- Implement proper TypeScript interfaces

## 🎬 Animation Guidelines

### Anime.js Standards
```typescript
// Use consistent animation configurations
const fadeInUp = {
  targets: '.fade-in-up',
  translateY: [60, 0],
  opacity: [0, 1],
  duration: 600,
  easing: 'easeOutQuad'
}

// Scroll-triggered animations with Intersection Observer
const scrollReveal = {
  targets: '.scroll-reveal',
  scale: [0.8, 1],
  opacity: [0, 1],
  duration: 800,
  easing: 'easeOutCubic',
  delay: anime.stagger(100) // Stagger animations
}

// Timeline animations for complex sequences
const timeline = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750
});

timeline
  .add({
    targets: '.hero-title',
    translateY: [100, 0],
    opacity: [0, 1]
  })
  .add({
    targets: '.hero-subtitle',
    translateY: [50, 0],
    opacity: [0, 1]
  }, '-=500'); // Start 500ms before previous animation ends
```

### Performance Rules
- Use `will-change` sparingly and remove after animation
- Prefer `transform` and `opacity` for animations
- Implement `prefers-reduced-motion` for accessibility
- Lazy load 3D components with `React.lazy()`

## 🌐 3D Scene Guidelines

### React Three Fiber Best Practices
```typescript
// Canvas setup
<Canvas
  camera={{ position: [0, 0, 5], fov: 75 }}
  shadows
  dpr={[1, 2]}
  gl={{ antialias: true }}
>
  <Suspense fallback={<Loader />}>
    <Scene />
  </Suspense>
</Canvas>

// Performance optimization
const Model = memo(({ ...props }) => {
  const { scene } = useGLTF('/models/model.glb')
  return <primitive object={scene} {...props} />
})
```

### 3D Performance Rules
- Use `useGLTF.preload()` for critical models
- Implement LOD (Level of Detail) for complex scenes
- Use `drei` helpers for common 3D patterns
- Optimize textures (WebP, compressed formats)

## 💻 Terminal Simulation

### Implementation Standards
```typescript
// Terminal component structure
interface TerminalProps {
  commands: TerminalCommand[]
  theme: 'dark' | 'light'
  autoPlay?: boolean
}

// Command structure
interface TerminalCommand {
  input: string
  output: string | React.ReactNode
  delay?: number
}
```
# shadcn/ui

## Components

### Form & Input

- [Form](https://ui.shadcn.com/docs/components/form): Building forms with React Hook Form and Zod validation.
- [Field](https://ui.shadcn.com/docs/components/field): Field component for form inputs with labels and error messages.
- [Button](https://ui.shadcn.com/docs/components/button): Button component with multiple variants.
- [Button Group](https://ui.shadcn.com/docs/components/button-group): Group multiple buttons together.
- [Input](https://ui.shadcn.com/docs/components/input): Text input component.
- [Input Group](https://ui.shadcn.com/docs/components/input-group): Input component with prefix and suffix addons.
- [Input OTP](https://ui.shadcn.com/docs/components/input-otp): One-time password input component.
- [Textarea](https://ui.shadcn.com/docs/components/textarea): Multi-line text input component.
- [Checkbox](https://ui.shadcn.com/docs/components/checkbox): Checkbox input component.
- [Radio Group](https://ui.shadcn.com/docs/components/radio-group): Radio button group component.
- [Select](https://ui.shadcn.com/docs/components/select): Select dropdown component.
- [Switch](https://ui.shadcn.com/docs/components/switch): Toggle switch component.
- [Slider](https://ui.shadcn.com/docs/components/slider): Slider input component.
- [Calendar](https://ui.shadcn.com/docs/components/calendar): Calendar component for date selection.
- [Date Picker](https://ui.shadcn.com/docs/components/date-picker): Date picker component combining input and calendar.
- [Combobox](https://ui.shadcn.com/docs/components/combobox): Searchable select component with autocomplete.
- [Label](https://ui.shadcn.com/docs/components/label): Form label component.

### Layout & Navigation

- [Accordion](https://ui.shadcn.com/docs/components/accordion): Collapsible accordion component.
- [Breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb): Breadcrumb navigation component.
- [Navigation Menu](https://ui.shadcn.com/docs/components/navigation-menu): Accessible navigation menu with dropdowns.
- [Sidebar](https://ui.shadcn.com/docs/components/sidebar): Collapsible sidebar component for app layouts.
- [Tabs](https://ui.shadcn.com/docs/components/tabs): Tabbed interface component.
- [Separator](https://ui.shadcn.com/docs/components/separator): Visual divider between content sections.
- [Scroll Area](https://ui.shadcn.com/docs/components/scroll-area): Custom scrollable area with styled scrollbars.
- [Resizable](https://ui.shadcn.com/docs/components/resizable): Resizable panel layout component.

### Overlays & Dialogs

- [Dialog](https://ui.shadcn.com/docs/components/dialog): Modal dialog component.
- [Alert Dialog](https://ui.shadcn.com/docs/components/alert-dialog): Alert dialog for confirmation prompts.
- [Sheet](https://ui.shadcn.com/docs/components/sheet): Slide-out panel component (drawer).
- [Drawer](https://ui.shadcn.com/docs/components/drawer): Mobile-friendly drawer component using Vaul.
- [Popover](https://ui.shadcn.com/docs/components/popover): Floating popover component.
- [Tooltip](https://ui.shadcn.com/docs/components/tooltip): Tooltip component for additional context.
- [Hover Card](https://ui.shadcn.com/docs/components/hover-card): Card that appears on hover.
- [Context Menu](https://ui.shadcn.com/docs/components/context-menu): Right-click context menu.
- [Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu): Dropdown menu component.
- [Menubar](https://ui.shadcn.com/docs/components/menubar): Horizontal menubar component.
- [Command](https://ui.shadcn.com/docs/components/command): Command palette component (cmdk).

### Feedback & Status

- [Alert](https://ui.shadcn.com/docs/components/alert): Alert component for messages and notifications.
- [Toast](https://ui.shadcn.com/docs/components/toast): Toast notification component using Sonner.
- [Progress](https://ui.shadcn.com/docs/components/progress): Progress bar component.
- [Spinner](https://ui.shadcn.com/docs/components/spinner): Loading spinner component.
- [Skeleton](https://ui.shadcn.com/docs/components/skeleton): Skeleton loading placeholder.
- [Badge](https://ui.shadcn.com/docs/components/badge): Badge component for labels and status indicators.
- [Empty](https://ui.shadcn.com/docs/components/empty): Empty state component for no data scenarios.

### Display & Media

- [Avatar](https://ui.shadcn.com/docs/components/avatar): Avatar component for user profiles.
- [Card](https://ui.shadcn.com/docs/components/card): Card container component.
- [Table](https://ui.shadcn.com/docs/components/table): Table component for displaying data.
- [Data Table](https://ui.shadcn.com/docs/components/data-table): Advanced data table with sorting, filtering, and pagination.
- [Chart](https://ui.shadcn.com/docs/components/chart): Chart components using Recharts.
- [Carousel](https://ui.shadcn.com/docs/components/carousel): Carousel component using Embla Carousel.
- [Aspect Ratio](https://ui.shadcn.com/docs/components/aspect-ratio): Container that maintains aspect ratio.
- [Typography](https://ui.shadcn.com/docs/components/typography): Typography styles and components.
- [Item](https://ui.shadcn.com/docs/components/item): Generic item component for lists and menus.
- [Kbd](https://ui.shadcn.com/docs/components/kbd): Keyboard shortcut display component.

### Misc

- [Collapsible](https://ui.shadcn.com/docs/components/collapsible): Collapsible container component.
- [Toggle](https://ui.shadcn.com/docs/components/toggle): Toggle button component.
- [Toggle Group](https://ui.shadcn.com/docs/components/toggle-group): Group of toggle buttons.
- [Pagination](https://ui.shadcn.com/docs/components/pagination): Pagination component for lists and tables.

## Forms

- [Forms Overview](https://ui.shadcn.com/docs/forms): Guide to building forms with shadcn/ui.
- [React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form): Using shadcn/ui with React Hook Form.
- [TanStack Form](https://ui.shadcn.com/docs/forms/tanstack-form): Using shadcn/ui with TanStack Form.
- [Forms - Next.js](https://ui.shadcn.com/docs/forms/next): Building forms in Next.js with Server Actions.
