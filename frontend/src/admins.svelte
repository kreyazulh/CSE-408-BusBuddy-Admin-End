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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {#each admins as { id, password }}
            <tr>
              <td>{id}</td>
              <td>{password}</td>
            </tr>
          {/each}
        </tbody>
      </table>
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
  