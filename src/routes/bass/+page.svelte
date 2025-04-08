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
      class="text-sm text-tertiary50 sm:hover:text-tertiary40 active:text-tertiary40 duration-200 p-2 touch-none"
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
    <ul class="grid gap-4 w-full">
      {#if filteredSongs.length > 0}
        {#each filteredSongs as song, i}
          <div class="song-item flex justify-center" style="--index: {i}">
            <SongDisplay {song} />
          </div>
        {/each}
      {:else}
        <p class="text-sm text-primary10 dark:text-primary90 sm:text-lg">
          No matching songs found.
        </p>
      {/if}
    </ul>
  {:else}
    <p class="text-sm text-primary10 dark:text-primary90 sm:text-lg">
      {data.error ? "Please try again later." : "No bass songs available."}
    </p>
  {/if}
</div>

<style>
  .song-item {
    view-timeline-name: --show-song;
    view-timeline-axis: block;
    animation: linear song-fade both;
    animation-timeline: --show-song;
    animation-range: entry 10% cover 17%;
    animation-delay: calc(var(--index) * 100ms);
  }

  @keyframes song-fade {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
