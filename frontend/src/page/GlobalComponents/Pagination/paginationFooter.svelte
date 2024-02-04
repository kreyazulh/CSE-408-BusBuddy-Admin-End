<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    // Pagination data
    export let totalEntries = 0;
    export let entriesPerPage = 10;
    export let currentPage = 1;
    export let totalPages = 1;

     // Function to navigate to a page
   function goToPage(page) {
    currentPage = page;
    dispatch("pageChanged", currentPage);
  }

  
  // Function to get the range of numbers to display in pagination
  function paginationRange(current, total) {
    let start = current - 2 > 0 ? current - 2 : 1;
    let end = current + 2 < total ? current + 2 : total;

    let range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }
</script>

<!-- Styled Pagination -->
<div class="flex justify-between items-center mt-4">
    <span class="text-xs font-regular text-black-700">
        Showing {(currentPage - 1) * Number(entriesPerPage) + 1} to {currentPage *
            Number(entriesPerPage) >
        totalEntries
            ? totalEntries
            : currentPage * Number(entriesPerPage)} of {totalEntries} entries
    </span>
    <div class="inline-flex">
        <button
            class="py-1 px-2 leading-tight text-sm text-gray-500 bg-white-700 rounded-l-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
        >
            Previous
        </button>
        {#each paginationRange(currentPage, totalPages) as page}
            <button
                class={`py-1 px-2 leading-tight ${
                    currentPage === page
                        ? "text-white-700 bg-maroon-500 hover:bg-maroon-900"
                        : "text-gray-500 bg-white-700 hover:bg-gray-200"
                }`}
                on:click={() => goToPage(page)}
            >
                {page}
            </button>
        {/each}
        <button
            class="py-1 px-2 leading-tight text-sm text-gray-500 bg-white-700 rounded-r-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            Next
        </button>
    </div>
</div>
