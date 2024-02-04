<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    // Pagination data
    let entriesPerPage = "10";

    // Function to update the entries per page
    function updateEntriesToShow(event) {
        entriesPerPage = event.target.value;
        dispatch("entriesPerPageChanged", entriesPerPage);
    }
</script>

<div class="flex mb-1">
    <label for="entriesToShow" class="text-sm font-semibold text-gray-700"
        >Show</label
    >
    <select
        id="entriesToShow"
        class="ml-1 mr-2 pl-1 bg-gray-300 rounded-full focus:bg-white-700 text-black-700 text-sm font-semibold h-6"
        bind:value={entriesPerPage}
        on:change={updateEntriesToShow}
    >
        <option value="10" class="text-sm">10</option>
        <option value="18" class="text-sm">18</option>
        <option value="27" class="text-sm">27</option>
    </select>
    <span class="text-sm font-semibold text-gray-700">entries</span>
</div>
