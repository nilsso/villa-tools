import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), basicSsl()],
	server: {
		fs: {
			allow: ['generated'],
		},
		host: true,
	},
	build: {
		rollupOptions: {
			// see
			// - <https://github.com/sveltejs/kit/issues/11416>
			// - <https://github.com/sveltejs/svelte/issues/9288#issuecomment-1969334642>
			external: ['@node-rs/argon2'],
		},
	},
});
