<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    // Search data
    export let originalRows = [];
    let searchQuery = "Search...";
    let searchRows = [];

    // Function to handle the search functionality
    function updateSearchQuery(event) {
        searchQuery = event.target.value;
        if (searchQuery.trim() === "") {
            searchRows = originalRows; // If the search query is empty, show all rows
        } else {
            // Filter rows based on the searchQuery
            searchRows = originalRows.filter((row) => {
                // Check if any value in the row contains the searchQuery as a substring
                return Object.values(row).some((value) => {
                    return (value !== null && value !== undefined) &&
                        value.toString().toLowerCase().includes(searchQuery.toLowerCase());       
                });
            });
        }
        dispatch("searchChanged", searchRows);
    }
</script>

<link
    rel="stylesheet"
    href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"
/>

<span class="h-8 bg-gray-300 rounded-full">
    <input
        id="search"
        type="text"
        class="h-7 px-3 bg-gray-300 text-sm text-gray-500 rounded-full focus:bg-white-700 focus:text-black-900 focus:ring focus:ring-maroon-500 focus:outline-none"
        bind:value={searchQuery}
        on:focus={() => {
            if (searchQuery === "Search...") searchQuery = "";
        }}
        on:blur={() => {
            if (searchQuery === "") searchQuery = "Search...";
        }}
        on:input={updateSearchQuery}
    />
    <span
        class="h-7 pl-1 pr-3 bg-transparent transform scale-110 text-gray-500 rounded-full transition-transform duration-100 ease-in-out"
    >
        <i class="bx bx-search-alt-2"></i>
    </span>
</span>
