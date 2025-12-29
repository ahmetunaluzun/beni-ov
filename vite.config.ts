import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    // Vercel veya yerel .env dosyasından API key'i al
    const apiKey = process.env.API_KEY || 
                   process.env.VITE_API_KEY || 
                   process.env.GEMINI_API_KEY || 
                   '';
    
    if (!apiKey && mode === 'production') {
      console.warn('⚠️ WARNING: API_KEY not found in environment variables!');
    }
    
    return {
      define: {
        // process.env için inject
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.NODE_ENV': JSON.stringify(mode),
        
        // import.meta.env için inject (Vite native)
        'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: false,
        // minify: 'esbuild' (varsayılan, terser'a gerek yok)
        rollupOptions: {
          output: {
            manualChunks: undefined
          }
        }
      }
    };
});
