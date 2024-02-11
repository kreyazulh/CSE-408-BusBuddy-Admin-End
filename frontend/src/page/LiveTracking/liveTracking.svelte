<script>
    import { onMount, onDestroy } from "svelte";
    import { isAuthenticated } from "../../auth";
    import L from "leaflet";
    import Navbar from "../GlobalComponents/navbar.svelte";

    let map;
    let mapContainer;
    let sidebarOpen = false;
    let selectedTripDetails = null;

    let route = [];
    let locations = [];
    let routes = [];

    let tripId = "";
    let intervalId;

    async function fetchRoutes() {
    try {
    const response = await fetch('http://localhost:3000/api/route/');
    routes = await response.json();
    console.log(routes);
    } catch (error) {
    console.error('Error fetching routes:', error);
    }
    }

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    function addRouteToMap() {
    // Create a red polyline from an array of LatLng points with a specific width
    L.polyline(route, { color: 'red', opacity: 0.5, weight: 7 }).addTo(map);
    }

    function addLocationToMap() {
       L.polyline(locations, { color: 'maroon', opacity: 1, weight: 5 }).addTo(map);
       if (locations.length >= 2) {
           L.marker(locations[0]).addTo(map);
           L.marker(locations[locations.length - 1]).addTo(map);
       }
    //    map.fitBounds(locations);
    }

    async function getcord(tripId) {
        // Request for trip id
        const response = await fetch(
            `http://localhost:3000/api/proxyGetTripData`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ trip_id: tripId }),
            },
        );
        const data = await response.json();
        console.log("data:", data);
        console.log("tripId:", tripId);

        if (data.success && data.id === tripId) {
            selectedTripDetails = data;

            const pathData = data.path;
            console.log("pathData:", pathData);
            if (data.path && Array.isArray(data.path) && data.path.length > 0) {
                locations = pathData.map((item) => [
                    item.latitude,
                    item.longitude,
                ]);

                // Add markers and polyline after fetching data
                addLocationToMap();
            } else {
                console.error("Path data is undefined");
            }
        }
    }

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        tripId = urlParams.get("tripId");
        console.log("tripId:", tripId);

        fetchRoutes();


        map = L.map("map").setView([23.769213162447304, 90.36876120662684], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);
        //fetch route data from backend

        console.log("selectedTripDetails:", selectedTripDetails);
        //addRouteToMap();


        getcord(tripId);

        console.log("selectedTripDetails:", selectedTripDetails);

        intervalId = setInterval(() => {
            getcord(tripId);
        }, 10000);
    });

    
    // Clear the interval when the component is destroyed
    onDestroy(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    });
</script>


{#if isAuthenticated}
<div class="relative max-h-screen max-w-screen flex flex-row">
    <div class="z-10">
        <Navbar />
    </div>


    <div id="map" class="w-full ml-56 z-0" bind:this={map}></div>


    <!-- sidebar -->
    {#if !sidebarOpen}
        <div class="absolute top-1/2 bottom-0 right-0 z-10">
            <button
                class="h-20 text-white-700 bg-maroon-500 hover:bg-maroon-900 focus:outline-none rounded-l-lg pr-2 pl-1"
                on:click={toggleSidebar}>
                <svg
                    class="w-6 h-8"
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
        <div class="absolute top-0 bottom-0 right-0 left-auto z-10">
            <div class="flex flex-row-reverse h-full w-full">
                <div
                    class="bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900">
                    {#if selectedTripDetails}
                        <p class="text-gray-300 text-xl font-bold px-5 pt-5">Trip ID :
                            <span class="text-white-900">{selectedTripDetails.id}</span>
                        </p>
                        <p class="text-gray-300 text-lg font-semibold px-5 pt-3 pb-2">Route : 
                            <span class="text-white-900">{selectedTripDetails.route}</span>
                        </p>
                        <p class="text-gray-300 text-normal font-normal px-5">Shift : 
                            <span class="text-white-900">{selectedTripDetails.time_type}</span>
                        </p>
                        <p class="text-gray-300 text-lg font-semibold px-5 pt-10 pb-2">Bus No : 
                            <span class="text-white-900">{selectedTripDetails.bus}</span>
                        </p>
                        <p class="text-gray-300 text-normal font-normal px-5 pb-2">Bus Type : 
                            <span class="text-white-900"></span>
                        </p>
                        <p class="text-gray-300 text-normal font-normal px-5">No of Passengers : 
                            <span class="text-white-900"></span>
                        </p>
                        <p class="text-gray-300 text-lg font-semibold px-5 pt-10 pb-2">Driver : 
                            <span class="text-white-900">{selectedTripDetails.driver}</span>
                        </p>
                        <p class="text-gray-300 text-normal font-normal px-5">Phone No : 
                            <span class="text-white-900"></span>
                        </p>
                        <p class="text-gray-300 text-lg font-semibold px-5 pt-10 pb-2">Helper : 
                            <span class="text-white-900">{selectedTripDetails.helper}</span>
                        </p>
                        <p class="text-gray-300 text-normal font-normal px-5">Phone No : 
                            <span class="text-white-900"></span>
                        </p>
                    {/if}
                </div>

                <button
                    class="z-10 h-20 mt-28 text-white-700 bg-maroon-500 hover:bg-maroon-900 focus:outline-none rounded-l-lg pr-2 pl-1"
                    on:click={toggleSidebar}
                >
                    <svg
                        class="w-6 h-8"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    {/if}
</div>
{:else}
    <div>
        <p class="text-3xl font-extrabold text-maroon-500">Access Denied</p>
    </div>
{/if}
```
