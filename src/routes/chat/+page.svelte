<script lang="ts">
  import { onMount } from "svelte";
  import type { ChatMessage } from "$lib/server/pocketbase";

  let messages: ChatMessage[] = [];
  let newMessage = "";
  let loading = false;

  async function sendMessage() {
    if (!newMessage.trim()) return;

    loading = true;
    const message = newMessage;
    newMessage = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      messages = [...messages, result];
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    try {
      const response = await fetch("/api/chat");
      messages = await response.json();
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  });
</script>

<div class="p-6">
  <div class="max-w-3xl mx-auto">
    <h1
      class="text-2xl text-primary30 font-semibold text-center my-8 pb-4 dark:text-secondary90"
    >
      Music History AI Chat
    </h1>

    <div
      class="bg-secondary90 rounded-lg shadow-lg p-4 mb-4 h-[500px] overflow-y-auto no-scrollbar dark:bg-secondary30"
    >
      {#each messages as message (message.id)}
        <div class="mb-4">
          <div class="bg-secondary70 p-3 rounded-lg mb-2 dark:bg-secondary80">
            <p class="font-semibold">You:</p>
            <p>{message.message}</p>
          </div>
          <div class="bg-tertiary90 p-3 rounded-lg">
            <p class="font-semibold">Music Historian:</p>
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
      {/if}
    </div>

    <form on:submit|preventDefault={sendMessage} class="flex gap-2">
      <input
        type="text"
        bind:value={newMessage}
        placeholder="Ask about any music history topic..."
        class="flex-1 rounded-lg border-primary70 shadow-sm focus:border-secondary50 focus:ring-secondary70"
        disabled={loading}
      />
      <button
        type="submit"
        class="bg-secondary50 text-primary90 px-4 py-2 rounded-lg hover:bg-secondary40 disabled:opacity-50"
        disabled={loading || !newMessage.trim()}
      >
        Send
      </button>
    </form>
  </div>
</div>
