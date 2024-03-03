<script>
    import { onMount } from 'svelte';
    import Navbar from '../GlobalComponents/navbar.svelte';
    import "../../tailwind.css";
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from '../../auth';
  
    let notices = [];
  
    // Function to fetch notices from the API
    async function fetchNotices() {
      try {
        const response = await fetch('http://localhost:3000/api/notice/');
        if (response.ok) {
          notices = await response.json();
          console.log('notices:', notices);
        } else {
          console.error('Failed to fetch notices:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    }
  
    // Function to confirm and delete a notice
    const confirmDelete = async (noticeId) => {
      if (window.confirm('Do you really want to delete this notice?')) {
        await deleteNotice(noticeId);
      }
    };
  
    // Function to delete a notice
    const deleteNotice = async (noticeId) => {
      try {
        const response = await fetch(`http://localhost:3000/api/notices/${noticeId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          fetchNotices(); // Refresh the list of notices
        } else {
          console.error('Failed to delete notice:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting notice:', error);
      }
    };
  
    // Fetch notices when the component mounts
    onMount(() => {
      fetchNotices();
    });
  </script>
  
  {#if $isAuthenticated}
  <main class="flex min-h-screen bg-gray-100">
    <div>
      <Navbar />
    </div>
    <div class="flex-1 ml-56 mr-4 mt-8 mb-4 p-6 bg-white rounded shadow-md">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-maroon">Notices</h1>
        <!-- Button to create a new notice can be added here -->
      </div>
  
      {#if notices.length > 0}
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-200">
              <th class="px-6 py-3 text-left">Notice ID</th>
              <th class="px-6 py-3 text-left">Date</th>
              <th class="px-6 py-3 text-left">Title</th>
              <th class="px-6 py-3 text-left">Body</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each notices as notice}
            <tr class="border-b border-gray-200">
              <td class="px-6 py-4">{notice.id}</td>
              <td class="px-6 py-4">{notice.date}</td>
              <td class="px-6 py-4">{notice.title}</td>
              <td class="px-6 py-4">{notice.body}</td>
              <td class="px-6 py-4 text-right">
                <!-- Buttons for edit and delete actions -->
                <button
                  class="p-2 rounded text-white bg-red-500 hover:bg-red-700"
                  on:click={() => confirmDelete(notice.id)}>
                  <i class="bx bx-trash"></i>
                </button>
              </td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {:else}
      <div class="text-center py-10">
        <p>No notices found.</p>
      </div>
      {/if}
    </div>
  </main>
  {:else}
  <div class="flex items-center justify-center h-screen">
    <div class="text-center">
      <p class="mb-4">You need to log in first</p>
      <a class="text-blue-500" href="/login">Log In</a>
    </div>
  </div>
  {/if}
  