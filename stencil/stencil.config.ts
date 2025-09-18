import { Config } from '@stencil/core';

const devBaseUrl = '/';
const prodBaseUrl = process.env.STENCIL_BASE_URL || devBaseUrl;

export const config: Config = {
	namespace: 'stencil',
	outputTargets: [
		{
			type: 'dist',
			esmLoaderPath: '../loader',
		},
		{
			type: 'dist-custom-elements',
		},
		{
			type: 'docs-readme',
		},
		{
			type: 'www',
			serviceWorker: null, // disable service workers
			baseUrl: prodBaseUrl,
		},
	]
};
