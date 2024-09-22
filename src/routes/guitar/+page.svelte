<script lang="ts">
  import SongDisplay from "../../components/SongDisplay.svelte";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
</script>

<div class="flex flex-col items-center justify-center px-2 py-4">
  <h1 class="text-xl font-semibold py-8">Guitar songs</h1>

  {#if data.songList.length > 0}
    {#each data.songList as song}
      <SongDisplay {song} />
    {/each}
  {:else}
    <p>No songs available.</p>
  {/if}
</div>
