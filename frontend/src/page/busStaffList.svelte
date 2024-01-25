<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';

  let bus_staffs = [];

  async function getBusStaffList() {
    const response = await fetch('http://localhost:3000/api/bus_staff');
    bus_staffs = await response.json();
  }

  onMount(() => {
    getBusStaffList();
  });
</script>

<main>
  <h1>Bus Staff List</h1>
  
  {#if bus_staffs.length > 0}
        {#each bus_staffs as {id, name, department,designation,residence,phone}}
          <p>{id},{name},{department},{designation},{residence},{phone}</p>
        {/each}
  {:else}
    <p>Loading...</p>
  {/if}
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
