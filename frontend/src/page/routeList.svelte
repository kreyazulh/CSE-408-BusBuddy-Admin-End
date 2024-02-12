<script>
    import { onMount } from 'svelte';
    import Navbar from './navbar.svelte';
    import "../tailwind.css";
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from '../auth';
  
    let routes = [];
  
    function goToCreateRoute() {
      navigate('/createRoute');
    }
  
    async function fetchRoutes() {
      try {
        const response = await fetch('http://localhost:3000/api/route/');
        routes = await response.json();
        console.log(routes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    }
  
    const confirmDelete = async (routeId) => {
      if (window.confirm('Do you really want to delete this route?')) {
        await deleteRoute(routeId);
      }
    };
  
    const deleteRoute = async (routeId) => {
      try {
        const response = await fetch(`http://localhost:3000/api/route/delete/${routeId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          console.log('Route deleted successfully');
          fetchRoutes(); // Refresh the list of routes
        } else {
          console.error('Failed to delete route');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    onMount(() => {
      fetchRoutes();
    });
  </script>
  
  {#if $isAuthenticated}
  <main class="flex">
    <div class="z-10">
      <Navbar />
    </div>
    <div class="flex-1 ml-56 p-6">
      <button 
        class="bg-green-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded-full m-4" 
        on:click={goToCreateRoute}
        style="position: absolute; top: 0; right: 0;">
        Create Route
      </button>
      <h1 class="text-3xl font-bold mb-4 text-maroon mx-auto">Bus Routes</h1>
  
      {#if routes.length > 0}
      {#each routes as route}
      <div class="bg-gray-100 rounded-md p-4 mb-4 flex justify-between items-center">
        <div>
          <p class="font-semibold">Route ID: {route.id}</p>
          <p>Terminal Point: {route.terminal_point}</p>
          <p>Stations: {route.name.join(' -> ')}</p>
        </div>
        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          on:click={() => confirmDelete(route.id)}>
          Delete
        </button>
      </div>
      {/each}
      {:else}
      <p>Loading...</p>
      {/if}
    </div>
  </main>
  {:else}
  <p>You need to log in first</p>
  <a href="/login">Log In</a>
  {/if}
  