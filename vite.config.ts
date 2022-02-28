import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        https: {
            key: readFileSync('cert/server.key'),
            cert: readFileSync('cert/server.crt')
        }
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: true
    },
    esbuild: {
        "sourcemap": true,
        "minify": false,
    },
    root: "client",
    define: {
        StoreName: '"Book"',
    },
})
