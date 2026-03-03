<script lang="ts">
  import type { Snippet } from "svelte";
  import "../app.css";
  import Footer from "../components/Footer.svelte";
  import Header from "../components/Header.svelte";

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
  let mainEl: HTMLElement | undefined = $state();
  let atBottom = $state(false);

  const THRESHOLD = 24;

  function checkScroll() {
    if (!mainEl) return;
    const { scrollTop, clientHeight, scrollHeight } = mainEl;
    atBottom = scrollTop + clientHeight >= scrollHeight - THRESHOLD;
  }

  $effect(() => {
    const el = mainEl;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  });
</script>

<div class="flex h-svh flex-col overflow-hidden">
  <Header />
  <main
    bind:this={mainEl}
    class="min-h-0 flex-1 flex flex-col overflow-auto bg-secondary97 dark:bg-secondary10"
  >
    {@render children?.()}
  </main>
  <div
    class="footer-container"
    class:footer-visible={atBottom}
  >
    <Footer />
  </div>
</div>

<style>
  .footer-container {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease;
  }

  .footer-container.footer-visible {
    max-height: 120px;
  }
</style>
