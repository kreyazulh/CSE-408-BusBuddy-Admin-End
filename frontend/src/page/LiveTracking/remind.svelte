<script>
    import { onMount } from 'svelte';
    import Navbar from '../GlobalComponents/navbar.svelte';
    import { isAuthenticated } from "../../auth";
    import { navigate } from 'svelte-routing';
  
    let overdueTrips = [];
    let loading = true;
    let error = null;
  
    async function fetchOverdueTrips() {
      try {
        const response = await fetch('/api/trip/remind');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        overdueTrips = await response.json();
        loading = false;
      } catch (err) {
        error = err.message;
        loading = false;
      }
    }
  
    onMount(() => {
      fetchOverdueTrips();
    });
  </script>
  
  {#if isAuthenticated}
    <main class="flex min-h-screen min-w-full">
      <Navbar />
  
      <div class="flex-1 ml-56 w-full px-4 py-8 bg-gray-100">
        <h1 class="text-3xl font-bold underline text-gray-800 mb-5">Remind Overdue Trips</h1>
  
        {#if loading}
          <p>Loading...</p>
        {:else if error}
          <p>Error: {error}</p>
        {:else}
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white-700 rounded-lg shadow overflow-hidden">
              <thead class="bg-maroon-500 text-white-700">
                <tr>
                  <th class="py-3 px-5 text-left">ID</th>
                  <th class="py-3 px-5 text-left">Start Timestamp</th>
                  <th class="py-3 px-5 text-left">Route</th>
                  <th class="py-3 px-5 text-left">Time Type</th>
                  <th class="py-3 px-5 text-left">Bus</th>
                  <th class="py-3 px-5 text-left">Driver</th>
                  <th class="py-3 px-5 text-left">Helper</th>
                  <th class="py-3 px-5 text-left">Overdue Seconds</th>
                </tr>
              </thead>
              <tbody class="text-gray-700">
                {#each overdueTrips as trip}
                  <tr class="border-b">
                    <td class="py-3 px-5">{trip.id}</td>
                    <td class="py-3 px-5">{new Date(trip.start_timestamp).toLocaleString()}</td>
                    <td class="py-3 px-5">{trip.route}</td>
                    <td class="py-3 px-5">{trip.time_type}</td>
                    <td class="py-3 px-5">{trip.bus}</td>
                    <td class="py-3 px-5">{trip.driver}</td>
                    <td class="py-3 px-5">{trip.helper}</td>
                    <td class="py-3 px-5">{Math.round(trip.overdue_seconds)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    </main>
  {:else}
    <div class="text-center">
      <p class="text-3xl font-bold text-red-500">Access Denied</p>
    </div>
  {/if}
  
  <style>
    /* Additional custom styles can go here */
  </style>
  