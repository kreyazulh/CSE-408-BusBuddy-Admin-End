<script>
    import Navbar from './navbar.svelte';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
  
    let liveTrips = [];
  
    onMount(async () => {
      try {
        const response = await fetch('http://localhost:3000/api/trip/liveTrips');
        if (!response.ok) {
          throw new Error('Error fetching live trips');
        }
        liveTrips = await response.json();
        console.log(liveTrips);
      } catch (error) {
        console.error('Error:', error);
      }
    });
  </script>
  
  <main class="flex">
    <div class="z-10">
      <Navbar />
    </div>
  
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold text-center mb-4">Live Trips</h1>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white divide-y divide-gray-200 shadow-md rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trip ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each liveTrips as trip}
  <tr>
    <td class="px-6 py-4 whitespace-nowrap">
      {trip.id}
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      {trip.start_timestamp} <!-- Format as needed -->
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      {trip.route}
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      {trip.is_live ? 'Live' : 'Not Live'} <!-- Adjust according to your data structure -->
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button 
        class="text-indigo-600 hover:text-indigo-900" 
        on:click={() => navigate(`/liveTrack?tripId=${trip.id}`)}>
        Track
      </button>
    </td>
  </tr>
{/each}
          </tbody>
        </table>
      </div>
    </div>
  </main>
  
  <style>
    /* You can add additional custom styles here */
  </style>