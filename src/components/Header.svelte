<script lang="ts">
  import { goto } from "$app/navigation";
  import { createPocketBaseInstance } from "$lib/pocketbase";
  import type PocketBase from "pocketbase";
  import { onDestroy, onMount } from "svelte";
  import Hamburger from "./Hamburger.svelte";

  let navItems = [
    { name: "Guitar", href: "/guitar" },
    { name: "Drums", href: "/drums" },
    { name: "Bass", href: "/bass" },
    { name: "Theory", href: "/theory" },
    { name: "Chat", href: "/chat" },
  ];

  let isMobileMenuOpen = $state(false);
  let isAuthenticated = $state(false);
  let pb = $state<PocketBase | undefined>(undefined);

  // Initialize PocketBase immediately if we're in the browser
  if (typeof window !== "undefined") {
    pb = createPocketBaseInstance();
  }

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    // Prevent scrolling when the mobile menu is open
    if (typeof document !== "undefined") {
      document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest("#mobile-menu") && !target.closest("button")) {
      if (isMobileMenuOpen) {
        isMobileMenuOpen = false;
        document.body.style.overflow = "auto";
      }
    }
  }

  function updateAuthStatus() {
    if (pb?.authStore) {
      isAuthenticated = pb.authStore.isValid;
    }
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("click", handleClickOutside);

      if (!pb) {
        pb = createPocketBaseInstance();
      }

      updateAuthStatus();

      pb.authStore.onChange(() => {
        updateAuthStatus();
      });
    } else {
      console.error("Window is not defined.");
    }
  });

  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "auto";
    }
    if (typeof window !== "undefined") {
      window.removeEventListener("click", handleClickOutside);
    }
  });

  function handleLogin() {
    isMobileMenuOpen = false;
    goto("/login");
  }

  async function handleLogout() {
    try {
      isMobileMenuOpen = false;

      pb?.authStore.clear();

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      window.location.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
      window.location.replace("/");
    }
  }
</script>

<header
  class="sticky top-0 bg-secondary93 border-b-4 border-tertiary80 dark:bg-secondary20 dark:border-tertiary70 py-5 px-4 z-20"
>
  <div class="flex flex-row justify-between items-center sm:hidden">
    <div>
      <a
        href="/"
        class="logo"
        aria-label="Home - Brett Eastman Studio"
      >
        <img src="/images/bes-logo.png" alt="Brett Eastman Studio" class="logo-img block dark:hidden" />
        <img src="/images/bes-logo-dark.png" alt="Brett Eastman Studio" class="logo-img hidden dark:block" />
      </a>
    </div>

    <button
      class="sm:hidden text-primary30 dark:text-tertiary90 hover:text-tertiary60 duration-200 focus:outline-none p-2"
      onclick={toggleMobileMenu}
      aria-label="Toggle navigation menu"
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-menu"
    >
      <Hamburger isActive={isMobileMenuOpen} />
    </button>
  </div>

  {#if !isMobileMenuOpen}
    <nav aria-label="Main navigation" class="hidden sm:block">
      <div class="flex justify-between items-center">
        <a
          href="/"
          class="logo hidden sm:block pl-4"
          aria-label="Home - Brett Eastman Studio"
        >
          <img src="/images/bes-logo.png" alt="Brett Eastman Studio" class="logo-img block dark:hidden" />
          <img src="/images/bes-logo-dark.png" alt="Brett Eastman Studio" class="logo-img hidden dark:block" />
        </a>
        <!-- Desktop nav -->
        <ul class="hidden sm:flex justify-end items-center" role="menubar">
          {#each navItems as item}
            <li class="mx-4" role="none">
              <a
                href={item.href}
                class="text-base text-primary30 dark:text-tertiary90 hover:text-tertiary60 duration-200"
                role="menuitem"
              >
                {item.name}
              </a>
            </li>
          {/each}
          {#if isAuthenticated}
            <li class="mx-4" role="none">
              <button
                onclick={handleLogout}
                class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
                role="menuitem"
                aria-label="Logout {pb?.authStore.model?.name}"
              >
                {`Logout ${pb?.authStore.model?.name}`}
              </button>
            </li>
          {:else}
            <li class="mx-4" role="none">
              <a
                href="/login"
                class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
                role="menuitem"
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
    <nav aria-label="Mobile navigation">
      <!-- Mobile nav -->
      <ul
        id="mobile-menu"
        class="flex flex-col bg-secondary93 dark:bg-secondary20 rounded-md px-4 py-2 shadow-lg"
        role="menu"
      >
        {#each navItems as item}
          <li class="my-2 w-full" role="none">
            <a
              href={item.href}
              onclick={toggleMobileMenu}
              class="flex px-4 w-full text-primary30 dark:text-tertiary90 hover:text-tertiary60 duration-200"
              role="menuitem"
            >
              {item.name}
            </a>
          </li>
        {/each}
        {#if isAuthenticated}
          <li class="my-2" role="none">
            <button
              onclick={handleLogout}
              class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
              role="menuitem"
              aria-label="Logout {pb?.authStore.model?.name}"
            >
              Logout
            </button>
          </li>
        {:else}
          <li class="my-2" role="none">
            <button
              onclick={handleLogin}
              class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
              role="menuitem"
            >
              Login
            </button>
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
  .logo {
    display: block;
    line-height: 0;
  }

  .logo-img {
    height: 3.25rem;
    width: auto;
  }
</style>
