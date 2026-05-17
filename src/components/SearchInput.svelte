<script lang="ts">
  import Icon from "./Icon.svelte";

  interface Props {
    value: string;
    placeholder?: string;
    ariaLabel?: string;
  }

  let {
    value = $bindable(),
    placeholder = "",
    ariaLabel = "",
  }: Props = $props();

  let inputEl: HTMLInputElement;

  function clear() {
    value = "";
    inputEl.focus();
  }
</script>

<div class="relative w-full md:w-3/4 lg:w-1/2">
  <input
    bind:this={inputEl}
    type="text"
    aria-label={ariaLabel}
    class="w-full p-2 pr-8 border border-primary30 dark:border-secondary90 rounded-md
           focus:outline-none focus:ring-2 focus:ring-secondary50 focus:border-secondary50"
    {placeholder}
    bind:value
  />
  <button
    type="button"
    class="absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-150
           {value ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
    onclick={clear}
    aria-label="Clear search"
  >
    <Icon
      name="close-line"
      size="18"
      className="fill-current text-primary20 dark:text-secondary20"
    />
  </button>
</div>
