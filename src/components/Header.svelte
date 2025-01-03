<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { pbUser } from "$lib/pocketbase";
  import { goto } from "$app/navigation";
  import Hamburger from "./Hamburger.svelte";

  let navItems = [
    { name: "Guitar", href: "/guitar" },
    { name: "Drums", href: "/drums" },
    { name: "Bass", href: "/bass" },
    { name: "Theory", href: "/theory" },
    { name: "Chat", href: "/chat" },
  ];

  let isMobileMenuOpen = false;
  let isAuthenticated = false;

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
  // Check auth status whenever it changes
  function updateAuthStatus() {
    isAuthenticated = pbUser.authStore.isValid;
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("click", handleClickOutside);
    } else {
      console.error("Window is not defined.");
    }
    updateAuthStatus();
    pbUser.authStore.onChange(() => {
      updateAuthStatus();
    });
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

  async function handleLogout() {
    pbUser.authStore.clear();
    await goto("/");
  }
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
          {#if isAuthenticated}
            <li
              class="mx-4 text-primary30 dark:text-tertiary90 hover:text-tertiary60 duration-200"
            >
              <button
                on:click={handleLogout}
                class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
              >
                {`Logout ${pbUser.authStore.model?.name}`}
              </button>
            </li>
          {:else}
            <li
              class="mx-4 text-primary30 dark:text-tertiary90 hover:text-tertiary60 duration-200"
            >
              <a
                href="/login"
                class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
              >
                Login
              </a>
            </li>
          {/if}
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
        {#if isAuthenticated}
          <li
            class="my-2 text-primary30 dark:text-tertiary90 hover:text-tertiary60 duration-200"
          >
            <button
              on:click={handleLogout}
              class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
            >
              Logout
            </button>
          </li>
        {:else}
          <li
            class="my-2 text-primary30 dark:text-tertiary90 hover:text-tertiary60 duration-200"
          >
            <a
              href="/login"
              class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
            >
              Login
            </a>
          </li>
        {/if}
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
