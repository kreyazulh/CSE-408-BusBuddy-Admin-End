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
<main class="flex min-h-screen bg-gray-100">
  <div>
    <Navbar />
  </div>
  <div class="flex-1 ml-56 p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-maroon">Bus Routes</h1>
      <button 
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        on:click={goToCreateRoute}>
        Create Route
      </button>
    </div>

    {#if routes.length > 0}
    <div class="overflow-x-auto">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Route ID
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Terminal Point
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Stations
            </th>
            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
          </tr>
        </thead>
        <tbody>
          {#each routes as route}
          <tr>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{route.id}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{route.terminal_point}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">{route.name.join(' -> ')}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
              <button
                class="bg-maroon-500 hover:bg-maroon-900 text-white-700 font-bold py-2 px-4 rounded"
                on:click={() => confirmDelete(route.id)}>
                Delete
              </button>
            </td>
          </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {:else}
    <div class="text-center py-10">
      <p>Loading...</p>
    </div>
    {/if}
  </div>
</main>
{:else}
<div class="flex items-center justify-center h-screen">
  <div class="text-center">
    <p class="mb-4">You need to log in first</p>
    <a class="text-blue-500" href="/login">Log In</a>
  </div>
</div>
{/if}
