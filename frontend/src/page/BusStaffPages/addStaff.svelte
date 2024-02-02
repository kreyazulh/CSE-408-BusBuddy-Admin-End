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
  let role = "";
  let name = "";
  let password = "";
  let busno = "";
  let route= "";
  let dob = "";
  let address = "";


  let allocatedRoutes = [];
  let unallocatedRoutes = [];
  
  let allocatedBuses = [];
  let unallocatedBuses = [];

  let success = -1;
  let addStaffResponse = "";

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

  async function addStaff() {
    // Create a JSON object with the data
    const staffData = {
      id: id,
      phone: phone,
      password: password,
      role: role,
      name: name,
      // baki jinish o add korte hobe
    };

    try {
      const response = await fetch("http://localhost:3000/api/staff/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffData),
      });
      console.log(response);
      console.log(staffData);
      // fornow = await response.json();

      if (response.ok) {
        // Request was successful
        addStaffResponse = "Staff added successfully";
        success = 1;
      } else {
        // Request failed
        addStaffResponse = "Failed to add staff";
        success = 0;
      }
    } catch (error) {
      console.error("Error:", error);
      addStaffResponse = "Error occurred";
      success = 0;
    }
  }

async function fetchRoutes() {
  try {
    const response = await fetch('http://localhost:3000/api/route/');
    const data= await response.json();
    allocatedRoutes = data.map((route)=> {
      return {
        route_id: route.id,
        route_name: route.terminal_point
      }
    });
    console.log(allocatedRoutes);
  } catch (error) {
    console.error('Error fetching routes:', error);
  }
  // unallocated routes
}

async function fetchBuses() {
  try {
    // fetch allocated & unallocated buses in seperate arrays
    const response = await fetch('http://localhost:3000/api/bus/');
    const data = await response.json();
    // console.log(data);
    allocatedBuses = data.map((bus)=>{
      return {
        bus_no: bus.reg_id
      }
    });
    console.log(allocatedBuses);
  } catch (error) {
    console.error('Error fetching buses:', error);
  }
}

  onMount(async () => {
    await fetchRoutes();
    await fetchBuses();
  });
</script>


{#if $isAuthenticated}
  <main
    class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900"
  >
    <div>
      <Navbar />
    </div>

    <div class="flex w-full justify-center items-center">
      <div class="w-1/2 py-5 px-5 my-10 rounded-lg shadow-lg bg-white-700">
        <h2 class="text-3xl font-bold underline uppercase text-maroon-500">
          Add Bus Staff
        </h2>

        <div class="flex flex-row">
          <div class="w-1/2">

            <!-- username -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="id">Staff ID:</label>
              <input
                required
                placeholder="eg: Altaf990"
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
                placeholder="eg: Altaf Mia"
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

            <!-- DOB -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="dob">Date of Birth:</label>
              <input 
                id="dob"
                class="w-full px-3 py-2 border rounded-md {dob === "" ? 'text-gray-400'  : 'text-black-900'}  focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                type="date"
                bind:value={dob}
              />
            </div>

            <!-- address -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="address">Address:</label>
              <input
                placeholder="eg: 123, ABC Road, XYZ"
                class=" w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                type="text"
                bind:value={address}
              />
            </div>
          </div>

          <div class = "w-1/2">
            <!-- allocate role -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="role">Select Role:</label>
             <select
                required
                class="{role===""?'text-gray-400':'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                id="roleDropdown"
                bind:value={role}>
              <option value="" hidden selected>Select Role</option>
              <option value="helper" class="text-black-900">Helper</option>
              <option value="driver" class="text-black-900">Driver</option>
            </select>
            </div>

            <!-- allocate route -->
            <div class = "my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="route">Allocate Route:</label>
              <select
                class="{route===""?'text-gray-400':'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                id="routeDropdown"
                bind:value={route}>
              <option value="" hidden>Select Route</option>
              <optgroup label="Allocated Route" class="text-maroon-500 italic">
              {#each allocatedRoutes as route}
                <option value={route.route_id} class="text-black-900 not-italic">{route.route_name}</option>
              {/each}
              </optgroup>
              <hr class="my-2 border border-gray-200" />
              <optgroup label="Unallocated Route" class="text-maroon-500 italic">
                {#each unallocatedRoutes as route}
                  <option value={route.route_id} class="text-black-900 not-italic">{route.route_name}</option>
                {/each}
                </optgroup>
              </select>
            </div>

            <!-- allocate bus -->
            <div class = "my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="bus">Allocate Bus:</label>
              <select
                class="{busno===""?'text-gray-400':'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                id="busDropdown"
                bind:value={busno}>
              <option value="" hidden>Select Bus</option>
              <optgroup label="Allocated Bus" class="text-maroon-500 italic">
              {#each allocatedBuses as bus}
                <option value={bus.bus_no} class="text-black-900 not-italic">{bus.bus_no}</option>
              {/each}
              </optgroup>
              <hr class="my-2 border border-gray-200" />
              <optgroup label="Unallocated Bus" class="text-maroon-500 italic">
                {#each unallocatedBuses as bus}
                  <option value={bus.bus_no} class="text-black-900 not-italic">{bus.bus_no}</option>
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
                errorMessage = 'Please enter a valid staff ID';
              }else if(name.length<=0){
                errorMessage = 'Please enter a valid name';
              }else if(phone.length!=11){
                errorMessage = 'Please enter a valid phone number';
              } else if(role.length<=0){
                errorMessage = 'Please select a role';
              }else if(password.length<8){
                errorMessage = 'Password must be at least 8 characters long';
              }else {
                addStaff();
              }
            }}>Add</button>
        </div>

        <!-- error popup -->
        {#if errorMessage.length>0}
          <ErrorPopUp errorMessage={errorMessage}
          on:closeError={()=>(errorMessage="")}/>
        {/if}

        {#if success==1}
          <SuccessfulPopUp successMessage={addStaffResponse}
          on:closeSuccess={()=>{success=-1;
          navigate("/busStaffList");}}/>
        {:else if success==0}
          <ErrorPopUp errorMessage={addStaffResponse}
          on:closeError={()=>(success=-1)}/>
        {/if}
       
      </div>
    </div>
</main>
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
                    alert('Please enter a valid staff ID');
                  }else if(name.length<=0){
                    alert('Please enter a valid name');
                  }else if(phone.length!=11){
                    alert('Please enter a valid phone number');
                  } else if(role.length<=0){
                    alert('Please select a role');
                  }else if(password.length<8){
                    alert('Password must be at least 8 characters long');
                  }else {
                    addStaff();
                  }
                }}>Add</button
              >
            </div>
          </div>
        </div>
      </div>
    </div> -->
 
