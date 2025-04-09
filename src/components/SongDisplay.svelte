<script lang="ts">
  import type { SongItem } from "$lib/types";

  interface Props {
    song: SongItem;
  }

  let { song }: Props = $props();
</script>

<a
  href={song.songPdfLink}
  class="border border-primary70 bg-secondary96 dark:bg-secondary20 shadow-customXl dark:shadow-none rounded-xl p-4 w-full md:w-3/4 lg:w-1/2 m-1 active:bg-secondary93 dark:active:bg-secondary10 active:text-white active:shadow-none hover:bg-secondary93 dark:hover:bg-secondary10 hover:text-white hover:shadow-none duration-200"
  target="_blank"
>
  <div class="text-xs text-primary10 dark:text-primary90 sm:text-sm md:text-lg">
    <p>Title: <b class="px-3 sm:px-[14px]">{song.songTitle}</b></p>
    <div class="flex justify-between">
      <span>Artist: <b class="px-1">{song.artistName}</b></span>
      <span class="text-xs flex items-center">{song.instrumentDescription}</span
      >
    </div>
  </div>
</a>
