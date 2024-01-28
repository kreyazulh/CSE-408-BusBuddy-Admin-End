<script>
  import Navbar from "./navbar.svelte";
  import { isAuthenticated } from "../auth";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import Password from "./password.svelte";
  import zxcvbn from "zxcvbn";

  let id = "";
  let phone = "";
  let password = "";
  let role = "";
  let name = "";

  let addStaffResponse = "";

  async function addStaff() {
    // Create a JSON object with the data
    const staffData = {
      id: id,
      phone: phone,
      password: password,
      role: role,
      name: name,
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
      } else {
        // Request failed
        addStaffResponse = "Failed to add staff";
      }
      navigate("/busStaffList");
    } catch (error) {
      console.error("Error:", error);
      addStaffResponse = "Error occurred";
    }
  }

  let showPasswordField = false;
  let passwordScore = 0;
  let charsLength = 12;
  let charsLower = true;
  let charsUpper = true;
  let charsNumeric = true;
  let charsSymbols = true;

  const chars = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numeric: "0123456789",
    symbols: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
  };

  function checkStrength(event) {
    // password = event ? event.target.value : password;
    if (!password) return (passwordScore = 0);
    passwordScore = zxcvbn(password).score + 1;
  }

  function generatePassword() {
    let charSet = "";
    if (charsLower) charSet += chars.lower;
    if (charsUpper) charSet += chars.upper;
    if (charsNumeric) charSet += chars.numeric;
    if (charsSymbols) charSet += chars.symbols;

    password = shuffleArray(charSet.split(""))
      .join("")
      .substring(0, charsLength);
    checkStrength();
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  onMount(() => {
    generatePassword();
  });
</script>

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css"
/>

{#if $isAuthenticated}
  <main
    class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 to-maroon-900"
  >
    <div>
      <Navbar />
    </div>

    <div class="flex-1 w-full bg-black-900 bg-opacity-60">
      <div class="flex justify-center items-center">
        <div class="w-1/3 py-5 px-5 my-10 rounded-lg shadow-lg bg-white-700">
          <h2 class="text-3xl font-bold underline uppercase text-maroon-500">
            Add Bus Staff
          </h2>

          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="input1"
              >Staff ID:</label
            >
            <input
              required
              placeholder="eg: Altaf990"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              bind:value={id}
            />
          </div>

          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="input2"
              >Name:</label
            >
            <input
              required
              pattern="[A-Z]{30}"
              placeholder="eg: Altaf Mia"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              bind:value={name}
            />
          </div>

          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="input3"
              >Phone:</label
            >
            <input
              required
              pattern="[0-9]{11}"
              placeholder="eg: 0171*******"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              bind:value={phone}
            />
          </div>

          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="dropdown"
              >Select an Option:</label
            >
            <select
              required
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              id="dropdown"
              bind:value={role}
            >
              <option value="" disabled selected>Select Role</option>
              <option value="collector">collector</option>
              <option value="driver">driver</option>
            </select>
          </div>

          <div class="my-4 px-5">
            <label class="block text-gray-600 font-semibold mb-2" for="input4"
              >Password:</label
            >
            <div class="relative mb-2">
              {#if showPasswordField}
                <input
                  required
                  type="text"
                  class="w-full pl-3 pr-10 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition-colors"
                  placeholder="Password"
                  on:input={(e) => {
                    checkStrength();
                  }}
                  bind:value={password}
                />
              {:else}
                <input
                  required
                  type="password"
                  class="w-full pl-3 pr-10 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition-colors"
                  placeholder="Password"
                  on:input={(e) => {
                    checkStrength();
                  }}
                  bind:value={password}
                />
              {/if}
              <button
                class="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 focus:outline-none hover:text-maroon-500 transition-colors"
                on:click={() => (showPasswordField = !showPasswordField)}
              >
                {#if showPasswordField}
                  <i class="mdi mdi-eye"></i>
                {:else}
                  <i class="mdi mdi-eye-off"></i>
                {/if}
              </button>
            </div>
            <div class="flex -mx-1">
              {#each Array(5) as _, i}
                <div class="w-1/5 px-1">
                  <div
                    class="h-2 rounded-xl transition-colors bg-gray-200 {i <
                    passwordScore
                      ? passwordScore <= 2
                        ? 'bg-red-400'
                        : passwordScore <= 4
                          ? 'bg-yellow-400'
                          : 'bg-lime-500'
                      : 'bg-gray-200'}"
                  ></div>
                </div>
              {/each}
            </div>
            <hr class="my-5 border border-gray-200" />
            <div class="mb-2">
              <label
                for="charsLength"
                class="block text-xs font-semibold text-gray-500 mb-2"
                >PASSWORD LENGTH</label
              >
              <input
                class="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-300 transition-colors"
                placeholder="Length"
                type="number"
                min="1"
                max="30"
                step="1"
                bind:value={charsLength}
                on:input={generatePassword}
              />
              <input
                class="w-full"
                type="range"
                bind:value={charsLength}
                min="1"
                max="30"
                step="1"
                on:input={generatePassword}
              />
            </div>
            <div class="flex -mx-2 mb-2">
              <div class="w-1/2 px-2">
                <label for="charsLower">
                  <input
                    type="checkbox"
                    class="align-middle"
                    id="charsLower"
                    bind:checked={charsLower}
                    on:input={generatePassword}
                  />
                  <span class="text-xs font-semibold text-gray-500"
                    >LOWERCASE</span
                  >
                </label>
              </div>
              <div class="w-1/2 px-2">
                <label for="charsUpper">
                  <input
                    type="checkbox"
                    class="align-middle"
                    id="charsUpper"
                    bind:checked={charsUpper}
                    on:input={generatePassword}
                  />
                  <span class="text-xs font-semibold text-gray-500"
                    >UPPERCASE</span
                  >
                </label>
              </div>
            </div>
            <div class="flex -mx-2">
              <div class="w-1/2 px-2">
                <label for="charsNumeric">
                  <input
                    type="checkbox"
                    class="align-middle"
                    id="charsNumeric"
                    bind:checked={charsNumeric}
                    on:input={generatePassword}
                  />
                  <span class="text-xs font-semibold text-gray-500"
                    >NUMBERS</span
                  >
                </label>
              </div>
              <div class="w-1/2 px-2">
                <label for="charsSymbols">
                  <input
                    type="checkbox"
                    class="align-middle"
                    id="charsSymbols"
                    bind:checked={charsSymbols}
                    on:input={generatePassword}
                  />
                  <span class="text-xs font-semibold text-gray-500"
                    >SYMBOLS</span
                  >
                </label>
              </div>
            </div>
            <p class="my-2 text-lg text-center text-indigo-500 font-bold">
              {addStaffResponse}
            </p>
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
    </div>
  </main>
{:else}
  <p>Not authenticated</p>
{/if}
