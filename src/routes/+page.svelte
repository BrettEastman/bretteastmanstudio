<script lang="ts">
  import SongDisplay from "../components/SongDisplay.svelte";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
</script>

<div class="home-page">
  <h1>Song Listing Home page</h1>

  {#each data.songList as song}
    <SongDisplay {song} />
  {/each}
</div>

<style>
  .home-page {
    padding: 2rem 4rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
</style>
