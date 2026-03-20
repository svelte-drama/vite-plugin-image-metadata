import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import imageMetadata from './src/lib/index.ts'

export default defineConfig({
	plugins: [sveltekit(), imageMetadata()]
})
