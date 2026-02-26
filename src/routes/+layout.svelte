<script lang="ts">
  import type { Snippet } from "svelte";
  import "../app.css";
  import Footer from "../components/Footer.svelte";
  import Header from "../components/Header.svelte";

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="flex h-svh flex-col overflow-hidden">
  <Header />
  <main class="min-h-0 flex-1 flex flex-col overflow-auto bg-secondary97 dark:bg-secondary10">
    {@render children?.()}
  </main>
  <Footer />
</div>
