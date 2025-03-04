<script lang="ts">
  import { writable } from "svelte/store";
  import SongDisplay from "../../components/SongDisplay.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let searchQuery = $state("");

  const songs = writable(data.songList);

  function randomizeSongs() {
    songs.update((currentSongs) =>
      [...currentSongs].sort(() => Math.random() - 0.5)
    );
  }

  let filteredSongs = $derived(
    $songs.filter((song) => {
      return (
        song.songTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artistName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
  );
</script>

<div class="grid place-items-center gap-4 p-6">
  <h2 class="text-2xl text-primary30 font-semibold py-2 dark:text-secondary90">
    Bass Songs
  </h2>
  {#if data.error}
    <p class="text-red-500 dark:text-red-400 text-center p-4">
      {data.error}
    </p>
  {/if}
  {#if $songs.length > 0}
    <button
      class="w-full text-sm text-tertiary50 active:text-tertiary80 duration-200 [@media(hover:hover)]:hover:text-tertiary80"
      onclick={randomizeSongs}
    >
      Randomize order
    </button>
    <input
      type="text"
      class="w-full md:w-3/4 lg:w-1/2 p-2 border border-primary30 dark:border-secondary90 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary50 focus:border-secondary50"
      placeholder="Search for a bass song by artist or title..."
      bind:value={searchQuery}
    />
    {#if filteredSongs.length > 0}
      {#each filteredSongs as song}
        <SongDisplay {song} />
      {/each}
    {:else}
      <p class="text-sm text-primary10 dark:text-primary90 sm:text-lg">
        No matching songs found.
      </p>
    {/if}
  {:else}
    <p class="text-sm text-primary10 dark:text-primary90 sm:text-lg">
      {data.error ? "Please try again later." : "No bass songs available."}
    </p>
  {/if}
</div>
