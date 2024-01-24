<!-- App.svelte -->
<script>
    import { onMount } from 'svelte';

    let admins = [];
  
    // Fetch admin data from the server
    async function getAdmins() {
      const response = await fetch('http://localhost:3000/api/admins');
      admins = await response.json();
    }
  
    // Call the function when the component is mounted
    onMount(() => {
      getAdmins();
    });
  </script>
  
  <main>
    <h1>Admin Table</h1>
    
    {#if admins.length > 0}
          {#each admins as { id, password }}
            <p>{id},{password}</p>
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
  