<script>
    // You can import your navbar here
    import Navbar from './navbar.svelte';
  
    // Example user data
    let user = {
      id: '0546',
      dateSinceService: '12 April 2013',
      phone: '01616413392',
      address: 'BUET Staff Quarter, Dhakeshwari',
      licenseNo: '2021-22',
      dob: '13 August 1975',
      upcomingTrips: [
        { time: '19 Dec, 2023, 8:58 am', tripId: '006674328', pickup: 'Mohammadpur', destination: 'BUET', busId: '34-8934' },
        // ... more trips
      ],
      recentTrips: [
        { time: '13 Dec, 2023, 8:58 am', tripId: '005388720', pickup: 'Mohammadpur', destination: 'BUET', busId: '34-8934' },
        // ... more trips
      ]
    };
  </script>
  <main class="flex">
  <div class="bg-gray-100 min-h-screen">
    <Navbar />
  </div>
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            User Profile
          </h3>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Edit Profile
          </button>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <!-- Multiple detail items -->
            {#each Object.entries(user) as [label, value]}
              {#if Array.isArray(value)} <!-- Skip arrays for special rendering -->
                
              {/if}
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  {label}
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {value}
                </dd>
              </div>
            {/each}
          </dl>
        </div>
      </div>
  
      <div class="mt-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Upcoming Trips
        </h3>
        <!-- Upcoming Trips List -->
        {#each user.upcomingTrips as trip}
          <div class="bg-white shadow overflow-hidden sm:rounded-lg mt-2">
            <div class="px-4 py-5 sm:px-6 grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Time:</p>
                <p class="mt-1 text-sm text-gray-900">{trip.time}</p>
              </div>
              <!-- More trip details -->
            </div>
          </div>
        {/each}
      </div>
  
      <div class="mt-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Recent Trips
        </h3>
        <!-- Recent Trips List -->
        {#each user.recentTrips as trip}
          <div class="bg-white shadow overflow-hidden sm:rounded-lg mt-2">
            <div class="px-4 py-5 sm:px-6 grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Time:</p>
                <p class="mt-1 text-sm text-gray-900">{trip.time}</p>
              </div>
              <!-- More trip details -->
            </div>
          </div>
        {/each}
      </div>
    </div>
  </main>
  
  <style>
    /* You can add additional custom styles here */
  </style>
  