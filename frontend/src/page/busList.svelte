<script>
  import { onMount } from 'svelte';
  import Navbar from './navbar.svelte'; // Assuming you want to use the same Navbar
  import { isAuthenticated } from '../auth'; // If authentication check is needed
  import { navigate } from 'svelte-routing';

  let buses = [];

  async function gotoAddBus() {
    navigate('/busAdd');
  }

  async function getBusList() {
    const response = await fetch('http://localhost:3000/api/bus/');
    buses = await response.json();
  }

  onMount(() => {
    getBusList();
  });
</script>

{#if $isAuthenticated}
  <main class="flex">
    <div class="z-10">
      <Navbar />
    </div>
    <div class="flex-1 ml-56">
      <h1 class="text-4xl font-bold mb-4 text-blue-600">Bus List</h1>
      <button type="submit" class="red-rectangular-button" on:click={gotoAddBus}>Add Bus</button>
      {#if buses.length > 0}
        {#each buses as { reg_id, type, capacity }}
          <div class="bg-gray-100 rounded-md p-4 mb-4">
            <div class="flex items-center justify-between mb-2">
              <p class="text-lg font-semibold">Registration ID: {reg_id}</p>
              <p class="text-lg font-semibold">Type: {type}</p>
            </div>
            <div class="flex items-center justify-between mb-2">
              <p class="text-gray-600">Capacity: {capacity}</p>
            </div>
          </div>
        {/each}
      {:else}
        <p>Loading...</p>
      {/if}
    </div>
  </main>
{:else}
  <!-- You can add a login redirection or a message here -->
{/if}

<style>
  .red-rectangular-button {
    background-color: darkred;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  .red-rectangular-button:hover {
    background-color: darkred;
  }
</style>
