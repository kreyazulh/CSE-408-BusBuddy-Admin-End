<script>
    import { onMount, afterUpdate } from 'svelte';
    import Navbar from "../GlobalComponents/navbar.svelte";
    import { isAuthenticated } from "../../auth";
    import { navigate } from 'svelte-routing';
    import { get } from 'svelte/store';
    
    let requestDetails = {};
    let request_id = '';
    let id = '';
    let requestor = '';
    let bus = '';
    let parts = '';
    let req_desc = '';
    let repair_desc = '';
    let timestamp = '';
    let is_repaired = '';
    let inventory = [];
    let items = [];
    let tempSelectedItems = [];
    
async function fetchRequestDetails() {
  const response = await fetch(`/api/billing/requests/${request_id}`);
  if(response.ok) {
    const data = await response.json();
    // No need to map, as data is likely an object, not an array
    const wow = {
        id: data.id,
        requestor: data.requestor,
        bus: data.bus,
        parts: data.parts,
        req_desc: data.request_des,
        repair_desc: data.repair_des,
        timestamp: new Date(data.timestamp).toLocaleString(),
        is_repaired: data.is_repaired ? 'Yes' : 'No'
    };
    
    id = wow.id;
    requestor = wow.requestor;
    bus = wow.bus;
    parts = wow.parts;
    req_desc = wow.req_desc;
    repair_desc = wow.repair_desc;
    timestamp = wow.timestamp;
    is_repaired = wow.is_repaired;
  } else {
    console.error("Failed to fetch request details");
  }
}

function removeItem(itemId) {
    items = items.filter(id => id !== itemId);
  }

  // Function to get item names by ID
  function getItemName(itemId) {
    const item = inventory.find(item => item.id === itemId);
    return item ? item.name : 'Unknown Item';
  }

  function updateItems() {
  items = Array.from(new Set([...items, ...tempSelectedItems]));
}

function removeSelectedItem(itemId) {
  items = items.filter(id => id !== itemId);
}



async function getInventory() {
      const response = await fetch('/api/billing/inventory/');
      const data = await response.json();
      inventory = data.map((row) => {
        return {
          id : row.id,
          name : row.name,
          rate : row.rate,
          amount : row.amount,
          status: 'Active',
        };
      });
      console.log(inventory);
      inventory = inventory.filter((row) => {
        if (row.reg_id === null) {
          return false;
        }
        return true;
      });
      for (let row in inventory){
        for (let key in inventory[row]){
          if (inventory[row][key] === null){
            inventory[row][key] = "N/A";
          }
        }
      }
      console.log(inventory);
    }

let showRejectSection = false;


  async function approveReq() {
    const response = await fetch(`/api/billing/requests/${request_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        is_repaired: true,
        parts: items
      })
    });
    if(response.ok) {
      navigate(`/repairRequestList`);
    } else {
      console.error("Failed to approve request");
    }
 
  }

  async function rejectReq() {
    navigate(`/repairRequestList`);
    
  }

  afterUpdate(() => {
  if (tempSelectedItems.length > 0) {
    updateItems();
    tempSelectedItems = []; // Optionally clear temp selections if needed
  }
});
    
    onMount(() => {
      const urlParams = new URLSearchParams(window.location.search);
      request_id = urlParams.get('reqID');
      if(request_id) {
        fetchRequestDetails();
        getInventory();
      }
    });
  </script>
  
  {#if $isAuthenticated}

  <main class="flex min-h-screen w-full bg-gradient-to-b from-maroon-500 to-maroon-900">
    <Navbar />
    <div class="flex flex-1 flex-col items-center justify-center py-10">
      <div class="w-full max-w-4xl bg-white-700 rounded-lg shadow-xl p-6">
        <h2 class="text-2xl font-bold text-maroon-500 mb-4">Repair Information</h2>
        <div class="flex flex-col ml-10 mt-3 mb-6">
          <p class="text-lg font-semibold text-gray-700 pb-2">Id : {id}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Requestor: {requestor}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Bus: {bus}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Parts Required: {parts}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Request: {req_desc}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Repair Details: {repair_desc}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Time: {timestamp}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Repaired:</p><p> {is_repaired}</p>
        </div> 
        <p class="text-lg font-semibold text-gray-700 pb-2">Allocate Parts:</p>
        <select multiple bind:value={tempSelectedItems} class="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
            {#each inventory as {id, name}}
              <option value={id}>{name}</option>
            {/each}
          </select>
          
          <!-- Display selected items and remove option -->
          {#each items as itemId}
  <div class="flex items-center justify-between">
    <span>{getItemName(itemId)}</span> 
    <button on:click={() => removeSelectedItem(itemId)}>Remove</button>
  </div>
{/each}

        <div class="w-full max-w-4xl bg-white-700 flex justify-between p-6">
          <button
            class="bg-green-500 hover:bg-green-900 text-white-700 font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
            on:click={approveReq}>
            Approve
          </button>
          <button
            class="bg-maroon-500 hover:bg-gray-700 text-white-700 font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
            on:click={rejectReq}>
            Halt
          </button>
      </div>
        
        </div>        
      </div>
  </main>
{:else}
  <p>Not authenticated</p>
{/if}


