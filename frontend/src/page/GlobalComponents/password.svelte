<script>
import zxcvbn from "zxcvbn";
import { onMount } from 'svelte';
import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();


export let password;
let showPasswordField = false;
let passwordScore = 0;
let charsLength = 0;
let charsLower = true;
let charsUpper = true;
let charsNumeric = true;
let charsSymbols = false;

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

  let pass = shuffleArray(charSet.split(""))
    .join("")
    .substring(0, charsLength);
  checkStrength();
  return pass;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function onInputChanged(event) {
    password = event.target.value;
    dispatch('passwordChanged', password);
  }

function passwordChanged(){
  let newPassword = generatePassword();
  if (newPassword !== password) {
    password = newPassword;
    dispatch("passwordChanged", password);
  }
}


onMount(() => {
  generatePassword();
});

</script>

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css"
/>


<div class="relative mb-2">
    {#if showPasswordField}
      <input
        required
        type="text"
        class="w-full pl-3 pr-10 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition-colors"
        placeholder="Select Password"
        on:input={(e) => {
          checkStrength();
          onInputChanged(e);
        }}
        bind:value={password}
      />
    {:else}
      <input
        required
        type="password"
        class="w-full pl-3 pr-10 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition-colors"
        placeholder="Select Password"
        on:input={(e) => {
          checkStrength();
          onInputChanged(e);
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

  <!-- bar -->
  <div class="flex -mx-1">
    {#each Array(5) as _, i}
      <div class="w-1/5 px-1">
        <div class="h-2 rounded-xl transition-colors bg-gray-200 
          {i < passwordScore ? passwordScore <= 2 ? 'bg-red-400' : passwordScore <= 4 ? 'bg-yellow-400' : 'bg-lime-500': 'bg-gray-200'}"></div>
      </div>
    {/each}
  </div>

  <hr class="my-5 border border-gray-200" />

  <!-- length bar -->
  <div class="mb-2">
    <label for="charsLength" class="block text-xs font-semibold text-gray-500 mb-2">PASSWORD LENGTH</label>
    <input
      class="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-3 focus:ring-maroon-500 transition-colors"
      placeholder="Length"
      type="number"
      min="1"
      max="30"
      step="1"
      bind:value={charsLength}
      on:input={passwordChanged}/>
    <input
      class="w-full"
      type="range"
      bind:value={charsLength}
      min="1"
      max="30"
      step="1"
      on:input={passwordChanged}/>
  </div>

  <!-- checkboxes -->
  <div class="flex -mx-2 mb-2">
    <div class="w-1/2 px-2">
      <label for="charsLower">
        <input
          type="checkbox"
          class="align-middle"
          id="charsLower"
          bind:checked={charsLower}
          on:input={passwordChanged}/>
        <span class="text-xs font-semibold text-gray-500">LOWERCASE</span>
      </label>
    </div>

    <div class="w-1/2 px-2">
      <label for="charsUpper">
        <input
          type="checkbox"
          class="align-middle"
          id="charsUpper"
          bind:checked={charsUpper}
          on:input={passwordChanged}/>
        <span class="text-xs font-semibold text-gray-500">UPPERCASE</span>
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
          on:input={passwordChanged}/>
        <span class="text-xs font-semibold text-gray-500">NUMBERS</span>
      </label>
    </div>

    <div class="w-1/2 px-2">
      <label for="charsSymbols">
        <input
          type="checkbox"
          class="align-middle"
          id="charsSymbols"
          bind:checked={charsSymbols}
          on:input={passwordChanged}/>
        <span class="text-xs font-semibold text-gray-500">SYMBOLS</span>
      </label>
    </div>
  </div>