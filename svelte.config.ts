// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import type { Config } from '@sveltejs/kit';

const config: Config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({}),
		alias: {
			$generated: './src/generated',
		},
	},
	compilerOptions: {
		experimental: {
			// async: true
		},
	},
};

export default config;
