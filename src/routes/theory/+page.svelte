<script lang="ts">
  import ResourceDisplay from "../../components/ResourceDisplay.svelte";
  import type { PageServerData } from "./$types";
  import type { ResourceItem } from "$lib/typesAndInterfaces";

  export let data: PageServerData;

  let searchQuery = "";

  $: filteredResources = data.resourceList.filter((resource: ResourceItem) => {
    return (
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.instrument.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
</script>

<div class="grid place-items-center gap-4 p-6">
  <h1
    class="text-2xl text-primary30 font-semibold py-2 sm:py-8 dark:text-secondary90"
  >
    Theory Resources
  </h1>
  <input
    type="text"
    class="w-full md:w-3/4 lg:w-1/2 p-2 border border-primary30 dark:border-secondary90 rounded-md"
    placeholder="Search for a resource by instrument or description..."
    bind:value={searchQuery}
  />
  {#if filteredResources.length > 0}
    {#each filteredResources as resource}
      <ResourceDisplay {resource} />
    {/each}
  {:else}
    <p>No resources available</p>
  {/if}
</div>
