<script lang="ts">
  import { writable } from "svelte/store";
  import Icon from "../../components/Icon.svelte";
  import SongDisplay from "../../components/SongDisplay.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let searchQuery = $state("");
  let y = $state(0);

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

<div class="grid place-items-center gap-2 p-6">
  <h2 class="text-2xl text-primary30 font-semibold py-2 dark:text-secondary90">
    Bass Songs
  </h2>
  <button
    class="text-sm text-tertiary50 dark:text-tertiary60 sm:hover:text-tertiary40 active:text-tertiary40 duration-200 p-4"
    onclick={randomizeSongs}
    aria-label="Randomize song order"
  >
    Randomize order
  </button>
  <input
    type="text"
    aria-label="Search bass songs"
    class="text-base w-full md:w-3/4 lg:w-1/2 p-2 mb-4 border border-primary30 dark:border-secondary90 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary50 focus:border-secondary50"
    placeholder="Search by artist or title..."
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
        No bass songs available.
      </p>
    {/if}
  </ul>

  <div
    class={`
  fixed bottom-0 left-0 z-10 transition-opacity duration-200
  ${y <= 100 ? "opacity-0 pointer-events-none" : "opacity-100"}
`}
  >
    <button
      onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top of page"
      class="px-3 py-6 sm:p-6"
    >
      <Icon
        name="arrow-up-s-line"
        size="36"
        className="fill-current text-primary30 dark:text-secondary90"
      />
    </button>
  </div>
</div>

<svelte:window bind:scrollY={y} />

<style>
  .song-item {
    opacity: 1;
    transform: translateY(0);
  }

  @supports (animation-timeline: view()) {
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
  }
</style>
