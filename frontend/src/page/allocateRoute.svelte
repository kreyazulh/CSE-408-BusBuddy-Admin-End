<script>
  import Navbar from "./navbar.svelte";
  import DeletePopUp from "./deletePopUp.svelte";

  // Sample data for the table rows
  let rows = [
    {
      id: "101",
      currentRoute: "Badda",
      busNumber: "OC-3042",
      driverName: "Altaf Mia",
      staffName: "Fazlul Karim",
      shift: ["M"],
    },
    {
      id: "102",
      currentRoute: "Mirpur",
      busNumber: "OC-3050",
      driverName: "Rahimuddin",
      staffName: "AK Fazlul Karim Akanda aaaaaaaaaaaaaaaaaaaaaaaaaaa",
      shift: ["M", "N", "E"],
    },
    // ... other rows
  ];

  let busNumbers = [];
  for (let i = 0; i < rows.length; i++) {
    busNumbers.push(rows[i].busNumber);
  }

  let driverNames = [];
  for (let i = 0; i < rows.length; i++) {
    driverNames.push(rows[i].driverName);
  }

  let staffNames = [];
  for (let i = 0; i < rows.length; i++) {
    staffNames.push(rows[i].staffName);
  }

  let shrinkID = null;

  let isDelVisible = false;
  let rowDelID = null;

  let changedRows = [];

  // Pagination data
  let totalEntries = rows.length;
  let entriesPerPage = "10";
  let currentPage = 1;
  let totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
  let pages = []; // to hold the page numbers

  // Search data
  let searchQuery = "Search...";
  let searchRows = rows;

  // Add a variable to track the sort state
  let sortColumn = "id";
  let sortOrder = "asc"; // or 'desc' for descending order

  // Populate the pages array with page numbers
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
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
    // Here you would also add your logic to fetch the data for the current page
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
  }

  // Function to handle the search functionality
  function updateSearchQuery(event) {
    searchQuery = event.target.value;
    if (searchQuery.trim() === "") {
      searchRows = rows; // If the search query is empty, show all rows
    } else {
      // Filter rows based on the searchQuery
      searchRows = rows.filter((row) => {
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

  // Function to add or remove shifts
  function toggleShift(id, shift) {
    const rowIndex = searchRows.findIndex(r => r.id === id);
    if (rowIndex !== -1) {
      const shiftIndex = rows[rowIndex].shift.indexOf(shift);
      if (shiftIndex !== -1) {
        searchRows[rowIndex].shift.splice(shiftIndex, 1); // remove the shift
      } else {
        searchRows[rowIndex].shift.push(shift); // add the shift
      }
      searchRows[rowIndex] = { ...searchRows[rowIndex], shift: [...searchRows[rowIndex].shift] };
    }
    changedRows.push(id);
  }

  // Function to update the row data when a selection is made
  function updateData(id, column, event) {
    let value = event.target.value;
    const rowIndex = searchRows.findIndex(r => r.id === id);
    if (rowIndex !== -1) {
      searchRows[rowIndex][column] = value;
      searchRows[rowIndex] = { ...searchRows[rowIndex] };
    }
    changedRows.push(id);
  }

  // Function to delete a row
  function deleteRow(id) {
    handleClick(id + "delete");
    isDelVisible = true;
    rowDelID = id;
  }

  function handleDeleteConfirm() {
    isDelVisible = false;
    let rowIndex = searchRows.findIndex(r => r.id === rowDelID);
    if (rowIndex !== -1) {
      searchRows.splice(rowIndex, 1);
      searchRows = [...searchRows];
    }
    totalEntries = searchRows.length;
    totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
    rowIndex = rows.findIndex(r => r.id === rowDelID);
    if (rowIndex !== -1) {
      rows.splice(rowIndex, 1);
      rows = [...rows];
      //write rows in DB
    }
  }

  // Function to show the details of a row
  function showDetails(id) {
    handleClick(id + "details");
    // Here you would add your logic to show the details of the row
  }

  // Function to save the row
  function saveRow(id) {
    handleClick(id + "save");
    if(changedRows.includes(id)) {
      let rowIndex = rows.findIndex(r => r.id === id);
      if (rowIndex !== -1) {
        rows[rowIndex] = searchRows[rowIndex];
      }
      //write rows in DB
    }
    changedRows = changedRows.filter(r => r !== id);
  }

</script>

<link
  rel="stylesheet"
  href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"
/>

<main class="flex">
  <div>
    <Navbar />
  </div>

  <!-- Heading -->
  <div class="container mx-auto px-4 py-8 bg-white-700">
    <div class="flex items-start justify-start h-18">
      <h1 class="text-3xl font-bold underline uppercase text-maroon-500">
        Route Allocation
      </h1>
    </div>

    <!-- Search Bar -->
    <div class="flex mb-4 justify-end">
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
      <table class="w-full table-fixed text-sm">
        <!-- Table header -->
        <thead>
          <tr>
            <th class="bg-white-700 border-b border-gray-400/10 w-1/12">
              <div
                class="flex items-center justify-center space-x-1 bg-red-70 rounded-full"
              >
                <span
                  class="pl-2 font-semibold uppercase text-xs text-black-700"
                >
                  ID
                </span>
                <div class="flex flex-col">
                  <button
                    class="h-3 bg-transparent transform scale-75"
                    on:click={() => sortTable("id", "asc")}
                  >
                    <span
                      class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
                      class:shrink={shrinkID === "idasc"}>▲</span
                    >
                  </button>
                  <button
                    class="bg-transparent transform scale-75"
                    on:click={() => sortTable("id", "desc")}
                  >
                    <span
                      class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
                      class:shrink={shrinkID === "iddesc"}>▼</span
                    >
                  </button>
                </div>
              </div></th
            >
            <th class="bg-white-700 border-b border-gray-400/10 w-1/6">
              <div
                class="flex items-center justify-center space-x-1 bg-red-70 rounded-full"
              >
                <span
                  class="pl-2 font-semibold uppercase text-xs text-black-700"
                >
                  Current Route
                </span>
                <div class="flex flex-col">
                  <button
                    class="h-3 bg-transparent transform scale-75"
                    on:click={() => sortTable("currentRoute", "asc")}
                  >
                    <span
                      class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
                      class:shrink={shrinkID === "currentRouteasc"}>▲</span
                    >
                  </button>
                  <button
                    class="bg-transparent transform scale-75"
                    on:click={() => sortTable("currentRoute", "desc")}
                  >
                    <span
                      class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
                      class:shrink={shrinkID === "currentRoutedesc"}>▼</span
                    >
                  </button>
                </div>
              </div></th
            >
            <th class=" bg-white-700 border-b border-gray-400/10 w-1/6">
              <div
                class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
              >
                <span class="font-semibold uppercase text-xs text-black-700">
                  Bus Number
                </span>
              </div>
            </th>
            <th class="bg-white-700 border-b border-gray-400/10 w-1/6">
              <div
                class="flex items-center justify-center space-x-1 bg-red-70 rounded-full"
              >
                <span class="font-semibold uppercase text-xs text-black-700">
                  Driver Name
                </span>
                <div class="flex flex-col">
                  <button
                    class="h-3 bg-transparent transform scale-75"
                    on:click={() => sortTable("driverName", "asc")}
                  >
                    <span
                      class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
                      class:shrink={shrinkID === "driverNameasc"}>▲</span
                    >
                  </button>
                  <button
                    class="bg-transparent transform scale-75"
                    on:click={() => sortTable("driverName", "desc")}
                  >
                    <span
                      class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
                      class:shrink={shrinkID === "driverNamedesc"}>▼</span
                    >
                  </button>
                </div>
              </div></th
            >
            <th class="bg-white-700 border-b border-gray-400/10 w-1/6">
              <div
                class="flex items-center justify-center space-x-1 bg-red-70 rounded-full"
              >
                <span
                  class="pl-2 font-semibold uppercase text-xs text-black-700"
                >
                  Staff Name
                </span>
                <div class="flex flex-col">
                  <button
                    class="h-3 bg-transparent transform scale-75"
                    on:click={() => sortTable("staffName", "asc")}
                  >
                    <span
                      class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
                      class:shrink={shrinkID === "staffNameasc"}>▲</span
                    >
                  </button>
                  <button
                    class="bg-transparent transform scale-75"
                    on:click={() => sortTable("staffName", "desc")}
                  >
                    <span
                      class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
                      class:shrink={shrinkID === "staffNamedesc"}>▼</span
                    >
                  </button>
                </div>
              </div></th
            >
            <th class=" bg-white-700 border-b border-gray-400/10 w-1/12">
              <div
                class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
              >
                <span class="font-semibold uppercase text-xs text-black-700">
                  Shift
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- Dynamic rows -->
          {#each searchRows as row, index (row.id)}
            <tr
              class="{index % 2 === 0
                ? 'bg-gray-200'
                : 'bg-white-700'} hover:bg-gray-300" 
            >
              <td class="py-2 pl-2 pr-2 border-b text-center border-gray-400/10 w-1/12"
                >{row.id}</td
              >
              <td class="py-2 px-2 border-b text-center border-gray-400/10 w-1/6"
                >{row.currentRoute}</td
              >
              <td class="py-2 px-2 border-b border-gray-400/10 w-1/6">
                <select class="w-full px-1 text-nowrap text-ellipsis bg-gray-100 rounded-full focus:bg-white-700 text-black-700 text-sm"
                bind:value={row.busNumber} 
                on:change={(event) => updateData(row.id, 'busNumber', event)}>
                  {#each busNumbers as busNumber}
                    <option value={busNumber}>{busNumber}</option>
                  {/each}
                </select>
              </td>
              <td class="py-2 px-2 border-b border-gray-400/10 w-1/6">
                <select class="w-full px-1 text-nowrap text-ellipsis bg-gray-100 rounded-full focus:bg-white-700 text-black-700 text-sm"
                bind:value={row.driverName} 
                on:change={(event) => updateData(row.id, 'driverName', event)}>
                  {#each driverNames as driverName}
                    <option value={driverName}>{driverName}</option>
                  {/each}
                </select>
              </td>
              <td class="py-2 px-2 border-b border-gray-400/10 w-1/6">
                <select class="w-full px-1 text-nowrap text-ellipsis bg-gray-100 rounded-full focus:bg-white-700 text-black-700 text-sm"
                bind:value={row.staffName} 
                on:change={(event) => updateData(row.id, 'staffName', event)}>
                  {#each staffNames as staffName}
                    <option value={staffName}>{staffName}</option>
                  {/each}
                </select>
              </td>
              <td class="py-2 px-2 border-b border-gray-400/10 w-1/12">
                <div class="flex justify-center w-full">
                <label class="inline-flex items-center">
                  <input type="checkbox" class="ml-2" checked={row.shift.includes('M')} on:change={() => toggleShift(row.id, 'M')} />
                  <span class="mx-1 text-xs">M</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="checkbox" checked={row.shift.includes('N')} on:change={() => toggleShift(row.id, 'N')} />
                  <span class="mx-1 text-xs">N</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="checkbox" checked={row.shift.includes('E')} on:change={() => toggleShift(row.id, 'E')} />
                  <span class="ml-1 mr-2 text-xs">E</span>
                </label>
                </div>
              </td>
              <td class="my-2 mx-2 border-b border-gray-400/10 w-auto">
                <div class="flex justify-center w-full">
                <button class="bg-transparent mx-2"
                class:shrink={shrinkID === row.id+"details"}
                on:click={() => showDetails(row.id)}>
                  <i class="bx bxs-info-circle text-maroon-500 scale-150"></i>
                </button>
                <button class="bg-transparent mx-2"
                class:shrink={shrinkID === row.id+"save"}
                on:click={() => saveRow(row.id)}>
                {#if changedRows.includes(row.id)}
                  <i class="bx bxs-save text-maroon-500 hover:text-maroon-900 scale-150"></i>
                {:else}
                  <i class="bx bxs-check-circle text-lime-500 hover:text-lime-700 scale-150"></i>
                {/if}
                </button>
                <button class="bg-transparent mx-2"
                class:shrink={shrinkID === row.id+"delete"}
                on:click={() => deleteRow(row.id)}>
                  <i class="bx bxs-trash text-maroon-500 hover:text-maroon-900 scale-150"></i>
                </button>
                {#if isDelVisible}
                  <DeletePopUp on:cancelDelete={() => isDelVisible = false}    
                  on:confirmDelete = {handleDeleteConfirm}/>
                {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Styled Pagination -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-xs font-regular text-black-700">
        Showing {(currentPage - 1) * Number(entriesPerPage) + 1} to {currentPage *
          Number(entriesPerPage) >
        totalEntries
          ? totalEntries
          : currentPage * Number(entriesPerPage)} of {totalEntries} entries
      </span>
      <div class="inline-flex">
        <button
          class="py-1 px-2 leading-tight text-sm text-gray-500 bg-white-700 rounded-l-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          on:click={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {#each paginationRange(currentPage, totalPages) as page}
          <button
            class={`py-1 px-2 leading-tight ${
              currentPage === page
                ? "text-white-700 bg-maroon-500 hover:bg-maroon-900"
                : "text-gray-500 bg-white-700 hover:bg-gray-200"
            }`}
            on:click={() => goToPage(page)}
          >
            {page}
          </button>
        {/each}
        <button
          class="py-1 px-2 leading-tight text-sm text-gray-500 bg-white-700 rounded-r-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          on:click={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  </div>
</main>

<style>
  .shrink {
    transform: translateY(2px);
  }
</style>
