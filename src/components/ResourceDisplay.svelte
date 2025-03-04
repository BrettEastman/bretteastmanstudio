<script lang="ts">
  import type { ResourceItem } from "$lib/types";

  interface Props {
    resource: ResourceItem;
  }

  let { resource }: Props = $props();
</script>

<a
  href={resource.pdfLink}
  class="border border-primary70 bg-secondary96 dark:bg-secondary20 shadow-customXl dark:shadow-none rounded-xl p-4 w-full md:w-3/4 lg:w-1/2 m-1 active:bg-secondary93 dark:active:bg-secondary10 active:text-white active:shadow-none [@media(hover:hover)]:hover:bg-secondary93 [@media(hover:hover)]:dark:hover:bg-secondary10 [@media(hover:hover)]:hover:text-white [@media(hover:hover)]:hover:shadow-none duration-200"
  target="_blank"
>
  <div class="text-primary10 dark:text-primary90 sm:text-lg">
    <p><b>{resource.description}</b></p>
    <div class="flex justify-end">
      <span>{resource.instrument}</span>
    </div>
  </div>
</a>
