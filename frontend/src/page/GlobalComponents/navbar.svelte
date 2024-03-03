<script>
  import {Link, navigate } from 'svelte-routing';
  import { isAuthenticated, checkSession } from '../../auth';
  import { onMount } from 'svelte';

  let dropdowns = new Set();

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

function toggleDropDown(action) {
  if (dropdowns.has(action)) {
    dropdowns.delete(action);
  } else {
    dropdowns.add(action);
  }
  // To force Svelte to update the DOM immediately
  dropdowns = new Set(dropdowns);
}

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
        <Link to="/profile" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-home"></i></span>
          <span class="text-xs font-medium">Profile</span>
        </Link>
      </li>
      <li class="relative">
        <button on:click={() => toggleDropDown('Directory')}
          class="flex flex-row items-center h-10 w-full transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-book-open"></i></span>
          <span class="text-xs font-medium">Directory  ▼</span>
        </button>
        {#if dropdowns.has('Directory')}
          <ul class="w-full z-10 flex flex-col bg-maroon-900 transition-transform ease-in-out duration-200">
            <li>
              <Link to="/userList" class="Link translate-x-5 flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5 ">
                <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-user-plus"></i></span>
                <span class="text-xs font-medium">User List</span>
              </Link>
            </li>
            <li>
              <Link to="/busStaffList" class="Link translate-x-5 flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5 ">
                <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-user-detail"></i></span>
                <span class="text-xs font-medium">Bus Staff List</span>
              </Link>
            </li>
            <li>
              <Link to="/busList" class="Link translate-x-5 flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5 ">
                <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-bus"></i></span>
                <span class="text-xs font-medium">Bus List</span>
              </Link>
            </li>
            <li>
              <Link to="/routeList" class="Link translate-x-5 flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5 ">
                <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-map-alt"></i></span>
                <span class="text-xs font-medium">Route List</span>
              </Link>
            </li>
          </ul>
        {/if}
      </li>
      <li>
        <Link to="/routeAllocation" class="Link flex flex-row items-center h-10 transform hover:translate-x-1.5 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:translate-y-0.5 focus:shadow focus-bg-maroon-900">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-directions"></i></span>
          <span class="text-xs font-medium">Route Allocation</span>
        </Link>
      </li>
      <li>
        <Link to="/scheduleTrip" class="Link flex flex-row items-center h-10 transform hover:translate-x-1.5 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:translate-y-0.5 focus:shadow focus-bg-maroon-900">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-table"></i></span>
          <span class="text-xs font-medium">Schedule Trip</span>
        </Link>
      </li>
      <li class="relative">
        <button on:click={() => toggleDropDown('Trips')}
          class="flex flex-row items-center h-10 w-full transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-trip"></i></span>
          <span class="text-xs font-medium">Trips  ▼</span>
        </button>
        {#if dropdowns.has('Trips')}
          <ul class="w-full z-10 flex flex-col bg-maroon-900 transition-transform ease-in-out duration-200">
            <li>
              <Link to="/upcomingTrips" class="Link translate-x-5 flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5">
                <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-calendar-plus"></i></span>
                <span class="text-xs font-medium">Upcoming Trips</span>
              </Link>
            </li>
            <li>
              <Link to="/pastTrips" class="Link translate-x-5 flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5 ">
                <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-history"></i></span>
                <span class="text-xs font-medium">Past Trips</span>
              </Link>
            </li>
            <li>
              <Link to="/showLive" class="Link translate-x-5 flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5 ">
                <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-map"></i></span>
                <span class="text-xs font-medium">Live Tracking</span>
                <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black-900">7</span>
              </Link>
            </li>
          </ul>
        {/if}
      </li>
      <li>
        <Link to="/notifications" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-comment-add"></i></span>
          <span class="text-xs font-medium">Notify</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black-900">1</span>
        </Link>
      </li>
      <li>
        <Link to="/feedbackList" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-group"></i></span>
          <span class="text-xs font-medium">Feedback</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black-900">5</span>
        </Link>
      </li>
      <li>
        <Link to="/requisitionList" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-mail-send"></i></span>
          <span class="text-xs font-medium">Requisition</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black-900">1</span>
        </Link>
      </li>
      <li>
        <Link to="/billingList" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5 ">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-dollar"></i></span>
          <span class="text-xs font-medium">Billing history</span>
        </Link>
      </li>
      <li>
        <Link to="/inventory" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5 ">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-cart-alt"></i></span>
          <span class="text-xs font-medium">Inventory</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black-900">2</span>
        </Link>
      </li>
      <li>
        <Link to="/bulletine" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5 ">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-receipt"></i></span>
          <span class="text-xs font-medium">Notice</span>
        </Link>
      </li>
      <li>
        <Link to="/assignmentmhb" class="Link flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5 ">
          <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bxs-cart-alt"></i></span>
          <span class="text-xs font-medium">Assignment</span>
          <span class="ml-auto mr-6 text-xs bg-red-100 rounded-full px-3 py-px text-black-900">2</span>
        </Link>
      </li>
    </ul>
    <!-- Logout link -->
    <button on:click={logout} class="mt-auto mb-8 flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-300 hover:text-white-700 focus:shadow focus:text-white-700 focus:translate-y-0.5 ">
        <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-white-700"><i class="bx bx-log-out"></i></span>
        <span class="text-xs font-medium">Logout</span>
    </button>
  </div>
</div>

