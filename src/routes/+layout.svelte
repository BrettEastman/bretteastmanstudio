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

<div>
  <Header />
  <div class="h-fit min-h-svh bg-secondary97 dark:bg-secondary10">
    {@render children?.()}
  </div>
  <Footer />
</div>
