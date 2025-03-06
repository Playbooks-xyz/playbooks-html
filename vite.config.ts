import react from '@vitejs/plugin-react';

import { exec } from 'node:child_process';
import path from 'path';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { defineConfig } from 'vite';

function pushBuild() {
	exec('dts-bundle-generator --config dts.config.ts', (response, error) => {
		if (error) console.error(error);
		console.log('types pushed');
		exec('npx yalc push', (response, error) => {
			if (error) console.error(error);
			console.log('yalc pushed');
		});
	});
}

export default defineConfig({
	base: './',
	build: {
		sourcemap: true,
		lib: {
			entry: path.resolve(__dirname, 'src/index.tsx'),
			name: 'PlaybooksHtml',
			formats: ['es', 'cjs', 'umd', 'iife'],
			fileName: format => `index.${format}.js`,
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					'react/jsx-runtime': 'react/jsx-runtime',
				},
			},
			plugins: [peerDepsExternal()],
		},
	},
	plugins: [
		react(),
		{
			name: 'push-build',
			closeBundle: pushBuild,
		},
	],
	resolve: {
		alias: {
			src: path.resolve(__dirname, '/src'),
			components: path.resolve(__dirname, '/src/components'),
			types: path.resolve(__dirname, '/src/types'),
			utils: path.resolve(__dirname, '/src/utils'),
		},
	},
});
