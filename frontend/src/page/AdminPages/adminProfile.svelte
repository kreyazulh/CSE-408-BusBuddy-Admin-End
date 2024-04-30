<script>
    import { onMount, onDestroy } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from '../../auth';
    import Navbar from '../GlobalComponents/navbar.svelte';
    import BarChart from '../GlobalComponents/Charts/BarChart.svelte';
    import PieChart from '../GlobalComponents/Charts/PieChart.svelte';


    // Import any required components or functions
    let admin = {id: '', password: '', email: '', photo: ''};
    let pastTrips = [];

    let upcomingTrips = [];
  let timer;

  async function fetchUpcomingTrips() {
    const response = await fetch('/api/admin/upcomingTripsTime');
    if (response.ok) {
      upcomingTrips = await response.json();
      upcomingTrips.forEach(trip => {
        trip.countdown = formatTime(trip.seconds_until_start);
      });
    }
  }
  console.log(upcomingTrips);

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }


  let chartData = {
    labels: [],
    datasets: [
      {
        label: 'Trip Count',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  let options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true, // Set to `true` to display the title
        text: 'Trips in the Last 7 Days' // Title text
      }
    }
  };

  let data;
  let pieData;

    
    // Fetch admin details
    async function fetchAdminDetails() {
        try {
            const response = await fetch(`/api/admin/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            let data = await response.json();
            admin = data;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    let topPassengerCounts = [];

    let isExpanded = false;

// Function to toggle the expanded state
function toggleExpand() {
  isExpanded = !isExpanded;
}

let isExpandedUp = false;

function toggleExpandUpcoming() {
    isExpandedUp = !isExpandedUp;
  }

async function fetchTopPassengerCounts() {
    try {
        const response = await fetch(`/api/admin/trips/topYesterday`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        topPassengerCounts = await response.json();
    } catch (error) {
        console.error('Error fetching top passenger counts:', error);
    }
}

let userCounts = { students: 0, busStaff: 0, buetStaff: 0 };

async function fetchUserCounts() {
    try {
        const response = await fetch(`/api/admin/counts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        userCounts = await response.json();
        console.log(userCounts);
      pieData = {
      labels: ['Students', 'Bus Staffs', 'Buet Staffs'],
      datasets: [{
        data: [parseInt(userCounts.studentCount, 10), parseInt(userCounts.busStaffCount, 10), parseInt(userCounts.buetStaffCount, 10)], // Example data
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1
    }]
};

    } catch (error) {
        console.error('Error fetching user counts:', error);
    }
}

let ticketCounts = { tickets: 0 };

async function fetchTicketCounts() {
    try {
        const response = await fetch(`/api/admin/tickets`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        ticketCounts = await response.json();
        console.log(ticketCounts);
    } catch (error) {
        console.error('Error fetching ticket counts:', error);
    }
};

let tripStats = { liveTripsCount: 0, upcomingTripsCount: 0 };

async function fetchTripStats() {
    try {
        const response = await fetch(`/api/admin/trips/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        tripStats = await response.json();
        console.log(tripStats);
    } catch (error) {
        console.error('Error fetching trip statistics:', error);
    }
}

let totalBuses = 0;

async function fetchBuses() {
  try {
    const response = await fetch('/api/bus'); // Adjust the URL to match your actual endpoint
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    totalBuses = data.length; // Assuming the response is an array of buses
  } catch (error) {
    console.error('Error fetching buses:', error);
  }
}




    async function lastTrips() {
        try {
            const response = await fetch(`/api/admin/trips/last7days`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            let infodata = await response.json();
            pastTrips = infodata;
            console.log(pastTrips);

            updateChartData();


            
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function updateChartData() {
      chartData.labels = pastTrips.map(trip =>
  new Date(trip.trip_date).toLocaleDateString('en-US', {
    month: 'short', // "short" for abbreviated month name, "numeric" for month number.
    day: 'numeric' // "numeric" for the day of the month.
  })
);

        chartData.datasets[0].data = pastTrips.map(trip => trip.trip_count);
        data = chartData;
        console.log("data", data);
    }

    onMount(async () => {
        fetchAdminDetails();
        lastTrips(); 
        fetchTopPassengerCounts();
        fetchUserCounts();
        fetchTicketCounts();
        fetchTripStats();
        fetchBuses();
        fetchUpcomingTrips();
    timer = setInterval(fetchUpcomingTrips, 60000); // Update every minute
    });

    $: if (pastTrips.length > 0) {
    updateChartData();
  }

  onDestroy(() => {
    clearInterval(timer);
  });

  </script>

<link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">

<div class="flex min-h-screen min-w-full">
  
    <div>
      <Navbar />
    </div>

  <div class="flex min-w-full">
    <!-- Sidebar -->
    <aside class="w-64" aria-label="Sidebar">
      <!-- Sidebar content here -->
    </aside>

    <!-- Main content -->
    <div class="flex-1">
      <!-- Admin Info -->
      <div class="p-4">
        <div class="flex items-center space-x-4">
          <img src={admin.photo} alt="Admin Photo" class="w-10 h-10 rounded-full">
          <div>
            <h1 class="font-bold">{admin.id}</h1>
            <p>{admin.email}</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Widgets -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
<!-- Total Users Widget -->
<div class="bg-white p-4 rounded-lg shadow">
  <span class="text-gray-500">Total Users</span>
  <div class="text-xl font-bold">
    <p>{
      parseInt(userCounts.studentCount, 10) +
      parseInt(userCounts.busStaffCount, 10) +
      parseInt(userCounts.buetStaffCount, 10)
    }</p>
  </div>
</div>

        <!-- Users Today Widget -->
        <div class="bg-white p-4 rounded-lg shadow">
          <span class="text-gray-500">Tickets Sold</span>
          <h2 class="text-xl font-bold">{ticketCounts.ticketCount}</h2>
        </div>

        <!-- Trips Completed Today Widget -->
        <div class="bg-white p-4 rounded-lg shadow">
          <span class="text-gray-500">Total Buses</span>
          <h2 class="text-xl font-bold">{totalBuses}</h2>
        </div>

        <!-- Duration Dropdown (Placeholder) -->
        <div class="bg-white p-4 rounded-lg shadow">
          <label for="duration" class="block mb-2 text-sm font-medium text-gray-900">Duration</label>
          <select id="duration" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <option selected>All Time</option>
            <option value="week">Active</option>
          </select>
        </div>
      </div>

<!-- Analytics Chart -->
<div class="p-4">
  <div class="bg-white p-4 rounded-lg shadow flex">
    <div class="w-2/5">
      <BarChart {data} {options} />
    </div>
    <div class="flex-none w-1/5"> <!-- Spacer div -->
      <!-- This is an empty div used as a spacer -->
    </div>
    <div class="w-1/4">
      <PieChart {pieData} />
    </div>
  </div>
</div>


<div class="p-4">
  <div class="bg-white p-4 rounded-lg shadow">
    <h2 class="mb-4 text-gray-500">Today's Upcoming Trips</h2>
    {#if upcomingTrips.length > 0}
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium text-gray-900">Route</th>
              <th class="px-6 py-3 text-left font-medium text-gray-900">Bus Number</th>
              <th class="px-6 py-3 text-left font-medium text-gray-900">Travel Direction</th>
              <th class="px-6 py-3 text-left font-medium text-gray-900">Leaves in</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            {#each upcomingTrips as trip, index}
              {#if index < 8 || isExpandedUp}
                <tr>
                  <td class="px-6 py-4">{trip.terminal_point}</td>
                  <td class="px-6 py-4">{trip.bus}</td>
                  <td class="px-6 py-4">
                    <i class={`bx ${trip.travel_direction === 'from_buet' ? 'bx-exit' : 'bx-home'} mr-2`}></i>
                    {trip.travel_direction === 'from_buet' ? 'Leaving BUET' : 'Coming to BUET'}
                  </td>
                  <td class="px-6 py-4">{trip.countdown}</td>
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
        {#if upcomingTrips.length > 8}
          <div class="flex justify-center mt-4">
            <button class="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300" on:click={toggleExpandUpcoming}>
              <span>Show {isExpandedUp ? 'Less' : 'More'}</span>
              <i class={`bx ${isExpandedUp ? 'bx-chevron-up' : 'bx-chevron-down'} ml-2`}></i>
            </button>
          </div>
        {/if}
      </div>
    {:else}
      <p>No trips are scheduled for today.</p>
    {/if}
  </div>
</div>



<div class="p-4">
  <div class="bg-white p-4 rounded-lg shadow">
    <h2 class="mb-4 text-gray-500">Passenger Count from Previous Day</h2>
    {#if topPassengerCounts.length > 0}
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium text-gray-900">Route</th>
              <th class="px-6 py-3 text-left font-medium text-gray-900">Shift</th>
              <th class="px-6 py-3 text-left font-medium text-gray-900">Passenger Count</th>
              <th class="px-6 py-3 text-left font-medium text-gray-900">Bus Capacity</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            {#each topPassengerCounts as {terminal_point, time_type, passenger_count, capacity}, index}
              {#if index < 3 || isExpanded}
                <tr>
                  <td class="px-6 py-4">{terminal_point}</td>
                  <td class="px-6 py-4">{time_type}</td>
                  <td class="px-6 py-4 flex items-center">
                    <i class='bx bx-user mr-2 {passenger_count > capacity ? "text-red-500" : "text-green-500"}'></i>
                    <span class="{passenger_count > capacity ? 'text-red-500' : 'text-green-500'}">
                      {passenger_count}
                    </span>
                  </td>
                  <td class="px-6 py-4">{capacity}</td>
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
        {#if topPassengerCounts.length > 3}
          <div class="flex justify-center mt-4">
            <button class="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300" on:click={toggleExpand}>
              <span>Show {isExpanded ? 'Less' : 'More'}</span>
              <i class={`bx ${isExpanded ? 'bx-chevron-up' : 'bx-chevron-down'} ml-2`}></i>
            </button>
          </div>
        {/if}
      </div>
    {:else}
      <p>No data available for yesterday.</p>
    {/if}
  </div>
</div>

      
      

      <!-- Live Car Status -->
      <div class="p-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="font-bold mb-2">Live Status</h2>
          <p>Live Trips Count: {tripStats.liveTripsCount}</p>
          <p>Upcoming Trips Count: {tripStats.upcomingTripsCount}
            {#if tripStats.upcomingTripsCount === 0}
              <i class='bx bx-error text-red-500'></i> 
            {/if}
          </p>
        </div>
      </div>

      <!-- Change Username or Password Button -->
      <div class="p-4">
        <button class="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
          Change Username or Password
        </button>
      </div>
    </div>
  </div>
</div>

  
  <style>
    /* Add custom styles or overrides for Tailwind CSS here */
  </style>
  