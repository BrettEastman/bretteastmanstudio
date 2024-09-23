<script lang="ts">
  import SongDisplay from "../../components/SongDisplay.svelte";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
</script>

<div class="grid place-items-center px-6">
  <h1 class="text-xl text-primary30 font-semibold py-8">Bass Songs</h1>
  {#if data.songList.length > 0}
    {#each data.songList as song}
      <SongDisplay {song} />
    {/each}
  {:else}
    <p>No bass songs available</p>
  {/if}
</div>
