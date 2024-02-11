<script>
    import Navbar from '../navbar.svelte';
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

  async function approveReq() {
    const respData = {
      id: id,
      time : time,
      approver : 'mashroor',
      bus_id : bus_id,
      driver : driver,
      collector : collector,
      remarks : remarks
    };

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
        <div class="flex flex-row w-full">
            <div class=" w-1/2 h-fit ml-60 mb-5 bg-white-700 rounded-lg shadow-lg">
                <h1 class=" mt-5 ml-5 text-2xl font-semibold text-maroon-500 underline underline-offset-1">Personal Information</h1> 
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
                  <label class="block text-gray-600 font-semibold mb-2" for="input2">Remarks/Reason for rejection:</label>
                  <input required pattern="[0-9]{3}" placeholder="dimu na bus ki korbi"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="text"  bind:value={remarks} />
                </div>
                <div class="flex flex-row justify-center my-5 gap-4">
                  <button
                    class="bg-maroon-500 hover:bg-maroon-900 py-2 px-5 w-1/4 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:ring-opacity-50"
                    on:click={approveReq}
                  >
                    Approve
                  </button>
                  
                  <button
                    class="bg-maroon-500 hover:bg-maroon-900 py-2 px-5 w-1/4 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-maroon-600 focus:ring-opacity-50"
                    on:click={rejectReq}
                  >
                    Reject
                  </button>
                  <p class="text-center text-indigo-500 font-bold">{addAllocationResponse}</p>
                </div>
                
                
            </div>
            
        </div>
    </div>
  </main>
{:else}
  <p>Not authenticated</p>
{/if}


  