<script lang="ts">
  import type { ResourceItem } from "$lib/types";

  interface Props {
    resource: ResourceItem;
  }

  let { resource }: Props = $props();
</script>

<a
  href={resource.pdfLink}
  class="border border-primary70 bg-secondary96 dark:bg-secondary20 shadow-customXl dark:shadow-none rounded-xl p-4 w-full md:w-3/4 lg:w-1/2 m-1 active:bg-secondary93 dark:active:bg-secondary10 active:text-white active:shadow-none hover:bg-secondary93 dark:hover:bg-secondary10 hover:text-white hover:shadow-none duration-200"
  target="_blank"
  aria-label="Download {resource.description} ({resource.instrument})"
>
  <div class="text-primary10 dark:text-primary90 sm:text-lg">
    <p><b>{resource.description}</b></p>
    <div class="flex justify-end">
      <span class="text-xs flex items-center">{resource.instrument}</span>
    </div>
  </div>
</a>
