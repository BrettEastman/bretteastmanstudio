import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-cloudflare";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    env: {
      dir: process.cwd(),
      publicPrefix: "PUBLIC_",
      privatePrefix: "",
    },
  },
};

export default config;
