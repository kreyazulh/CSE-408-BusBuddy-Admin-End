<script>
  import Navbar from '../GlobalComponents/navbar.svelte';
  import { isAuthenticated } from '../../auth';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import ErrorPopUp from '../GlobalComponents/PopUps/errorPopUp.svelte';
  import SuccessfulPopUp from "../GlobalComponents/PopUps/successfulPopUp.svelte";

  let isShrink = false;

  let routeList = [];

  let allocatedDrivers = [];
  let unallocatedDrivers = [];

  let allocatedHelpers = [];
  let unallocatedHelpers = [];

  let allocatedBuses = [];
  let unallocatedBuses = [];

  let date = null;
  let route = '';
  let shift = '';
  let bus_id = '';
  let driver = '';
  let helper = '';

  let success = -1;
  let errorMessage = '';

  let addAllocationResponse = '';

  function handleClick() {
    isShrink = true;
    setTimeout(() => {
      isShrink = false;
    }, 100);
  }

  async function addAllocation() {
    // Create a JSON object with the data
    const allocationData = {
      date: date,
      route: route,
      shift: shift,
      bus_id: bus_id,
      driver: driver,
      collector: helper
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
        success = 1;
        addAllocationResponse = 'Trip added successfully';
      } else {
        // Request failed
        success = 0;
        addAllocationResponse = 'Failed to add allocation';
      }
      navigate('/upcomingTrips');
    } catch (error) {
      console.error('Error:', error);
      success = 0;
      addAllocationResponse = 'Error occurred';
      // navigate('/upcomingTrips');
    }
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
    allocatedBuses = data.map((row) => {
      return {
        id: row.reg_id,
        type: row.type,
        capacity: row.capacity,
      };
    });
    //unallocated kemne anbo jani na
  }
  async function getDriverList() {
    const response = await fetch('http://localhost:3000/api/staff/driver');
    const data = await response.json();
    allocatedDrivers = data.map((row) => {
      return {
        id: row.id,
        name: row.name
      };
    });
    // unallocated kemne anbo jani na
  }
  async function getHelperList() {
    const response = await fetch('http://localhost:3000/api/staff/collector');
    const data = await response.json();
    allocatedHelpers = data.map((row) => {
      return {
        id: row.id,
        name: row.name
      };
    });
    // unallocated kemne anbo jani na
  }

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format the date as YYYY-MM-DD
  let formattedTomorrow = `${tomorrow.getDate().toString().padStart(2, '0')}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getFullYear()}`;
  let americanTomorrow = `${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}-${tomorrow.getFullYear()}`;

  async function addBulk() {
    handleClick();
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
    getHelperList();
});
</script>

<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css">

