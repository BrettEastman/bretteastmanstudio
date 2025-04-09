<script lang="ts">
  import type { ResourceItem } from "$lib/types";
  import Icon from "../../components/Icon.svelte";
  import ResourceDisplay from "../../components/ResourceDisplay.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let searchQuery = $state("");
  let y = $state(0);

  let filteredResources = $derived(
    data.resourceList.filter((resource: ResourceItem) => {
      return (
        resource.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resource.instrument.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
  );
</script>

<div class="grid place-items-center gap-4 p-6">
  <h2 class="text-2xl text-primary30 font-semibold py-2 dark:text-secondary90">
    Theory Resources
  </h2>
  <input
    type="text"
    class="w-full md:w-3/4 lg:w-1/2 p-2 border border-primary30 dark:border-secondary90 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary50 focus:border-secondary50"
    placeholder="Search for a resource by instrument or description..."
    bind:value={searchQuery}
  />
  <ul class="grid gap-4 w-full">
    {#if filteredResources.length > 0}
      {#each filteredResources as resource, i}
        <div class="resource-item flex justify-center" style="--index: {i}">
          <ResourceDisplay {resource} />
        </div>
      {/each}
    {:else}
      <p class="text-sm text-primary10 dark:text-primary90 sm:text-lg">
        No resources available
      </p>
    {/if}
  </ul>

  <div
    class={`
    fixed bottom-0 left-0 px-2 py-8 sm:p-12 z-10 transition-opacity duration-200
    ${y <= 100 ? "opacity-0 pointer-events-none" : "opacity-100"}
  `}
  >
    <button onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <Icon name="arrow-up-s-line" size="36" className="fill-current" />
    </button>
  </div>
</div>

<svelte:window bind:scrollY={y} />

<style>
  .resource-item {
    opacity: 1;
    transform: translateY(0);
  }

  @supports (animation-timeline: view()) {
    .resource-item {
      view-timeline-name: --show-resource;
      view-timeline-axis: block;
      animation: linear resource-fade both;
      animation-timeline: --show-resource;
      animation-range: entry 10% cover 17%;
      animation-delay: calc(var(--index) * 100ms);
    }

    @keyframes resource-fade {
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
