<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let searchRows = [];
    export let sortColumn = "id";

    let shrinkID = null;

  function handleClick(name) {
    shrinkID = name;
    setTimeout(() => {
      shrinkID = null;
    }, 100);
  }

     // Function to sort the table
  function sortTable(sortOrder) {
    handleClick(sortColumn + sortOrder);
    searchRows = searchRows.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    });
    dispatch("sort", searchRows);
  }


</script>

<div class="flex flex-col">
    <button
      class="h-3 bg-transparent transform scale-75"
      on:click={() => sortTable("asc")}
    >
      <span
        class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
        class:shrink={shrinkID === sortColumn+"asc"}>▲</span
      >
    </button>
    <button
      class="bg-transparent transform scale-75"
      on:click={() => sortTable("desc")}
    >
      <span
        class="inline-block ml-1 my-0 text-xs text-maroon-900 hover:text-black-900"
        class:shrink={shrinkID === sortColumn+"desc"}>▼</span
      >
    </button>
  </div>

  <style>
    .shrink {
      transform: translateY(2px);
    }
  </style>