<script>
    import Navbar from './navbar.svelte';
    import { checkSession, isAuthenticated } from '../auth';
    import { onMount } from 'svelte';
  
    let id = '';
    let phone = '';
    let password = '';
    let role = '';
    let name = '';
  
    let addStaffResponse = '';
  
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
  
        if (response.ok) {
          // Request was successful
          addStaffResponse = 'Staff added successfully';
        } else {
          // Request failed
          addStaffResponse = 'Failed to add staff';
        }
      } catch (error) {
        console.error('Error:', error);
        addStaffResponse = 'Error occurred';
      }
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
        <h1>Add Staff</h1>
  
        <form on:submit={handleAddStaff}>
          <input type="text" bind:value={id} placeholder="Staff ID" />
          <input type="text" bind:value={phone} placeholder="Phone Number" maxlength="11" />
          <input type="password" bind:value={password} placeholder="Password" />
          <select bind:value={role}>
            <option value="" disabled selected>Select Role</option>
            <option value="collector">collector</option>
            <option value="driver">driver</option>
          </select>
          <input type="text" bind:value={name} placeholder="Name" />
  
          <button type="submit">Add Staff</button>
        </form>
  
        <p>{addStaffResponse}</p>
      </div>
    </main>
  {:else}
    <p>Not authenticated</p>
  {/if}