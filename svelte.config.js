import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-cloudflare";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    csp: {
      directives: {
        "default-src": ["self"],
        "script-src": ["self"],
        "style-src": ["self", "unsafe-inline", "https://fonts.googleapis.com"],
        "font-src": ["self", "https://fonts.gstatic.com"],
        "img-src": ["self", "data:", "https://api.bretteastmanstudio.com"],
        "connect-src": ["self", "https://api.bretteastmanstudio.com"],
        "frame-src": ["self", "https://api.bretteastmanstudio.com"],
        "object-src": ["none"],
        "base-uri": ["self"],
        "form-action": ["self"],
        "frame-ancestors": ["none"],
      },
    },
    env: {
      dir: process.cwd(),
      publicPrefix: "PUBLIC_",
      privatePrefix: "PRIVATE_",
    },
  },
};

export default config;
