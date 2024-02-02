<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let isShrink = false;
    export let successMessage = "";

    function closePopup() {
        handleClick();
        dispatch("closeSuccess");
    }

    function handleClick() {
        isShrink = true;
        setTimeout(() => {
            isShrink = false;
        }, 100);
    }
</script>

<div class="fixed z-10 inset-0 overflow-y-auto" id="my-modal">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-black-900 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white-700 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            <div>
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-lime-300">
                    <svg class="h-6 w-6 text-lime-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div class="mt-3 text-center sm:mt-5">
                    <h3 class="text-2xl leading-6 font-medium text-gray-900" id="modal-headline">
                        Success
                    </h3>
                    <div class="mt-2">
                        <p class="text-normal text-gray-600">
                            {successMessage}
                        </p>
                    </div>
                </div>
            </div>
            <div class="mt-5 sm:mt-6">
                <button
                    class="inline-flex justify-center text-white-700 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-lime-500 text-base font-medium text-white hover:bg-lime-700 focus:outline-none sm:text-sm"
                    class:shrink={isShrink}
                    on:click={closePopup}>
                    OK
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    .shrink {
        transform: translateY(2px);
    }
</style>