<script>
  import Navbar from "../GlobalComponents/navbar.svelte";
  import DeletePopUp from "../GlobalComponents/PopUps/deletePopUp.svelte";
  import { navigate } from 'svelte-routing';
  import { onMount } from "svelte";
  import { isAuthenticated } from "../../auth";

  // Sample data for the table rows
  let rows = [];
  let busNumbers = [];
  let driverNames = [];
  let tempDriverNames = [];
  let staffNames = [];
  let tempStaffNames = [];
  let routes = [];
  let tomorrowTime = {time: ''};

  let date = null;

  let warningMessages = [];



  let shrinkID = null;

  let isDelVisible = false;
  let rowDelID = null;

  let changedRows = [];

  // Pagination data
  let totalEntries = 0;
  let entriesPerPage = "10";
  let currentPage = 1;
  let totalPages = 0;
  let pages = []; // to hold the page numbers

  // Search data
  let searchQuery = "Search...";
  let searchRows = [];

  // Add a variable to track the sort state
  let sortColumn = "id";
  let sortOrder = "asc"; // or 'desc' for descending order

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

  function updateData(id, column, event) {
    let newValue = event.target.value;
    const rowIdx = searchRows.findIndex((r) => r.id === id);
    if (rowIdx !== -1) {
        searchRows[rowIdx][column] = newValue;
        searchRows = [...searchRows];
        changedRows.push(id);
    }
}

  // Function to delete a row
  function deleteRow(id) {
    handleClick(id + "delete");
    isDelVisible = true;
    rowDelID = id;
    console.log("Row to delete:", id);
  }

async function handleDeleteConfirm() {
  isDelVisible = false;
  let rowIndex = searchRows.findIndex((r) => r.id === rowDelID);

  console.log("Row index:", rowIndex);
  
  if (rowIndex !== -1) {
    try {
      const response = await fetch("http://localhost:3000/api/route/allocation/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: rowDelID }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Row deleted successfully:", result);
        
        // Remove the row from the UI
        searchRows.splice(rowIndex, 1);
        searchRows = [...searchRows];
        totalEntries = searchRows.length;
        totalPages = Math.ceil(totalEntries / Number(entriesPerPage));

        rowIndex = rows.findIndex((r) => r.id === rowDelID);
        if (rowIndex !== -1) {
          rows.splice(rowIndex, 1);
          rows = [...rows];
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
    // Here you would add your logic to show the details of the row
  }

  // Function to save the row
  async function saveRow(id) {
    handleClick(id + "save");
    if (changedRows.includes(id)) {
      let rowIndex = searchRows.findIndex((r) => r.id === id);
      if (rowIndex !== -1) {
        // Extract the row data using the rowIndex
        const rowData = searchRows[rowIndex];

        console.log("Row data:", rowData);

        // Assemble the data to send
        const payload = {
          id: rowData.id, // Assuming 'id' is used as a unique identifier for the allocation
          currentRoute: rowData.route_no,
          busNumber: rowData.busNumber,
          driverName: rowData.driverName,
          staffName: rowData.staffName,
          shift: rowData.shift,
        };

        console.log("Payload:", payload);

        try {
          const response = await fetch(
            "http://localhost:3000/api/route/allocation/edit",
            {
              method: "POST", // or 'PUT' if updating an existing allocation
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            },
          );

          const result = await response.json();
          if (response.ok) {
            console.log("Row saved successfully:", result);
            await sendNotification(rowData);
            // Additional logic after successful save (e.g., update UI, clear fields)
          } else {
            console.error("Failed to save row:", result);
            // Handle error case
          }
        } catch (error) {
          console.error("Error saving row:", error);
          // Handle error case
        }
      }
      // Remove the id from changedRows after saving
      changedRows = changedRows.filter((r) => r !== id);
    }
    await fetchRows(selectedDate);
  }

  async function sendNotification(rowData) {
  const notificationMessage = `You have been assigned a trip with bus ${rowData.busNumber}, shift ${rowData.shift} on ${selectedDate}. Staffs ${rowData.driverName} and ${rowData.staffName}.`;
  // Assuming you have an endpoint or method to send a notification
  try {
    const notificationResponse = await fetch('http://localhost:3000/api/proxyPersonalNotification', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nTitle: "Trip Assigned", 
        userId: rowData.driverName, // Assuming the 'id' can be used to identify the user for the notification
        message: notificationMessage,
      }),
    });

    if (notificationResponse.ok) {
      console.log("Notification sent successfully");
    } else {
      console.error("Failed to send notification");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }

  try {
    const notificationResponse = await fetch('http://localhost:3000/api/proxyPersonalNotification', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: rowData.staffName, // Assuming the 'id' can be used to identify the user for the notification
        message: notificationMessage,
      }),
    });

    if (notificationResponse.ok) {
      console.log("Notification sent successfully");
    } else {
      console.error("Failed to send notification");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
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

async function fetchHelper(time) {
  try {
    const response = await fetch(`http://localhost:3000/api/staff/collector_with_time?time=${encodeURIComponent(time)}`);
  const data = await response.json();
    staffNames = data.map(item => item.id);
  } catch (error) {
    console.error('Error fetching helpers:', error);
  }
}

async function fetchDriver(time) {
  try {
    const response = await fetch(`http://localhost:3000/api/staff/driver_with_time?time=${encodeURIComponent(time)}`);
  const data = await response.json();
    console.log(data);
    driverNames = data.map(item => item.id);
    console.log(driverNames);
  } catch (error) {
    console.error('Error fetching drivers:', error);
  }
}

async function fetchBus() {
  try {
    const response = await fetch('http://localhost:3000/api/bus/');
    let data = await response.json();
    console.log(data);
    busNumbers = data.map(item => item.reg_id);
  } catch (error) {
    console.error('Error fetching buses:', error);
  }
}

let dates = getNextSevenDays();
let selectedDate = dates[0]; // Default to today

// Function to call fetchRows with the selected date
async function onDateChange(event) {
  const selectedDate = event.target.value;
  await fetchRows(selectedDate);
}

// Function to generate an array of the next 7 dates
function getNextSevenDays() {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]); // Format the date as YYYY-MM-DD
  }
  return dates;
}

