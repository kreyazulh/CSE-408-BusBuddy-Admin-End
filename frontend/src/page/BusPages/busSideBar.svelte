<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let navID = 0;
    $: dispatch("navID", navID);
</script>
  
  <!-- component -->
  <link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css" />
  
  <div class="h-fit flex flex-row bg-white-700">
    <div class="flex flex-col w-56 bg-white-700 rounded-r-3xl overflow-hidden h-full postion: fixed">
      <ul class="flex flex-col py-4">
        <li>
          <button class="w-full flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-700 hover:text-maroon-900 focus:shadow focus:text-maroon-900 focus:bg-gray-300 focus:outline-none"
            autofocus
            on:focus={() => navID = 1}>
            <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-maroon-900"><i class="bx bxs-info-circle"></i></span>
            <span class="text-xs font-medium">Bus Details</span>
          </button>
        </li>
        <li>
            <button class="w-full flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-700 hover:text-maroon-900 focus:shadow focus:text-maroon-900 focus:bg-gray-300"
                on:focus={() => navID = 2}>
                <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-maroon-900"><i class="bx bxs-gas-pump"></i></span>
                <span class="text-xs font-medium">Fuel Records</span>
            </button>
        </li>
        <li>
            <button class="w-full flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-700 hover:text-maroon-900 focus:shadow focus:text-maroon-900 focus:bg-gray-300"
                on:focus={() => navID = 3}>
                <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-maroon-900"><i class="bx bxs-wrench"></i></span>
                <span class="text-xs font-medium">Maintenance Records</span>
            </button>
        </li>
        <li>
            <button class="w-full flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-700 hover:text-maroon-900 focus:shadow focus:text-maroon-900 focus:bg-gray-300"
                on:focus={() => navID = 4}>
                <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-maroon-900"><i class="bx bxs-car-mechanic"></i></span>
                <span class="text-xs font-medium">Fitness Records</span>
            </button>
        </li>
        <li>
            <button class="w-full flex flex-row items-center h-10 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-700 hover:text-maroon-900 focus:shadow focus:text-maroon-900 focus:bg-gray-300"
                on:focus={() => navID = 5}>
                <span class="inline-flex items-center justify-center h-10 w-12 text-lg focus:text-maroon-900"><i class="bx bxs-bank"></i></span>
                <span class="text-xs font-medium">Tax Records</span>
            </button>
        </li>
      </ul>
    </div>
  </div>
  
  