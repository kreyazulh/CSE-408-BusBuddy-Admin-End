<script>
    import Navbar from "../GlobalComponents/navbar.svelte";
    import { isAuthenticated } from "../../auth";
    import BusSideBar from './busSideBar.svelte';
    import FuelRecords from './fuelRecords.svelte';
    import MaintenanceRecords from "./maintenanceRecords.svelte";
    import FitnessRecord from "./fitnessRecord.svelte";
    import TaxRecords from "./taxRecords.svelte";
    import { onMount } from "svelte";

    let sidebarOpen = false;

    let navID = 1;

    let reg_id = 'BA-01-2345';
    let type = 'double decker';
    let capacity = 60;
    let remarks = 'good';
    let completedTrips = 100;
    let milage = '10km/L';
    let driver = 'Khondker Ibrahim';
    let helper = 'Mohammad Ali';
    let fuelType = 'diesel';
    let fuelCapacity = '100L';
    let fuelConsumption = '5km/L';
    let fuelCost = 'Rs. 100/L';
    let maintenance = 'on-time';
    let fitness = 'Up-to-date';
    let tax = 'Paid';
    let servicing = 'on-time';
    let status = 'Active';
    let tripStatus = 'Inactive';
    let photo;
    let upcomingTrips = [
        ['12-02-24','M','Baada-Buet'],
        ['12-02-24','A','Buet-Badda'],
        ['12-02-24','E','Buet-Uttara'],
        ['14-02-24','R','Buet-UIU']]
    let recentTrips = [
        ['10-02-24','M','Baada-Buet'],
        ['10-02-24','A','Buet-Badda'],
        ['10-02-24','E','Buet-Badda']]

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    let regID;

    async function fetchBusDetails() {
      const response = await fetch(`http://localhost:3000/api/bus/${regID}`);
      const data = await response.json();
      console.log('data:', data);

      const wow =  data.map((row) => {
        return {
          reg_id : row.reg_id,
          type : row.type,
          capacity : row.capacity,
          remarks : row.remarks,
          photo : row.photo
        };
      })[0];
      
        reg_id = wow.reg_id;
        type = wow.type;
        capacity = wow.capacity;
        remarks = wow.remarks;
        photo = wow.photo;
    }

    onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
      regID = urlParams.get('busID');
      console.log('busID:', regID);
      fetchBusDetails();
    });   
  </script>
  
  
  {#if $isAuthenticated}
    <main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900">
      <div class="z-20">
        <Navbar />
      </div>

      <!-- sidebar -->
      {#if !sidebarOpen}
        <div class="ml-56 mt-56 z-10">
            <button class="h-20 text-maroon-500 bg-white-700 border-2 border-maroon-500 hover:bg-gray-200 focus:outline-none rounded-r-lg pr-2 pl-1"
                on:click={toggleSidebar}>
                <svg class="w-6 h-8"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M9 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
      {:else}
        <div class="ml-56 z-10">
            <BusSideBar on:navID={(event) => navID = event.detail} />
        </div>
        <button class="z-10 ml-56 h-20 mt-28 border-2 border-maroon-500 text-maroon-500 bg-white-700 hover:bg-gray-200 focus:outline-none rounded-r-lg pr-2 pl-1"
                on:click={toggleSidebar}>
                <svg class="w-6 h-8"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            d="M15 19l-7-7 7-7"/>
                </svg>
        </button>
      {/if}

      {#if navID===1}
        <div class="w-full z-0 flex flex-row">
            <div class="w-4/5 flex flex-col ml-2">
                <div class="w-full my-3 h-1/4 bg-white-700 rounded-lg">
                    <img src={photo} alt="bus_picture" class="w-full h-full rounded-lg">
                </div>

                <div class="w-full mb-5 pb-10 h-fit bg-white-700 rounded-lg">
                    <h2 class="text-maroon-500 font-bold text-2xl underline pl-5 py-3">Bus Details</h2>
                    <div class="flex flex-row px-5">
                        <div class="flex flex-col ml-3">
                            <p class="text-gray-900 text-lg font-semibold py-1">Bus ID: {reg_id}</p>
                            <p class="text-gray-900 text-lg font-semibold py-1">Type: {type}</p>
                            <p class="text-gray-900 text-lg font-semibold py-1">Capacity: {capacity}</p>
                            <p class="text-gray-900 text-lg font-semibold py-1">Remarks: {remarks}</p>
                            <p class="text-gray-900 text-lg font-semibold py-1">Completed Trips: {completedTrips}</p>
                            <p class="text-gray-900 text-lg font-semibold py-1">Milage: {milage}</p>
                        </div>
                        <div class="flex flex-col ml-5">
                            <p class="text-gray-900 text-lg font-semibold py-1">Maintenance: 
                                <span class="{maintenance==='on-time'?'bg-lime-500':'bg-gray-500'} text-white-700 rounded-full px-3 py-1">{maintenance}</span>
                            </p>
                            <p class="text-gray-900 text-lg font-semibold py-1">Servicing: 
                                <span class="{servicing==='on-time'?'bg-lime-500':'bg-gray-500'} text-white-700 rounded-full px-3 py-1">{servicing}</span>
                            </p>
                            <hr class="w-4/5 my-5 border-2 border-maroon-500">
                            <p class="text-gray-900 text-lg font-semibold py-1">Fuel Type: {fuelType}</p>
                            <p class="text-gray-900 text-lg font-semibold py-1">Fuel Capacity: {fuelCapacity}</p>
                            <p class="text-gray-900 text-lg font-semibold py-1">Fuel Consumption: {fuelConsumption}</p>
                            <p class="text-gray-900 text-lg font-semibold py-1">Fuel Cost: {fuelCost}</p> 
                        </div>
                        <div class="flex flex-col ml-5">
                            <p class="text-gray-900 text-lg font-semibold py-1">Status: 
                                <span class="{status==='Active'?'bg-lime-500':'bg-gray-500'} text-white-700 rounded-full px-3 py-1">{status}</span>
                            </p>
                            {#if tripStatus==='In Trip'}
                                <span class="bg-lime-500 text-white-700 rounded-full px-3 py-1 text-lg font-semibold text-center w-fit animate-pulse">{tripStatus}</span>
                            {/if}
                            <hr class="w-4/5 my-5 border-2 border-maroon-500">
                            <p class="text-gray-900 text-lg font-semibold py-1">Fitness: 
                                <span class="{fitness==='Up-to-date'?'bg-lime-500':'bg-gray-500'} text-white-700 rounded-full px-3 py-1">{fitness}</span>
                            </p>
                            <p class="text-gray-900 text-lg font-semibold py-1">Tax: 
                                <span class="{tax==='Paid'?'bg-lime-500':'bg-gray-500'} text-white-700 rounded-full px-3 py-1">{tax}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-1/5 flex flex-col ml-3 mr-5">
                <div class="w-full my-3 pb-5 h-fit bg-white-700 rounded-lg">
                    <h2 class="text-maroon-500 font-bold text-2xl underline pl-3 py-3">Upcoming Trips</h2>
                    <div class="flex flex-col px-5">
                        {#each upcomingTrips as trip}
                            {#if trip[1]==='R'}
                                <p class="text-white-700 bg-cyan-600 rounded-lg text-sm font-semibold py-1 px-1">{trip}</p>
                            {:else}
                                <p class="text-gray-900 text-sm font-semibold py-1">{trip}</p>
                            {/if}
                        {/each}
                    </div>
                </div>

                <div class="w-full mb-5 pb-5 h-fit bg-white-700 rounded-lg">
                    <h2 class="text-maroon-500 font-bold text-2xl underline pl-3 py-3">Recent Trips</h2>
                    <div class="flex flex-col px-5">
                        {#each recentTrips as trip}
                            {#if trip[1]==='R'}
                                <p class="text-white-700 bg-cyan-600 rounded-lg text-sm font-semibold py-1 px-1">{trip}</p>
                            {:else}
                                <p class="text-gray-900 text-sm font-semibold py-1">{trip}</p>
                            {/if}
                        {/each}
                    </div>
                </div>

                <div class="w-full mb-5 h-fit bg-white-700 rounded-lg">
                    <div class="flex flex-col px-5 py-3">
                        <p class="text-indigo-500 text-lg font-semibold py-1">Driver: {driver}</p>
                        <p class="text-indigo-500 text-lg font-semibold py-1">Helper: {helper}</p>
                    </div>
                </div>
            </div>


        </div> 
      {:else if navID===2}
        <div class="w-full z-0 flex flex-row">
            <FuelRecords />
        </div>
      {:else if navID===3}
        <div class="w-full z-0 flex flex-row">
            <MaintenanceRecords />
        </div>
      {:else if navID===4}
        <div class="w-full z-0 flex flex-row">
            <FitnessRecord />
        </div>
      {:else if navID===5}
        <div class="w-full z-0 flex flex-row">
            <TaxRecords />
        </div>
      {/if}
    </main>
{:else}
    <div>
        <p class="text-3xl font-extrabold text-maroon-500">Access Denied</p>
    </div>
{/if}
     