<script>
  let navItems = [
    { name: "Guitar", href: "/guitar" },
    { name: "Drums", href: "/drums" },
    { name: "Bass", href: "/bass" },
  ];
</script>

<header
  class="flex justify-between items-center px-4 py-2 bg-secondary93 border-b-4 border-solid border-tertiary80 dark:bg-secondary20 dark:border-tertiary70"
>
  <a
    href="/"
    class="text-primary30 dark:text-tertiary90 font-semibold hover:text-primary70 duration-200"
    >Brett Eastman Studio <em>student PDF archives</em></a
  >
  <nav>
    <ul class="flex">
      {#each navItems as item}
        <li
          class="mx-2 text-primary30 dark:text-tertiary90 hover:text-primary70 duration-200"
        >
          <a href={item.href}>{item.name}</a>
        </li>
      {/each}
    </ul>
  </nav>
</header>
