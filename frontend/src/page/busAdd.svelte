<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';
  import Navbar from './navbar.svelte';
  import { checkSession, isAuthenticated } from '../auth';

  let admins = [];
  let buses = [];
  let addbus = [];

  // Fetch admin data from the server
  async function getAdmins() {
    const response = await fetch('http://localhost:3000/api/admin/');
    admins = await response.json();
  }


  async function getBus() {
    const response = await fetch('http://localhost:3000/api/bus/');
    buses = await response.json();
  }

  let reg_id = '';
  let type = '';
  let capacity = 0;

  async function addBus(reg_id, type, capacity) {
    // Create a JSON object with the data
    const busData = {
      reg_id: reg_id,
      type: type,
      capacity: capacity
    };

    try {
      const response = await fetch('http://localhost:3000/api/bus/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(busData)
      });
      addbus = await response.json();



      if (response.ok) {
        // Request was successful
        console.log('Bus added successfully');
      } else {
        // Request failed
        console.error('Failed to add bus');
      }
    } catch (error) {
      console.error('Error:', error);
    }

  }

  async function handleAddBus(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
    await addBus(reg_id, type, capacity);
  }


  onMount(() => {
    // getAdmins();
    // getBus();
  });
</script>

{#if $isAuthenticated}
<main class="flex">
  <div class="w-fit">
      <Navbar />
  </div>
  <div class="w-full p-6">
  <h1>Admin Table</h1>

  <form on:submit={handleAddBus}>
    <input type="text" bind:value={reg_id} placeholder="Registration ID" />
    <input type="text" bind:value={type} placeholder="Type" />
    <input type="number" bind:value={capacity} placeholder="Capacity" />

    <button type="submit">Add Bus</button>
  </form>

  
  {#if addbus.length > 0}
        <!-- {#each buses as { reg_id, type, capacity }} -->
          <p>{addbus}</p>
        <!-- {/each} -->
  {:else}
    <p>Loading...</p>
  {/if}
</main>
{:else}
  <p>Not authenticated</p>
{/if}

