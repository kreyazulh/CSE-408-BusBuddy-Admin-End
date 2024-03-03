<script>
      import Navbar from '../GlobalComponents/navbar.svelte';
  import { isAuthenticated } from '../../auth';
  import { navigate } from 'svelte-routing';
  import { onMount } from "svelte";
  import ErrorPopUp from '../GlobalComponents/PopUps/errorPopUp.svelte';
  import SuccessfulPopUp from "../GlobalComponents/PopUps/successfulPopUp.svelte";
    
    let staffList = [];
    let searchRows = [];


      // Pagination data
  let totalEntries = 0;
  let entriesPerPage = "10";
  let currentPage = 1;
  let totalPages = 0;


   // Function to handle the entry per page functionality
   function handleEntriesPerPage() {
    currentPage = 1;
    totalPages = Math.ceil(totalEntries / Number(entriesPerPage));
  }
  
    // Other variables and functions remain unchanged...
  
    async function getStaffList() {
      const response = await fetch('http://localhost:3000/api/billing/buet_staff');
      if (response.ok) {
        const data = await response.json();
        staffList = data.map((staff) => ({
          id: staff.id,
          name: staff.name,
          residence: staff.residence || "N/A",
          phone: staff.phone,
          designation: staff.designation,
          pending: staff.pending , // Assuming 'pending' is a boolean
        }));
        searchRows = staffList;
        totalEntries = searchRows.length;
        handleEntriesPerPage();
      } else {
        console.error("Failed to fetch staff list");
      }
    }

    async function sendBulkNotifications() {
    const pendingStaff = staffList.filter(staff => staff.pending > 0);
    
    for (const staff of pendingStaff) {
        await sendNotification(staff.id, staff.name); // Reuse the sendNotification function
    }

    console.log("Bulk notifications sent successfully.");
}

    async function sendNotification(staffId, staffName) {
  const notificationMessage = `Reminder: You have pending payment. Please check your dashboard.`;
  try {
    const notificationResponse = await fetch('http://localhost:3000/api/proxyPersonalNotification', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({

        nTitle: "Pending Payment",
        userId: staffId, // Use the staff ID for identifying the user for the notification
        message: notificationMessage,
      }),
    });

    if (notificationResponse.ok) {
      console.log(`Notification sent successfully to ${staffName}`);
    } else {
      console.error(`Failed to send notification to ${staffName}`);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
  
    onMount(async() => {
      await getStaffList();
    });
  
  </script>


<main class="flex w-full">
    <div>
      <Navbar />
    </div>
  
    <!-- Heading -->
    <div class="flex-1 ml-56 w-full px-4 py-8 bg-white-700">

        <div class="flex justify-between items-center mb-4">
            <h1 class="text-3xl font-bold underline uppercase text-maroon-500">BUET Staff List</h1>
            <button 
              on:click={sendBulkNotifications} 
              class="py-2 px-4 bg-maroon-900 hover:bg-green-700 text-white-700 font-bold rounded"
            >
              Send Bulk Notifications
            </button>
          </div>
    <table class="w-full table-auto">
      <!-- Table header -->
      <thead>
        <tr>
          <th class="bg-white-700 w-auto">ID</th>
          <th class="bg-white-700 w-auto">Name</th>
          <th class="bg-white-700 w-auto">Residence</th>
          <th class="bg-white-700 w-auto">Phone</th>
          <th class="bg-white-700 w-auto">Designation</th>
          <th class="bg-white-700 w-auto">Pending</th>
        </tr>
      </thead>
      <tbody>
        <!-- Dynamic rows for staff data -->
        {#each searchRows as row, index (row.id)}
        {#if index >= (currentPage - 1) * Number(entriesPerPage) && index < currentPage * Number(entriesPerPage)}
          <tr class:pending-no={row.pending === 0} class:pending-yes={row.pending !== 0}>
            <tr class="{index % 2 === 0 ? 'bg-gray-200' : 'bg-white-700'} hover:bg-gray-300">
              <td class="py-2 pl-2 pr-2 text-center w-auto">{row.id}</td>
              <td class="py-2 pl-2 pr-2 text-center w-auto">{row.name}</td>
              <td class="py-2 pl-2 pr-2 text-center w-auto">{row.residence}</td>
              <td class="py-2 pl-2 pr-2 text-center w-auto">{row.phone}</td>
              <td class="py-2 pl-2 pr-2 text-center w-auto">{row.designation}</td>
              <td class="py-2 pl-2 pr-2 text-center w-auto">{row.pending}</td>
              {#if row.pending > 0}
              <td>
                <button on:click={() => sendNotification(row.id, row.name)} class="py-2 px-4 bg-blue-500 hover:bg-lime-500 text-white font-bold rounded">
                  Send Notification
                </button>
              </td>
            {:else}
              <td>---</td>
            {/if}
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>
</main>

  