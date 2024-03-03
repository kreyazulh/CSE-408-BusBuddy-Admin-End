<script>
  import { onMount } from 'svelte';
  import Navbar from '../GlobalComponents/navbar.svelte';
  import "../../tailwind.css";
  import { navigate } from 'svelte-routing';
  import { isAuthenticated } from '../../auth';

  let routes = [];

  // Function to fetch routes from the API
  async function fetchRoutes() {
    try {
      const response = await fetch('http://localhost:3000/api/route/');
      if (response.ok) {
        routes = await response.json();
        console.log('routes:', routes);
      } else {
        console.error('Failed to fetch routes:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  }

  // Function to confirm and delete a route
  const confirmDelete = async (routeId) => {
    if (window.confirm('Do you really want to delete this route?')) {
      await deleteRoute(routeId);
    }
  };

  // Function to delete a route
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
        console.error('Failed to delete route:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

   // Function to navigate to the route details page
   function goToRouteDetails(routeId) {
    navigate(`/routeDetails?routeId=${routeId}`);
  }

  // Fetch routes when the component mounts
  onMount(() => {
    fetchRoutes();
  });

  // Function to navigate to the route creation page
  function goToCreateRoute() {
    navigate('/createRoute');
  }
</script>

<!-- Importing Boxicons CSS -->
<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css">

{#if $isAuthenticated}
<main class="flex min-h-screen bg-gray-100">
  <div>
    <Navbar />
  </div>
  <div class="flex-1 ml-56 mr-4 mt-8 mb-4 p-6 bg-white rounded shadow-md">
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
      <table class="min-w-full">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-6 py-3 text-left">Route ID</th>
            <th class="px-6 py-3 text-left">Terminal Point</th>
            <th class="px-6 py-3 text-left">Stations</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each routes as route}
          <tr class="border-b border-gray-200">
            <td class="px-6 py-4">{route.id}</td>
            <td class="px-6 py-4">{route.terminal_point}</td>
            <td class="px-6 py-4">
              {#each route.name as station, index}
                <span>{station}</span>
                {#if index !== route.name.length - 1}
                  <i class="bx bx-right-arrow-alt mx-2 text-gray-500"></i>
                {/if}
              {/each}
            </td>
            <td class="px-6 py-4 text-right">
              <button
              class="p-2 rounded text-white bg-blue-500 hover:bg-blue-700 mr-2"
              on:click={() => goToRouteDetails(route.id)}>
              <i class="bx bx-edit"></i>
            </button>
              <button
                class="p-2 rounded text-white bg-red-500 hover:bg-red-700"
                on:click={() => confirmDelete(route.id)}>
                <i class="bx bx-trash"></i>
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
