<script>
  import Navbar from "../GlobalComponents/navbar.svelte";
  import { isAuthenticated } from "../../auth";
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
  let dob = "";
  let address = "";
  let salary = 0;

  let addStaffResponse = "";

  let success = -1;
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
      const response = await fetch("/api/staff/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffData),
      });
      console.log(response);
      console.log(staffData);

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
</script>


{#if $isAuthenticated}
  <main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900">
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
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
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

            <!-- salary -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="salary">Salary:</label>
              <input
                placeholder="eg: 25000"
                class="{salary===0 ? 'text-gray-400' : 'text-black-900'} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500"
                type="number"
                bind:value={salary}
              />
            </div>

            <!-- password -->
            <div class="my-4 px-5">
              <label class="block text-gray-600 font-semibold mb-2" for="password">Password:</label>
              <Password password={password} on:passwordChanged={handlePasswordChange}/>
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

        <!-- success popup -->
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