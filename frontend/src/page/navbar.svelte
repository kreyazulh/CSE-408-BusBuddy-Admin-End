<script>
  import { navigate } from 'svelte-routing';
  import { isAuthenticated, checkSession } from '../auth';
  import { onMount } from 'svelte';


// Logout function
const logout = async () => {
 // Make API request to your backend for logout
        const response = await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (data.status === 'success') {
            isAuthenticated.set(false);
            console.log(isAuthenticated);
            navigate('/login');
        } else {
            // Handle logout failure
        }
    };

let bus_staffs = [];

async function allocateRoute() {
  navigate('/allocateRoute');
}

async function getBusStaffList() {
  navigate('/busStaffList');
}

onMount(() => {
        checkSession();
    });


</script>

<!-- component -->
<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css" />

<div class="min-h-screen flex flex-row bg-white">
  <div class="flex flex-col w-56 bg-maroon text-white rounded-r-3xl overflow-hidden">
    <div class="flex items-center justify-center h-20 shadow-md">
      <h1 class="text-3xl uppercase text-white-700">Admin</h1>
    </div>
    <ul class="flex flex-col py-4">
      <li>
        <a href="#" class="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-home"></i></span>
          <span class="text-xs font-medium">Profile</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-group"></i></span>
          <span class="text-xs font-medium">Feedback</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black-700">5</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-note"></i></span>
          <span class="text-xs font-medium">Requisition</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black-700">1</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-history"></i></span>
          <span class="text-xs font-medium">Tracking history</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black-700">7</span>
        </a>
      </li>
      <li>
        <button on:click={allocateRoute} class="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-map-alt"></i></span>
          <span class="text-xs font-medium">Route Allocation</span>
        </button>
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-user-plus"></i></span>
          <span class="text-xs font-medium">User List</span>
        </a>
      </li>
      <li>
        <button on:click={getBusStaffList} class="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-spreadsheet"></i></span>
          <span class="text-xs font-medium">Bus Staff List</span>
        </button>
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-bus"></i></span>
          <span class="text-xs font-medium">Bus Details</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-list-check"></i></span>
          <span class="text-xs font-medium">Billing history</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-cart-alt"></i></span>
          <span class="text-xs font-medium">Inventory</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black-700">2</span>
        </a>
      </li>
    </ul>
    <!-- Logout link -->
    <button on:click={logout} class="mt-auto mb-8 flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-gray-100 focus:bg-opacity-20">
        <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-log-out"></i></span>
        <span class="text-xs font-medium">Logout</span>
    </button>
  </div>
</div>
