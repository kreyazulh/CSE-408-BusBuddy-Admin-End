<script>
  import "../tailwind.css";
  import {Link, navigate } from 'svelte-routing';
  import { isAuthenticated, checkSession } from '../auth';
  import { onMount } from 'svelte';

  let dropdowns = [];

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

onMount(() => {
        checkSession();
    });


</script>

<!-- component -->
<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css" />

<div class="min-h-screen flex flex-row bg-white-700">
  <div class="flex flex-col w-56 bg-maroon-500 rounded-r-3xl overflow-hidden h-full postion: fixed">
    <div class="flex items-center justify-center h-20 shadow-md">
      <h1 class="text-3xl uppercase text-white-700">Admin</h1>
    </div>
    <ul class="flex flex-col py-4">
      <li>
        <Link to="/profile" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-maroon-900">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-home"></i></span>
          <span class="text-xs font-medium">Profile</span>
        </Link>
      </li>
      <li>
        <Link to="/feedback" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-maroon-900">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-group"></i></span>
          <span class="text-xs font-medium">Feedback</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black">5</span>
        </Link>
      </li>
      <li>
        <Link to="/requisition" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-maroon-900">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-note"></i></span>
          <span class="text-xs font-medium">Requisition</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black">1</span>
        </Link>
      </li>
      <li>
        <Link to="\trackingHistory" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-maroon-900 ">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-history"></i></span>
          <span class="text-xs font-medium">Tracking history</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black">7</span>
        </Link>
      </li>
      <li>
        <Link to="/allocateRoute" class="Link flex flex-row items-center h-10 transform hover:translate-x-1.5 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:translate-y-0.5 focus:shadow focus-bg-maroon-900">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-map-alt"></i></span>
          <span class="text-xs font-medium">Route Allocation</span>
        </Link>
      </li>
      <li>
        <Link to="/UserList" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-maroon-900 ">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-user-plus"></i></span>
          <span class="text-xs font-medium">User List</span>
        </Link>
      </li>
      <li>
        <Link to="/busStaffList" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-maroon-900 ">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-spreadsheet"></i></span>
          <span class="text-xs font-medium">Bus Staff List</span>
        </Link>
      </li>
      <li>
        <Link to="/busList" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-maroon-900 ">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-bus"></i></span>
          <span class="text-xs font-medium">Bus Details</span>
        </Link>
      </li>
      <li>
        <Link to="/billingHistory" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-maroon-900 ">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-list-check"></i></span>
          <span class="text-xs font-medium">Billing history</span>
        </Link>
      </li>
      <li>
        <Link to="/inventory" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-maroon-900 ">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-cart-alt"></i></span>
          <span class="text-xs font-medium">Inventory</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black">2</span>
        </Link>
      </li>
    </ul>
    <!-- Logout link -->
    <button on:click={logout} class="mt-auto mb-8 flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-white-700 focus:shadow focus:text-white-700 focus:bg-maroon-900 ">
        <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-log-out"></i></span>
        <span class="text-xs font-medium">Logout</span>
    </button>
  </div>
</div>
