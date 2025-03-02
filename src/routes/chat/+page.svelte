<script lang="ts">
  import { createPocketBaseInstance } from "$lib/pocketbase";
  import type { ChatMessage } from "$lib/typesAndInterfaces";
  import { formatDateTime } from "$lib/utils/formatDateTime";
  import { onMount } from "svelte";

  let messages: ChatMessage[] = $state([]);
  let newMessage = $state("");
  let loading = $state(false);
  let error = $state("");
  let messageContainer: HTMLDivElement | undefined = $state();
  let isAuthenticated = $state(false);

  const scrollToBottom = () => {
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  };

  const checkAuth = () => {
    const pbUser = createPocketBaseInstance();
    isAuthenticated = pbUser.authStore.isValid;
    console.log("Auth check - isValid:", isAuthenticated);
    console.log("Auth token exists:", !!pbUser.authStore.token);
  };

  $effect(() => {
    if (messages) {
      setTimeout(scrollToBottom, 0);
    }
  });

  async function loadMessages() {
    try {
      const response = await fetch("/api/chat", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Authentication failed when loading messages");
          isAuthenticated = false;
          return;
        }
        const errorData = await response.json();
        console.error("Server error details:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      messages = await response.json();
    } catch (error) {
      console.error("Error loading messages:", error);
      error = "Failed to load messages. Please try refreshing the page.";
    }
  }

  async function sendMessage(e: Event) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    loading = true;
    error = "";
    const message = newMessage;
    newMessage = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Authentication failed when sending message");
          isAuthenticated = false;
          return;
        }
        if (response.status === 429) {
          const { error: errorMsg } = await response.json();
          error = errorMsg;
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      messages = [...messages, result];
    } catch (error) {
      console.error("Error sending message:", error);
      error = "Failed to send message. Please try again.";
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    checkAuth();
    if (!isAuthenticated) return;
    await loadMessages();
  });
</script>

<div class="p-6">
  <div class="max-w-3xl mx-auto">
    <h2
      class="text-2xl text-primary30 font-semibold text-center my-8 pb-4 dark:text-secondary90"
    >
      Music History AI Chat
    </h2>

    {#if !isAuthenticated}
      <div class="text-center">
        <p
          class="mb-4 text-lg text-primary30 font-semibold text-center mb-4 pb-4 dark:text-secondary90"
        >
          Please log in to use the chat feature.
        </p>
        <a
          href="/login"
          class="inline-block bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
        >
          Login
        </a>
      </div>
    {:else}
      <div
        bind:this={messageContainer}
        class="bg-secondary90 rounded-lg shadow-lg p-4 mb-4 h-[500px] overflow-y-auto no-scrollbar dark:bg-secondary30"
      >
        {#each messages as message (message.id)}
          <div class="mb-4">
            <div class="bg-secondary80 p-3 rounded-lg mb-2 dark:bg-secondary90">
              <div class="flex justify-between">
                <p class="font-semibold">You:</p>
                <p class="text-xs text-primary30">
                  {formatDateTime(message.created)}
                </p>
              </div>
              <p>{message.message}</p>
            </div>
            <div class="bg-tertiary90 p-3 rounded-lg">
              <div class="flex justify-between">
                <p class="font-semibold">Music Historian:</p>
                <p class="text-xs text-primary30">
                  {formatDateTime(message.created)}
                </p>
              </div>
              <p>{message.response}</p>
            </div>
          </div>
        {/each}

        {#if loading}
          <div class="flex justify-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary50"
            ></div>
          </div>
        {:else if error}
          <div class="text-center text-red-500">{error}</div>
        {/if}
        <form onsubmit={sendMessage} class="flex gap-2">
          <input
            type="text"
            bind:value={newMessage}
            placeholder="Ask about any music history topic..."
            class="flex-1 px-4 rounded-lg border-primary70 shadow-sm focus:border-secondary50 focus:ring-secondary70"
            disabled={loading}
          />
          <button
            type="submit"
            class="bg-secondary80 text-primary20 px-4 py-2 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200"
            disabled={loading || !newMessage.trim()}
          >
            Send
          </button>
        </form>
      </div>
    {/if}
  </div>
</div>
