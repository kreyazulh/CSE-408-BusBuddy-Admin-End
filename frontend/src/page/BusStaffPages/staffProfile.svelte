<script>
  import { onMount } from 'svelte';
  import Navbar from "../GlobalComponents/navbar.svelte";
  import { isAuthenticated } from "../../auth";

  let username = 'Altaf990';
  let role = 'Driver';
  let rating = 3.4; // Rating out of 5
  let salaryStatus = 'Paid'; // "Paid", "Unpaid"
  let isActive = true; 
  let isDriving = true;

  let tripsCompleted = 5;
  let userComplains = 2;
  let tripIssues = 1;

  let name = 'Altaf Hussain';
  let age = 25;
  let phone = '01765111234';
  let address = 'House 123, Road 4, Uttara Sector 17, Dhaka 1209';
  let salary = 15000;
  let joiningDate = '01-01-2021';

  let upcomingTrips= [
    {time: '06:00 AM', description: 'Pickup: 123, Road 4, Uttara Sector 17, Dhaka 1209', color: 'red'},
    {time: '08:00 AM', description: 'Dropoff: BUET, Dhaka 1207', color: 'lime'},
    {time: '01:30 PM', description: 'Pickup: BUET, Dhaka 1207', color: 'cyan'},
    {time: '03:00 PM', description: 'Dropoff: 123, Road 4, Uttara Sector 17, Dhaka 1209', color: 'maroon'},
    {time: '05:30 PM', description: 'Pickup: BUET, Dhaka 1207', color: 'yellow'},
    {time: '07:00 PM', description: 'Dropoff: 123, Road 4, Uttara Sector 17, Dhaka 1209', color: 'indigo'},
  ];

  let recentTrips= [
    {date: '03-02-24-M', description: "Uttara-BUET"},
    {date: '03-02-24-A', description: "BUET-Uttara"},
    {date: '02-02-24-M', description: "Uttara-BUET"},
  ];

  let allocatedRoute = 'Uttara';
  let allocatedBus = 'BA-01-2468';

  async function fetchStaffDetails() {
      const response = await fetch(`http://localhost:3000/api/staff/${username}`);
      const data = await response.json();
      // phone = data.phone;

      const wow =  data.map((row) => {
        return {
          phone : row.phone,
          name : row.name,
          role : row.role
        };
      })[0];
      
      phone = wow.phone;
      name = wow.name;
      role = wow.role;

      console.log(name);
    }

  onMount(() => {
      const urlParams = new URLSearchParams(window.location.search);
      username = urlParams.get('staffId');
      fetchStaffDetails();
    });

</script>


