<script>
    import SearchBar from "../GlobalComponents/searchBar.svelte";

    let taxRecord = [
        {date: '02-01-24', description: 'Tax Paid', cost: '20000 taka'},
        {date: '01-01-23', description: 'Tax Paid', cost: '17000 taka'},
        {date: '02-01-22', description: 'Tax Paid', cost: '15000 taka'},
    ]
    let searchRows = taxRecord;
</script>

<div class="flex flex-col w-full h-full">
    <h1 class="text-4xl text-white-700 text-center underline mt-5">Tax Records</h1>
    <div class="flex flex-row justify-end">
        <button class="w-fit px-5 h-10 mt-5 mr-3 bg-cyan-500 hover:bg-cyan-700 rounded-lg text-white-700 font-sans">Print</button>
        <button class="w-fit px-5 h-10 mt-5 mr-5 bg-indigo-600 hover:bg-indigo-800 rounded-lg text-white-700 font-sans">Add New Record</button>
    </div>
    <div class="flex flex-row justify-start ml-2">
        <SearchBar originalRows={taxRecord} on:searchChanged={(event) => searchRows = event.detail} />
    </div>
    
    <table class="w-auto h-auto mx-5 my-5 bg-white-700 rounded-lg">
        <thead>
            <tr class="text-white-700 bg-maroon-500 rounded-lg text-center">
                <th class="p-2">Date</th>
                <th class="p-2">Description</th>
                <th class="p-2">Cost</th>
            </tr>
        </thead>
        <tbody>
            {#each searchRows as record}
                <tr class="text-black-900 bg-white-700 border-b-2 border-b-shadow text-center">
                    <td class="p-2">{record.date}</td>
                    <td class="p-2">{record.description}</td>
                    <td class="p-2">{record.cost}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>