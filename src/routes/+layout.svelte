<script>
  import "../app.css";
  import Footer from "../components/Footer.svelte";
  import Header from "../components/Header.svelte";
</script>

<div>
  <Header />
  <div class="h-fit min-h-svh bg-secondary97 dark:bg-secondary10">
    <slot />
  </div>
  <Footer />
</div>
