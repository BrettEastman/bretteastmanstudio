<!-- src/components/Header.svelte -->
<script lang="ts">
  import Hamburger from "./Hamburger.svelte";
  import { onDestroy, onMount } from "svelte";

  let navItems = [
    { name: "Guitar", href: "/guitar" },
    { name: "Drums", href: "/drums" },
    { name: "Bass", href: "/bass" },
    { name: "Theory", href: "/theory" },
    { name: "Chat", href: "/chat" },
  ];

  let isMobileMenuOpen = false;

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    if (typeof document !== "undefined") {
      document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest("#mobile-menu") && !target.closest("button")) {
      if (isMobileMenuOpen) {
        toggleMobileMenu();
      }
    }
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("click", handleClickOutside);
    } else {
      console.error("Window is not defined.");
    }
  });

  // Reset body overflow on component unmount
  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "auto";
    }
    if (typeof window !== "undefined") {
      window.removeEventListener("click", handleClickOutside);
    }
  });
</script>

<header
  class="sticky top-0 bg-secondary93 border-b-4 border-tertiary80 dark:bg-secondary20 dark:border-tertiary70"
>
  <div class="flex flex-row justify-between items-center px-4 pt-6 sm:hidden">
    <div>
      <a
        href="/"
        class="text-primary30 dark:text-tertiary90 font-semibold hover:text-tertiary60 duration-200"
      >
        Brett Eastman <em>teaching archives</em>
      </a>
    </div>

    <button
      class="sm:hidden text-primary30 dark:text-tertiary90 hover:text-tertiary60 duration-200 focus:outline-none"
      on:click={toggleMobileMenu}
      aria-label="Toggle navigation menu"
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-menu"
    >
      <Hamburger isActive={isMobileMenuOpen} />
    </button>
  </div>

  {#if !isMobileMenuOpen}
    <nav>
      <div class="flex justify-between py-4">
        <a
          href="/"
          class="hidden sm:block pl-4 text-primary30 dark:text-tertiary90 font-semibold hover:text-tertiary60 duration-200"
        >
          Brett Eastman <em>teaching archives</em>
        </a>
        <!-- Desktop nav -->
        <ul class="hidden sm:flex justify-end">
          {#each navItems as item}
            <li class="mx-4">
              <a
                href={item.href}
                class="text-primary30 dark:text-tertiary90 hover:text-tertiary60 duration-200"
              >
                {item.name}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </nav>
  {/if}

  {#if isMobileMenuOpen}
    <nav>
      <!-- Mobile nav -->
      <ul
        id="mobile-menu"
        class="flex flex-col mt-2 bg-secondary93 dark:bg-secondary20 rounded-md p-4 shadow-lg"
      >
        {#each navItems as item}
          <li class="my-2">
            <a
              href={item.href}
              on:click={toggleMobileMenu}
              class="text-primary30 dark:text-tertiary90 hover:text-tertiary60 duration-200"
            >
              {item.name}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  {/if}
</header>

<style>
  #mobile-menu {
    transition:
      max-height 0.3s ease,
      opacity 0.3s ease;
  }
</style>
