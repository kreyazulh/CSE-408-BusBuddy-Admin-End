<script>
  import { onMount } from 'svelte';
  import Navbar from './navbar.svelte';
  import { checkSession, isAuthenticated } from '../auth';
  import { navigate } from 'svelte-routing';

  let bus_staffs = [];

  async function getBusStaffList() {
    const response = await fetch('http://localhost:3000/api/bus_staff');
    bus_staffs = await response.json();
  }
  
  onMount(async() => {
    const initialIsAuthenticated = await checkSession();
    isAuthenticated.set(initialIsAuthenticated);
    getBusStaffList();
  });
</script>

{#if $isAuthenticated}
  <main class="flex">
    <div class="w-fit">
      <Navbar />
    </div>
    <div class="mx-auto max-w-lg">
      <h1 class="text-4xl font-bold mb-4 text-blue-600">Bus Staff List</h1>
      
      {#if bus_staffs.length > 0}
        {#each bus_staffs as { id, name, department, designation, residence, phone }}
          <div class="bg-gray-100 rounded-md p-4 mb-4">
            <div class="flex items-center justify-between mb-2">
              <p class="text-lg font-semibold">ID: {id}</p>
              <p class="text-lg font-semibold">Name: {name}</p>
            </div>
            <div class="flex items-center justify-between mb-2">
              <p class="text-gray-600">Department: {department}</p>
              <p class="text-gray-600">Designation: {designation}</p>
            </div>
            <div class="flex items-center justify-between mb-2">
              <p class="text-gray-600">Residence: {residence}</p>
              <p class="text-gray-600">Phone: {phone}</p>
            </div>
          </div>
        {/each}
      {:else}
        <div class="bg-gray-100 rounded-md p-4 mb-4">
          <p class="text-gray-800">You need to login first</p>
          <a href="/login" class="text-blue-500 underline">Log In</a>
        </div>
      {/if}
    </div>
  </main>
{/if}