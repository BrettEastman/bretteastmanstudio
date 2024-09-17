<script lang="ts">
  import type { SongItem } from "../types";
  export let song: SongItem;
</script>

<div class="song-item">
  <p>Title: <b>{song.songTitle}</b></p>
  <p>Description: <b>{song.songDescription}</b></p>
  <div class="song-details">
    <span>Artist: <b>{song.artistName}</b></span>
    <span>PDF: <a href={song.songPdfLink}>Link</a></span>
  </div>
</div>

<style>
  .song-item {
    border: 1px solid grey;
    padding: 2rem;
    width: 50%;
    margin: 1rem;
    border-radius: 10px;
  }

  .song-details {
    display: flex;
    justify-content: space-between;
  }
</style>
