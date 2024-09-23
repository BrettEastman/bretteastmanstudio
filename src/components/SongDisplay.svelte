<script lang="ts">
  import type { SongItem } from "../lib/typesAndInterfaces";
  export let song: SongItem;
</script>

<a
  href={song.songPdfLink}
  class="border border-primary70 bg-tertiary97 dark:bg-secondary20 shadow-customXl dark:shadow-none rounded-xl p-4 w-full sm:w-1/2 m-1 hover:bg-primary90 dark:hover:bg-secondary10 hover:text-white hover:shadow-none duration-100"
  target="_blank"
>
  <div class="text-primary10 dark:text-primary90">
    <p>Title: <b>{song.songTitle}</b></p>
    <div class="flex justify-between">
      <span>Artist: <b>{song.artistName}</b></span>
      <span>{song.instrumentDescription}</span>
    </div>
  </div>
</a>
