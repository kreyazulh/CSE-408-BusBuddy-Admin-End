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

  let selectedRole = 'student';
  let selectedType = 'all';

  let studentFeedbacks = [];
  let teacherFeedbacks = [];
  let StudentRows = [];
  let TeacherRows = [];
  let searchRows = [];

  let shrinkID = null;

  let isDelVisible = false;
  let rowDelID = null;

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
  console.log("searchrows",searchRows);
}



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

  // Function to delete a row
   function deleteRow(id) {
    handleClick(id + "delete");
    isDelVisible = true;
    rowDelID = id;
  }

  async function handleDeleteConfirm() {
  // isDelVisible = false;
  // let rowIndex = searchRows.findIndex((r) => r.id === rowDelID);

  // if (rowIndex !== -1) {
  //   try {
  //     const response = await fetch("http://localhost:3000/api/bus/delete", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id: rowDelID }),
  //     });

  //     const result = await response.json();
  //     console.log(result);

  //     if (response.ok) {
  //       console.log("Row deleted successfully:", result);

  //       // Remove the row from the UI
  //       searchRows.splice(rowIndex, 1);
  //       searchRows = [...searchRows];
  //       totalEntries = searchRows.length;
  //       totalPages = Math.ceil(totalEntries / Number(entriesPerPage));

  //       rowIndex = studentFeedbacks.findIndex((r) => r.id === rowDelID);
  //       if (rowIndex !== -1) {
  //         studentFeedbacks.splice(rowIndex, 1);
  //         studentFeedbacks = [...studentFeedbacks];
  //       }

  //       // Additional logic after successful deletion (e.g., update UI)
  //     } else {
  //       console.error("Failed to delete row:", result);
  //       // Handle error case
  //     }
  //   } catch (error) {
  //     console.error("Error deleting row:", error);
  //     // Handle error case
  //   }
  // }
}

   // Function to show the details of a row
   function showDetails(id) {
    handleClick(id + "details");
    if(selectedRole=='student'){
      navigate(`/feedbackStudent?feedbackId=${id}`);
    }
    else{
      navigate(`/feedbackTeacher?feedbackId=${id}`);
    }
  }

  let routes = [];

  async function fetchRoutes() {
    try {
      const response = await fetch('http://localhost:3000/api/route/');
      routes = await response.json();
      console.log(routes);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  }



var feedbacks = [];

async function getFeedbackList() {
await fetchRoutes();

// Define the request payload
const payload = { statusType: selectedType }; // Assuming `selectType` holds the value of the select dropdown

// Define the fetch options for POST request
const fetchOptions = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
};

// Adjust the URL based on selectedRole
const url = selectedRole === 'student' ? 'http://localhost:3000/api/feedback/student' : 'http://localhost:3000/api/feedback/teacher';

const response = await fetch(url, fetchOptions);
const data = await response.json();

console.log(data);

feedbacks = data.map(row => {
  const routeObj = routes.find(route => route.id === row.route);
  return {
    id: row.id,
    complainer_id: row.complainer_id,
    route: routeObj ? routeObj.terminal_point : "Unknown",
    sub_time: row.submission_timestamp,
    trip_id: row.trip_id,
    subject: row.subject,
    response: row.response
  };
});

console.log(feedbacks);

// Use the feedbacks data as needed for your UI
searchRows = feedbacks;
totalEntries = searchRows.length;
totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
}


$: selectedType, selectedRole, getFeedbackList();


  onMount(async() => {
    await getFeedbackList();
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
        Feedbacks
      </h1>
    </div>

    <!-- Select Role -->
    <div class="mt-4">
      <label>
        <input type="radio"  bind:group={selectedRole} value="student"/>
        Student
      </label>
      
      <label>
        <input type="radio" bind:group={selectedRole} value="teacher"/>
        Teacher
      </label>
    </div>

    <div class="mt-4">
      <label for="feedbackFilter">Feedback Status:</label>
      <select id="feedbackFilter" bind:value={selectedType}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="responded">Responded</option>
      </select>
    </div>

     <!-- Search Bar-->
     <div class="flex mb-4 justify-end">
        <SearchBar originalRows={searchRows} on:searchChanged={handleSearch} />
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
                <span class="pl-2 font-semibold uppercase text-xs text-black-700">
                  Complainer ID
                </span>
                <SortingButtons
                  searchRows={searchRows}
                  sortColumn="complainer_id"
                  on:sort={(e) => {
                    searchRows = e.detail;
                  }}/>
              </div>
            </th>
            <th class=" bg-white-700  w-auto">
              <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                <span class="font-semibold uppercase text-xs text-black-700">
                  Route
                </span>
                <SortingButtons
                  searchRows={searchRows}
                  sortColumn="route"
                  on:sort={(e) => {
                    searchRows = e.detail;
                  }}/>
              </div>
            </th>
            <th class="bg-white-700  w-auto">
              <div class="flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                <span class="font-semibold uppercase text-xs text-black-700">
                  Submission Time 
                </span>
                <SortingButtons
                searchRows={searchRows}
                sortColumn="sub_time"
                on:sort={(e) => {
                  searchRows = e.detail;
                }}/>
              </div>
            </th>
            <th class=" bg-white-700  w-auto">
              <div class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                <span class="font-semibold uppercase text-xs text-black-700">
                  Subject
                </span>
              </div>
            </th>    
          </tr>
        </thead>

        <tbody>
          <!-- Dynamic rows -->
          {#each searchRows as row, index}
            {#if index >= (currentPage - 1) * Number(entriesPerPage) && index < currentPage * Number(entriesPerPage)}
              <tr class="{index % 2 === 0 ? 'bg-gray-200': 'bg-white-700'} hover:bg-gray-300">
                <td class="py-2 pl-2 pr-2 text-center w-auto">{row.complainer_id}</td>
                <td class="py-2 pl-2 pr-2 text-center w-auto">{row.route}</td>
                <td class="py-2 pl-2 pr-2 text-center w-auto">{formatDate(row.sub_time)}</td>
                <td class="py-2 pl-2 pr-2 text-center w-auto">{row.subject.slice(1, -1)}</td>
                <td class="py-2 pl-2 pr-2 text-center w-auto">
                  {#if row.response === null}
                    <span class="border border-red-500 w-fit px-3 py-1 rounded-full text-red-500 font-medium">
                      <i class="bx bxs-x-circle text-red-500 scale-150 mr-2"></i>
                      Pending
                    </span>
                  {:else}
                  <span class="border border-lime-500 w-fit px-3 py-1 rounded-full text-maroon-500 font-medium">
                    <i class="bx bxs-check-circle text-lime-500 scale-150 mr-2"></i>
                    Responded
                  </span>
                  {/if}
                </td>
                <td class="my-2 mx-2 w-auto">
                  <div class="flex justify-center w-full">
                    <button class="bg-transparent mx-2"
                      class:shrink={shrinkID === row.id + "details"}
                      on:click={() => showDetails(row.id)}>
                      <i class="bx bxs-info-circle text-maroon-500 hover:text-maroon-900 scale-150"></i>
                    </button>
                    <button class="bg-transparent mx-2"
                      class:shrink={shrinkID === row.id + "delete"}
                      on:click={() => deleteRow(row.id)}>
                      <i class="bx bxs-trash text-maroon-500 hover:text-maroon-900 scale-150"></i>
                    </button>
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
on:pageChanged={(e) => {currentPage = e.detail;}}
/>
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
