<script>
    import Navbar from '../navbar.svelte';
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


  async function fetchReqDetails() {
      const response = await fetch(`http://localhost:3000/api/requisition/${id}`);
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

    }

  async function addFeedback() {
    // Create a JSON object with the data
    // const respData = {
    //   id: id,
    //   response: response
    // };

    // try {
    //   const response = await fetch('http://localhost:3000/api/feedback/student/respond', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(respData)
    //   });
    //   console.log(response);
    //   console.log(respData);
    //   // fornow = await response.json();

    //   if (response.ok) {
    //     // Request was successful
    //     // addBusResponse = 'Bus added successfully';
    //   } else {
    //     // Request failed
    //     // addBusResponse = 'Failed to add bus';
    //   }
    //   navigate('/requisitionList');
    // } catch (error) {
    //   console.error('Error:', error);
    // //   addBusResponse = 'Error occurred';
    // }
  }
  
    let reqId = '';
  
    onMount(() => {
      const urlParams = new URLSearchParams(window.location.search);
      id = urlParams.get('reqId');
      fetchReqDetails();
    });
  </script>
  

  {#if $isAuthenticated}
  <main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 to-maroon-900">
    <div>
        <Navbar />
    </div>


    <div class="flex-1 w-full bg-black-900 bg-opacity-60">
        <p>Hello</p>
  </div>
  </main>
{:else}
  <p>Not authenticated</p>
{/if}


  