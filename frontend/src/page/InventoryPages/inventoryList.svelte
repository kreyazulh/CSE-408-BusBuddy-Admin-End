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

    let inStockID = [];
    let lowStockID = [];
    let outOfStockID = [];
    let updatingStockID = [];
    let repairRequestedID = [];

  
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
      console.log("searchrows",searchRows);
    }

    let repairRequestsCount = 0;

async function fetchRepairRequestsCount() {
  handleClick("repairRequestsCount");
    const response = await fetch('http://localhost:3000/api/billing/repairRequestsCount');
    if (response.ok) {
        const data = await response.json();
        repairRequestsCount = data;
    } else {
        console.error("Failed to fetch repair requests count");
    }
}

    async function getInventory() {
      const response = await fetch('http://localhost:3000/api/billing/inventory/');
      const data = await response.json();
      inventory = data;
      for(let i=0; i<inventory.length; i++){
        inventory[i].pdate = new Date(inventory[i].pdate).toDateString();
        inventory[i].total = inventory[i].amount * inventory[i].rate;
        if(inventory[i].amount >= 15){
          inStockID.push(inventory[i].id);
        }
        else if(inventory[i].amount < 15 && inventory[i].amount > 0){
          lowStockID.push(inventory[i].id);
        }
        else if(inventory[i].amount <= 0){
          outOfStockID.push(inventory[i].id);
        }
      }
      console.log(inventory);
      inventory = inventory.filter((row) => {
        if (row.id === null) {
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
      searchRows = inventory;
      totalEntries = searchRows.length;
      handleEntriesPerPage();
      for(let i=0; i<8; i++){
        let random = Math.floor(Math.random() * inventory.length);
        updatingStockID.push(inventory[random].id);
      }
    }
  
    onMount(async() => {
      await getInventory();
      await fetchRepairRequestsCount();
      for(let i=0; i<repairRequestsCount; i++){
        let random = Math.floor(Math.random() * inventory.length);
        repairRequestedID.push(inventory[random].id);
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
        <h1 class="text-3xl font-bold underline uppercase text-maroon-500">Inventory</h1>
      </div>
  
       <!-- Search Bar & Add Button-->
      <div class="flex mb-4 justify-end">
        <button
          class="bg-cyan-600 hover:bg-cyan-700 mr-4 text-white-700 font-semibold py-2 px-4 rounded-full"
          class:shrink={shrinkID === "repairRequestsCount"}
          on:click={() => navigate('/repairRequestList')}
        >Repair Requests 
        <span class="bg-red-500 text-red-50 rounded-full px-2 py-1 text-xs font-bold">{repairRequestsCount}</span>
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
                  <span class="pl-2 font-semibold uppercase text-xs text-black-700">Stock Id</span>
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
                    <span class="pl-2 font-semibold uppercase text-xs text-black-700">Item</span>
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
                    <span class="pl-2 py-2 font-semibold uppercase text-xs text-black-700">Purchase Date</span>
                  </div>
                </th>
                <th class="bg-white-700  w-auto">
                  <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                    <span class="pl-2 font-semibold uppercase text-xs text-black-700">Purchase Quantity</span>
                    <SortingButtons
                      searchRows={searchRows}
                      sortColumn="amount"
                      on:sort={(e) => {
                        searchRows = e.detail;
                      }}/>
                  </div>
                </th>
                <th class="bg-white-700  w-auto">
                  <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                    <span class="pl-2 font-semibold uppercase text-xs text-black-700">Unit Price (bdt)</span>
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
                    <span class="pl-2 font-semibold uppercase text-xs text-black-700">Total Price (bdt)</span>
                    <SortingButtons
                      searchRows={searchRows}
                      sortColumn="total"
                      on:sort={(e) => {
                        searchRows = e.detail;
                      }}/>
                  </div>
                </th>
            </tr>
          </thead>
  
          <tbody>
            <!-- Dynamic rows -->
            {#each searchRows as row, index}
              {#if index >= (currentPage - 1) * Number(entriesPerPage) && index < currentPage * Number(entriesPerPage)}
                <tr class="{index % 2 === 0 ? 'bg-gray-200' : 'bg-white-700'} hover:bg-gray-300">
                  <td class="py-2 pl-2 pr-2 text-center w-auto uppercase">{row.id}</td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.name}</td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.pdate}</td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.amount}</td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.rate}</td>
                  <td class="py-2 pl-2 pr-2 text-center w-auto">{row.total}</td>
                  <td class="my-2 mx-2 w-auto">
                    <div class="flex justify-center w-full">
                      {#if inStockID.includes(row.id)}
                      <span class="inline-flex items-center justify-center h-10 w-10 text-lg">
                        <i class="bx bxs-check-square text-lime-500 scale-150"></i>
                      </span>
                      {/if}
                      {#if lowStockID.includes(row.id)}
                      <span class="inline-flex items-center justify-center h-10 w-10 text-lg">
                        <i class="bx bxs-error text-yellow-500 scale-150"></i>
                      </span>
                      {/if}
                      {#if outOfStockID.includes(row.id)}
                      <span class="inline-flex items-center justify-center h-10 w-10 text-lg">
                        <i class="bx bxs-x-square text-red-500 scale-150"></i>
                      </span>
                      {/if}
                      {#if updatingStockID.includes(row.id)}
                      <span class="inline-flex items-center justify-center h-10 w-10 text-lg">
                        <i class="bx bxs-cart-download text-cyan-500 scale-150"></i>
                      </span>
                      {/if}
                      {#if repairRequestedID.includes(row.id)}
                      <span class="inline-flex items-center justify-center h-10 w-10 text-lg">
                        <i class="bx bxs-car-mechanic text-red-300 scale-150"></i>
                      </span>
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
  