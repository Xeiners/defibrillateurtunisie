import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // En developpement, front et service d'envoi sont sur deux ports : Vite
    // relaie /api vers le second, si bien que le code appelle la meme adresse
    // qu'en production et qu'il n'y a aucune origine croisee a regler.
    // Voir server/README.md.
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
