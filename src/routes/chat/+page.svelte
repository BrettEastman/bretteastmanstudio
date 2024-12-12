<script lang="ts">
  import type { ChatMessage } from "$lib/typesAndInterfaces";
  import { onMount } from "svelte";
  import { currentUser } from "$lib/pocketbase";

  let messages: ChatMessage[] = [];
  let newMessage = "";
  let loading = false;
  let messageContainer: HTMLDivElement; // Add container reference

  const scrollToBottom = () => {
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  };

  // Reactive statement to trigger scroll when messages change
  $: if (messages) {
    setTimeout(scrollToBottom, 0);
  }

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
    {#if !$currentUser}
      <iframe
        id="embed-preview-iframe"
        loading="eager"
        src="https://embed.pickaxeproject.com/axe?id=Music_Historian_MKXCL&mode=embed_gold&host=beta&theme=light&opacity=100&font_header=Real+Head+Pro&size_header=30&font_body=Real+Head+Pro&size_body=16&font_labels=Real+Head+Pro&size_labels=14&font_button=Real+Head+Pro&size_button=16&c_fb=FFFFFF&c_ff=FFFFFF&c_fbd=888888&c_rb=FFFFFF&c_bb=228DD7&c_bt=FFFFFF&c_t=000000&s_ffo=100&s_rbo=100&s_bbo=100&s_f=minimalist&s_b=filled&s_t=1&s_to=1&s_r=2"
        width="100%"
        height="700px"
        class="bg-secondary90 rounded-lg shadow-lg p-4 mb-4 dark:bg-secondary30"
        style="border:1px solid rgba(0, 0, 0, 1);transition:.3s;border-radius:12px;max-width:1200px"
        frameBorder="0"
        title="Music History AI Chatbot"
      ></iframe>
    {:else}
      <h1
        class="text-2xl text-primary30 font-semibold text-center my-8 pb-4 dark:text-secondary90"
      >
        Music History AI Chat
      </h1>

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
                  {message.created.slice(5, 10)}
                </p>
              </div>
              <p>{message.message}</p>
            </div>
            <div class="bg-tertiary90 p-3 rounded-lg">
              <div class="flex justify-between">
                <p class="font-semibold">Music Historian:</p>
                <p class="text-xs text-primary30">
                  {message.created.slice(5, 10)}
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
        {/if}
      </div>

      <form on:submit|preventDefault={sendMessage} class="flex gap-2">
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
    {/if}
  </div>
</div>
