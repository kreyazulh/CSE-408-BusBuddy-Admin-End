<script>
  import { onMount } from 'svelte';
  import Navbar from '../GlobalComponents/navbar.svelte';
  import { isAuthenticated } from '../../auth'; // If authentication check is needed
  import { navigate } from 'svelte-routing';
  import DeletePopUp from "../GlobalComponents/PopUps//deletePopUp.svelte";
  import PaginationFooter from "../GlobalComponents/Pagination/paginationFooter.svelte";

  let selectedRole = 'student';

  let students = [];
  let teachers = [];
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
  let searchStudentRows = [];
  let searchTeacherRows = [];

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
      searchStudentRows = students; // If the search query is empty, show all rows
      searchTeacherRows = teachers; // If the search query is empty, show all rows
    } else {
      // Filter rows based on the searchQuery
      searchStudentRows = students.filter((row) => {
        // Check if any value in the row contains the searchQuery as a substring
        return Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        );
      });

      searchTeacherRows = teachers.filter((row) => {
        // Check if any value in the row contains the searchQuery as a substring
        return Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        );
      });
    }
    // Update the totalEntries and totalPages
    if(selectedRole=='student'){
    totalEntries = searchStudentRows.length;
    }
    else{
      totalEntries = searchTeacherRows.length;
    }
    totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
  }

  // Function to sort the table
  function sortTable(column, order) {
    handleClick(column + order);
    sortColumn = column;
    sortOrder = order;
    searchStudentRows = searchStudentRows.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    });
    searchTeacherRows = searchTeacherRows.sort((a, b) => {
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

  //       rowIndex = students.findIndex((r) => r.id === rowDelID);
  //       if (rowIndex !== -1) {
  //         students.splice(rowIndex, 1);
  //         students = [...students];
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
      navigate(`/student?id=${id}`);
    }
    else{
      navigate(`/teacher?id=${id}`);
    }
    // Here you would add your logic to show the details of the row
  }

  // Function to save the row
  async function editRow(id) {
    handleClick(id + "edit");
   //navigate to edit details page
  }

  async function getUserList() {
    const response1 = await fetch('http://localhost:3000/api/user/student');
    const data1 = await response1.json();
    students = data1.map((row) => {
      return {
        id: row.id,
        phone : row.phone,
        name : row.name,
        route : row.default_route
      };
    });
    console.log(students);
    searchStudentRows = students;


    const response2 = await fetch('http://localhost:3000/api/user/teacher');
    const data2 = await response2.json();
    teachers = data2.map((row) => {
      return {
        id: row.id,
        name: row.name,
        phone : row.phone,
        designation : row.designation,
        department : row.department
      };
    });
    console.log(teachers);
    searchTeacherRows = teachers;


    totalEntries = searchStudentRows.length;
    totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
  }

  $: if (selectedRole === 'student') {
    searchRows = searchStudentRows;
  } else {
    searchRows = searchTeacherRows;
  }

  async function gotoAddUser() {
    navigate('/addStudent');
  }

  onMount(async() => {
    await getUserList();
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
        Users
      </h1>
    </div>
    <div>
      <label>
        <input type="radio" bind:group={selectedRole} value="student">
        Student
      </label>
      
      <label>
        <input type="radio" bind:group={selectedRole} value="teacher">
        Teacher
      </label>
    </div>
    <button
    class=" mr-3 bg-indigo-700 hover:bg-indigo-900 text-white-700 font-semibold py-2 px-4 rounded-full focus:translate-y-1.5"
    on:click={gotoAddUser}> Add User</button>
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
          {#if selectedRole==='student'}
          <tr>
            
            <th class="bg-white-700  w-1/4">
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
              </div>
              </th>
              <th class=" bg-white-700  w-1/4">
                <div
                  class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
                >
                  <span class="font-semibold uppercase text-xs text-black-700">
                    Name
                  </span>
                </div>
              </th>
              <th class="bg-white-700  w-1/4">
                <div
                  class="flex items-center justify-center space-x-1 bg-red-70 rounded-full"
                >
                  <span class="font-semibold uppercase text-xs text-black-700">
                    Route 
                  </span>
                  <div class="flex flex-col">
                    <button
                      class="h-3 bg-transparent transform scale-75"
                      on:click={() => sortTable("route", "asc")}
                    >
                      <span
                        class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
                        class:shrink={shrinkID === "routeasc"}>▲</span
                      >
                    </button>
                    <button
                      class="bg-transparent transform scale-75"
                      on:click={() => sortTable("route", "desc")}
                    >
                      <span
                        class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
                        class:shrink={shrinkID === "routedesc"}>▼</span
                      >
                    </button>
                  </div>
                </div></th>
                <th class=" bg-white-700  w-1/4">
                  <div
                    class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
                  >
                    <span class="font-semibold uppercase text-xs text-black-700">
                      Phone
                    </span>
                  </div>
                </th>
          </tr>
          {:else}
          <tr>
            
            <th class=" bg-white-700  w-1/4">
              <div
                class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
              >
                <span class="font-semibold uppercase text-xs text-black-700">
                  Name
                </span>
              </div>
            </th>
              <th class=" bg-white-700  w-1/4">
                <div
                  class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
                >
                  <span class="font-semibold uppercase text-xs text-black-700">
                    Department
                  </span>
                </div>
              </th>

              <th class=" bg-white-700  w-1/4">
                <div
                  class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
                >
                  <span class="font-semibold uppercase text-xs text-black-700">
                    Designation
                  </span>
                </div>
              </th>
              
                <th class=" bg-white-700  w-1/4">
                  <div
                    class="py-2 flex items-center justify-center space-x-1 bg-red-70 rounded-full"
                  >
                    <span class="font-semibold uppercase text-xs text-black-700">
                      Phone
                    </span>
                  </div>
                </th>
          </tr>
          {/if}
        </thead>

        <tbody>
          <!-- Dynamic rows -->
          {#each searchRows as row, index}
          {#if index >= (currentPage - 1) * Number(entriesPerPage) && index < currentPage * Number(entriesPerPage)}
          <tr
            class="{index % 2 === 0
              ? 'bg-gray-200'
              : 'bg-white-700'} hover:bg-gray-300">
              {#if selectedRole === 'student'}
              <td class="py-2 pl-2 pr-2 text-center w-1/4">{row.id}
              </td>
              <td class="py-2 pl-2 pr-2 text-center w-1/4">{row.name}
              </td>
              <td class="py-2 pl-2 pr-2 text-center w-1/4">{row.route}
              </td>
              <td class="py-2 pl-2 pr-2 text-center w-1/4">{row.phone}
              </td>
              {:else}
              <td class="py-2 pl-2 pr-2 text-center w-1/4">{row.name}
              </td>
              <td class="py-2 pl-2 pr-2 text-center w-1/4">{row.department}
              </td>
              <td class="py-2 pl-2 pr-2 text-center w-1/4">{row.designation}
              </td>
              <td class="py-2 pl-2 pr-2 text-center w-1/4">{row.phone}
              </td>
              {/if}
              
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
