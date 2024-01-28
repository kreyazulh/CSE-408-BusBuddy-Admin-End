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
    addBus();
  }

  onMount(() => {
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
      <h2 class="text-3xl font-bold underline uppercase text-maroon-500">Add Bus</h2>

      <div class="my-4 px-5">

        <label class="block text-gray-600 font-semibold mb-2" for="input1">Bus Reg ID:</label>
        <input required pattern="[A-Z]{2}[0-9]{2}[A-Z]{3}" placeholder="eg: AB12CDE"
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="text"  bind:value={reg_id} />
      </div>

      <div class="my-4 px-5">
        <label class="block text-gray-600 font-semibold mb-2" for="input2">Capacity:</label>
        <input required pattern="[0-9]{3}" placeholder="eg: 30"
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="number"  bind:value={capacity} />
      </div>

      <div class="my-4 px-5">
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

      <div class="my-4 px-5">
        <label class="block text-gray-600 font-semibold mb-2" for="input3">Remarks:</label>
        <textarea class="min-h-[100px] max-h-[300px] h-28 appearance-none block w-full bg-white-900 text-black-900 focus:ring focus:border-blue-300 rounded-lg py-4 px-4" placeholder="Enter any remark" spellcheck="false" bind:value={remarks} ></textarea>
									<p class="text-xs text-gray-400 text-left my-3">You inserted {remarks.length} characters</p>
      </div>

      <div class="flex my-4 pt-6 justify-end pr-8">
        <button type="submit" class=" bg-maroon-500 hover:bg-maroon-900 py-3 px-8 text-white-700 font-semibold rounded-full"
        on:click={()=>{
          if(reg_id.length!=10){
          alert('Please enter a valid bus registration ID');
        }
        if(Number(capacity)<0){
            alert('Capacity cannot be less than 0');
          }
          else{
            addBus();
          }
        }}
        >Add</button>
      </div>
    <p class="text-center text-indigo-500 font-bold">{addBusResponse}</p>
  </div>
  </div>
  </div>
  </main>
{:else}
  <p>Not authenticated</p>
{/if}

