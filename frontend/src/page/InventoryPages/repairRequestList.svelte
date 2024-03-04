<script>
    import { onMount } from "svelte";
    import Navbar from "../GlobalComponents/navbar.svelte";
    import PaginationFooter from "../GlobalComponents/Pagination/paginationFooter.svelte";
    import { navigate } from "svelte-routing";
    
    let repairRequests = [];
    let totalEntries = 0;
    let entriesPerPage = "10";
    let currentPage = 1;
    let totalPages = 0;
  
    async function fetchRepairRequests() {
      const response = await fetch('http://localhost:3000/api/billing/repairRequests');
      if (response.ok) {
        const data = await response.json();
        repairRequests = data.map(request => ({
        id: request.id,
          requestor: request.requestor,
          bus: request.bus,
          parts: request.parts,
          timestamp: new Date(request.timestamp).toLocaleString(),
          is_repaired: request.is_repaired ? 'Yes' : 'No',
          missing_items: request.missing===null ? '--' : request.missing
        }));
        totalEntries = repairRequests.length;
        totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
      } else {
        console.error("Failed to fetch repair requests");
      }
    }

    // Function to show the details of a row
         function showDetails(id) {
      navigate(`/requestDetails?reqID=${id}`);
    }
  
    onMount(() => {
      fetchRepairRequests();
    });
  </script>
  
  <main class="flex w-full">
    <Navbar />
    
    <!-- Rest of the page content -->
    <div class="flex-1 ml-56 w-full px-4 py-8 bg-white-700">
      <h1 class="text-3xl font-bold underline uppercase text-maroon-500">Repair Requests</h1>
  
      <!-- Table -->
      <div class="bg-white-700 shadow-md my-3 overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="text-left">
              <th>Requestor</th>
              <th>Bus</th>
              <th>Parts</th>
              <th>Timestamp</th>
              <th>Is Repaired</th>
              <th>Items Missing</th>
            </tr>
          </thead>
          <tbody>
            {#each repairRequests as request, index}
              {#if index >= (currentPage - 1) * Number(entriesPerPage) && index < currentPage * Number(entriesPerPage)}
                <tr class="{index % 2 === 0 ? 'bg-gray-200' : 'bg-white-700'}">
                  <td>{request.requestor}</td>
                  <td>{request.bus}</td>
                  <td>{request.parts}</td>
                  <td>{request.timestamp}</td>
                  <td>{request.is_repaired}</td>
                    <td>{request.missing}</td>

                  <td class="my-2 mx-2 w-auto">
                    <div class="flex justify-center w-full">
                      <button class="bg-transparent mx-2" on:click={() => showDetails(request.id)} >
                        <i class="bx bxs-info-circle text-maroon-500 hover:text-maroon-900 scale-150"></i>
                      </button>
                        <button class="bg-transparent mx-2" >
                          <i class="bx bxs-edit text-maroon-500 hover:text-maroon-900 scale-150"></i>
                        </button>
                        <button class="bg-transparent mx-2" >
                          <i class="bx bxs-trash text-maroon-500 hover:text-maroon-900 scale-150"></i>
                        </button>
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