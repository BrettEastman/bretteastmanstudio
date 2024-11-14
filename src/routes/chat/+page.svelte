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

<div class="min-h-screen bg-gray-100 p-4">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8">Music History AI Chat</h1>

    <div
      class="bg-white rounded-lg shadow-lg p-4 mb-4 h-[600px] overflow-y-auto"
    >
      {#each messages as message (message.id)}
        <div class="mb-4">
          <div class="bg-blue-100 p-3 rounded-lg mb-2">
            <p class="font-semibold">You:</p>
            <p>{message.message}</p>
          </div>
          <div class="bg-gray-100 p-3 rounded-lg">
            <p class="font-semibold">Music Historian:</p>
            <p>{message.response}</p>
          </div>
        </div>
      {/each}

      {#if loading}
        <div class="flex justify-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
          ></div>
        </div>
      {/if}
    </div>

    <form on:submit|preventDefault={sendMessage} class="flex gap-2">
      <input
        type="text"
        bind:value={newMessage}
        placeholder="Ask about any music history topic..."
        class="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        disabled={loading}
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        disabled={loading || !newMessage.trim()}
      >
        Send
      </button>
    </form>
  </div>
</div>
