<!-- App.svelte -->

<script>
  import { onMount } from 'svelte';

  let addbus = [];

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

  onMount(() => {
    // getAdmins();
    // getBus();
    addBus("Ba-69-8288","double_decker",60);
  });
</script>

<main>
  <h1>Admin Table</h1>
  
  <!-- {#if addbus.length > 0} -->
        <!-- {#each buses as { reg_id, type, capacity }} -->
          <p>{addbus}</p>
        <!-- {/each} -->
  <!-- {:else}
    <p>Loading...</p>
  {/if} -->
</main>

<style>
  main {
    text-align: center;
    margin: 2em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
</style>
