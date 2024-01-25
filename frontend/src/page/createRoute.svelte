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
  
    const fetchStationNames = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/stations', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
  
            if (data && Array.isArray(data)) {
                stationNames = data;
            } else {
                console.error('Failed to fetch station names.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
  
    // Function to remove a name from selectedNames
    const removeSelectedName = (name) => {
        selectedNames = selectedNames.filter(selected => selected !== name);
        tempSelectedNames = tempSelectedNames.filter(tempSelected => tempSelected !== name);
    };
  
  
    const createRoute = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/createroute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, terminal_point: terminalPoint, names: selectedNames }),
            });
  
            const data = await response.json();
  
            if (data.status === 'success') {
                createdRoute = data.route; // Store the created route information
                // Clear the selectedNames array after successful creation
                selectedNames = [];
                tempSelectedNames = [];
            } else {
                console.error('Failed to create route.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
  
    // Ensure selectedNames stays reactive
    afterUpdate(() => {
        selectedNames = Array.from(new Set([...selectedNames, ...tempSelectedNames]));
        console.log('Selected Names:', selectedNames);
    });

    $: if (!$isAuthenticated) {
        navigate('/login', { replace: true });
    }
  
    onMount(() => {
        checkSession();
        fetchStationNames();
    });
    
  </script>
  
  {#if $isAuthenticated}
  <main class="flex">
    <div class="w-1/4">
        <Navbar />
    </div>
    <div class="mx-auto max-w-md">
    <h1 class="text-3xl font-bold mb-4 text-gray-800">Create Route</h1>
  
    <!-- Input for id -->
    <label for="id" class="block text-sm font-semibold text-gray-700 mt-2">ID:</label>
    <input type="text" bind:value={id} id="id" class="w-1/2 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" />
  
    <!-- Input for terminal_point -->
    <label for="terminalPoint" class="block text-sm font-semibold text-gray-700 mt-2 mx-auto">Terminal Point:</label>
    <input type="text" bind:value={terminalPoint} id="terminalPoint" class="w-1/2 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" />
  
    <!-- Dropdown menu for selecting names -->
    <label for="selectNames" class="block text-sm font-semibold text-gray-700 mt-2">Select Names:</label>
    <select id="selectNames" bind:value={tempSelectedNames} multiple class="w-1/2 py-2 px-3  border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
        {#each stationNames as { name }}
            <option value={name}>{name}</option>
        {/each}
    </select>
  
    <div class="mt-4">
        <h3 class="text-lg font-semibold text-gray-800">Selected Names:</h3>
        {#if selectedNames.length > 0}
            <ul class="list-disc pl-4 mt-2">
                {#each selectedNames as selectedName}
                    <li class="flex items-center justify-between bg-gray-100 p-2 mt-2 rounded-md">
                        {selectedName}
                        <button on:click={() => removeSelectedName(selectedName)}>X</button>
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="text-gray-800">No names selected</p>
        {/if}
    </div>
  
    <!-- Button to trigger route creation -->
    <button on:click={createRoute} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4">Create Route</button>
  
    {#if createdRoute}
        <div class="mt-4">
            <h2 class="text-2xl font-bold text-gray-800">Route Created</h2>
            <p>ID: {createdRoute.id}</p>
            <p>Terminal Point: {createdRoute.terminal_point}</p>
        </div>
    {/if}
    </div>
  </main>
    {:else}
        <p>Not authenticated</p>
    {/if}
