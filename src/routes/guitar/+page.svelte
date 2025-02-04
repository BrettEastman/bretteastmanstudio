<script lang="ts">
  import SongDisplay from "../../components/SongDisplay.svelte";
  import type { PageServerData } from "./$types";
  import { writable } from "svelte/store";
  import type { SongItem } from "$lib/typesAndInterfaces";

  export let data: PageServerData;

  let searchQuery = "";

  // Create store for songs
  const songs = writable(data.songList);

  // Function to randomize songs
  function randomizeSongs() {
    songs.update((currentSongs) =>
      [...currentSongs].sort(() => Math.random() - 0.5)
    );
  }

  // Filter songs based on search query
  $: filteredSongs = $songs.filter((song) => {
    return (
      song.songTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artistName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
</script>

<div class="grid place-items-center gap-4 p-6">
  <h2
    class="text-2xl text-primary30 font-semibold py-2 sm:py-8 dark:text-secondary90"
  >
    Guitar Songs
  </h2>
  <div>
    <button
      class="bg-primary30 dark:bg-secondary90 text-white dark:text-primary30 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary50 focus:border-secondary50"
      on:click={randomizeSongs}
    >
      Randomize order
    </button>
  </div>
  <input
    type="text"
    class="w-full md:w-3/4 lg:w-1/2 p-2 border border-primary30 dark:border-secondary90 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary50 focus:border-secondary50"
    placeholder="Search for a guitar song by artist or title..."
    bind:value={searchQuery}
  />

  {#if filteredSongs.length > 0}
    {#each filteredSongs as song}
      <SongDisplay {song} />
    {/each}
  {:else}
    <p class="text-sm text-primary10 dark:text-primary90 sm:text-lg">
      No guitar songs available.
    </p>
  {/if}
</div>
