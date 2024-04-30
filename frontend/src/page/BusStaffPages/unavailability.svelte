<script>
    import Navbar from "../GlobalComponents/navbar.svelte";
    import { onMount } from "svelte";
    import { isAuthenticated } from "../../auth";
    import { navigate } from "svelte-routing";
    import ErrorPopUp from "../GlobalComponents/PopUps/errorPopUp.svelte";
    import SuccessfulPopUp from "../GlobalComponents/PopUps/successfulPopUp.svelte";
  
    let staffId = "";
    let startDate = "";
    let endDate = "";
  
    let success = -1;
    let errorMessage = "";

    let bus_staffs = [];

    let unavailableStaffList = [];

async function fetchUnavailableStaff() {
  try {
    const response = await fetch("/api/staff/unavailableStaff"); // Adjust the endpoint as necessary
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    unavailableStaffList = data.map((staff) => ({
      ...staff,
      start_date: staff.start_date.split('T')[0], // Removes the timestamp, keeping only the date part
      end_date: staff.end_date.split('T')[0] // Same as above
    }));
    console.log(unavailableStaffList);
  } catch (error) {
    console.error("Error fetching unavailable staff:", error);
  }
}

    async function getBusStaffList() {
    const response = await fetch("/api/staff/");
    const data = await response.json();
    bus_staffs = data.map((row) => {
      return {
        id: row.id,
        name: row.name,
        role: row.role,
        phone: row.phone,
      };
    });
    console.log(bus_staffs);

  }
  
    async function submitUnavailability() {
      if (!staffId || !startDate || !endDate) {
        errorMessage = "Please fill in all fields";
        return;
      }
  
      const unavailabilityData = {
        staffId,
        startDate,
        endDate,
      };
  
      try {
        const response = await fetch("/api/staff/unavailability", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(unavailabilityData),
        });
  
        if (response.ok) {
          success = 1;
        } else {
          success = 0;
        }
      } catch (error) {
        console.error("Error:", error);
        success = 0;
      }
    }
    onMount(() => {
    getBusStaffList();
    fetchUnavailableStaff();
  });
  </script>
  
  {#if $isAuthenticated}
    <main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900">
      <Navbar />
  
      <div class="flex w-full justify-center items-center">
        <div class="w-1/2 py-5 px-5 my-10 rounded-lg shadow-lg bg-white-700">
          <h2 class="text-3xl font-bold underline uppercase text-maroon-500">
            Staff Unavailability
          </h2>
  
          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="staffId">Staff ID:</label>
            <select
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
              bind:value={staffId}
            >
              <option value="" disabled selected>Select a Bus Staff</option>
              {#each bus_staffs as staff}
                <option value={staff.id}>{staff.name}</option>
              {/each}
            </select>
          </div>
  
          <div class="flex gap-4">
            <div class="w-1/2 my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="startDate">Start Date:</label>
              <input 
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                type="date"
                bind:value={startDate}
              />
            </div>
  
            <div class="w-1/2 my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="endDate">End Date:</label>
              <input 
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                type="date"
                bind:value={endDate}
              />
            </div>
          </div>
  
          <div class="flex my-4 pt-4 justify-end pr-8">
            <button
              class="bg-maroon-500 hover:bg-maroon-900 py-3 px-8 text-white-700 font-semibold rounded-full"
              on:click={submitUnavailability}>Submit</button>
          </div>
  
          {#if errorMessage.length > 0}
            <ErrorPopUp errorMessage={errorMessage} on:closeError={() => (errorMessage = "")}/>
          {/if}
  
          {#if success == 1}
            <SuccessfulPopUp successMessage="Unavailability submitted successfully" on:closeSuccess={() => { success = -1; navigate("/busStaffList"); }}/>
          {:else if success == 0}
            <ErrorPopUp errorMessage="Failed to submit unavailability" on:closeError={() => (success = -1)}/>
          {/if}

                            <!-- Unavailable Staff List Display -->
                            {#if unavailableStaffList.length > 0}
                            <div class="mt-6">
                            <h3 class="text-xl font-bold underline uppercase text-maroon-500">Unavailable Staff</h3>
                            {#each unavailableStaffList as staff}
                                <p class="text-md font-semibold mt-2">{staff.name}: Unavailable from {staff.start_date} to {staff.end_date}</p>
                            {/each}
                            </div>
                              {/if}
        </div>
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
  