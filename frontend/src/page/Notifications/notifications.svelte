<script>
  import { onMount } from 'svelte';
  import Navbar from '../GlobalComponents/navbar.svelte';
  import ErrorPopUp from '../GlobalComponents/PopUps/errorPopUp.svelte';
  import SuccessfulPopUp from "../GlobalComponents/PopUps/successfulPopUp.svelte";

  let nTitle = '';
  let nBody = '';
  let success = -1;
  let errorMessage = "";
  let includeDateTime = false; // Checkbox state

  // Function to format the current date and time
  function getFormattedDateTime() {
    const now = new Date();
    return now.toLocaleString(); // Adjust formatting as needed
  }

  async function sendNotification() {
    let finalBody = nBody;
    if (includeDateTime) {
      const dateTime = getFormattedDateTime();
      finalBody += ` \nSent on: ${dateTime}`; // Append date and time
    }

    if (!nTitle || !finalBody) {
      errorMessage = 'Title and Body are required';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/proxyBroadcastNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nTitle, nBody: finalBody }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      // Handle success
      success = 1;
      nTitle = '';
      nBody = '';
    } catch (error) {
      console.error('Error:', error);
      errorMessage = error.message || 'Error occurred';
      success = 0;
    }
  }
</script>

<main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900">
    <div>
      <Navbar />
    </div>
  
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow bg-white-700">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Send Notification</h2>
  
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="nTitle">
          Title
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="nTitle" type="text" placeholder="Notification Title" bind:value={nTitle} />
      </div>
  
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="nBody">
          Body
        </label>
        <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="nBody" placeholder="Notification Body" bind:value={nBody}></textarea>
      </div>

      <div class="mb-4">
        <label class="flex items-center">
          <input type="checkbox" class="form-checkbox" bind:checked={includeDateTime} />
          <span class="ml-2 text-gray-700 text-sm">Include Date and Time</span>
        </label>
      </div>
      
      <!-- Existing form elements -->
  
      <div class="flex items-center justify-between">
        <button class="bg-maroon-500 hover:bg-maroon-900 text-white-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" on:click={sendNotification}>
          Send
        </button>
      </div>
    </div>
  </div>
</main>
  
  <!-- Success and Error Popups -->
  {#if success === 1}
    <SuccessfulPopUp successMessage="Notification sent successfully" on:closeSuccess={() => (success = -1)} />
  {:else if success === 0}
    <ErrorPopUp errorMessage={errorMessage} on:closeError={() => (success = -1)} />
  {/if}

  