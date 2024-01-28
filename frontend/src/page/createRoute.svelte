<script>
  import { onMount, afterUpdate } from 'svelte';
  import Navbar from './navbar.svelte';
  import "../tailwind.css";
  import { navigate} from 'svelte-routing';
  import { checkSession, isAuthenticated } from '../auth';

  let id = '';
  let terminalPoint = '';
  let createdRoute = null;

  let selectedNames = [];
  let stationNames = [];
  let tempSelectedNames = [];

  let routes = [];

  let searchTerm = '';
  let filteredStationNames = [];

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


  const fetchStationNames = async () => {
      try {
          const response = await fetch('http://localhost:3000/api/station/', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          const data = await response.json();

          if (data && Array.isArray(data)) {
              stationNames = data;
              filteredStationNames = data;
              console.log('Station names:', stationNames);

          } else {
              console.error('Failed to fetch station names.');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  };

  const removeSelectedName = (name) => {
      selectedNames = selectedNames.filter(selected => selected !== name);
      tempSelectedNames = tempSelectedNames.filter(tempSelected => tempSelected !== name);
  };

  const filterStations = () => {
    if (searchTerm.trim() === '') {
          filteredStationNames = stationNames;
          console.log('Filtered stations:', filteredStationNames);
      } else {
          filteredStationNames = stationNames.filter(stationObj => 
              stationObj.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          console.log('Filtered stations:', filteredStationNames);
      }
  };

  const handleSearch = (event) => {
      searchTerm = event.target.value;
      filterStations();
  };



  const createRoute = async () => {
      try {
          const response = await fetch('http://localhost:3000/api/route/create', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ terminal_point: terminalPoint, names: selectedNames }),
          });

          const data = await response.json();

          if (data.status === 'success') {
              createdRoute = data.route; // Store the created route information
              // Clear the selectedNames array after successful creation
              fetchRoutes();
              selectedNames = [];
              tempSelectedNames = [];
          } else {
              console.error('Failed to create route.');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  };

  const updateStations = () => {
    selectedNames = Array.from(new Set([...selectedNames, ...tempSelectedNames]));
      console.log('Selected Names:', selectedNames);
  };

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


  afterUpdate(() => { 
    if (tempSelectedNames.length > 0) {
      updateStations();
    }  
      
  });

  onMount(() => {
      fetchRoutes();
      fetchStationNames();
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
  <!-- Existing route display -->
  <div>
    <p class="font-semibold">Route ID: {route.id}</p>
    <p>Terminal Point: {route.terminal_point}</p>
    <p>Stations: {route.names}</p>
  </div>

  <!-- Delete button -->
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
      <h1 class="text-3xl font-bold mb-4 text-maroon mx-auto">Create Route</h1>
    
      <label for="terminalPoint" class="block text-sm font-semibold text-gray-700 mt-2 mx-auto">Terminal Point:</label>
      <input type="text" bind:value={terminalPoint} id="terminalPoint" class="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" />
    
          <!-- Search bar for stations -->
          <label for="selectNames" class="block text-sm font-semibold text-gray-700 mt-2">Select Stations:</label>
  <input
  type="text"
  bind:value={searchTerm}
  on:input={handleSearch}
  placeholder="Search..."
  class="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
/>

<!-- Dropdown for selecting stations -->
<select id="selectNames" bind:value={tempSelectedNames} multiple class="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
  {#each filteredStationNames as {name}}
      <option value={name}>{name}</option>
  {/each}
</select >
    
      <div class="mt-4">
        <h3 class="text-lg font-semibold text-maroon">Selected Names:</h3>
        {#if selectedNames.length > 0}
          <ul class="list-disc pl-4 mt-2">
            {#each selectedNames as selectedName}
              <li class="flex items-center justify-between bg-gray-100 p-2 mt-2 rounded-md">
                {selectedName}
                <button on:click={() => removeSelectedName(selectedName)} class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full">X</button>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-gray-800">No names selected</p>
        {/if}
      </div>
    
      <button on:click={createRoute} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4">Create Route</button>
    
      {#if createdRoute}
        <div class="mt-4">
          <h2 class="text-2xl font-bold text-maroon">Route Created</h2>
          <p>Terminal Point: {createdRoute.terminal_point}</p>
        </div>
      {/if}
    </div>
</main>
{:else}
<p>You need to log in first</p>
<a href="/login">Log In</a>
  {/if}