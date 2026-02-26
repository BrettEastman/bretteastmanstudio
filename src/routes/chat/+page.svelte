<script lang="ts">
  import { createPocketBaseInstance } from "$lib/pocketbase";
  import type { ChatMessage } from "$lib/types";
  import { formatDateTime } from "$lib/utils/formatDateTime";
  import { markdownToHtml } from "$lib/utils/markdown";
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

<div class="flex flex-1 flex-col min-h-0 p-6">
  <div class="mx-auto flex w-full max-w-3xl flex-1 flex-col min-h-0">
    <h2
      class="text-2xl text-primary30 font-semibold text-center my-8 pb-4 dark:text-secondary90"
    >
      Music History AI Chat
    </h2>

    {#if !isAuthenticated}
      <div class="text-center">
        <p
          class="text-lg text-primary30 font-semibold text-center mb-4 pb-4 dark:text-secondary90"
        >
          Please login or create an account to use the chat feature.
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
        class="flex flex-1 flex-col min-h-0 rounded-lg overflow-hidden"
      >
        <!-- Scrollable messages (history loads here; scroll up to see previous chats) -->
        <div
          bind:this={messageContainer}
          class="flex-1 min-h-0 overflow-y-auto bg-secondary90 dark:bg-secondary30 shadow-lg p-4"
        >
          {#each messages as message (message.id)}
            <div class="mb-4">
              <div
                class="bg-secondary80 p-3 rounded-lg mb-2 dark:bg-secondary20 text-primary20 dark:text-secondary90"
              >
                <div class="flex justify-between">
                  <p class="font-semibold">You:</p>
                  <p class="text-xs opacity-80">
                    {formatDateTime(message.created)}
                  </p>
                </div>
                <p>{message.message}</p>
              </div>
              <div
                class="bg-tertiary90 dark:bg-secondary20 p-3 rounded-lg text-primary20 dark:text-secondary90"
              >
                <div class="flex justify-between">
                  <p class="font-semibold">Music Historian:</p>
                  <p class="text-xs opacity-80">
                    {formatDateTime(message.created)}
                  </p>
                </div>
                <div
                  class="prose prose-sm max-w-none dark:prose-invert"
                >
                  {@html markdownToHtml(message.response)}
                </div>
              </div>
            </div>
          {/each}
        </div>

        {#if loading}
          <div class="flex justify-center py-2 bg-secondary96 dark:bg-secondary20 border-t border-secondary80 dark:border-secondary30">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary50"
            ></div>
          </div>
        {:else if error}
          <div class="text-center text-red-500 py-2 bg-secondary96 dark:bg-secondary20 border-t border-secondary80 dark:border-secondary30">{error}</div>
        {/if}

        <!-- Fixed input bar (always visible, ChatGPT-style) -->
        <div class="shrink-0 border-t border-secondary80 dark:border-secondary30 bg-secondary96 dark:bg-secondary20 p-4">
          <form onsubmit={sendMessage} class="flex gap-2 max-w-3xl mx-auto">
            <input
              type="text"
              bind:value={newMessage}
              aria-label="Type your message"
              placeholder="Ask about any music history topic..."
              class="flex-1 px-4 py-2.5 rounded-lg border border-primary70 shadow-sm focus:border-secondary50 focus:ring-secondary70 bg-primary100 dark:bg-secondary10 text-primary10 dark:text-secondary97 placeholder:primary50 dark:placeholder-secondary60"
              disabled={loading}
            />
            <button
              type="submit"
              aria-label="Send message"
              class="bg-secondary80 text-primary20 px-4 py-2.5 rounded-lg hover:bg-secondary60 dark:bg-secondary30 dark:text-tertiary90 duration-200 shrink-0 font-medium"
              disabled={loading || !newMessage.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    {/if}
  </div>
</div>
