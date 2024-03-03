<script>
    import { onMount } from 'svelte';
    import Navbar from '../GlobalComponents/navbar.svelte';
  import { isAuthenticated } from '../../auth';
  import ErrorPopUp from '../GlobalComponents/PopUps/errorPopUp.svelte';
  import SuccessfulPopUp from "../GlobalComponents/PopUps/successfulPopUp.svelte";
  import { navigate } from 'svelte-routing';

    let notices = [];
    let text = '';
    let addBusResponse = '';
    let success = 0;

    async function getNoticeList() {
    const response = await fetch('http://localhost:3000/api/notice/');
    const data = await response.json();
    notices = data.map((row) => {
      return {
        id: row.id,
        text: row.text,
      };
    });
    //unallocated kemne anbo jani na
  }

  async function addNotice() {
    // Create a JSON object with the data
    const noticeData = {
      text : text
      // baki jinish dite hobe
    };

    try {
      const response = await fetch('http://localhost:3000/api/notice/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noticeData)
      });
      console.log(response);
      console.log(noticeData);
      // fornow = await response.json();

      if (response.ok) {
        // Request was successful
        addBusResponse = 'Bus added successfully';
        success = 1;
      } else {
        // Request failed
        addBusResponse = 'Failed to add bus';
        success = 0;
      }
      navigate('/bulletine');
    } catch (error) {
      console.error('Error:', error);
      addBusResponse = 'Error occurred';
      success = 0;
    }
  }
  
  onMount(async () => {
        getNoticeList();
    });
  </script>
  
  <main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900">
      <div>
        <Navbar />
      </div>
    
    <div class="container mx-auto px-4 py-8">
      <!-- Text input and Add button -->
    <div class="flex justify-end mb-8">
        <input type="text" bind:value={text} placeholder="Enter notice text" class="input bg-white border border-gray-400 rounded-lg p-2 mr-4">
        <button on:click={addNotice} class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Notice</button>
      </div>
  
      <!-- Notices display -->
      <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        {#if notices.length > 0}
          <div class="space-y-4">
            {#each notices as notice}
              <div class="p-4 bg-white rounded-lg shadow-md">
                <p class="text-black">ID: {notice.id}</p>
                <p class="text-black">Text: {notice.text}</p>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-center text-white">No notices available</p>
        {/if}
      </div>
    </div>
  </main>
    
  
    