<script>
  import Icon from "./Icon.svelte";
</script>

<footer
  class="bottom-0 bg-secondary90 border-t-4 border-solid border-tertiary70 dark:bg-secondary20 dark:border-tertiary70"
>
  <div
    class="flex justify-center py-6 mx-auto sm:justify-end gap-4 sm:pr-4 sm:gap-8"
  >
    <a
      href="https://github.com/BrettEastman/bretteastmanstudio/"
      target="_blank"
      class="text-primary30 dark:text-primary50 active:text-tertiary80 transition duration-200"
      aria-label="View project source code on GitHub"
    >
      <Icon name="github" className="fill-current" size="36" />
    </a>

    <a
      href="https://www.linkedin.com/in/brett-austin-eastman/"
      target="_blank"
      class="text-primary30 dark:text-primary50 active:text-tertiary80 transition duration-200"
      aria-label="Connect with Brett Eastman on LinkedIn"
    >
      <Icon name="linkedin" className="fill-current" size="36" />
    </a>
  </div>
</footer>
