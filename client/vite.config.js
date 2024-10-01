import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': {}, // Add this line
    },
    resolve: {
        alias: {
            // Resolve node built-in modules if necessary
            buffer: 'buffer/',
            crypto: 'crypto-browserify',
        },
    },
    // If using external libraries, ensure to install the following
    optimizeDeps: {
        include: ['buffer', 'crypto-browserify'],
    },

})