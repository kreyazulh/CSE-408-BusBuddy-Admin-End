<script>
    import Navbar from "../GlobalComponents/navbar.svelte";
    import { isAuthenticated } from "../../auth";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import Password from "../GlobalComponents/password.svelte";
    import ErrorPopUp from "../GlobalComponents/PopUps/errorPopUp.svelte";
    import SuccessfulPopUp from "../GlobalComponents/PopUps/successfulPopUp.svelte";
  
    let isShrink = false;
  
    let id = "";
    let phone = "";
    let email = "";
    let name = "";
    let password = "";
    let route = "";
    let station = "";

    let allRoutes = [];
    let allStations = [];
   
  
  
    let success = -1;
    let addstudentResponse = "";
  
    let errorMessage="";
  
    function handleClick() {
          isShrink = true;
          setTimeout(() => {
              isShrink = false;
          }, 100);
      }
  
    function handlePasswordChange(event) {
      password = event.detail;
    }
  
    async function addStudent() {
      // Create a JSON object with the data
      const studentData = {
        id: id,
        phone: phone,
        email: email,
        password: password,
        default_route: route,
        name: name,
        default_station: station
        // baki jinish o add korte hobe
      };
  
      try {
        const response = await fetch("http://localhost:3000/api/user/student/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        });
        console.log(response);
        console.log(studentData);
        // fornow = await response.json();
  
        if (response.ok) {
          // Request was successful
          addstudentResponse = "student added successfully";
          success = 1;
        } else {
          // Request failed
          addstudentResponse = "Failed to add student";
          success = 0;
        }
      } catch (error) {
        console.error("Error:", error);
        addstudentResponse = "Error occurred";
        success = 0;
      }
    }
  
  async function fetchRoutes() {
    try {
      const response = await fetch('http://localhost:3000/api/route/');
      const data= await response.json();
      allRoutes = data.map((route)=> {
        return {
          route_id: route.id,
          route_name: route.terminal_point
        }
      });
      console.log(allRoutes);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  }
  
  async function fetchStations() {
    try {
      // fetch allocated & unallocated buses in seperate arrays
      const response = await fetch('http://localhost:3000/api/station/');
      const data = await response.json();
      // console.log(data);
      allStations = data.map((station)=>{
        return {
          station_id: station.id,
          station_name: station.name
        }
      });
      console.log(allStations);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  }
  
    onMount(async () => {
      await fetchRoutes();
      await fetchStations();
    });
  </script>
  
  
  {#if $isAuthenticated}
    <main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900">
      <div>
        <Navbar />
      </div>
  
      <div class="flex w-full justify-center items-center">
        <div class="w-1/2 py-5 px-5 my-10 rounded-lg shadow-lg bg-white-700">
          <h2 class="text-3xl font-bold underline uppercase text-maroon-500">
            Add Student
          </h2>
  
          <div class="flex flex-row">
            <div class="w-1/2">
  
              <!-- userid -->
              <div class="my-4 px-5">
                <label class="block text-gray-600 font-semibold mb-2" for="id">student ID:</label>
                <input
                  required
                  placeholder="eg: 1905088"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                  type="text"
                  bind:value={id}
                />
              </div>
  
              <!-- name -->
              <div class="my-4 px-5">
                <label class="block text-gray-600 font-semibold mb-2" for="name">Name:</label>
                <input
                  required
                  pattern="[A-Z]{30}"
                  placeholder="eg: Mubasshira Musarrat"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                  type="text"
                  bind:value={name}
                />
              </div>
  
              <!-- phone -->
              <div class="my-4 px-5">
                <label class="block text-gray-600 font-semibold mb-2" for="phone">Phone:</label>
                <input
                  required
                  pattern="[0-9]{11}"
                  placeholder="eg: 0171*******"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                  type="text"
                  bind:value={phone}
                />
              </div>
              <!-- email -->
              <div class="my-4 px-5">
                <label class="block text-gray-600 font-semibold mb-2" for="address">Email:</label>
                <input
                  placeholder="eg: xyz@gmail.com"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                  type="text"
                  bind:value={email}
                />
              </div>
  
            </div>
  
            <div class = "w-1/2">
  
              <!-- select route -->
              <div class = "my-4 px-5">
                <label class="block text-gray-600 font-semibold mb-2" for="route">Select Default Route:</label>
                <select
                  class="{route===""?'text-gray-400':'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                  id="routeDropdown"
                  bind:value={route}>
                <option value="" hidden>Select Route</option>
                <optgroup label="Allocated Route" class="text-maroon-500 italic">
                {#each allRoutes as route}
                  <option value={route.route_id} class="text-black-900 not-italic">{route.route_name}</option>
                {/each}
                </optgroup>
                </select>
              </div>
  
              <!-- select station -->
              <div class = "my-4 px-5">
                <label class="block text-gray-600 font-semibold mb-2" for="route">Select Default Station:</label>
                <select
                  class="{station===""?'text-gray-400':'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                  id="stationDropdown"
                  bind:value={station}>
                <option value="" hidden>Select Station</option>
                <optgroup label="Allocated Route" class="text-maroon-500 italic">
                {#each allStations as station}
                  <option value={station.station_id} class="text-black-900 not-italic">{station.station_name}</option>
                {/each}
                </optgroup>
                </select>
              </div>
  
              <!-- password -->
              <div class="my-4 px-5">
                <label class="block text-gray-600 font-semibold mb-2" for="password">Password:</label>
                <Password  on:passwordChanged={handlePasswordChange}/>
              </div>
            </div>
          </div>
          <!-- add button -->
          <div class="flex my-4 pt-4 justify-end pr-8">
            <button
              class=" bg-maroon-500 hover:bg-maroon-900 py-3 px-8 text-white-700 font-semibold rounded-full"
              class:shrink={isShrink}
              on:click={() => {
                handleClick();
                if(id.length<=0){
                  errorMessage = 'Please enter a valid student ID';
                }else if(name.length<=0){
                  errorMessage = 'Please enter a valid name';
                }else if(phone.length!=11){
                  errorMessage = 'Please enter a valid phone number';
                } else if(password.length<8){
                  errorMessage = 'Password must be at least 8 characters long';
                }else {
                  addStudent();
                }
              }}>Add</button>
          </div>
  
          <!-- error popup -->
          {#if errorMessage.length>0}
            <ErrorPopUp errorMessage={errorMessage}
            on:closeError={()=>(errorMessage="")}/>
          {/if}
  
          {#if success==1}
            <SuccessfulPopUp successMessage={addstudentResponse}
            on:closeSuccess={()=>{success=-1;
            navigate("/studentList");}}/>
          {:else if success==0}
            <ErrorPopUp errorMessage={addstudentResponse}
            on:closeError={()=>(success=-1)}/>
          {/if}
         
        </div>
      </div>
  </main>
  {:else}
    <div>
      <p class="text-3xl font-extrabold text-maroon-500">Access Denied</p>
    </div>
  {/if}
  
  <style>
    .shrink {
        transform: translateY(2px);
    }
  </style>
  
  
  
  
  
  
  
  
    
      <!-- <div class="flex-1 w-full bg-black-900 bg-opacity-60">
       
            
  
  
             
              <div class="flex my-4 pt-4 justify-end pr-8">
                <button
                  type="submit"
                  class=" bg-maroon-500 hover:bg-maroon-900 py-3 px-8 text-white-700 font-semibold rounded-full"
                  on:click={() => {
                    if(id.length<=0){
                      alert('Please enter a valid student ID');
                    }else if(name.length<=0){
                      alert('Please enter a valid name');
                    }else if(phone.length!=11){
                      alert('Please enter a valid phone number');
                    } else if(role.length<=0){
                      alert('Please select a role');
                    }else if(password.length<8){
                      alert('Password must be at least 8 characters long');
                    }else {
                      addstudent();
                    }
                  }}>Add</button
                >
              </div>
            </div>
          </div>
        </div>
      </div> -->
   
  