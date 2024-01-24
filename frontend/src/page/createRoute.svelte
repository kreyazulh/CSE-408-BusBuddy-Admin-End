<script>
    import { onMount, afterUpdate } from 'svelte';

    let id = '';
    let terminalPoint = '';
    let createdRoute = null;

    let selectedNames = [];
    let stationNames = [];
    let tempSelectedNames = [];

    const fetchStationNames = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/stations');
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

    onMount(() => {
        fetchStationNames();
    });
</script>

<main>
    <h1>Create Route</h1>

    <!-- Input for id -->
    <label for="id">ID:</label>
    <input type="text" bind:value={id} id="id" />

    <!-- Input for terminal_point -->
    <label for="terminalPoint">Terminal Point:</label>
    <input type="text" bind:value={terminalPoint} id="terminalPoint" />

    <!-- Dropdown menu for selecting names -->
    <label for="selectNames">Select Names:</label>
    <select id="selectNames" bind:value={tempSelectedNames} multiple>
        {#each stationNames as { name }}
            <option value={name}>{name}</option>
        {/each}
    </select>

    <div>
        <h3>Selected Names:</h3>
        {#if selectedNames.length > 0}
            <ul>
                {#each selectedNames as selectedName}
                    <li>
                        {selectedName}
                        <button on:click={() => removeSelectedName(selectedName)}>X</button>
                    </li>
                {/each}
            </ul>
        {:else}
            <p>No names selected</p>
        {/if}
    </div>

    <!-- Button to trigger route creation -->
    <button on:click={createRoute}>Create Route</button>

    {#if createdRoute}
        <div>
            <h2>Route Created</h2>
            <p>ID: {createdRoute.id}</p>
            <p>Terminal Point: {createdRoute.terminal_point}</p>
        </div>
    {/if}
</main>

<style>
    main {
        text-align: center;
        margin: 50px;
    }
</style>
