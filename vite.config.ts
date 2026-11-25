import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Скиллы и их артефакты не должны триггерить HMR: иначе страница
    // перезагружается бесконечно, а dev-сервер падает.
    watch: {
      ignored: ['**/.agents/**', '**/.taste-skill/**', '**/.claude/**'],
    },
  },
})
