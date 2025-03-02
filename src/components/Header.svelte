<script lang="ts">
  import { goto } from "$app/navigation";
  import { createPocketBaseInstance } from "$lib/pocketbase";
  import { onDestroy, onMount } from "svelte";
  import type PocketBase from "pocketbase";
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

  function updateAuthStatus() {
    if (pb?.authStore) {
      isAuthenticated = pb.authStore.isValid;
      console.log("Auth status updated:", isAuthenticated);
    }
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("click", handleClickOutside);

      // Ensure we have a PocketBase instance
      if (!pb) {
        pb = createPocketBaseInstance();
      }

      // Initial auth check
      updateAuthStatus();

      // Set up auth change listener
      pb.authStore.onChange(() => {
        updateAuthStatus();
      });
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

  function handleLogin() {
    isMobileMenuOpen = false;
    goto("/login");
  }

  async function handleLogout() {
    try {
      isMobileMenuOpen = false; // Close menu immediately

      // Clear client-side auth store first
      pb?.authStore.clear();

      // Call server-side logout endpoint
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Force a full page reload to clear all state
      window.location.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still try to redirect on error
      window.location.replace("/");
    }
  }
</script>

<header
  class="sticky top-0 bg-secondary93 border-b-4 border-tertiary80 dark:bg-secondary20 dark:border-tertiary70 p-4"
>
  <div class="flex flex-row justify-between items-center sm:hidden">
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
      onclick={toggleMobileMenu}
      aria-label="Toggle navigation menu"
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-menu"
    >
      <Hamburger isActive={isMobileMenuOpen} />
    </button>
  </div>

  {#if !isMobileMenuOpen}
    <nav>
      <div class="flex justify-between items-center">
        <a
          href="/"
          class="hidden sm:block pl-4 text-primary30 dark:text-tertiary90 font-semibold hover:text-tertiary60 duration-200"
        >
          Brett Eastman <em>teaching archives</em>
        </a>
        <!-- Desktop nav -->
        <ul class="hidden sm:flex justify-end items-center">
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
                onclick={handleLogout}
                class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
              >
                {`Logout ${pb?.authStore.model?.name}`}
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
    <nav
      class="absolute left-0 right-0 top-[66px] z-10 border-b-4 border-tertiary80 dark:border-tertiary70"
    >
      <!-- Mobile nav -->
      <ul
        id="mobile-menu"
        class="flex flex-col bg-secondary93 dark:bg-secondary20 rounded-md px-4 py-2 shadow-lg"
      >
        {#each navItems as item}
          <li class="my-2">
            <a
              href={item.href}
              onclick={toggleMobileMenu}
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
              onclick={handleLogout}
              class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
            >
              Logout
            </button>
          </li>
        {:else}
          <li
            class="my-2 text-primary30 dark:text-tertiary90 hover:text-tertiary60 duration-200"
          >
            <button
              onclick={handleLogin}
              class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
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
</style>
