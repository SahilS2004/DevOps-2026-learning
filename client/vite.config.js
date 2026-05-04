import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5005',
                changeOrigin: true,
            }
        }
    },
    test: {
        exclude: ['**/e2e/**', '**/node_modules/**', '**/dist/**'],
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    },
})