{#if $isAuthenticated}
  <main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900">
    <div>
        <Navbar />
    </div>

    <div class="flex w-full justify-center items-center">
      <div class="w-1/2 py-5 px-5 my-10 rounded-lg shadow-lg bg-white-700">
        <h2 class="text-3xl font-bold underline uppercase text-maroon-500">
          Schedule Regular Trips
        </h2>
        <div class="flex justify-end my-5">
          <button class="shadow-md font-bold text-xl text-white-700 bg-gradient-to-br from-red-600 to-red-900 mr-5  w-fit rounded-lg py-3 px-10" 
          class:shrink={isShrink}
          on:click={()=>{ addBulk();}}>
          <i class="bx bxs-hand-right"></i>
          Add Regular Trips for {formattedTomorrow}
          </button>
        </div>

        <div class="flex flex-row">
          <div class="w-1/2">

            <!-- date -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="date">Date:</label>
              <input 
                required
                id="date"
                class="w-full px-3 py-2 border rounded-md {date === null ? 'text-gray-400 bg-gray-100'  : 'text-black-900 bg-white-700'}  focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                type="date"
                bind:value={date}
              />
            </div>

            <!-- route -->
              <div class="my-4 px-5">
                <label class="block text-gray-600 font-semibold mb-2" for="route">Select Route:</label>
                <select
                  required
                  class= "{route === "" ? 'text-gray-400' : 'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                  id="routeDropdown"
                  bind:value={route}>
                  <option value="" hidden selected>Select Route</option>
                  {#each routeList as routeName}
                    <option value={routeName.id} class="text-black-900">{routeName.terminal_point}</option>
                  {/each}
                </select>
              </div>

            <!-- shift -->
              <div class="my-4 px-5">
                <label class="block text-gray-600 font-semibold mb-2" for="shift">Select Shift:</label>
                <select
                  required
                  class= "{shift === "" ? 'text-gray-400' : 'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                  id="shiftDropdown"
                  bind:value={shift}>
                  <option value="" hidden selected>Select Shift</option>
                  <option value="morning" class="text-black-900">Morning</option>
                  <option value="afternoon" class="text-black-900">Afternoon</option>
                  <option value="evening" class="text-black-900">Evening</option>
                </select>
              </div>
          </div>

          <div class = "w-1/2">

            <!-- allocate driver -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="driver">Allocate Driver:</label>
              <select
                class="{driver === "" ? 'text-gray-400' : 'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                id="driverDropdown"
                bind:value={driver}>
                <option value="" hidden selected>Select Driver</option>
                <optgroup label="Allocated Drivers" class="text-maroon-500 italic">
                  {#each allocatedDrivers as allocatedDriver}
                    <option value={allocatedDriver.id} class="text-black-900 not-italic">{allocatedDriver.name}</option>
                  {/each}
                </optgroup>
                <optgroup label="Unallocated Drivers" class="text-maroon-500 italic">
                  {#each unallocatedDrivers as unallocatedDriver}
                    <option value={unallocatedDriver.id} class="text-black-900 not-italic">{unallocatedDriver.name}</option>
                  {/each}
                </optgroup>
              </select>
            </div>
              
            <!-- allocate helper -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="helper">Allocate Helper:</label>
              <select
                class="{helper === "" ? 'text-gray-400' : 'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                id="helperDropdown"
                bind:value={helper}>
                <option value="" hidden selected>Select Helper</option>
                <optgroup label="Allocated Helpers" class="text-maroon-500 italic">
                  {#each allocatedHelpers as allocatedHelper}
                    <option value={allocatedHelper.id} class="text-black-900 not-italic">{allocatedHelper.name}</option>
                  {/each}
                </optgroup>
                <optgroup label="Unallocated Helpers" class="text-maroon-500 italic">
                  {#each unallocatedHelpers as unallocatedHelper}
                    <option value={unallocatedHelper.id} class="text-black-900 not-italic">{unallocatedHelper.name}</option>
                  {/each}
                </optgroup>
              </select>
            </div>

            <!-- select bus -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="bus">Allocate Bus:</label>
              <select
                class="{bus_id === "" ? 'text-gray-400' : 'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                id="busDropdown"
                bind:value={bus_id}>
                <option value="" hidden selected>Select Helper</option>
                <optgroup label="Allocated Buses" class="text-maroon-500 italic">
                  {#each allocatedBuses as allocatedBus}
                    <option value={allocatedBus.id} class="text-black-900 not-italic">{allocatedBus.id}</option>
                  {/each}
                </optgroup>
                <optgroup label="Unallocated Helpers" class="text-maroon-500 italic">
                  {#each unallocatedBuses as unallocatedBus}
                    <option value={unallocatedBus.id} class="text-black-900 not-italic">{unallocatedBus.id}</option>
                  {/each}
                </optgroup>
              </select>
            </div>

            <!-- add button -->
            <div class="flex mb-4 justify-end pr-8">
              <button
                class=" bg-maroon-500 hover:bg-maroon-900 py-3 px-8 text-white-700 font-semibold rounded-full"
                class:shrink={isShrink}
                on:click={() => {
                  handleClick();
                  if(date === null){
                    errorMessage = 'Please select a date';
                  }else if(route === ''){
                    errorMessage = 'Please select a route';
                  }else if(shift === ''){
                    errorMessage = 'Please select a shift';
                  }else {
                    addAllocation();
                  }
                }}>Add
              </button>
            </div>

            <!-- error popup -->
            {#if errorMessage.length>0}
            <ErrorPopUp errorMessage={errorMessage}
            on:closeError={()=>(errorMessage="")}/>
            {/if}
            
            <!-- success popup -->
            {#if success==1}
              <SuccessfulPopUp successMessage={addAllocationResponse}
              on:closeSuccess={()=>{success=-1;
              navigate("/upcomingTrips");}}/>
            {:else if success==0}
              <ErrorPopUp errorMessage={addAllocationResponse}
              on:closeError={()=>(success=-1)}/>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </main>
{:else}
  <div>
    <p class="text-3xl font-extrabold text-maroon-500">Access Denied</p>
  </div>
{/if}

<style>
  .shrink {
      transform: translateY(2px);
  }
</style>
