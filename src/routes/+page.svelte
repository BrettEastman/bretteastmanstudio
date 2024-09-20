<script lang="ts">
  import SongDisplay from "../components/SongDisplay.svelte";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
</script>

<div class="home-page">
  <h1>Song Listing Home Page</h1>

  {#if data.songList.length > 0}
    {#each data.songList as song}
      <SongDisplay {song} />
    {/each}
  {:else}
    <p>No songs available.</p>
  {/if}
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
