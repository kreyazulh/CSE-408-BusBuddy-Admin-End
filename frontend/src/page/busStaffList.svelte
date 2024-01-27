<script>
  import { onMount } from 'svelte';
  import Navbar from './navbar.svelte';
  import { checkSession, isAuthenticated } from '../auth';
  import { navigate } from 'svelte-routing';

  let bus_staffs = [];

  async function getBusStaffList() {
    const response = await fetch('http://localhost:3000/api/staff/');
    bus_staffs = await response.json();
  }

  async function gotoAddStaff() {
      navigate('/addStaff');
    }
  
  onMount(() => {
    getBusStaffList();
  });
</script>

{#if $isAuthenticated}
  <main class="flex">
    <div class="z-10">
      <Navbar />
    </div>
    <div class="flex-1 ml-56">
      <h1 class="text-4xl font-bold mb-4 text-blue-600">Bus Staff List</h1>
      <button type="submit" class="red-rectangular-button" on:click={gotoAddStaff}>Add Staff</button>
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
      {/if}
    </div>
  </main>
{/if}

<style>
  .red-rectangular-button {
    background-color: darkred;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.red-rectangular-button:hover {
    background-color: darkred;
}
</style>