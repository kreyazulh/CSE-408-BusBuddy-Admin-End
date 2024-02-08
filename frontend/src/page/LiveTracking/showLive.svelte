<script>
    import Navbar from '../GlobalComponents/navbar.svelte';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from "../../auth";
    import SearchBar from "../GlobalComponents/searchBar.svelte";
    import EntriesPerPageDropdown from "../GlobalComponents/Pagination/entriesPerPageDropdown.svelte";
    import PaginationFooter from "../GlobalComponents/Pagination/paginationFooter.svelte";
    import SortingButtons from "../GlobalComponents/sortingButtons.svelte";
  
    let liveTrips = [];
    let searchRows = [];
    let routes =  [];

    let shrinkID = null;

    let trackingOffIDs = [];

     // Pagination data
    let totalEntries = 0;
    let entriesPerPage = "10";
    let currentPage = 1;
    let totalPages = 0;

    function handleClick(name) {
    shrinkID = name;
    setTimeout(() => {
      shrinkID = null;
    }, 100);
  }

  // Function to handle the entry per page functionality
  function handleEntriesPerPage() {
    currentPage = 1;
    totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
  }

   // Function to handle the search functionality
  function handleSearch(event) {
    searchRows = event.detail;
    totalEntries = searchRows.length;
    handleEntriesPerPage();
  }

  // Function to show the details of a row
  function trackLive(id) {
    handleClick(id + "track");
    navigate(`/liveTrack?tripId=${id}`);
  }

  // Function to stop tracking a trip
  function trackOff(id) {
    handleClick(id + "trackOff");
    if (trackingOffIDs.includes(id)) {
      trackingOffIDs = trackingOffIDs.filter((item) => item !== id);
    } else {
      trackingOffIDs.push(id);
    }
    //stop tracking logic
  }

  // Function to end a trip
  function endTrip(id) {
    handleClick(id + "tripOff");
    //end logic
  }

  async function fetchRoutes() {
try {
  const response = await fetch('http://localhost:3000/api/route/');
  routes = await response.json();
  console.log(routes);
} catch (error) {
  console.error('Error fetching routes:', error);
}
}
  
  onMount(async () => {
      try {
        const response = await fetch('http://localhost:3000/api/trip/liveTrips');
        if (!response.ok) {
          throw new Error('Error fetching live trips');
        }
        liveTrips = await response.json();
        console.log(liveTrips);
        liveTrips = liveTrips.filter((row) => {
        if (row.id === null) {
          return false;
        }
        searchRows = liveTrips;
        return true;
       });
       totalEntries = searchRows.length;
       handleEntriesPerPage();
      } catch (error) {
        console.error('Error:', error);
      }
    });

  </script>

<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"/>

{#if $isAuthenticated}
  <main class="flex min-h-screen min-w-full">
    <div>
      <Navbar />
    </div>

     <!-- Heading -->
     <div class="flex-1 ml-56 w-full px-4 py-8 bg-white-700">
      <div class="flex items-start justify-start h-18">
        <h1 class="text-3xl font-bold underline uppercase text-maroon-500">Live Trips</h1>
      </div>


      <!-- Search Bar-->
      <div class="flex mb-4 justify-end">
        <SearchBar originalRows={liveTrips} on:searchChanged={handleSearch} />
      </div>

      <!-- Entries per page -->
      <EntriesPerPageDropdown
        on:entriesPerPageChanged={(e) => {
          entriesPerPage = e.detail;
          handleEntriesPerPage();}}/>


      <!-- Table -->
      <div class="bg-white-700 shadow-md my-3 overflow-x-auto">
        <table class="w-full table-auto">
          <!-- Table header -->
          <thead>
            <tr>
              <th class="bg-white-700 w-auto">
                <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                  <span class="pl-2 font-semibold uppercase text-xs text-black-700">Trip ID</span>
                  <SortingButtons
                    searchRows={searchRows}
                    sortColumn="id"
                    on:sort={(e) => {
                      searchRows = e.detail;
                    }}/>
                </div>
              </th>
              <th class="bg-white-700 w-auto">
                <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                  <span class="pl-2 font-semibold uppercase text-xs text-black-700">Route</span>
                  <SortingButtons
                    searchRows={searchRows}
                    sortColumn="route"
                    on:sort={(e) => {
                      searchRows = e.detail;
                    }}/>
                </div>
              </th>
              <th class=" bg-white-700 w-auto">
                <div class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                  <span class="font-semibold uppercase text-xs text-black-700">Start Time</span>
                </div>
              </th>
              <th class=" bg-white-700 w-auto">
                <div class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                  <span class="font-semibold uppercase text-xs text-black-700">Bus No</span>
                </div>
              </th>
              <th class=" bg-white-700 w-auto">
                <div class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                  <span class="font-semibold uppercase text-xs text-black-700">Driver</span>
                </div>
              </th>
              <th class=" bg-white-700 w-auto">
                <div class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                  <span class="font-semibold uppercase text-xs text-black-700">Helper</span>
                </div>
              </th>
              <th class=" bg-white-700 w-auto">
                <div class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                  <span class="font-semibold uppercase text-xs text-black-700">Status</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <!-- Dynamic rows -->
            {#each searchRows as row, index}
              {#if index >= (currentPage - 1) * Number(entriesPerPage) && index < currentPage * Number(entriesPerPage)}
                <tr class="{index % 2 === 0 ? 'bg-gray-200': 'bg-white-700'} hover:bg-gray-300">
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.id} </td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.route} </td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.start_timestamp} </td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.bus} </td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.driver} </td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.helper} </td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto font-semibold text-white-700 border-2 border-white-700
                    {row.is_live ? 'bg-lime-500':'bg-gray-500'}">{row.is_live ? 'Live' : 'Not Live'} </td>
                  <td class="my-2 mx-2 w-auto">
                    <div class="flex justify-center w-full">
                      {#if row.is_live && !trackingOffIDs.includes(row.id)}
                        <button class="bg-transparent mx-2" class:shrink={shrinkID === row.id + "track"}
                        on:click={() => trackLive(row.id)}>
                          <i class="bx bxs-navigation text-maroon-500 hover:text-maroon-900 scale-150"></i>
                        </button>
                      {/if}
                      <button class="bg-transparent mx-2" class:shrink={shrinkID === row.id + "trackOff"}
                        on:click={() => trackOff(row.id)}>
                        <i class="bx bxs-stop-circle text-maroon-500 hover:text-maroon-900 scale-150"></i>
                      </button>
                      <button class="bg-transparent mx-2" class:shrink={shrinkID === row.id + "tripOff"}
                        on:click={() => endTrip(row.id)}>
                        <i class="bx bx-power-off text-maroon-500 hover:text-maroon-900 scale-150"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <PaginationFooter
        totalEntries={totalEntries}
        entriesPerPage={Number(entriesPerPage)}
        currentPage={currentPage}
        totalPages={totalPages}
        on:pageChanged={(e) => {currentPage = e.detail;}}/>
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