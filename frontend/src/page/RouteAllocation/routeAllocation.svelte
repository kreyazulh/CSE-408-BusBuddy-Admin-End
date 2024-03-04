<script>
    import Navbar from "../GlobalComponents/navbar.svelte";
    import { onMount } from "svelte";
    import { isAuthenticated } from "../../auth";

    let mode = 0;

    let sidebarOpen = false;
    let selectedRows=[];
    let selectedRows2 = [];

    let busAdd = false;
    let driverAdd = false;
    let staffAdd = false;

    let shrinkID = "";
    let selectionID = "";
    let selectionID2 = "";

    let selectionRowID =[];
    let selectionRowID2 =[];

    let changesAllocation = [];
    let changesBus = [];
    let changesDriver = [];
    let changesStaff = [];

    let selectionNo = 1;

    let allocations = [{id:1,route:"Badda",shift:"morning",bus:"Dhaka Metro 1",driver:"Mr. X",staff:"Mr. Y"},
                        {id:2,route:"Gulshan",shift:"morning",bus:"Dhaka Metro 2",driver:"Mr. X",staff:"Mr. Y"},
                        {id:3,route:"Banani",shift:"morning",bus:"Dhaka Metro 3",driver:"Mr. X",staff:"Mr. Y"},
                        {id:4,route:"Mirpur",shift:"morning",bus:"Dhaka Metro 4",driver:"Mr. X",staff:"Mr. Y"},
                        {id:5,route:"Mohammadpur",shift:"morning",bus:"Dhaka Metro 5",driver:"Mr. X",staff:"Mr. Y"},
                        {id:6,route:"Dhanmondi",shift:"morning",bus:"Dhaka Metro",driver:"Mr. X",staff:"Mr. Y"},
                        {id:7,route:"Uttara",shift:"morning",bus:"Dhaka Metro 7",driver:"Mr. X",staff:"Mr. Y"},
                        {id:8,route:"Motijheel",shift:"morning",bus:"Dhaka Metro 6",driver:"Mr. X",staff:"Mr. Y"},
                        {id:9,route:"Paltan",shift:"morning",bus:"Dhaka Metro",driver:"Mr. X",staff:"Mr. Y"},
                        {id:10,route:"Kamalapur",shift:"morning",bus:"Dhaka Metro",driver:"Mr. X",staff:"Mr. Y"},
                        {id:11,route:"Badda",shift:"morning",bus:"Dhaka Metro",driver:"Mr. X",staff:"Mr. Y"},
                        {id:12,route:"Gulshan",shift:"morning",bus:"Dhaka Metro",driver:"Mr. X",staff:"Mr. Y"},
                        {id:13,route:"Banani",shift:"morning",bus:"Dhaka Metro",driver:"Mr. X",staff:"Mr. Y"},
                        {id:14,route:"Mirpur",shift:"morning",bus:"Dhaka Metro",driver:"Mr. X",staff:"Mr. Y"},
                        {id:15,route:"Mohammadpur",shift:"morning",bus:"Dhaka Metro",driver:"Mr. X",staff:"Mr. Y"},]

    let bus = [];//['BA-01-1111','BA-01-2222','BA-01-3333','BA-01-4444','BA-01-5555','BA-01-6666','BA-01-7777','BA-01-8888','BA-01-9999','BA-01-0000'];
    let driver = [];// ['Mr. X','Mr. Y','Mr. Z','Mr. A','Mr. B','Mr. C','Mr. D','Mr. E','Mr. F','Mr. G'];
    let staff = [];//['Mr. P','Mr. Q','Mr. R','Mr. S','Mr. T','Mr. U','Mr. V','Mr. W','Mr. X','Mr. Y'];

    let allDriver = [];
    let allStaff = [];

    function handleClick(name) {
    shrinkID = name;
    setTimeout(() => {
      shrinkID = null;
    }, 100);
    }

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }


    function select(index,string) {
        if(mode === 0) {
            selectionID = index+string;
            selectedRows.length = 0;
            selectedRows.push({index:index, name: string});
            console.log(selectedRows[0].index);
            if(string === 'bus') {
                busAdd = true;
                driverAdd = false;
                staffAdd = false;
            }
            else if(string === 'driver') {
                busAdd = false;
                driverAdd = true;
                staffAdd = false;
            }
            else if(string === 'staff') {
                busAdd = false;
                driverAdd = false;
                staffAdd = true;
            }
        }

        else if(mode === 1) {
            if(selectionNo === 1){
                if(selectedRows.length == 0){
                    selectionID = index+string;
                    selectedRows.push({index:index, name: string});
                    console.log(selectedRows[0].index);
                }
                else if(selectedRows.length === 1){
                    if(string == selectedRows[0].name){
                        selectionID2 = index+string;
                        selectedRows2.push({index:index, name: string});
                        console.log(selectedRows2[0].index);
                    }
                }
            }

            else if(selectionNo === 3){
                if(selectedRows.length === 0){
                    selectionRowID.length = 0;
                    selectionRowID.push(index+"bus");
                    selectionRowID.push(index+"driver");
                    selectionRowID.push(index+"staff");
                    selectedRows.push({index:index, name: "bus"});
                    selectedRows.push({index:index, name: "driver"});
                    selectedRows.push({index:index, name: "staff"});
                }
                else if(selectedRows.length === 3){
                    selectionRowID2.length = 0;
                    selectionRowID2.push(index+"bus");
                    selectionRowID2.push(index+"driver");
                    selectionRowID2.push(index+"staff");
                    selectedRows2.push({index:index, name: "bus"});
                    selectedRows2.push({index:index, name: "driver"});
                    selectedRows2.push({index:index, name: "staff"});
                }
            }
        }
    }

    function deselect(event) {
        if(event.key === "x" || event.key === "X") {
            if(mode === 0) {
                selectionID = "";
                selectedRows.length = 0;
                busAdd = false;
                driverAdd = false;
                staffAdd = false;
                console.log("de-selected");
            }
            else if(mode === 1) {
                if(selectionNo === 1){
                    selectionID = "";
                    selectionID2 = "";
                    selectedRows.length = 0;
                    selectedRows2.length = 0;
                    console.log("de-selected");
                }
                else{
                    selectionRowID.length = 0;
                    selectionRowID2.length = 0;
                    selectedRows.length = 0;
                    selectedRows2.length = 0;
                    console.log("de-selected");
                }
            }
        }
    }

    function selectUnallocatedBus(idx) {
        handleClick(idx+'buschange');
        console.log(idx);
        let allocationIndex = selectedRows[0].index;
        let temp = allocations[allocationIndex].bus;
        allocations[allocationIndex].bus = bus[idx];
        bus[idx] = temp;
        changesAllocation.push(allocationIndex);
        changesBus.push(idx);
    }

    function selectUnallocatedDriver(idx) {
        handleClick(idx+'driverchange');
        console.log(idx);
        let allocationIndex = selectedRows[0].index;
        let temp = allocations[allocationIndex].driver;
        allocations[allocationIndex].driver = driver[idx];
        driver[idx] = temp;
        changesAllocation.push(allocationIndex);
        changesDriver.push(idx);
    }

    function selectUnallocatedStaff(idx) {
        handleClick(idx+'staffchange');
        console.log(idx);
        let allocationIndex = selectedRows[0].index;
        let temp = allocations[allocationIndex].staff;
        allocations[allocationIndex].staff = staff[idx];
        staff[idx] = temp;
        changesAllocation.push(allocationIndex);
        changesStaff.push(idx);
    }

    function changeMode(value) {
        mode = value;
        selectionID = "";
        selectionID2 = "";
        selectionRowID.length = 0;
        selectionRowID2.length = 0;
        selectedRows.length = 0;
        selectedRows2.length = 0;
        busAdd = false;
        driverAdd = false;
        staffAdd = false;
    }

    function changeSelectionNo(value) {
        selectionNo = value;
    }

    function swap(){
        handleClick("swap");
        if(selectionNo === 1){
            if(selectedRows.length === 1 && selectedRows2.length === 1){
                let allocationIndex1 = selectedRows[0].index;
                let allocationIndex2 = selectedRows2[0].index;
                if(selectedRows[0].name === 'bus'){
                    let temp = allocations[allocationIndex1].bus;
                    allocations[allocationIndex1].bus = allocations[allocationIndex2].bus;
                    allocations[allocationIndex2].bus = temp;
                }
                else if(selectedRows[0].name === 'driver'){
                    let temp = allocations[allocationIndex1].driver;
                    allocations[allocationIndex1].driver = allocations[allocationIndex2].driver;
                    allocations[allocationIndex2].driver = temp;
                }
                else if(selectedRows[0].name === 'staff'){
                    let temp = allocations[allocationIndex1].staff;
                    allocations[allocationIndex1].staff = allocations[allocationIndex2].staff;
                    allocations[allocationIndex2].staff = temp;
                }
                changesAllocation.push(allocationIndex1);
                changesAllocation.push(allocationIndex2);
            }
        }

        else if(selectionNo === 3){
            if(selectedRows.length === 3 && selectedRows2.length === 3){
                let allocationIndex1 = selectedRows[0].index;
                let allocationIndex2 = selectedRows2[0].index;
                let temp = allocations[allocationIndex1].bus;
                allocations[allocationIndex1].bus = allocations[allocationIndex2].bus;
                allocations[allocationIndex2].bus = temp;
                temp = allocations[allocationIndex1].driver;
                allocations[allocationIndex1].driver = allocations[allocationIndex2].driver;
                allocations[allocationIndex2].driver = temp;
                temp = allocations[allocationIndex1].staff;
                allocations[allocationIndex1].staff = allocations[allocationIndex2].staff;
                allocations[allocationIndex2].staff = temp;
                changesAllocation.push(allocationIndex1);
                changesAllocation.push(allocationIndex2);
            }
        }
    }

    function rotate(){
        handleClick("rotate");
        if(selectionNo === 1){
            if(selectedRows.length === 1 && selectedRows2.length === 1){
                let allocationIndex1 = selectedRows[0].index;
                let allocationIndex2 = selectedRows2[0].index;
                let index1 = allocationIndex1 < allocationIndex2 ? allocationIndex1 : allocationIndex2
                let index2 = index1 === allocationIndex1 ? allocationIndex2 : allocationIndex1
                if(selectedRows[0].name === 'bus'){
                    let temp = allocations[index1].bus;
                    for(let j=index1; j<index2; j++){
                        allocations[j].bus = allocations[j+1].bus;
                    }
                    allocations[index2].bus = temp;
                }
                else if(selectedRows[0].name === 'driver'){
                    let temp = allocations[index1].driver;
                    for(let j=index1; j<index2; j++){
                        allocations[j].driver = allocations[j+1].driver;
                    }
                    allocations[index2].driver = temp;
                }
                else if(selectedRows[0].name === 'staff'){
                    let temp = allocations[index1].staff;
                    for(let j=index1; j<index2; j++){
                        allocations[j].staff = allocations[j+1].staff;
                    }
                    allocations[index2].staff = temp;
                }
                for(let j=index1; j<=index2; j++){
                    changesAllocation.push(j);
                }
            }
        }

        else if(selectionNo === 3){
            if(selectedRows.length === 3 && selectedRows2.length === 3){
                let allocationIndex1 = selectedRows[0].index;
                let allocationIndex2 = selectedRows2[0].index;
                let index1 = allocationIndex1 < allocationIndex2 ? allocationIndex1 : allocationIndex2
                let index2 = index1 === allocationIndex1 ? allocationIndex2 : allocationIndex1
                let temp = allocations[index1].bus;
                let temp2 = allocations[index1].driver;
                let temp3 = allocations[index1].staff;
                for(let j=index1; j<index2; j++){
                    allocations[j].bus = allocations[j+1].bus;
                    allocations[j].driver = allocations[j+1].driver;
                    allocations[j].staff = allocations[j+1].staff;
                }
                allocations[index2].bus = temp;
                allocations[index2].driver = temp2;
                allocations[index2].staff = temp3;
                for(let j=index1; j<=index2; j++){
                    changesAllocation.push(j);
                }
            }
        }
    }

    async function saveChanges(){
        handleClick("save");

        try {
            const response = await fetch('http://localhost:3000/api/assignment/save/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ allocations })
            });
            
            if (response.ok) {
                console.log('Allocations sent successfully');
            } else {
                console.error('Failed to send allocations');
            }
        } catch (error) {
            console.error('Error:', error);
        }




        selectionID = "";
        selectionID2 = "";
        selectionRowID.length = 0;
        selectionRowID2.length = 0;
        selectedRows.length = 0;
        selectedRows2.length = 0;
        busAdd = false;
        driverAdd = false;
        staffAdd = false;
        //backend e data pathate hobe
        changesAllocation.length = 0;
        changesBus.length = 0;
        changesDriver.length = 0;
        changesStaff.length = 0;
    }

    async function getAllocations() {
        //backend theke data ante hobe
        
        const response2 = await fetch('http://localhost:3000/api/assignment/');
        const data2 = await response2.json();
        allocations = data2.map((row) => {
            return {
            id : row.id,
            route : row.route,
            shift: row.time_type,
            bus: row.default_bus,
            driver: row.default_driver,
            staff: row.default_helper
            };
        });
        for (let row in allocations){
            for (let key in allocations[row]){
                if (allocations[row][key] === null){
                    allocations[row][key] = "N/A";
            }
            }
        }

    }

    async function getBusList() {
      //unallocated kemne anbo jani na
      const response2 = await fetch('http://localhost:3000/api/assignment/unallocatedBuses');
      const data2 = await response2.json();
      bus = data2.map((row) => row.reg_id);
      console.log(bus);
    }
    async function getDriverList() {

        const response = await fetch('http://localhost:3000/api/staff/driver/');
      const data = await response.json();
      allDriver = data.map((row) => {
        return {
          id: row.id,
          name: row.name
        };
      });
      console.log(allDriver);
      // unallocated kemne anbo jani na
      const response2 = await fetch('http://localhost:3000/api/assignment/unallocatedDrivers');
      const data2 = await response2.json();
      driver = data2.map((row) => row.id);
    }
    async function getHelperList() {
        const response = await fetch('http://localhost:3000/api/staff/collector');
      const data = await response.json();
      allStaff = data.map((row) => {
        return {
          id: row.id,
          name: row.name
        };
      });
      console.log(allStaff);
      // unallocated kemne anbo jani na
      const response2 = await fetch('http://localhost:3000/api/assignment/unallocatedHelpers');
      const data2 = await response2.json();
      staff = data2.map((row) => row.id);
      console.log(staff);
    }

    onMount(async () => {
        getBusList();
        getDriverList();
        getHelperList();
        await getAllocations();
    });

