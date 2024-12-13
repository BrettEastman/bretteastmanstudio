<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { pb } from "$lib/pocketbase";
</script>

<form
  method="POST"
  class="grid place-items-center"
  use:enhance={() => {
    return async ({ result }) => {
      // when the form is submitted, we need to tell the client to load the user from the cookie
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
  <div class="flex flex-col gap-2 mb-4 text-lg">
    <input
      type="text"
      name="firstName"
      placeholder="First Name"
      class="bg-secondary100 dark:bg-secondary80 rounded-md p-2"
    />
    <input
      type="text"
      name="lastName"
      placeholder="Last Name"
      class="bg-secondary100 dark:bg-secondary80 rounded-md p-2"
    />
    <input
      type="email"
      name="email"
      placeholder="Email"
      class="bg-secondary100 dark:bg-secondary80 rounded-md p-2"
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      class="bg-secondary100 dark:bg-secondary80 rounded-md p-2"
    />
    <input
      type="password"
      name="passwordConfirm"
      placeholder="Confirm password"
      class="bg-secondary100 dark:bg-secondary80 rounded-md p-2"
    />
    <button
      class="bg-secondary100 dark:bg-secondary80 rounded-md p-2 text-primary30 font-semibold dark:text-secondary90 hover:bg-secondary90 duration-200"
      >Register</button
    >
  </div>
</form>
