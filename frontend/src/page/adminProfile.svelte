<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from '../auth';
    import Navbar from './navbar.svelte';
    import BarChart from './BarChart.svelte';


    // Import any required components or functions
    let admin = {id: '', password: '', email: '', photo: ''};
    let pastTrips = [];


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


    
    // Fetch admin details
    async function fetchAdminDetails() {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/profile`, {
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

    async function lastTrips() {
        try {
            const response = await fetch(`http://localhost:3000/api/admin//trips/last7days`, {
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
    });

    $: if (pastTrips.length > 0) {
    updateChartData();
  }

  </script>

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
          <h2 class="text-xl font-bold">5600</h2>
        </div>

        <!-- Users Today Widget -->
        <div class="bg-white p-4 rounded-lg shadow">
          <span class="text-gray-500">Users Today</span>
          <h2 class="text-xl font-bold">2353</h2>
        </div>

        <!-- Trips Completed Today Widget -->
        <div class="bg-white p-4 rounded-lg shadow">
          <span class="text-gray-500">Trips Completed Today</span>
          <h2 class="text-xl font-bold">21/24</h2>
        </div>

        <!-- Duration Dropdown (Placeholder) -->
        <div class="bg-white p-4 rounded-lg shadow">
          <label for="duration" class="block mb-2 text-sm font-medium text-gray-900">Duration</label>
          <select id="duration" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <option selected>All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <!-- Analytics Chart (Placeholder) -->
      <div class="p-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="h-4">Analytics Chart</div>
        <div class="w-2/5">
          <BarChart {data} {options} />
        </div>
        </div>
      </div>

      <!-- Ticket Transactions -->
      <div class="p-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="font-bold mb-2">Ticket Transactions</h2>
          <!-- Ticket Transactions Table -->
          <!-- ... -->
        </div>
      </div>

      <!-- Live Car Status -->
      <div class="p-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="font-bold mb-2">Live Car Status</h2>
          <!-- Live Car Status Table -->
          <!-- ... -->
        </div>
      </div>

      <!-- Change Username or Password Button -->
      <div class="p-4">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Change Username or Password
        </button>
      </div>
    </div>
  </div>
</div>

  
  <style>
    /* Add custom styles or overrides for Tailwind CSS here */
  </style>
  