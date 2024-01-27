<script>
  import Navbar from './navbar.svelte';
  import { checkSession, isAuthenticated } from '../auth';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

  let id = '';
  let phone = '';
  let password = '';
  let role = '';
  let name = '';

  let addStaffResponse = '';
  let fornow = [];

  async function addStaff() {
    // Create a JSON object with the data
    const staffData = {
      id: id,
      phone: phone,
      password: password,
      role: role,
      name: name
    };

    try {
      const response = await fetch('http://localhost:3000/api/staff/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffData)
      });
      console.log(response);
      console.log(staffData);
      // fornow = await response.json();

      if (response.ok) {
        // Request was successful
        addStaffResponse = 'Staff added successfully';
      } else {
        // Request failed
        addStaffResponse = 'Failed to add staff';
      }
      navigate('/busStaffList');
    } catch (error) {
      console.error('Error:', error);
      addStaffResponse = 'Error occurred';
    }
  }

  async function gotoAddBus() {
    navigate('/busAdd');
  }

  function handleAddStaff(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
    addStaff();
  }

  onMount(() => {
});
</script>

{#if $isAuthenticated}
  <main class="flex">
    <div class="w-fit">
        <Navbar />
    </div>
    <div class="flex-1 ml-56 p-6">
      <h2 class="text-3xl font-bold uppercase text-maroon-500">Add Bus Staff</h2>
      <button type="submit" class="red-rectangular-button" on:click={gotoAddBus}>Add Bus</button>
      <div class="mb-4">
        <label class="block text-gray-600 font-semibold mb-2" for="input1">Staff ID:</label>
        <input class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="text" id="input1" bind:value={id} />
      </div>
      <div class="mb-4">
        <label class="block text-gray-600 font-semibold mb-2" for="input1">Name:</label>
        <input class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="text" id="input1" bind:value={name} />
      </div>
      <div class="mb-4">
        <label class="block text-gray-600 font-semibold mb-2" for="input1">Phone:</label>
        <input class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="text" id="input1" bind:value={phone} />
      </div>
      <div class="mb-4">
        <label class="block text-gray-600 font-semibold mb-2" for="input1">Password:</label>
        <input class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="password" id="input1" bind:value={password} />
      </div>
      <div class="mb-4">
        <label class="block text-gray-600 font-semibold mb-2" for="dropdown">Select an Option:</label>
        <select class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" id="dropdown" bind:value={role}>
          <option value="" disabled selected>Select Role</option>
          <option value="collector">collector</option>
          <option value="driver">driver</option>
        </select>
      </div>
      <form on:submit={handleAddStaff}>
        <button type="submit" class="red-rectangular-button">Add Staff</button>
      </form>

      <p>{addStaffResponse}</p>
    </div>
  </main>
{:else}
  <p>Not authenticated</p>
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