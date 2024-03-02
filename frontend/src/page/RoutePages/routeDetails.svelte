<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import Navbar from '../GlobalComponents/navbar.svelte';
    import { isAuthenticated } from '../../auth';
  
    let mapContainer;
    let map;
    let sidebarOpen = false;
    let routeDetails = null;
    let routeId = ''; // Assume this is obtained from somewhere, e.g., URL params or another part of your app
  
    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }
  
    async function fetchRouteDetails(routeId) {
      try {
        const response = await fetch('http://localhost:3000/api/routeDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ routeId })
        });
        if (response.ok) {
          routeDetails = await response.json();
          // Assuming routeDetails includes an array of { name, coords }
          addLocationsToMap(routeDetails.coords);
        } else {
          console.error('Failed to fetch route details');
        }
      } catch (error) {
        console.error('Error fetching route details:', error);
      }
    }
  
    function addLocationsToMap(coords) {
      coords.forEach(([lat, lng]) => {
        L.marker([lat, lng]).addTo(map);
      });
  
      if (coords.length >= 2) {
        L.polyline(coords, { color: 'maroon', opacity: 1, weight: 5 }).addTo(map);
        map.fitBounds(coords);
      }
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
  <Navbar />
  <div id="map" class="w-full z-0" bind:this={mapContainer}></div>

  <!-- Sidebar and other UI elements for displaying route details -->
  <!-- Adjust according to your actual routeDetails structure -->
</div>
{:else}
<div>
  <p class="text-3xl font-extrabold text-maroon-500">Access Denied</p>
</div>
{/if}
  