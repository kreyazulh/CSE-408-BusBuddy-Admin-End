<script>
  import Navbar from './navbar.svelte';
  import { checkSession, isAuthenticated } from '../auth';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

  let reg_id = '';
  let capacity = '';
  let type = '';
  let remarks = '';

  let addBusResponse = '';
  let fornow = [];

  async function addBus() {
    // Create a JSON object with the data
    const busData = {
      reg_id: reg_id,
      capacity: capacity,
      type: type,
      remarks: remarks
    };

    try {
      const response = await fetch('http://localhost:3000/api/bus/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(busData)
      });
      console.log(response);
      console.log(busData);
      // fornow = await response.json();

      if (response.ok) {
        // Request was successful
        addBusResponse = 'Bus added successfully';
      } else {
        // Request failed
        addBusResponse = 'Failed to add bus';
      }
      navigate('/busList');
    } catch (error) {
      console.error('Error:', error);
      addBusResponse = 'Error occurred';
    }
  }

  function handleAddBus(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
    addBus();
  }

  onMount(() => {
});
</script>

{#if $isAuthenticated}
  <main class="flex">
    <div class="w-fit">
        <Navbar />
    </div>
    <div class="flex-1 ml-56 p-6">
      <h2 class="text-3xl font-bold text-maroon-500">Add Bus</h2>
      <div class="mb-4">
        <label class="block text-gray-600 font-semibold mb-2" for="input1">Bus Reg ID:</label>
        <input class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="text"  bind:value={reg_id} />
      </div>
      <div class="mb-4">
        <label class="block text-gray-600 font-semibold mb-2" for="input1">Capacity:</label>
        <input class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="number"  bind:value={capacity} />
      </div>
      <div class="mb-4">
        <label class="block text-gray-600 font-semibold mb-2" for="dropdown">Select an Option:</label>
        <select class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" id="dropdown" bind:value={type}>
          <option value="" disabled selected>Select Type</option>
          <option value="normal">normal</option>
          <option value="mini">minibus</option>
          <option value="double_decker">double decker</option>
          <option value="micro">microbus</option>
          <option value="single_decker">single decker</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-gray-600 font-semibold mb-2" for="input1">Remarks:</label>
        <input class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="text"  bind:value={remarks} />
      </div>
      <form on:submit={handleAddBus}>
        <button type="submit" class="red-rectangular-button">Add Bus</button>
      </form>

      <p>{addBusResponse}</p>
    </div>
  </main>
{:else}
  <p>Not authenticated</p>
{/if}

<style>
.red-rectangular-button {
  background-color: darkred;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.red-rectangular-button:hover {
  background-color: darkred;
}
</style>