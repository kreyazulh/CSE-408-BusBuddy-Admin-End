<script>
    import Navbar from '../GlobalComponents/navbar.svelte';
  import { isAuthenticated } from '../../auth';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

    let id= '';
    let req_id= '';
    let source= '';
    let dest= '';
    let subject= '';
    let text= '';
    let time= '';
    let bus_type= '';
    let valid= '';
  let bus_id = '';
  let driver = '';
  let collector = '';
  let remarks = '';
  let addAllocationResponse = '';
  let payment = 0;

    let busNumbers = [];
  let driverNames = [];
  let staffNames = [];

  function ordinalSuffix(day) {
    if (day > 3 && day < 21) return day + 'th';
    switch (day % 10) {
      case 1: return day + "st";
      case 2: return day + "nd";
      case 3: return day + "rd";
      default: return day + "th";
    }
  }

  // Function to format date
  function formatDate(dateString) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date(dateString);

    const hours = date.getHours() % 12 || 12; // Convert 24h to 12h format and handle midnight
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() < 12 ? 'AM' : 'PM';
    const day = ordinalSuffix(date.getDate());
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${hours}:${minutes} ${ampm}, ${day} ${month}, ${year}`;
  }


  async function fetchReqDetails() {
      const response = await fetch(`http://localhost:3000/api/requisition/${id}`);
      const data = await response.json();
      
      const wow =  data.map((row) => {
        return {
          id: row.id,
          req_id : row.requestor_id,
          source : row.source,
          dest : row.destination,
          subject : row.subject,
          text : row.text,
          time : row.timestamp,
          bus_type : row.bus_type,
          valid : row.valid
        };
      })[0];
      console.log(wow);

          id= wow.id;
          req_id = wow.req_id;
          source = wow.source;
          dest = wow.dest;
          subject = wow.subject;
          text = wow.text;
          time = wow.time;
          bus_type = wow.bus_type;
          valid = wow.valid;

          const formattedBusType = formatBusType(wow.bus_type); // Use this function
          bus_type = formattedBusType; // Use the formatted string without braces
          getDriverList(wow.time);
          getStaffList(wow.time);

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
  // async function getDriverList() {
  //   const response = await fetch('http://localhost:3000/api/staff/driver');
  //   const data = await response.json();
  //   driverNames = data.map((row) => {
  //     return {
  //       id: row.id,
  //       name: row.name
  //     };
  //   });
  // }
  // async function getStaffList() {
  //   const response = await fetch('http://localhost:3000/api/staff/collector');
  //   const data = await response.json();
  //   staffNames = data.map((row) => {
  //     return {
  //       id: row.id,
  //       name: row.name
  //     };
  //   });
  // }

  // Frontend modification to include time in the request
async function getDriverList(time) {
  const response = await fetch(`http://localhost:3000/api/staff/driver_with_time?time=${encodeURIComponent(time)}`);
  const data = await response.json();
  driverNames = data.map((row) => {
    return {
      id: row.id,
      name: row.name
    };
  });
}

async function getStaffList(time) {
  const response = await fetch(`http://localhost:3000/api/staff/collector_with_time?time=${encodeURIComponent(time)}`);
  const data = await response.json();
  staffNames = data.map((row) => {
    return {
      id: row.id,
      name: row.name
    };
  });
}

  let showRejectSection = false;

// Toggle function
function toggleRejectSection() {
  showRejectSection = !showRejectSection;
}

  // Function to remove curly braces
  function formatBusType(busType) {
    return busType.replace(/[{}]/g, ''); // Removes both { and }
  }

  console.log("req_id", req_id);

  async function approveReq() {
    const respData = {
      id: id,
      time : time,
      approver : 'reyazul',
      bus_id : bus_id,
      driver : driver,
      collector : collector,
      remarks : remarks,
      payment : payment,
      req_id : req_id
    };

    console.log(respData);

    try {
      const response = await fetch('http://localhost:3000/api/requisition/approve', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(respData)
      });
      console.log(response);
      console.log(respData);

      if (response.ok) {
        // Request was successful
        addAllocationResponse = 'Bulk Trips added successfully';
      } else {
        // Request failed
        addAllocationResponse = 'Failed to add bulk allocation';
      }
    } catch (error) {
      console.error('Error:', error);
      addAllocationResponse = 'Error occurred';
    }
    // navigate('/requisitionList');
  }

  async function rejectReq() {
    const respData = {
      id: id,
      approver : 'reyazul',
      remarks : remarks
    };

    try {
      const response = await fetch('http://localhost:3000/api/requisition/reject', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(respData)
      });
      console.log(response);
      console.log(respData);

      if (response.ok) {
      } else {
        console.log('Error:', response);
      }
      navigate('/requisitionList');
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
    let reqId = '';
  
    onMount(() => {
      const urlParams = new URLSearchParams(window.location.search);
      id = urlParams.get('reqId');
      fetchReqDetails();
      getBusList();
      // getDriverList();
      // getStaffList();
    });
  </script>
  

  {#if $isAuthenticated}

  <main class="flex min-h-screen w-full bg-gradient-to-b from-maroon-500 to-maroon-900">
    <Navbar />
    <div class="flex flex-1 flex-col items-center justify-center py-10">
      <div class="w-full max-w-4xl bg-white-700 rounded-lg shadow-xl p-6">
        <h2 class="text-2xl font-bold text-maroon-500 mb-4">Requisition Information</h2>
        <div class="flex flex-col ml-10 mt-3 mb-6">
          <p class="text-lg font-semibold text-gray-700 pb-2">Id : {id}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Requestor: {req_id}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Source: {source}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Destination: {dest}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Subject: {subject}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Time: {formatDate(time)}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Bus Type: {bus_type}</p>
          <p class="text-lg font-semibold text-gray-700 pb-2">Text:</p><p> {text}</p>
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
          <label class="block text-gray-600 font-semibold mb-2" for="dropdown">Payment:</label>
          <select
          class="w-full px-3 py-2 text-nowrap text-ellipsis border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-black-700 text-sm"
            bind:value={payment}>
            <option value=0>0</option>
              <option value=1000>1000</option>
              <option value=1000>1500</option>
              <option value=1000>2000</option>
          </select>
        </div>
        <div class="w-full max-w-4xl bg-white-700 flex justify-between p-6">
          <button
            class="bg-green-500 hover:bg-green-900 text-white-700 font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
            on:click={approveReq}>
            Approve
          </button>
          <button
            class="bg-maroon-500 hover:bg-gray-700 text-white-700 font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
            on:click={toggleRejectSection}>
            {showRejectSection ? 'Cancel' : 'Reject'}
          </button>
      </div>
        
          {#if showRejectSection}
            <div class="mt-4">
              <label class="block text-gray-600 font-semibold mb-2" for="input2">Remarks/Reason for rejection:</label>
              <input
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                type="text"
                bind:value={remarks}
                placeholder="Provide a reason for rejection" />
              <button
                class="bg-red-500 hover:bg-red-700 text-white-700 font-semibold py-2 px-4 rounded transition duration-150 ease-in-out mt-4 float-right"
                on:click={rejectReq}>
                Submit Rejection
              </button>
            </div>
          {/if}
        </div>        
        <p class="text-center text-indigo-500 font-bold mt-3">{addAllocationResponse}</p>
      </div>
  </main>
{:else}
  <p>Not authenticated</p>
{/if}


  