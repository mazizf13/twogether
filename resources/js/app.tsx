import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/components/ThemeProvider'
import '../css/app.css'

createInertiaApp({
  resolve: name => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const defaultTheme = (props.initialPage.props as any).auth?.user?.theme || 'light'
    
    createRoot(el).render(
      <ThemeProvider defaultTheme={defaultTheme}>
        <App {...props} />
      </ThemeProvider>
    )
  },
  progress: {
    color: '#ec4899',
  },
})
