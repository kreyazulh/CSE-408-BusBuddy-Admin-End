<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from '../auth';
    import Navbar from './navbar.svelte';
    // Import any required components or functions
    let admin = {id: '', password: '', email: '', photo: ''};
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

    onMount(async () => {
        fetchAdminDetails();
    });

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
          <!-- Replace this div with your actual chart component -->
          <div class="h-64">Analytics Chart</div>
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
  