async function fetchRows(selectedDate) {
  warningMessages = [];
  try {
    const url = "http://localhost:3000/api/route/allocation";
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: selectedDate }),
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Convert the response body to JSON

    let rows = data.map(item => ({
      id: item.id,
      route_no: item.route,
      busNumber: item.bus,
      driverName: item.driver,
      staffName: item.helper,
      shift: item.time_type,
      currentRoute: routes.find(route => route.id === item.route)?.terminal_point || 'Not Assigned'
      //currentRoute: item.route
    })).filter(row => !Object.values(row).includes(null));


    console.log("Rows:", rows);
      console.log("Rows:", rows);
      rows = rows.filter((row) => {
        for (let key in row) {
          if (row[key] === null) {
            return false;
          }
        }
        return true;
      });

      searchRows = rows;

          // Track occurrences of driver+shift and helper+shift combinations
    let driverShiftCounts = {};
    let helperShiftCounts = {};

    rows.forEach(row => {
      const driverShiftKey = `${row.driverName}_${row.shift}`;
      const helperShiftKey = `${row.staffName}_${row.shift}`;

      // Increment count for each combination
      driverShiftCounts[driverShiftKey] = (driverShiftCounts[driverShiftKey] || 0) + 1;
      helperShiftCounts[helperShiftKey] = (helperShiftCounts[helperShiftKey] || 0) + 1;
    });

    // Check for any counts greater than 1 and add warnings
    Object.keys(driverShiftCounts).forEach(key => {
      if (driverShiftCounts[key] > 1) {
        const [driverName, shift] = key.split('_');
        warningMessages.push(`Driver ${driverName} is assigned to multiple routes for shift ${shift}.`);
      }
    });

    Object.keys(helperShiftCounts).forEach(key => {
      if (helperShiftCounts[key] > 1) {
        const [helperName, shift] = key.split('_');
        warningMessages.push(`Helper ${helperName} is assigned to multiple routes for shift ${shift}.`);
      }
    });
      // for (let i = 0; i < rows.length; i++) {
      //   busNumbers.push(rows[i].busNumber);
      // }
      // busNumbers = Array.from(new Set(busNumbers));
      // for (let i = 0; i < rows.length; i++) {
      //   driverNames.push(rows[i].driverName);
      // }
      driverNames = Array.from(new Set(driverNames));
      // for (let i = 0; i < rows.length; i++) {
      //   staffNames.push(rows[i].staffName);
      // }
      staffNames = Array.from(new Set(staffNames));

          // Check each row for missing driver or helper in the lists
      rows.forEach(row => {
      if (!driverNames.includes(row.driverName)) {
        warningMessages.push(`Valid driver unassigned for route ${row.currentRoute}, shift ${row.shift}`);
      }
      if (!staffNames.includes(row.staffName)) {
        warningMessages.push(`Valid helper unassigned for route ${row.currentRoute}, shift ${row.shift}`);
      }
    });
    console.log("Warning messages:", warningMessages);
      totalEntries = rows.length;
      totalPages = Math.ceil(totalEntries / Number(entriesPerPage));

      // Populate the pages array with page numbers
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } catch (error) {
      console.error("Could not fetch rows:", error);
    }
  }


  async function gotoAddTrip() {
    navigate('/scheduleTrip');
  }


onMount(async () => {
    await fetchRoutes();
    await fetchDriver(selectedDate);
    await fetchHelper(selectedDate);
    await fetchBus();
    await fetchRows(selectedDate);
  });
</script>

<link
  rel="stylesheet"
  href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"
/>

