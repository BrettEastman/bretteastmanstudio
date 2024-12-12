<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { pb } from "$lib/pocketbase";
</script>

<form
  method="POST"
  class=""
  use:enhance={() => {
    return async ({ result }) => {
      pb.authStore.loadFromCookie(document.cookie);
      await applyAction(result);
    };
  }}
>
  <h1
    class="text-2xl mb-8 text-primary30 font-semibold py-2 sm:py-8 dark:text-secondary90"
  >
    Register
  </h1>
  <div class="gap-2 mb-4 text-lg">
    <input
      type="email"
      name="email"
      placeholder="Email"
      class="input input-bordered"
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      class="input input-bordered"
    />
    <input
      type="password"
      name="passwordConfirm"
      placeholder="Confirm password"
      class="input input-bordered"
    />
    <button
      class="text-primary30 font-semibold py-2 sm:py-8 dark:text-secondary90"
      >Register</button
    >
  </div>
</form>
