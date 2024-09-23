<script>
  let navItems = [
    { name: "Guitar", href: "/guitar" },
    { name: "Drums", href: "/drums" },
    { name: "Bass", href: "/bass" },
  ];
</script>

<header class="flex justify-between items-center px-4 py-2 bg-primary50">
  <a
    href="/"
    class="text-primary90 font-semibold hover:text-primary80 duration-200"
    >Brett Eastman Studio Archives</a
  >
  <nav>
    <ul class="flex">
      {#each navItems as item}
        <li class="mx-2 text-primary90 hover:text-primary80 duration-200">
          <a href={item.href}>{item.name}</a>
        </li>
      {/each}
    </ul>
  </nav>
</header>