{#if isAuthenticated}
<main class="flex w-full">
  <div>
    <Navbar />
  </div>

  <!-- Heading -->
  <div class="flex-1 ml-56 w-full px-4 py-8 bg-white-700">
    <div class="flex items-start justify-start h-18">
      <h1 class="text-3xl font-bold underline uppercase text-maroon-500">
        Upcoming Trips
      </h1>
    </div>

    <!-- Search Bar -->
    <div class="flex mb-4 justify-end">
      <button
        class=" mr-3 bg-indigo-700 hover:bg-indigo-900 text-white-700 font-semibold py-2 px-4 rounded-full focus:translate-y-1.5"
        on:click={gotoAddTrip}> Add Trip</button>
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

    <!--date-->
    <div class="flex mb-1">
      <label for="dateSelector" class="text-sm font-semibold text-gray-700 mr-2 mt-2">
        Select Date:
      </label>
      <select
        id="dateSelector"
        class="ml-1 bg-gray-300 rounded-full focus:bg-white focus:border-blue-300 focus:ring-blue-200 text-black text-sm font-semibold h-10 p-1.5"
        on:change={onDateChange}
      >
        {#each dates as date}
          <option value={date}>{date}</option>
        {/each}
      </select>
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

    <!-- Warning Messages -->
{#if warningMessages.length > 0}
<div class="mb-4">
  {#each warningMessages as message}
    <p class="text-xs font-semibold text-red-500">{message}</p>
  {/each}
</div>
{/if}

    <!-- Table -->
    <div class="bg-white-700 shadow-md my-3 overflow-x-auto">
      <table class="w-full table-fixed text-normal">
        <!-- Table header -->
        <thead>
          <tr>
            <th class="bg-white-700 border-b  w-1/12">
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
            <th class="bg-white-700 border-b  w-1/6">
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
            <th class=" bg-white-700 border-b  w-1/6">
              <div
                class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
              >
                <span class="font-semibold uppercase text-xs text-black-700">
                  Bus Number
                </span>
              </div>
            </th>
            <th class="bg-white-700 border-b  w-1/6">
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
            <th class="bg-white-700 border-b  w-1/6">
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
            <th class=" bg-white-700 border-b  w-1/12">
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
          {#each searchRows as row, index}
            {#if index >= (currentPage - 1) * Number(entriesPerPage) && index < currentPage * Number(entriesPerPage)}
              <tr
                class="{index % 2 === 0
                  ? 'bg-gray-200'
                  : 'bg-white-700'} hover:bg-gray-300"
              >
                <td
                  class="py-2 pl-2 pr-2 border-b text-center  w-1/12"
                  >{row.id}</td
                >
                <td
                  class="py-2 px-2 border-b text-center  w-1/6"
                  >{row.currentRoute}</td
                >
                <td class="py-2 px-2 border-b  w-1/6">
                  <select
                    class="w-full px-1 text-nowrap text-ellipsis bg-gray-100 rounded-full focus:bg-white-700 text-black-700 text-sm"
                    bind:value={row.busNumber}
                    on:change={(event) =>
                      updateData(row.id, "busNumber", event)}
                  >
                    {#each busNumbers as busNumber}
                      <option value={busNumber}>{busNumber}</option>
                    {/each}
                  </select>
                </td>
                <td class="py-2 px-2 border-b  w-1/6">
                  <select
                    class="w-full px-1 text-nowrap text-ellipsis bg-gray-100 rounded-full focus:bg-white-700 text-black-700 text-sm"
                    bind:value={row.driverName}
                    on:change={(event) =>
                      updateData(row.id, "driverName", event)}>
                    {#each driverNames as driverName}
                      <option value={driverName}>{driverName}</option>
                    {/each}
                  </select>
                </td>
                <td class="py-2 px-2 border-b  w-1/6">
                  <select
                    class="w-full px-1 text-nowrap text-ellipsis bg-gray-100 rounded-full focus:bg-white-700 text-black-700 text-sm"
                    bind:value={row.staffName}
                    on:change={(event) =>
                      updateData(row.id, "staffName", event)}
                  >
                    {#each staffNames as staffName}
                      <option value={staffName}>{staffName}</option>
                    {/each}
                  </select>
                </td>
                <td
                  class="py-2 pl-2 pr-2 border-b text-center  w-1/12"
                  >{row.shift}</td
                >
                <td class="my-2 mx-2 border-b  w-auto">
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
                      class:shrink={shrinkID === row.id + "save"}
                      on:click={() => saveRow(row.id)}
                    >
                      {#if changedRows.includes(row.id)}
                        <i
                          class="bx bxs-save text-maroon-500 hover:text-maroon-900 scale-150"
                        ></i>
                      {:else}
                        <i
                          class="bx bxs-check-circle text-lime-500 hover:text-lime-700 scale-150"
                        ></i>
                      {/if}
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
{/if}

<style>
  .shrink {
    transform: translateY(2px);
  }
</style>