import { defineConfig } from 'vite';

const { HOSTNAME, PORT, SERVER } = process.env;

export default defineConfig({
  server: {
		host: HOSTNAME,
		port: PORT,
	},
	define: {
		'import.meta.env.SERVER': JSON.stringify(SERVER),
	}
});