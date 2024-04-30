<script>
  import { onMount } from "svelte";
  import Navbar from "../GlobalComponents/navbar.svelte";
  import { isAuthenticated } from "../../auth";
  import { navigate } from "svelte-routing";
  import SearchBar from "../GlobalComponents/searchBar.svelte";
  import EntriesPerPageDropdown from "../GlobalComponents/Pagination/entriesPerPageDropdown.svelte";
  import PaginationFooter from "../GlobalComponents/Pagination/paginationFooter.svelte";
  import SortingButtons from "../GlobalComponents/sortingButtons.svelte";
  import DeletePopUp from "../GlobalComponents/PopUps/deletePopUp.svelte";

  let buses = [];
  let allocations = [];
  let allDriver = [];
  let allStaff = [];
  let searchRows = [];

  let shrinkID = null;

  let isDelVisible = false;
  let rowDelID = null;

  let showAll = false;

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

   // Function to show all the rows
   function showStatus() {
    handleClick("showAll");
    if (showAll) {
      searchRows = buses.filter((row) => row.status === "Active");
      showAll = false;
    } else {
      searchRows = buses;
      showAll = true;
    }
    totalEntries = searchRows.length;
    handleEntriesPerPage();
  }

  // Function to handle the search functionality
  function handleSearch(event) {
    searchRows = event.detail;
    totalEntries = searchRows.length;
    handleEntriesPerPage();
    // console.log("searchrows",searchRows);
  }

   // Function to delete a row
   function deleteRow(id) {
    handleClick(id + "delete");
    isDelVisible = true;
    rowDelID = id;
  }

  async function handleDeleteConfirm() {
  isDelVisible = false;
  let rowIndex = searchRows.findIndex((r) => r.id === rowDelID);

  if (rowIndex !== -1) {
    try {
      const response = await fetch("/api/bus/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: rowDelID }),
      });

      const result = await response.json();
      // console.log(result);

      if (response.ok) {
        // console.log("Row deleted successfully:", result);

        // Remove the row from the UI
        searchRows.splice(rowIndex, 1);
        searchRows = [...searchRows];
        totalEntries = searchRows.length;
        totalPages = Math.ceil(totalEntries / Number(entriesPerPage));

        rowIndex = buses.findIndex((r) => r.id === rowDelID);
        if (rowIndex !== -1) {
          buses.splice(rowIndex, 1);
          buses = [...buses];
        }

        // Additional logic after successful deletion (e.g., update UI)
      } else {
        console.error("Failed to delete row:", result);
        // Handle error case
      }
    } catch (error) {
      console.error("Error deleting row:", error);
      // Handle error case
    }
  }
}

   // Function to show the details of a row
   function showDetails(id) {
    handleClick(id + "details");
    navigate(`/busDetails?busID=${id}`);
  }

  // Function to save the row
  async function editRow(id) {
    handleClick(id + "edit");
    navigate(`/editBus?busID=${id}`);
  }

  async function gotoAddBus() {
    navigate('/busAdd');
  }

  function getDriverIdFromAlloc(idAsString) {
    console.log('Function called with ID:', idAsString);
    const allocation = allocations.find(allocation => allocation.bus === idAsString);
    console.log('Matching allocation:', allocation);
    // Return the default driver ID if found, otherwise return null
    return allocation ? allocation.driver : null;
  }
    function getStaffIdFromAlloc(idAsString) {
      console.log('Function called with ID:', idAsString);
      const allocation = allocations.find(allocation => allocation.bus === idAsString);
      console.log('Matching allocation:', allocation);
      // Return the default driver ID if found, otherwise return null
      return allocation ? allocation.staff : null;
    }

  function getDriverNameById(idAsString) {
        if(!idAsString) return 'N/A';
        const driver = allDriver.find(driver => driver.id === idAsString);
        return driver.name ? driver.name : null;
    }
    function getStaffNameById(idAsString) {
        if(!idAsString) return 'N/A';
        const driver = allStaff.find(driver => driver.id === idAsString);
        return driver.name ? driver.name : null;
    }

  async function getAllocations() {
        //backend theke data ante hobe
        
        const response2 = await fetch('/api/assignment/');
        const data2 = await response2.json();
        allocations = data2.map((row) => {
            return {
            bus: row.default_bus,
            driver: row.default_driver,
            staff: row.default_helper
            };
        });
        // console.log(getDriverNameById(getDriverIdFromAlloc('Ba-48-5757')));
    }

    async function getDriverList() {

        const response = await fetch('/api/staff/driver/');
      const data = await response.json();
      allDriver = data.map((row) => {
        return {
          id: row.id,
          name: row.name
        };
      });
      // console.log(getDriverNameById('aminhaque'));
    }
    async function getHelperList() {
        const response = await fetch('/api/staff/collector');
      const data = await response.json();
      allStaff = data.map((row) => {
        return {
          id: row.id,
          name: row.name
        };
      });
    }

  async function getBusList() {
    const response = await fetch('/api/bus/');
    const data = await response.json();
    // console.log(data);
    buses = data.map((row) => {
      return {
        reg_id: row.reg_id,
        type: row.type,
        capacity: row.capacity,
        status: 'Active',
      };
    });
    // console.log(buses);
    buses = buses.filter((row) => {
      if (row.reg_id === null) {
        return false;
      }
      return true;
    });
    for (let row in buses){
      for (let key in buses[row]){
        if (buses[row][key] === null){
          buses[row][key] = "N/A";
        }
      }
    }
    // console.log(buses);
    searchRows = buses.filter((row) => row.status === "Active");
    totalEntries = searchRows.length;
    handleEntriesPerPage();
  }

  onMount(async() => {
    getDriverList();
    getHelperList();
    getAllocations();
    await getBusList();
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
      <h1 class="text-3xl font-bold underline uppercase text-maroon-500">Bus List</h1>
    </div>

     <!-- Search Bar & Add Button-->
    <div class="flex mb-4 justify-end">
      <button class="{showAll ? 'bg-lime-600 hover:bg-lime-700':'bg-cyan-600 hover:bg-cyan-700'} text-white-700 font-semibold py-2 px-4 rounded-full"
        class:shrink={shrinkID === "showAll"}
        on:click={showStatus}>{showAll ? "Show Active" : "Show All"}
      </button>
      <button class=" mx-3 bg-indigo-700 hover:bg-indigo-900 text-white-700 font-semibold py-2 px-4 rounded-full focus:translate-y-1.5"
        on:click={gotoAddBus}> Add Bus
      </button>
      <SearchBar originalRows={buses} on:searchChanged={handleSearch} />
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
            <th class="bg-white-700  w-auto">
              <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                <span class="pl-2 font-semibold uppercase text-xs text-black-700">Registered ID</span>
                <SortingButtons
                    searchRows={searchRows}
                    sortColumn="reg_id"
                    on:sort={(e) => {
                      searchRows = e.detail;
                    }}/>
              </div>
              </th>
              <th class=" bg-white-700  w-auto">
                <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                  <span class="pl-2 font-semibold uppercase text-xs text-black-700">Type</span>
                  <SortingButtons
                    searchRows={searchRows}
                    sortColumn="type"
                    on:sort={(e) => {
                      searchRows = e.detail;
                    }}/>
                </div>
              </th>
              <th class="bg-white-700  w-auto">
                <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                  <span class="pl-2 font-semibold uppercase text-xs text-black-700">Capacity</span>
                  <SortingButtons
                    searchRows={searchRows}
                    sortColumn="capacity"
                    on:sort={(e) => {
                      searchRows = e.detail;
                    }}/>
                </div>
              </th>
              <th class="bg-white-700  w-auto">
                <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                  <span class="pl-2 font-semibold uppercase text-xs text-black-700">Allocated Driver</span>
                  <SortingButtons
                    searchRows={searchRows}
                    sortColumn="driver"
                    on:sort={(e) => {
                      searchRows = e.detail;
                    }}/>
                </div>
              </th>
              <th class="bg-white-700  w-auto">
                <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                  <span class="pl-2 font-semibold uppercase text-xs text-black-700">Allocated Helper</span>
                  <SortingButtons
                    searchRows={searchRows}
                    sortColumn="helper"
                    on:sort={(e) => {
                      searchRows = e.detail;
                    }}/>
                </div>
              </th>
              {#if showAll}
                <th class="bg-white-700 w-auto">
                  <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                    <span class="pl-2 font-semibold uppercase text-xs text-black-700">Status</span>
                    <SortingButtons
                      searchRows={searchRows}
                      sortColumn="status"
                      on:sort={(e) => {
                        searchRows = e.detail;
                      }}/>
                  </div>
                </th>
              {/if}
          </tr>
        </thead>

        <tbody>
          <!-- Dynamic rows -->
          {#each searchRows as row, index}
            {#if index >= (currentPage - 1) * Number(entriesPerPage) && index < currentPage * Number(entriesPerPage)}
              <tr class="{index % 2 === 0 ? 'bg-gray-200' : 'bg-white-700'} hover:bg-gray-300">
                <td class="py-2 pl-2 pr-2 text-center w-auto">{row.reg_id}</td>
                <td class="py-2 pl-2 pr-2 text-center w-auto">{row.type}</td>
                <td class="py-2 pl-2 pr-2 text-center w-auto">{row.capacity}</td>
                <td class="py-2 pl-2 pr-2 text-center w-auto">{getDriverNameById(getDriverIdFromAlloc(row.reg_id))}</td>
                <td class="py-2 pl-2 pr-2 text-center w-auto">{getStaffNameById(getStaffIdFromAlloc(row.reg_id))}</td>
                {#if showAll}
                  <td class="py-2 pl-2 pr-2 text-center w-auto font-semibold text-white-700 border-2 border-white-700
                  {row.status==='Active' ? 'bg-lime-500':'bg-gray-500'}">{row.status} </td>
                {/if}
                <td class="my-2 mx-2 w-auto">
                  <div class="flex justify-center w-full">
                    <button class="bg-transparent mx-2" class:shrink={shrinkID === row.reg_id + "details"}
                      on:click={() => showDetails(row.reg_id)}>
                      <i class="bx bxs-info-circle text-maroon-500 hover:text-maroon-900 scale-150"></i>
                    </button>
                    {#if !showAll}
                      <button class="bg-transparent mx-2" class:shrink={shrinkID === row.id + "edit"}
                        on:click={() => editRow(row.id)}>
                        <i class="bx bxs-edit text-maroon-500 hover:text-maroon-900 scale-150"></i>
                      </button>
                      <button class="bg-transparent mx-2" class:shrink={shrinkID === row.id + "delete"}
                        on:click={() => deleteRow(row.id)}>
                        <i class="bx bxs-trash text-maroon-500 hover:text-maroon-900 scale-150"></i>
                      </button>
                    {/if}
                    {#if isDelVisible}
                      <DeletePopUp deleteMessage={rowDelID}
                        on:cancelDelete={() => {isDelVisible = false;
                          rowDelID='';}}
                        on:confirmDelete={handleDeleteConfirm}/>
                    {/if}
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
