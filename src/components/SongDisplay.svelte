<script lang="ts">
  import type { SongItem } from "../lib/typesAndInterfaces";

  interface Props {
    song: SongItem;
  }

  let { song }: Props = $props();
</script>

<a
  href={song.songPdfLink}
  class="border border-primary70 bg-secondary96 dark:bg-secondary20 shadow-customXl dark:shadow-none rounded-xl p-4 w-full md:w-3/4 lg:w-1/2 m-1 hover:bg-secondary93 dark:hover:bg-secondary10 hover:text-white hover:shadow-none duration-200"
  target="_blank"
>
  <div class="text-sm text-primary10 dark:text-primary90 sm:text-lg">
    <p>Title: <b>{song.songTitle}</b></p>
    <div class="flex justify-between">
      <span>Artist: <b>{song.artistName}</b></span>
      <span>{song.instrumentDescription}</span>
    </div>
  </div>
</a>
