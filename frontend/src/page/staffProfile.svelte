<script>
  import { onMount } from 'svelte';
  // Assuming Navbar is already imported in your main layout and does not need to be here

  let user = null;

  // Function to fetch staff details
  async function fetchStaffDetails(staffId) {
      try {
          const response = await fetch(`http://localhost:3000/api/staff/${staffId}`);
          let data = await response.json();
          user = data[0];
          console.log(user);
      } catch (error) {
          console.error('Error:', error);
      }
  }

  onMount(async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const staffId = urlParams.get('staffId');
      fetchStaffDetails(staffId);
  });
</script>
{#if user}
<main class="flex flex-col items-center bg-gray-100 p-8">
  <div class="w-full max-w-4xl bg-white rounded-lg shadow-md p-5">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-semibold text-gray-800">{user.name || 'User Name'}</h1>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Edit Profile
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-gray-50 p-4 rounded-lg">
        <h2 class="text-lg font-medium text-gray-700">Personal Details</h2>
        <div class="mt-4">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Date of Birth:</strong> </p>
          <p><strong>Address:</strong></p>
        </div>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg">
        <h2 class="text-lg font-medium text-gray-700">Upcoming Trips</h2>
        <div class="mt-4">
        </div>
      </div>
    </div>
    <div class="bg-gray-50 p-4 rounded-lg">
      <h2 class="text-lg font-medium text-gray-700">Recent Trips</h2>
      <div class="mt-4">
      </div>
    </div>
  </div>
</main>
{/if}
<style>
  /* Additional styles can be added here */
  p {
    margin-bottom: 0.5rem;
  }
</style>
