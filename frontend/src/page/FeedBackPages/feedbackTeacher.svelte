<script>
  import Navbar from '../GlobalComponents/navbar.svelte';
  import { isAuthenticated } from '../../auth';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

  let id = '';
  let complainer_id = '';
  let route = '';
  let subtime = '';
  let contime = '';
  let text = '';
  let trip_id = '';
  let subject = '';
  let response = '';

  function ordinalSuffix(day) {
    if (day > 3 && day < 21) return day + 'th';
    switch (day % 10) {
      case 1: return day + "st";
      case 2: return day + "nd";
      case 3: return day + "rd";
      default: return day + "th";
    }
  }

  // Function to format date
  function formatDate(dateString) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date(dateString);

    const hours = date.getHours() % 12 || 12; // Convert 24h to 12h format and handle midnight
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() < 12 ? 'AM' : 'PM';
    const day = ordinalSuffix(date.getDate());
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${hours}:${minutes} ${ampm}, ${day} ${month}, ${year}`;
  }


  async function fetchFeedBackDetails() {
      const response = await fetch(`http://localhost:3000/api/feedback/teacher/${id}`);
      const data = await response.json();
      
      const wow =  data.map((row) => {
        return {
          complainer_id : row.complainer_id,
          route : row.route,
          subtime : row.submission_timestamp,
          contime : row.concerned_timestamp,
          text : row.text,
          trip_id : row.trip_id,
          subject : row.subject
        };
      })[0];
      console.log(wow);
      
        complainer_id = wow.complainer_id;
        route = wow.route;
        subtime = wow.subtime;
        contime = wow.contime;
        text = wow.text;
        trip_id = wow.trip_id;
        subject = wow.subject;
        subject = subject.slice(1,-1).toUpperCase();

    }

  async function addFeedback() {
    // Create a JSON object with the data
    const respData = {
      id: id,
      response: response
    };

    try {
      const response = await fetch('http://localhost:3000/api/feedback/teacher/respond', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(respData)
      });
      console.log(response);
      console.log(respData);

      if (response.ok) {
      } else {
        console.log('Error occurred');
      }
      navigate('/feedbackList');
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
    onMount(() => {
      const urlParams = new URLSearchParams(window.location.search);
      id = urlParams.get('feedbackId');
      fetchFeedBackDetails();
    });
  </script>
  

  {#if $isAuthenticated}
  <main class="flex min-h-screen min-w-full bg-white-700">
    <div>
        <Navbar />
    </div>

    <div class="flex flex-col ml-60 w-full h-full">
      <h2 class="mx-5 my-5 text-3xl font-bold underline uppercase text-maroon-500">Feedback Details</h2>
      <h3 class="mx-8 mb-8 mt-3 text-2xl font-semibold text-black-900">Subject: {subject}</h3>
      <p class="mx-8 text-normal font-bold text-gray-700 pb-2">Feedback Id: 
        <span class="font-semibold">{id}</span>
      </p>
      <p class="mx-8 text-normal font-bold text-gray-700 pb-2">Complainer: 
        <span class="font-semibold">{complainer_id}</span>
      </p>
      <p class="mx-8 text-normal font-bold text-gray-700 pb-2">Route: 
        <span class="font-semibold">{route}</span>
      </p>
      <p class="mx-8 text-normal font-bold text-gray-700 pb-2">Submission Time: 
        <span class="font-semibold">{formatDate(subtime)}</span>
      </p>
      <p class="mx-8 text-normal font-bold text-gray-700 pb-2">Concerned Time: 
        <span class="font-semibold">{formatDate(contime)}</span>
      </p>
      <p class="mx-8 text-normal font-bold text-gray-700 pb-2">Text: </p>
      <textarea class="ml-10 mr-20 text-normal font-normal text-black-900 py-2 px-2 rounded-lg bg-gray-200 h-28 focus:outline-none focus:ring-2 focus:ring-maroon-500" 
        value={text} readonly />
      <p class="mx-8 text-normal font-bold text-maroon-500 py-2">Response: </p>
      <textarea class="ml-10 mr-20 text-normal font-normal text-black-900 py-2 px-2 rounded-lg bg-gray-200 h-28 focus:outline-none focus:ring-2 focus:ring-maroon-500"
        placeholder="We'll look into it." 
        value={response}/>
      <div class="flex flex-row justify-end my-5 mr-5">
        <button class="bg-maroon-500 hover:bg-maroon-900 py-2 px-5 w-fit text-white-700 font-semibold rounded-full focus:translate-y-2"
        on:click={addFeedback}>
          Respond
        </button>
      </div>
    </div>
  </main>
{:else}
<div>
  <p class="text-3xl font-extrabold text-maroon-500">Access Denied</p>
</div>
{/if}


  