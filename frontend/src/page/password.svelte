
<!-- on progress -->
<script>
    import { onMount } from 'svelte';
    import zxcvbn from 'zxcvbn';

    let showPasswordField = true;
    let passwordScore = 0;
    let password = '';
    let charsLength = 12;
    let charsLower = true;
    let charsUpper = true;
    let charsNumeric = true;
    let charsSymbols = true;

    const chars = {
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numeric: '0123456789',
        symbols: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
    };

    function checkStrength(event) {
        password = event ? event.target.value : password;
        if (!password) return passwordScore = 0;
        passwordScore = zxcvbn(password).score + 1;
    }

    function generatePassword() {
        let charSet = '';
        if (charsLower) charSet += chars.lower;
        if (charsUpper) charSet += chars.upper;
        if (charsNumeric) charSet += chars.numeric;
        if (charsSymbols) charSet += chars.symbols;

        password = shuffleArray(charSet.split('')).join('').substring(0, charsLength);
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

<!-- HTML goes here, using Svelte's syntax for reactivity and event handling -->
<div class="min-w-screen min-h-screen bg-whte-700 flex items-center justify-center px-5 py-5">
    <div class="w-full mx-auto rounded-lg bg-white shadow p-5 text-gray-800" style="max-width: 500px">
        <div class="relative mb-2">
            <input type={showPasswordField ? 'password' : 'text'} value={password} class="w-full pl-3 pr-10 py-2 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition-colors" placeholder="Password" on:input={(e) => {checkStrength(); }}>
            <button class="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 focus:outline-none hover:text-indigo-500 transition-colors" on:click={() => showPasswordField = !showPasswordField}>
                <!-- You'll need to adjust the icon logic -->
            </button>
        </div>
        <div class="flex -mx-1">
            {#each Array(5) as _, i}
                <div class="w-1/5 px-1">
                    <div class="h-2 rounded-xl transition-colors bg-gray-200 {i < passwordScore ? (passwordScore <= 2 ? 'bg-red-400' : (passwordScore <= 4 ? 'bg-yellow-400' : 'bg-green-500')) : 'bg-gray-200'}"></div>
                </div>
            {/each}
        </div>
        <hr class="my-5 border border-gray-200">
        <div class="mb-2">
            <label for="charsLength" class="block text-xs font-semibold text-gray-500 mb-2">PASSWORD LENGTH</label>
            <input class="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Length" type="number" min="1" max="30" step="1" bind:value={charsLength} on:input={generatePassword}/>
            <input class="w-full" type="range" bind:value={charsLength} min="1" max="30" step="1" on:input={generatePassword}>
        </div>
        <div class="flex -mx-2 mb-2">
            <div class="w-1/2 px-2">
                <label for="charsLower">
                    <input type="checkbox" class="align-middle" id="charsLower" bind:checked={charsLower} on:input={generatePassword}>
                    <span class="text-xs font-semibold text-gray-500">LOWERCASE</span>
                </label>
            </div>
            <div class="w-1/2 px-2">
                <label for="charsUpper">
                    <input type="checkbox" class="align-middle" id="charsUpper" bind:checked={charsUpper} on:input={generatePassword}>
                    <span class="text-xs font-semibold text-gray-500">UPPERCASE</span>
                </label>
            </div>
        </div>
        <div class="flex -mx-2">
            <div class="w-1/2 px-2">
                <label for="charsNumeric">
                    <input type="checkbox" class="align-middle" id="charsNumeric" bind:checked={charsNumeric} on:input={generatePassword}>
                    <span class="text-xs font-semibold text-gray-500">NUMBERS</span>
                </label>
            </div>
            <div class="w-1/2 px-2">
                <label for="charsSymbols">
                    <input type="checkbox" class="align-middle" id="charsSymbols" bind:checked={charsSymbols} on:input={generatePassword}>
                    <span class="text-xs font-semibold text-gray-500">SYMBOLS</span>
                </label>
            </div>    
        </div>

    </div>
</div>

<style>
@import url(https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css);
</style>
