<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import Navbar from '../GlobalComponents/navbar.svelte';
  import 'leaflet-routing-machine'; // Make sure to import Leaflet Routing Machine
  import { isAuthenticated } from '../../auth';



  let mapContainer;
  let map;
  let sidebarOpen = false;
  let routeDetails = null;
  let routeId = ''; // Assume this is obtained from somewhere, e.g., URL params or another part of your app
  let locations = [];

  function toggleSidebar() {
      sidebarOpen = !sidebarOpen;
  }

  async function fetchRouteDetails(routeId) {
    try {
      const response = await fetch(`/api/route/routeDetails/${routeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ routeId })
      });
      if (response.ok) {
        routeDetails = await response.json();
        console.log('routeDetails:', routeDetails);
        // Assuming routeDetails includes an array of { name, coords }

        if (routeDetails && routeDetails.stations) {
    locations = routeDetails.stations.map(station => {
        // Extract latitude and longitude from the coords string
        // Example of coords string: "(23.763809074127288,90.36564046785911)"
        const matches = station.coords.match(/\(([^)]+),([^)]+)\)/);
        if (matches) {
            const lat = parseFloat(matches[1]);
            const lng = parseFloat(matches[2]);
            return L.latLng(lat, lng);
        }
        return null;
    }).filter(location => location !== null); // Filter out any nulls in case of parsing failures

      console.log('locations:', locations);
      addRouteToMap(locations);
        } else {
          console.error('Path data is undefined');
        }
      } else {
        console.error('Failed to fetch route details');
      }
    } catch (error) {
      console.error('Error fetching route details:', error);
    }
  }

  function addRouteToMap(coords) {
    // Clear existing routes
    map.eachLayer(function (layer) {
      if (!!layer._route) { // Check if the layer is a routing layer
        map.removeLayer(layer);
      }
    });

    // Initialize routing control with the coords
    // @ts-ignore
    L.Routing.control({
      waypoints: coords,
      routeWhileDragging: false,
      show: true, // Set to true if you want to show the routing control
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{color: 'maroon', opacity: 1, weight: 5}]
      }
    }).addTo(map);
  }

  onMount(() => {
      const urlParams = new URLSearchParams(window.location.search);
      routeId = urlParams.get('routeId');
    map = L.map(mapContainer).setView([23.8103, 90.4125], 13); // Default to Dhaka, adjust as necessary
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Fetch and display route details
    fetchRouteDetails(routeId);
  });
</script>

{#if isAuthenticated}
<div class="relative max-h-screen max-w-screen flex flex-row">
  <div class="z-10">
      <Navbar />
  </div>
  <div id="map" class="w-full z-0" bind:this={mapContainer}></div>

  <!-- Sidebar and other UI elements for displaying route details -->
  <!-- Adjust according to your actual routeDetails structure -->
</div>
{:else}
<div>
  <p class="text-3xl font-extrabold text-maroon-500">Access Denied</p>
</div>
{/if}
  