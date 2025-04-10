<script lang="ts">
  import type { SongItem } from "$lib/types";

  interface Props {
    song: SongItem;
  }

  let { song }: Props = $props();

  let width = $state(0);
</script>

<a
  href={song.songPdfLink}
  class="border border-primary70 bg-secondary96 dark:bg-secondary20 shadow-customXl dark:shadow-none rounded-xl p-4 w-full md:w-3/4 lg:w-1/2 m-1 active:bg-secondary93 dark:active:bg-secondary10 active:text-white active:shadow-none hover:bg-secondary93 dark:hover:bg-secondary10 hover:text-white hover:shadow-none duration-200"
  target="_blank"
  aria-label="Download {song.songTitle} by {song.artistName} ({song.instrumentDescription})"
>
  <div
    class="text-sm text-primary10 dark:text-primary90 sm:text-base md:text-lg"
  >
    <p>
      {width > 768 ? "Title: " : ""}<b
        class={`${width > 768 ? "px-3" : "px-0"}`}>{song.songTitle}</b
      >
    </p>
    <div class="flex justify-between">
      <span
        >{width > 768 ? "Artist: " : ""}<b
          class={`${width > 768 ? "px-1" : "px-0"}`}>{song.artistName}</b
        >
      </span>
      <span class="text-xs flex items-center">{song.instrumentDescription}</span
      >
    </div>
  </div>
</a>

<svelte:window bind:innerWidth={width} />
