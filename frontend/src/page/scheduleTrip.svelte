<script>
  import Navbar from './navbar.svelte';
  import { checkSession, isAuthenticated } from '../auth';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

  let routeList = [];
  let busNumbers = [];
  let driverNames = [];
  let staffNames = [];

  let date = null;
  let route = '';
  let shift = '';
  let bus_id = '';
  let driver = '';
  let collector = '';

  let addAllocationResponse = '';

  async function addAllocation() {
    // Create a JSON object with the data
    const allocationData = {
      date: date,
      route: route,
      shift: shift,
      bus_id: bus_id,
      driver: driver,
      collector: collector
    };



    try {
      const response = await fetch('http://localhost:3000/api/route/allocation/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(allocationData)
      });
      console.log(response);
      console.log(allocationData);
      // fornow = await response.json();

      if (response.ok) {
        // Request was successful
        addAllocationResponse = 'Trip added successfully';
      } else {
        // Request failed
        addAllocationResponse = 'Failed to add allocation';
      }
      navigate('/upcomingTrips');
    } catch (error) {
      console.error('Error:', error);
      addAllocationResponse = 'Error occurred';
      // navigate('/upcomingTrips');
    }
  }

  function handleAddAllocation(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
    addAllocation();
  }

  async function getRouteList() {
    const response = await fetch('http://localhost:3000/api/route/');
    const data = await response.json();
    routeList = data.map((row) => {
      return {
        id: row.id,
        terminal_point: row.terminal_point
      };
    });
  }
  async function getBusList() {
    const response = await fetch('http://localhost:3000/api/bus/');
    const data = await response.json();
    busNumbers = data.map((row) => {
      return {
        id: row.reg_id,
        type: row.type,
        capacity: row.capacity,
      };
    });
  }
  async function getDriverList() {
    const response = await fetch('http://localhost:3000/api/staff/driver');
    const data = await response.json();
    driverNames = data.map((row) => {
      return {
        id: row.id,
        name: row.name
      };
    });
  }
  async function getStaffList() {
    const response = await fetch('http://localhost:3000/api/staff/collector');
    const data = await response.json();
    staffNames = data.map((row) => {
      return {
        id: row.id,
        name: row.name
      };
    });
  }

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format the date as YYYY-MM-DD
  let formattedTomorrow = `${tomorrow.getDate().toString().padStart(2, '0')}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getFullYear()}`;
  let americanTomorrow = `${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}-${tomorrow.getFullYear()}`;

  async function addBulk() {
    const bulkData = {
      date: americanTomorrow,
    };



    try {
      const response = await fetch('http://localhost:3000/api/route/allocation/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bulkData)
      });
      console.log(response);
      console.log(bulkData);
      // fornow = await response.json();

      if (response.ok) {
        // Request was successful
        addAllocationResponse = 'Bulk Trips added successfully';
      } else {
        // Request failed
        addAllocationResponse = 'Failed to add bulk allocation';
      }
      // navigate('/upcomingTrips');
    } catch (error) {
      console.error('Error:', error);
      addAllocationResponse = 'Error occurred';
      // navigate('/upcomingTrips');
    }
  }

  onMount(() => {
    getRouteList();
    getBusList();
    getDriverList();
    getStaffList();
});
</script>

{#if $isAuthenticated}
  <main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 to-maroon-900">
    <div>
        <Navbar />
    </div>
    <div class="flex-1 w-full bg-black-900 bg-opacity-60">
      <div class="flex justify-center  items-center">
        <div class="w-1/3 py-5 px-5 my-10 rounded-lg shadow-lg bg-white-700">
          <button class="custom-button font-bold" on:click={()=>{ addBulk();}}>Add Regular Trips for {formattedTomorrow}</button>
          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="input2">Date:</label>
            <input required pattern="[0-9]{3}" placeholder="eg: 30"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="date"  bind:value={date} />
          </div>
          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="dropdown">Select Route:</label>
            <select
            class="w-full px-3 py-2 text-nowrap text-ellipsis border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black-700 text-sm"
              bind:value={route}>
              {#each routeList as routeName}
                <option value={routeName.id}>{routeName.terminal_point}</option>
              {/each}
            </select>
          </div>
          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="dropdown">Select Driver:</label>
            <select
            class="w-full px-3 py-2 text-nowrap text-ellipsis border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black-700 text-sm"
              bind:value={driver}>
              {#each driverNames as driverName}
                <option value={driverName.id}>{driverName.name}</option>
              {/each}
            </select>
          </div>
          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="dropdown">Select Helper:</label>
            <select
            class="w-full px-3 py-2 text-nowrap text-ellipsis border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black-700 text-sm"
              bind:value={collector}>
              {#each staffNames as staffName}
                <option value={staffName.id}>{staffName.name}</option>
              {/each}
            </select>
          </div>
          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="dropdown">Select Bus:</label>
            <select
            class="w-full px-3 py-2 text-nowrap text-ellipsis border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black-700 text-sm"
              bind:value={bus_id}>
              {#each busNumbers as busNumber}
                <option value={busNumber.id}>{busNumber.id}</option>
              {/each}
            </select>
          </div>
          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="dropdown">Select Shift:</label>
            <select class="w-full px-3 py-2 text-nowrap text-ellipsis border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black-700 text-sm"
              bind:value={shift}>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
            </select>
          </div>
          <div class="flex my-4 pt-6 justify-end pr-8">
            <button type="submit" class=" bg-maroon-500 hover:bg-maroon-900 py-3 px-8 text-white-700 font-semibold rounded-full"
            on:click={()=>{ addAllocation();}}>Add</button>
          </div>
          <p class="text-center text-indigo-500 font-bold">{addAllocationResponse}</p>
        </div>
      </div>
    </div>
  </main>
{:else}
  <p>Not authenticated</p>
{/if}

<style>
  .custom-button {
      width: 100%; /* Set the width to 90% of the parent container */
      padding: 30px; /* Adjust the padding to your liking */
      background-color: darkred; /* Red background color */
      color: white; /* White text color */
      border: none; /* Remove border */
      border-radius: 10px; /* Rounded corners */
      text-align: center;
      font-size: 18px; /* Adjust the font size to your liking */
      cursor: pointer;
  }
</style>
