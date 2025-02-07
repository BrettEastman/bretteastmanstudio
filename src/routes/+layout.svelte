<script lang="ts">
  import "../app.css";
  import Footer from "../components/Footer.svelte";
  import Header from "../components/Header.svelte";
  import { dev } from "$app/environment";
  import { injectAnalytics } from "@vercel/analytics/sveltekit";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  injectAnalytics({ mode: dev ? "development" : "production" });
</script>

<div>
  <Header />
  <div class="h-fit min-h-svh bg-secondary97 dark:bg-secondary10">
    {@render children?.()}
  </div>
  <Footer />
</div>
