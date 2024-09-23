<script lang="ts">
  import type { SongItem } from "../lib/typesAndInterfaces";
  export let song: SongItem;
</script>

<a
  href={song.songPdfLink}
  class="border border-primary70 rounded-xl p-4 w-full sm:w-1/2 m-1 hover:bg-primary70 hover:text-white duration-100"
  target="_blank"
>
  <div>
    <p>Title: <b>{song.songTitle}</b></p>
    <div class="flex justify-between">
      <span>Artist: <b>{song.artistName}</b></span>
      <span>{song.instrumentDescription}</span>
    </div>
  </div>
</a>
