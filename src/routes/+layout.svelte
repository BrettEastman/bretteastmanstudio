<script>
  import "../app.css";
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<div>
  <Header />
  <div class="h-fit min-h-svh bg-secondary97 dark:bg-secondary10">
    <slot />
  </div>
  <Footer />
</div>
