<script>
    import Navbar from '../GlobalComponents/navbar.svelte';
    import { isAuthenticated } from '../../auth';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import ErrorPopUp from '../GlobalComponents/PopUps/errorPopUp.svelte';
    import SuccessfulPopUp from "../GlobalComponents/PopUps/successfulPopUp.svelte";
    
    let routeList = [];
    let allocatedDrivers = [];
    let unallocatedDrivers = [];
    //allocated
    let allocatedHelpers = [];
    let unallocatedHelpers = [];
    let allocatedBuses = [];
    let unallocatedBuses = [];
  
    let isShrink = false;
    let route = ''; 
    let shift = '';
    let bus_id = '';
    let driver = '';
    let helper = '';
    let success = -1, errorMessage = '', addAllocationResponse = '';
  
    function handleClick() {
    isShrink = true;
    setTimeout(() => {
      isShrink = false;
    }, 100);
  }
  
    // Existing functions...
    async function addAssgn() {
      const bulkData = {
        route : route, 
        shift : shift,
        driver : driver,
        helper : helper,
        bus : bus_id
      };
      try {
        const response = await fetch('http://localhost:3000/api/assignment/update', {
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
          addAllocationResponse = 'Assignment added successfully';
        } else {
          // Request failed
          addAllocationResponse = 'Failed to add assignment allocation';
        }
        // navigate('/upcomingTrips');
      } catch (error) {
        console.error('Error:', error);
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
      const response = await fetch('http://localhost:3000/api/assignment/allocatedBuses');
      const data = await response.json();
      allocatedBuses = data.map((row) => {
        return {
          id: row.reg_id,
          type: row.type,
          capacity: row.capacity,
        };
      });
      //unallocated kemne anbo jani na
      const response2 = await fetch('http://localhost:3000/api/assignment/unallocatedBuses');
      const data2 = await response2.json();
      unallocatedBuses = data2.map((row) => {
        return {
          id: row.reg_id,
          type: row.type,
          capacity: row.capacity,
        };
      });
    }
    async function getDriverList() {
      const response = await fetch('http://localhost:3000/api/assignment/allocatedDrivers');
      const data = await response.json();
      allocatedDrivers = data.map((row) => {
        return {
          id: row.id,
          name: row.name
        };
      });
      // unallocated kemne anbo jani na
      const response2 = await fetch('http://localhost:3000/api/assignment/unallocatedDrivers');
      const data2 = await response2.json();
      unallocatedDrivers = data2.map((row) => {
        return {
          id: row.id,
          name: row.name
        };
      });
    }
    async function getHelperList() {
        const response = await fetch('http://localhost:3000/api/assignment/allocatedHelpers');
      const data = await response.json();
      allocatedHelpers = data.map((row) => {
        return {
          id: row.id,
          name: row.name
        };
      });
      // unallocated kemne anbo jani na
      const response2 = await fetch('http://localhost:3000/api/assignment/unallocatedHelpers');
      const data2 = await response2.json();
      unallocatedHelpers = data2.map((row) => {
        return {
          id: row.id,
          name: row.name
        };
      });
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
  
          <div class="flex flex-row">
            <div class="w-1/2">

  
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
                    if(route === ''){
                      errorMessage = 'Please select a route';
                    }else if(shift === ''){
                      errorMessage = 'Please select a shift';
                    }else {
                      addAssgn();
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
  