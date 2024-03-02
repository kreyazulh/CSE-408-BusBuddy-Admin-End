<script>
    import { onMount } from 'svelte';
    import Navbar from '../GlobalComponents/navbar.svelte';
    import { isAuthenticated } from '../../auth'; // If authentication check is needed
    import { navigate } from 'svelte-routing';
    import DeletePopUp from "../GlobalComponents/PopUps/deletePopUp.svelte";
    import PaginationFooter from "../GlobalComponents/Pagination/paginationFooter.svelte";
  
    let requisitions = [];
    let searchRows = [];
  
    let shrinkID = null;
  
    let isDelVisible = false;
    let rowDelID = null;
  
    // Pagination data
     let totalEntries = 0;
    let entriesPerPage = "10";
    let currentPage = 1;
    let totalPages = 0;
    let pages = []; // to hold the page numbers
  
    // Search data
    let searchQuery = "Search...";
  
     // Add a variable to track the sort state
    let sortColumn = "id";
    let sortOrder = "asc"; // or 'desc' for descending order

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
  
    function handleClick(name) {
      shrinkID = name;
      setTimeout(() => {
        shrinkID = null;
      }, 100);
    }
  
     // Function to navigate to a page
     function goToPage(page) {
      currentPage = page;
    }
  
    // Function to get the range of numbers to display in pagination
    function paginationRange(current, total) {
      let start = current - 2 > 0 ? current - 2 : 1;
      let end = current + 2 < total ? current + 2 : total;
  
      let range = [];
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    }
  
    // Function to update the entries per page
    function updateEntriesToShow(event) {
      entriesPerPage = event.target.value;
      currentPage = 1;
      totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
      for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
    }
  
     // Function to handle the search functionality
     function updateSearchQuery(event) {
      searchQuery = event.target.value;
      if (searchQuery.trim() === "") {
        searchRows = requisitions; // If the search query is empty, show all rows
      } else {
        // Filter rows based on the searchQuery
        searchRows = requisitions.filter((row) => {
          // Check if any value in the row contains the searchQuery as a substring
          return Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
          );
        });
      }
      // Update the totalEntries and totalPages
      totalEntries = searchRows.length;

      totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
    }
  
    // Function to sort the table
    function sortTable(column, order) {
      handleClick(column + order);
      sortColumn = column;
      sortOrder = order;
      searchRows = searchRows.sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortColumn] > b[sortColumn] ? 1 : -1;
        } else {
          return a[sortColumn] < b[sortColumn] ? 1 : -1;
        }
      });
    }
  
     // Function to delete a row
     function deleteRow(id) {
      handleClick(id + "delete");
      isDelVisible = true;
      rowDelID = id;
    }
  
    async function handleDeleteConfirm() {
        ;
  }
  
     // Function to show the details of a row
     function showDetails(id) {
      handleClick(id + "details");
        navigate(`/requisition?reqId=${id}`);
      // Here you would add your logic to show the details of the row
    }
  
    // Function to save the row
    async function editRow(id) {
      handleClick(id + "edit");
     //navigate to edit details page
    }
  
    async function getReqList() {
      const response1 = await fetch('http://localhost:3000/api/requisition');
      const data1 = await response1.json();
      requisitions = data1.map((row) => {
        return {
          id: row.id,
          req_id : row.requestor_id,
          source : row.source,
          dest : row.destination,
          subject : row.subject,
          text : row.text,
          time : row.timestamp,
          approver : row.approved_by,
          bus : row.bus_type,
          valid : row.valid
        };
      });
      console.log(requisitions);
      searchRows = requisitions;


      totalEntries = searchRows.length;
      totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
      for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
    }

    onMount(async() => {
      await getReqList();
    });
  </script>
  
  <link
    rel="stylesheet"
    href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"
  />
  
  {#if $isAuthenticated}
    <main class="flex min-h-screen min-w-full">
      <div>
        <Navbar />
      </div>
  
      <!-- Heading -->
    <div class="flex-1 ml-56 w-full px-4 py-8 bg-white-700">
      <div class="flex items-start justify-start h-18">
        <h1 class="text-3xl font-bold underline uppercase text-maroon-500">
          Requisitions
        </h1>
      </div>
  
       <!-- Search Bar & Add Button-->
       <div class="flex mb-4 justify-end">
        <!-- <button
          class=" mr-3 bg-indigo-700 hover:bg-indigo-900 text-white-700 font-semibold py-2 px-4 rounded-full focus:translate-y-1.5"
          on:click={gotoAddBus}> Add Bus</button> -->
        <span class="h-8 bg-gray-300 rounded-full">
          <input
            id="search"
            type="text"
            class="h-7 px-3 bg-gray-300 text-sm text-gray-500 rounded-full focus:bg-white-700 focus:text-black-900"
            bind:value={searchQuery}
            on:focus={() => {
              if (searchQuery === "Search...") searchQuery = "";
            }}
            on:blur={() => {
              if (searchQuery === "") searchQuery = "Search...";
            }}
            on:input={updateSearchQuery}
          />
          <span
            class="h-7 pl-1 pr-3 bg-transparent transform scale-110 text-gray-500 rounded-full transition-transform duration-100 ease-in-out"
          >
            <i class="bx bx-search-alt-2"></i>
          </span>
        </span>
      </div>
  
      <!-- Entries per page -->
      <div class="flex mb-1">
        <label for="entriesToShow" class="text-sm font-semibold text-gray-700"
          >Show</label
        >
        <select
          id="entriesToShow"
          class="ml-1 mr-2 pl-1 bg-gray-300 rounded-full focus:bg-white-700 text-black-700 text-sm font-semibold h-6"
          bind:value={entriesPerPage}
          on:change={updateEntriesToShow}
        >
          <option value="10" class="text-sm">10</option>
          <option value="18" class="text-sm">18</option>
          <option value="27" class="text-sm">27</option>
        </select>
        <span class="text-sm font-semibold text-gray-700">entries</span>
      </div>
  
      <!-- Table -->
      <div class="bg-white-700 shadow-md my-3 overflow-x-auto">
        <table class="w-full table-auto">
          <!-- Table header -->
          <thead>
            <tr>
                <th class=" bg-white-700  w-1/4">
                    <div
                      class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
                    >
                      <span class="font-semibold uppercase text-xs text-black-700">
                        Requestor ID
                      </span>
                    </div>
                  </th>
                  <th class=" bg-white-700  w-1/4">
                    <div
                      class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
                    >
                      <span class="font-semibold uppercase text-xs text-black-700">
                        Destination
                      </span>
                    </div>
                  </th>
                <th class=" bg-white-700  w-1/4">
                  <div
                    class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
                  >
                    <span class="font-semibold uppercase text-xs text-black-700">
                      Subject
                    </span>
                  </div>
                </th>
                <th class=" bg-white-700  w-1/4">
                    <div
                      class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
                    >
                      <span class="font-semibold uppercase text-xs text-black-700">
                        Date
                      </span>
                    </div>
                  </th>
                
            </tr>
          </thead>
  
          <tbody>
            <!-- Dynamic rows -->
            {#each searchRows as row, index}
            {#if index >= (currentPage - 1) * Number(entriesPerPage) && index < currentPage * Number(entriesPerPage)}
            <tr
              class="{index % 2 === 0
                ? 'bg-gray-200'
                : 'bg-white-700'} hover:bg-gray-300">
                <td class="py-2 pl-2 pr-2 text-center w-1/4">{row.req_id}
                </td>
                <td class="py-2 pl-2 pr-2 text-center w-1/4">{row.dest}
                </td>
                <td class="py-2 pl-2 pr-2 text-center w-1/4">{row.subject}
                </td>
                <td class="py-2 pl-2 pr-2 text-center w-1/4">{formatDate(row.time)}
                </td>
                <td class="my-2 mx-2 w-auto">
                  <div class="flex justify-center w-full">
                    <button
                      class="bg-transparent mx-2"
                      class:shrink={shrinkID === row.id + "details"}
                      on:click={() => showDetails(row.id)}
                    >
                      <i
                        class="bx bxs-info-circle text-maroon-500 hover:text-maroon-900 scale-150"
                      ></i>
                    </button>
                    <button
                      class="bg-transparent mx-2"
                      class:shrink={shrinkID === row.id + "edit"}
                      on:click={() => editRow(row.id)}
                    >
                      <i
                            class="bx bxs-edit text-maroon-500 hover:text-maroon-900 scale-150"
                          ></i>
                        </button>
                        <button
                          class="bg-transparent mx-2"
                          class:shrink={shrinkID === row.id + "delete"}
                          on:click={() => deleteRow(row.id)}
                        >
                          <i
                            class="bx bxs-trash text-maroon-500 hover:text-maroon-900 scale-150"
                          ></i>
                        </button>
                        {#if isDelVisible}
                        <DeletePopUp
                          on:cancelDelete={() => (isDelVisible = false)}
                          on:confirmDelete={handleDeleteConfirm}
                        />
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
  {/if}
  
  
  <style>
    .shrink {
      transform: translateY(2px);
    }
  </style>
  