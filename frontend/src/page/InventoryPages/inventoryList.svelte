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
  
    let inventory = [];
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
        searchRows = inventory.filter((row) => row.status === "Active");
        showAll = false;
      } else {
        searchRows = inventory;
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
      console.log("searchrows",searchRows);
    }

    let repairRequestsCount = 0;

async function fetchRepairRequestsCount() {
    const response = await fetch('http://localhost:3000/api/billing/repairRequestsCount');
    if (response.ok) {
        const data = await response.json();
        repairRequestsCount = data;
    } else {
        console.error("Failed to fetch repair requests count");
    }
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
        const response = await fetch("http://localhost:3000/api/bus/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: rowDelID }),
        });
  
        const result = await response.json();
        console.log(result);
  
        if (response.ok) {
          console.log("Row deleted successfully:", result);
  
          // Remove the row from the UI
          searchRows.splice(rowIndex, 1);
          searchRows = [...searchRows];
          totalEntries = searchRows.length;
          totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
  
          rowIndex = inventory.findIndex((r) => r.id === rowDelID);
          if (rowIndex !== -1) {
            inventory.splice(rowIndex, 1);
            inventory = [...inventory];
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
      //navigate(`/busDetails?busID=${id}`);
    }
  
    // Function to save the row
    async function editRow(id) {
      handleClick(id + "edit");
      //navigate(`/editBus?busID=${id}`);
    }
  
    async function getInventory() {
      const response = await fetch('http://localhost:3000/api/billing/inventory/');
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
      searchRows = inventory.filter((row) => row.status === "Active");
      totalEntries = searchRows.length;
      handleEntriesPerPage();
    }
  
    onMount(async() => {
      await getInventory();
      await fetchRepairRequestsCount();
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
        <h1 class="text-3xl font-bold underline uppercase text-maroon-500">Inventory</h1>
      </div>
  
       <!-- Search Bar & Add Button-->
      <div class="flex mb-4 justify-end">
        <button
  class="bg-cyan-600 hover:bg-cyan-700 mr-4 text-white font-semibold py-2 px-4 rounded-full"
  on:click={() => navigate('/repairRequestList')}
>
  Repair Requests <span class="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">{repairRequestsCount}</span>
</button>
        <SearchBar originalRows={inventory} on:searchChanged={handleSearch} />
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
                  <span class="pl-2 font-semibold uppercase text-xs text-black-700">Id</span>
                  <SortingButtons
                      searchRows={searchRows}
                      sortColumn="id"
                      on:sort={(e) => {
                        searchRows = e.detail;
                      }}/>
                </div>
                </th>
                <th class=" bg-white-700  w-auto">
                  <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                    <span class="pl-2 font-semibold uppercase text-xs text-black-700">Name</span>
                    <SortingButtons
                      searchRows={searchRows}
                      sortColumn="name"
                      on:sort={(e) => {
                        searchRows = e.detail;
                      }}/>
                  </div>
                </th>
                <th class="bg-white-700  w-auto">
                  <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                    <span class="pl-2 font-semibold uppercase text-xs text-black-700">Rate(bdt)</span>
                    <SortingButtons
                      searchRows={searchRows}
                      sortColumn="rate"
                      on:sort={(e) => {
                        searchRows = e.detail;
                      }}/>
                  </div>
                </th>
                <th class="bg-white-700  w-auto">
                  <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                    <span class="pl-2 font-semibold uppercase text-xs text-black-700">Amount</span>
                    <SortingButtons
                      searchRows={searchRows}
                      sortColumn="amount"
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
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.id}</td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.name}</td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.rate}</td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.amount}</td>
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
  