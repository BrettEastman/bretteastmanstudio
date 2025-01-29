<script lang="ts">
  import SongDisplay from "../../components/SongDisplay.svelte";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;

  let searchQuery = "";

  $: filteredSongs = data.songList.filter((song) => {
    return (
      song.songTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artistName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
</script>

<div class="grid place-items-center gap-4 p-6">
  <h1
    class="text-2xl text-primary30 font-semibold py-2 sm:py-8 dark:text-secondary90"
  >
    Bass Songs
  </h1>
  <input
    type="text"
    class="w-full md:w-3/4 lg:w-1/2 p-2 border border-primary30 dark:border-secondary90 rounded-md focus:outline-none focus:ring-4 focus:ring-secondary50 focus:border-secondary50"
    placeholder="Search for a bass song by artist or title..."
    bind:value={searchQuery}
  />
  {#if filteredSongs.length > 0}
    {#each filteredSongs as song}
      <SongDisplay {song} />
    {/each}
  {:else}
    <p class="text-sm text-primary10 dark:text-primary90 sm:text-lg">
      No bass songs available
    </p>
  {/if}
</div>
