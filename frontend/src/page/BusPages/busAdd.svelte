<script>
  import Navbar from '../GlobalComponents/navbar.svelte';
  import { isAuthenticated } from '../../auth';
  import { navigate } from 'svelte-routing';
  import { onMount } from "svelte";
  import ErrorPopUp from '../GlobalComponents/PopUps/errorPopUp.svelte';
  import SuccessfulPopUp from "../GlobalComponents/PopUps/successfulPopUp.svelte";

  let isShrink = false;

  let reg_id = '';
  let capacity = 0;
  let type = '';
  let remarks = '';
  let driver = '';
  let helper = '';
  // online 408
  let rented = 'false';

  let allocatedDrivers = [];
  let unallocatedDrivers = [];
  let allocatedHelpers = [];
  let unallocatedHelpers = [];

  let addBusResponse = '';

  let success = -1;
  let errorMessage="";

  function handleClick() {
        isShrink = true;
        setTimeout(() => {
            isShrink = false;
        }, 100);
  }

  async function fetchDrivers() {
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
    async function fetchHelpers() {
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


  async function addBus() {
    // Create a JSON object with the data
    const busData = {
      reg_id: reg_id,
      capacity: capacity,
      type: type,
      remarks: remarks,
      is_rented : rented
      // baki jinish dite hobe
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
        success = 1;
      } else {
        // Request failed
        addBusResponse = 'Failed to add bus';
        success = 0;
      }
      navigate('/busList');
    } catch (error) {
      console.error('Error:', error);
      addBusResponse = 'Error occurred';
      success = 0;
    }
  }

  $: {
  ;;;
}
onMount(async () => {
    await fetchDrivers();
    await fetchHelpers();
  });
</script>

{#if $isAuthenticated}
  <main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900">
    <div>
      <Navbar />
    </div>

    <div class="flex w-full justify-center items-center">
      <div class="w-1/2 py-5 px-5 my-10 rounded-lg shadow-lg bg-white-700">
        <h2 class="text-3xl font-bold underline uppercase text-maroon-500">
          Add Bus
        </h2>

        <div class="flex flex-row">
          <div class="w-1/2">

            <div class="mt-4">
              <label class="block text-gray-600 font-semibold mb-2" for="capacity">Is the Bus Rented?:</label>
              <label>
                <input type="radio"  bind:group={rented} value="true"/>
                Yes
              </label>
              
              <label>
                <input type="radio" bind:group={rented} value="false"/>
                No
              </label>
            </div>

            <!-- bus no -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="id">Bus Reg ID:</label>
              <input
                required
                pattern="[A-Z]{2}[-][0-9]{2}[-][0-9]{4}"
                placeholder="eg: BA-01-2345"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                type="text"
                bind:value={reg_id}
              />
            </div>

             <!-- capacty -->
             <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="capacity">Capacity:</label>
              <input
                placeholder="eg: 30"
                class="{capacity===0 ? 'text-gray-400' : 'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                type="number"
                bind:value={capacity}
              />
            </div>

            <!-- select bus type -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="busType">Select Bus Type:</label>
              <select
                required
                class= "{type === "" ? 'text-gray-400' : 'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                id="busTypeDropdown"
                bind:value={type}>
                <option value="" hidden selected>Select Bus Type</option>
                <option value="micro" class="text-black-900">Micro-bus</option>
                <option value="mini" class="text-black-900">Mini-bus</option>
                <option value="normal" class="text-black-900">Coaster</option>
                <option value="single_decker" class="text-black-900">Single Decker</option>
                <option value="double_decker" class="text-black-900">Double Decker</option>
              </select>
            </div>

            <!-- remarks -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="remarks">Remarks:</label>
              <textarea 
                class="min-h-[100px] max-h-[300px] w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500 text-black-900" 
                placeholder="Enter any remark" 
                spellcheck="false"
                bind:value={remarks}/>
              <p class="text-xs text-gray-400 text-left my-2">You inserted {remarks.length} characters</p>
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
                  {#each allocatedDrivers as drivers}
                    <option value={drivers.name} class="text-black-900 not-italic">{drivers.name}</option>
                  {/each}
                </optgroup>
                <optgroup label="Unallocated Drivers" class="text-maroon-500 italic">
                  {#each unallocatedDrivers as drivers}
                    <option value={drivers.name} class="text-black-900 not-italic">{drivers.name}</option>
                  {/each}
                </optgroup>
              </select>
            </div>

            <!-- allocate helper -->
            {#if type!=="micro" && type!=="mini"}
              <div class="my-4 px-5">
                <label class="block text-gray-600 font-semibold mb-2" for="helper">Allocate Helper:</label>
                <select
                  class="{helper === "" ? 'text-gray-400' : 'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                  id="helperDropdown"
                  bind:value={helper}>
                  <option value="" hidden selected>Select Helper</option>
                  <optgroup label="Allocated Helpers" class="text-maroon-500 italic">
                    {#each allocatedHelpers as helpers}
                      <option value={helpers.name} class="text-black-900 not-italic">{helpers.name}</option>
                    {/each}
                  </optgroup>
                  <optgroup label="Unallocated Helpers" class="text-maroon-500 italic">
                    {#each unallocatedHelpers as helpers}
                      <option value={helpers.name} class="text-black-900 not-italic">{helpers.name}</option>
                    {/each}
                  </optgroup>
                </select>
              </div>
            {/if}
          </div>
        </div>

        <!-- add button -->
        <div class="flex mb-4 justify-end pr-8">
          <button
            class=" bg-maroon-500 hover:bg-maroon-900 py-3 px-8 text-white-700 font-semibold rounded-full"
            class:shrink={isShrink}
            on:click={() => {
              handleClick();
              if(reg_id.length!=10){
                errorMessage = 'Please enter a valid bus registration number';
              }else if(capacity<0){
                errorMessage = 'Capacity cannot be less than 0';
              }else if(type.length<=0){
                errorMessage = 'Please select a bus type';
              } else {
                addBus();
              }
             }
            }
            >Add
          </button>
        </div>

        <!-- error popup -->
        {#if errorMessage.length>0}
          <ErrorPopUp errorMessage={errorMessage}
          on:closeError={()=>(errorMessage="")}/>
        {/if}

        <!-- success popup -->
        {#if success==1}
          <SuccessfulPopUp successMessage={addBusResponse}
          on:closeSuccess={()=>{success=-1;
          navigate("/busList");}}/>
        {:else if success==0}
          <ErrorPopUp errorMessage={addBusResponse}
          on:closeError={()=>(success=-1)}/>
        {/if}

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
          



      


      