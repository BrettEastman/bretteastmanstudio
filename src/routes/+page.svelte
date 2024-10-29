<script lang="ts">
  import SongDisplay from "../components/SongDisplay.svelte";
  import type { PageServerData } from "./$types";

  export let data: PageServerData;
  let searchQuery = "";

  $: filteredSongs = data.songList.filter((song) =>
    song.songTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="flex flex-col items-center px-2 py-4">
  <h1 class="text-2xl text-primary10 dark:text-primary80 font-semibold py-8">
    Home Page
  </h1>
  <div class="w-1/2 text-lg text-primary10 dark:text-primary80">
    <p>
      Brett Eastman is a{" "}
      <a
        href="https://www.bretteastman.dev/"
        target="_blank"
        class="hover:text-primary60 duration-200"
        >software engineer,
      </a>
      {" "}composer,{" "}
      <a
        href="https://www.brettaustineastman.com/"
        target="_blank"
        class="hover:text-primary60 duration-200"
      >
        musician,
      </a> and former music teacher based in San Francisco. As a teacher, his mission
      was to provide students the chance to develop lasting musical skills, leaving
      the student with abilities to provide a lifetime of musical enjoyment. His
      aim was to inspire students to do their very best and to find their own deep
      connection to music.
    </p>
  </div>
</div>

<div class="grid place-items-center gap-4 p-6">
  <h1 class="text-xl text-primary30 font-semibold py-8 dark:text-secondary90">
    All Songs:
  </h1>
  <input
    type="text"
    class="w-1/2 p-2 border border-primary30 dark:border-secondary90 rounded-md"
    placeholder="Search for a song..."
    bind:value={searchQuery}
  />
  {#if filteredSongs.length > 0}
    {#each filteredSongs as song}
      <SongDisplay {song} />
    {/each}
  {:else}
    <p>No songs available</p>
  {/if}
</div>
