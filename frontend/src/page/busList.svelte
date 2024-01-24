<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';

  let buses = [];

  async function getBusList() {
    const response = await fetch('http://localhost:3000/api/bus');
    buses = await response.json();
  }

  onMount(() => {
    getBusList();
  });
</script>

<main>
  <h1>Bus List</h1>
  
  {#if buses.length > 0}
        {#each buses as { reg_id, type, capacity }}
          <p>{ reg_id},{ type}, {capacity }</p>
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