</script>

<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css" />

{#if $isAuthenticated}
<main class="flex min-h-screen min-w-full">
  <div class="z-20">
    <Navbar />
  </div>

   <!-- Heading -->
    <div class="flex-1 ml-56 w-full pl-4 py-8 bg-white-700">
    <div class="flex items-start justify-start h-18">
      <h1 class="text-3xl font-bold underline uppercase text-maroon-500">Route Allocation</h1>
    </div>

    <div class="flex flex-row items-start justify-end mr-5">
        <label for="mode 0">
            <button on:click={()=>changeMode(0)}>
                {#if mode === 0}
                    <input type="radio" name="" id="" checked>
                {:else}
                    <input type="radio" name="" id="">
                {/if}
            </button>
            <span class="text-lg font-semibold text-black-700 mr-3">New Selection</span>
        </label>
        <label for="mode 1">
            <button on:click={()=>changeMode(1)}>
                {#if mode === 1}
                    <input type="radio" name="" id="" checked>
                {:else}
                    <input type="radio" name="" id="">
                {/if}
            </button>
            <span class="text-lg font-semibold text-black-700 mr-3">Rotate/Swap</span>
        </label>
    </div>

    {#if mode === 1}
        <div class="flex flex-row items-start justify-end mr-5">
            <label for="select 1">
                <button on:click={()=>changeSelectionNo(1)}>
                    {#if selectionNo === 1}
                        <input type="radio" name="" id="" checked>
                    {:else}
                        <input type="radio" name="" id="">
                    {/if}
                </button>
                <span class="text-lg font-semibold text-black-700 mr-3">Single Cell</span>
            </label>
            <label for="selection 3">
                <button on:click={()=>changeSelectionNo(3)}>
                    {#if selectionNo === 3}
                        <input type="radio" name="" id="" checked>
                    {:else}
                        <input type="radio" name="" id="">
                    {/if}
                </button>
                <span class="text-lg font-semibold text-black-700 mr-3">Three Cells</span>
            </label>
        </div>
        <button class="bg-transparent mx-2" class:shrink={shrinkID === "swap"}
        on:click={swap}>
            <i class="rotate-90 bx bx-transfer-alt bg-yellow-500 hover:bg-yellow-700 scale-150 rounded-lg px-2 py-2 text-white-700">
            </i>
        </button>
        <button class="bg-transparent mx-3" class:shrink={shrinkID === "rotate"}
        on:click={rotate}>
            <i class="bx bx-rotate-left bg-cyan-500 hover:bg-cyan-700 scale-150 rounded-lg px-2 py-2 text-white-700">
            </i>
        </button>
    {/if}

    {#if mode === 0}
       <!-- sidebar -->
      {#if !sidebarOpen}
      <div class="absolute top-1/3 bottom-0 right-0 z-10">
          <button class="h-20 text-white-700 bg-maroon-500 border-2 hover:bg-maroon-900 focus:outline-none rounded-l-lg pr-2 pl-1"
              on:click={toggleSidebar}>
              <svg class="w-6 h-8"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            d="M15 19l-7-7 7-7"/>
                </svg>
          </button>
      </div>
      {:else}
        <div class="absolute top-1/3 bottom-0 right-0 w-96 mr-10 z-10">
            <button class="h-20 text-white-700 bg-maroon-500 border-2 hover:bg-maroon-900 focus:outline-none rounded-l-lg pr-2 pl-1"
              on:click={toggleSidebar}>
              <svg class="w-6 h-8"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M9 5l7 7-7 7"/>
                </svg>
          </button>
        </div>
        <div class="absolute top-0 bottom-0 right-0 z-10 w-96 bg-gradient-to-b from-maroon-500  to-maroon-900">
            <div class="flex items-start justify-start h-18">
                <h1 class="text-xl font-semibold underline uppercase text-white-700 my-3 mx-3">Available</h1>
            </div>
            <div class = "flex flex-row">
                    <div class="flex flex-col mx-3">
                        <h1 class="text-white-700 text-s font-semibol underline mb-1">Bus</h1>
                        {#each bus as item,idx}
                            {#if selectedRows[0] == null}
                                <p class="text-white-700 text-s">{item}</p>
                            {:else}
                                {#if busAdd}
                                    <button class="flex flex-row focus:outline-none"
                                        class:shrink={shrinkID === idx+"buschange"}
                                        on:click={() => selectUnallocatedBus(idx)}>
                                        <svg class="w-6 h-6 text-white-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                        </svg>
                                        <p class="text-white-700 text-s">{item}</p>
                                    </button>
                                {:else}
                                    <p class="text-gray-400 text-s">{item}</p>
                                {/if}
                            {/if}
                        {/each}
                    </div>
                    <div class="flex flex-col mx-3">
                        <h1 class="text-white-700 text-s font-semibol underline mb-1">Driver</h1>
                        {#each driver as item,idx}
                        {#if selectedRows[0] == null}
                                <p class="text-white-700 text-s">{item}</p>
                            {:else}
                                {#if driverAdd}
                                    <button class="flex flex-row focus:outline-none"
                                        class:shrink={shrinkID === idx+"driverchange"}
                                        on:click={() => selectUnallocatedDriver(idx)}>
                                        <svg class="w-6 h-6 text-white-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                        </svg>
                                        <p class="text-white-700 text-s">{item}</p>
                                    </button>
                                {:else}
                                    <p class="text-gray-400 text-s">{item}</p>
                                {/if}
                            {/if}
                        {/each}
                    </div>
                    <div class="flex flex-col mx-3">
                        <h1 class="text-white-700 text-s font-semibol underline mb-1">Staff</h1>
                        {#each staff as item,idx}
                        {#if selectedRows[0] == null}
                                <p class="text-white-700 text-s">{item}</p>
                            {:else}
                                {#if staffAdd}
                                    <button class="flex flex-row focus:outline-none"
                                        class:shrink={shrinkID === idx+"staffchange"}
                                        on:click={() => selectUnallocatedStaff(idx)}>
                                        <svg class="w-6 h-6 text-white-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                        </svg>
                                        <p class="text-white-700 text-s">{item}</p>
                                    </button>
                                {:else}
                                    <p class="text-gray-400 text-s">{item}</p>
                                {/if}
                            {/if}
                        {/each}
                    </div>
            </div>
        </div>
      {/if}
    {/if}

    <div class="{sidebarOpen?'w-2/3':'w-full'} flex flex-col h-full mt-5 mb-3 bg-white-700 shadow-md overflow-x-auto">
        <table class="w-full table-auto border-collapse">
            <!-- Table header -->
            <thead>
                <tr>
                    <th class=" bg-white-700 w-auto">
                            <div class="py-3 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                              <span class="font-semibold uppercase text-xs text-black-700">ID</span>
                            </div>
                        </th>
                        <th class=" bg-white-700 w-auto">
                            <div class="py-3 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                              <span class="font-semibold uppercase text-xs text-black-700">Route</span>
                            </div>
                        </th>
                        <th class=" bg-white-700 w-auto">
                            <div class="py-3 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                              <span class="font-semibold uppercase text-xs text-black-700">Shift</span>
                            </div>
                        </th>
                        <th class=" bg-white-700 w-auto">
                            <div class="py-3 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                              <span class="font-semibold uppercase text-xs text-black-700">Allocated Bus</span>
                            </div>
                        </th>
                        <th class=" bg-white-700 w-auto">
                            <div class="py-3 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                              <span class="font-semibold uppercase text-xs text-black-700">Allocated Driver</span>
                            </div>
                        </th>
                        <th class=" bg-white-700 w-auto">
                            <div class="py-3 flex items-center justify-center space-x-1 bg-red-70 rounded-full">
                              <span class="font-semibold uppercase text-xs text-black-700">Allocated Staff</span>
                            </div>
                        </th>
                    </tr>
            </thead>

            <tbody>
                    <!-- Dynamic rows -->
                    {#each allocations as row, index}
                        <tr class="bg-white-700 pt-3" on:keypress={deselect}>
                            <td class="py-2 pl-2 pr-2 text-center w-auto border-2 border-gray-300 hover:bg-gray-200">{row.id}</td>
                            {#if index%3==0}
                                <td class="py-2 pl-2 pr-2 text-center w-auto border-2 border-gray-300 hover:bg-gray-200" rowspan="3">{row.route}</td>
                            {/if}
                            <td class="py-2 pl-2 pr-2 text-center w-auto border-2 border-gray-300 hover:bg-gray-200">{row.shift}</td>
                            <td class="w-auto border-2 border-gray-300 hover:bg-maroon-500 hover:text-white-700">
                                <button class="w-full h-full py-2 pl-2 pr-2 text-center focus:outline-none" 
                                    class:selected={selectionID === index+'bus' || selectionID2 === index+'bus' || selectionRowID.includes(index+'bus') || selectionRowID2.includes(index+'bus')}
                                    on:dblclick={() => select(index,'bus')}>{row.bus}</button>
                            </td>
                            <td class="w-auto border-2 border-gray-300 hover:bg-maroon-500 hover:text-white-700">
                                <button class="w-full h-full py-2 pl-2 pr-2 text-center focus:outline-none" 
                                     class:selected={selectionID === index+'driver' || selectionID2 === index+'driver' || selectionRowID.includes(index+'driver') || selectionRowID2.includes(index+'driver')}
                                    on:dblclick={() => select(index,'driver')}>{row.driver}</button>
                            </td>
                            <td class="w-auto border-2 border-gray-300 hover:bg-maroon-500 hover:text-white-700">
                                <button class="w-full h-full py-2 pl-2 pr-2 text-center focus:outline-none" 
                                     class:selected={selectionID === index+'staff' || selectionID2 === index+'staff' || selectionRowID.includes(index+'staff') || selectionRowID2.includes(index+'staff')}
                                    on:dblclick={() => select(index,'staff')}>{row.staff}</button>
                            </td>
                        </tr>
                    {/each}
            </tbody>
        </table>
        <div class="flex justify-end my-3">
            <button
            class=" bg-maroon-500 hover:bg-maroon-900 py-3 px-8 text-white-700 font-semibold rounded-full w-fit"
            class:shrink={shrinkID === "save"} on:click={saveChanges}>
            Save</button>
        </div> 
    </div>
    </div>
</main>
{:else}
    <div>
        <p class="text-3xl font-extrabold text-maroon-500">Access Denied</p>
    </div>
{/if}

<style>
    .selected {
      background-color: indianred;
      color: white;
      transform: scale3d(1.05, 1.05, 1.05);
    }

    .shrink {
    transform: translateY(2px);
    }
  </style>