<script>
    import Navbar from '../navbar.svelte';
  import { isAuthenticated } from '../../auth';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

    let id= '';
    let req_id= '';
    let source= '';
    let dest= '';
    let subject= '';
    let text= '';
    let time= '';
    let approver= '';
    let bus= '';
    let valid= '';

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
            id: row.id,
          req_id : row.requestor_id,
          source : row.source,
          dest : row.destination,
          subject : row.subject,
          text : row.text,
          time : row.timestamp,
          approver : row.approved_by,
          bus : row.bus_type,
          valid : row.valid
        };
      })[0];
      console.log(wow);

          id= wow.id,
          req_id = wow.requestor_id,
          source = wow.source,
          dest = wow.destination,
          subject = wow.subject,
          text = wow.text,
          time = wow.timestamp,
          approver = wow.approved_by,
          bus = wow.bus_type,
          valid = wow.valid

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
        <div class="flex flex-row w-full">
            <div class=" w-1/2 h-fit ml-60 mb-5 bg-white-700 rounded-lg shadow-lg">
                <h1 class=" mt-5 ml-5 text-2xl font-semibold text-maroon-500 underline underline-offset-1">Personal Information</h1> 
                <div class="flex flex-col ml-10 mt-3 mb-6">
                  <p class="text-lg font-semibold text-gray-700 pb-2">Id : {id}</p>
                  <p class="text-lg font-semibold text-gray-700 pb-2">Requestor: {req_id}</p>
                  <p class="text-lg font-semibold text-gray-700 pb-2">Source: {source}</p>
                  <p class="text-lg font-semibold text-gray-700 pb-2">Destination: {dest}</p>
                  <p class="text-lg font-semibold text-gray-700 pb-2">Subject: {subject}</p>
                  <p class="text-lg font-semibold text-gray-700 pb-2">Time: {formatDate(time)}</p>
                  <p class="text-lg font-semibold text-gray-700 pb-2">Bus Type: {bus}</p>
                  <p class="text-lg font-semibold text-gray-700 pb-2">Text:</p><p> {text}</p>
                </div> 
                <!-- <div class="my-4 px-5">
                    <label class="block text-gray-600 font-semibold mb-2" for="input1">Response</label>
                    <input placeholder="we'll look into it"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" type="text"  bind:value={response} />
                  </div> 
                  <button type="submit" class=" bg-maroon-500 hover:bg-maroon-900 py-3 px-8 text-white-700 font-semibold rounded-full"
        on:click={()=>{addFeedback();}}
        >Respond</button>  -->
            </div>
            
        </div>
    </div>
  </main>
{:else}
  <p>Not authenticated</p>
{/if}


  