{#if $isAuthenticated}
  <main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900">
    <div>
      <Navbar />
    </div>

    <div class="flex flex-col w-full h-full">
      <div class="flex flex-row w-full">
        <div class=" w-3/5 h-fit ml-60 my-5 bg-white-700 rounded-lg shadow-lg">
          <div class="flex flex-row mx-6 my-3">
            <!-- image -->
            <div class=" border border-black-900 rounded-full h-28 w-28">
              <img src="/blankProfilePicture.png" alt="profile" class=" rounded-full h-28 w-28"/>
            </div>

            <!-- username, role & rating -->
            <div class="flex flex-col ml-3 mt-3">
              <p class="text-xl font-semibold text-black-900">{username}</p>
              <p class="text-gray-600">{role}</p>
              <!-- stars -->
              <div class="flex items-center py-2">
                {#each Array(5) as _, i}
                  {#if i < Math.floor(rating)} <!-- Fill complete stars -->
                    <svg class="w-5 h-5 text-maroon-500 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    </svg>
                  {:else if i === Math.floor(rating) && rating % 1 !== 0} <!-- Fill partially filled star -->
                  <svg class="w-5 h-5 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <defs>
                      <clipPath id={`partial-star-clip-${i}`}>
                        <rect width={`${(rating % 1) * 22}`} height="20"/>
                      </clipPath>
                    </defs>
                    <path class="text-gray-600" d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    <path class="text-maroon-500" d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" clip-path={`url(#partial-star-clip-${i})`} />
                  </svg>  
                  {:else} <!-- Empty stars -->
                    <svg class="w-5 h-5 text-gray-600 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    </svg>
                  {/if}
                {/each} 
                <p class="ml-1 text-lg font-bold text-black-900 ">{rating}</p>
              </div>            
            </div>


            <!-- salary status, inactive, driving status -->
            <div class="flex flex-col mr-3 mt-3 ml-auto">
              <p class=" mb-5 text-lg font-semibold text-gray-700">Salary Status: 
                <span class="{salaryStatus==='Unpaid' ? 'bg-red-600' : 'bg-lime-500'} rounded-full text-white-700 px-4">{salaryStatus}</span>
              </p>
              {#if !isActive}
                <p class=" bg-gray-700 rounded-full text-center w-fit px-5 text-lg font-semibold text-white-700">Inactive</p>
              {:else if isDriving}
                <p class="bg-lime-500 animate-pulse rounded-full text-center w-fit px-5 text-xl font-semibold text-white-700">In Trip</p>
              {/if}
            </div>
          </div>
        </div>

        <div class=" w-1/5 h-fit mx-5 my-5 bg-gray-200 rounded-lg shadow-lg">
          <div class="flex flex-col mx-3 my-3">
            <p class="text-2xl font-semibold text-black-900">{tripsCompleted}
              <span class="text-gray-700 text-base font-normal">Trips Completed</span>
            </p>
            <p class="text-base font-normal text-gray-700">Trip Deviations: 
              <span class="text-maroon-900 text-2xl font-semibold">{tripIssues}</span>
            </p>
            <p class="text-2xl font-semibold text-maroon-500">{userComplains}
              <span class="text-gray-700 text-base font-normal">User Complains</span>
            </p>
            <div class="flex items-center">
              <input type="range" min="0" max="{tripsCompleted}" value="{(tripsCompleted-tripIssues-userComplains)}" class="range-input" disabled>
              <span class="ml-2 text-sm text-black-900">{((tripsCompleted-tripIssues-userComplains)/tripsCompleted)*100}% successful trips</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-row w-full">
        <div class=" w-1/2 h-fit ml-60 mb-5 bg-white-700 rounded-lg shadow-lg">
            <h1 class=" mt-5 ml-5 text-2xl font-semibold text-maroon-500 underline underline-offset-1">Personal Information</h1> 
            <div class="flex flex-col ml-10 mt-3 mb-6">
              <p class="text-lg font-semibold text-gray-700 pb-2">Name: {name}</p>
              <p class="text-lg font-semibold text-gray-700 pb-2">Age: {age}</p>
              <p class="text-lg font-semibold text-gray-700 pb-2">Phone: {phone}</p>
              <p class="text-lg font-semibold text-gray-700 pb-2">Address: {address}</p>
              <p class="text-lg font-semibold text-gray-700 pb-2">Salary: {salary}</p>
              <p class="text-lg font-semibold text-gray-700 pb-2">Joining Date: {joiningDate}</p>
            </div>   
        </div>

        <div class="flex flex-col w-1/2 h-fit">
          <!-- upcoming trips -->
          <div class="mx-5 bg-white-700 rounded-lg shadow-lg">
            <h2 class="mt-5 ml-5 text-2xl font-semibold text-maroon-500">Upcoming Trips</h2>
            <div class="relative mx-10 my-3">
                <ul class="space-y-3">
                  {#each upcomingTrips as upcomingTrip, i}
                    <li class="flex items-center relative">
                      <!-- Time and description -->
                      <div class="z-10">
                        <span class="font-bold w-16 text-gray-700">{upcomingTrip.time}</span>
                        <span class="flex-1 ml-6 text-gray-600">{upcomingTrip.description}</span>
                      </div>
            
                      <!-- Dot with connecting line -->
                      <div class="absolute ml-20">
                        <span class="w-3 h-3 rounded-full bg-{upcomingTrip.color}-500 flex items-center justify-center">
                          <!-- Connecting lines for all but the first item -->
                          {#if i !== 0}
                          <span class="absolute w-0.5 bg-gray-300 h-full left-1/2 transform -translate-x-1/2 bottom-full"></span>
                          {/if}
            
                          <!-- Connecting lines for all but the last item -->
                          {#if i !== upcomingTrips.length - 1}
                          <span class="absolute w-0.5 bg-gray-300 h-full left-1/2 transform -translate-x-1/2 top-full"></span>
                          {/if}
                        </span>
                      </div>
                    </li>
                  {/each}
                </ul>
            </div>
          </div>

          <div class="flex flex-row">
            <!-- recent trips -->
            <div class="mx-5 my-3 w-1/2 bg-white-700 rounded-lg shadow-lg">
              <h2 class="mt-5 ml-5 text-2xl font-semibold text-maroon-500">Recent Trips</h2>
              <div class="relative ml-8 mr-3 my-3">
                  <ul class="space-y-2">
                    {#each recentTrips as recentTrip, i}
                      <li class="flex items-center relative">
                        <!-- Time and description -->
                        <div class="z-10">
                          <span class="font-bold w-16 text-gray-700">{recentTrip.date}</span>
                          <span class="flex-1 ml-3 text-gray-600">{recentTrip.description}</span>
                        </div>
                      </li>
                    {/each}
                  </ul>
              </div>
            </div>

            <!-- allocated route & bus -->
            <div class="mx-5 my-3 w-1/2 bg-white-700 rounded-lg shadow-lg h-fit">
                <p class="text-lg font-semibold text-cyan-500 mx-3 my-3"> Allocated Route: {allocatedRoute}</p>
                <p class="text-lg font-semibold text-cyan-500 mx-3 my-3">Allocated Bus: {allocatedBus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
{:else}
  <div>
    <p class="text-3xl font-extrabold text-maroon-500">Access Denied</p>
  </div>
{/if}
