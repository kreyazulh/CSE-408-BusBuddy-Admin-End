<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import Navbar from './navbar.svelte';
  

  let mapContainer;
  let map;
  let selectedTripDetails = null;

  let locations = [];

  let tripId = '';

  // Variables to store markers and polyline
  let startMarker, endMarker, polyline;

  function addMarkersAndPolyline() {
    console.log('locations:', locations);

    // Clear previous markers and polyline
    if (startMarker) map.removeLayer(startMarker);
    if (endMarker) map.removeLayer(endMarker);
    if (polyline) map.removeLayer(polyline);

    if (locations.length >= 2) {
      // Add marker at the start location
      startMarker = L.marker(locations[0]).addTo(map);

      // Add marker at the end location
      endMarker = L.marker(locations[locations.length - 1]).addTo(map);

      // Create a polyline connecting the locations
      polyline = L.polyline(locations, { color: 'red' }).addTo(map);

      // Adjust the view to cover all markers
      map.fitBounds(polyline.getBounds());
    }
  }

  async function getcord() {
    // Request for trip id
    const response = await fetch(`http://localhost:3000/api/trip/tracking?tripId=${tripId}`);
    const data = await response.json();
    console.log('data:', data);
    if (Array.isArray(data) && data.length > 0) {
      const pathData = data[0].path;
      if (pathData) {
        locations = pathData.map(item => [item.x, item.y]);

        // Add markers and polyline after fetching data
        addMarkersAndPolyline();
      } else {
        console.error('Path data is undefined');
      }
    }
  }

  let validTripIds = [];

  async function updateTripId() {
    const response = await fetch('http://localhost:3000/api/trip/validTripId');
    validTripIds = await response.json();
    console.log('validTripIds:', validTripIds);
    if (tripId) {
      selectedTripDetails = validTripIds.find(trip => trip.id === tripId);
    }
    getcord();
  }

  onMount(() => {
    map = L.map(mapContainer).setView([23.769213162447304, 90.36876120662684], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    updateTripId();
  });
</script>

<main class="flex min-h-screen w-full">
  <Navbar /> <!-- Adjust the width as needed -->
  <div class="flex-1 flex flex-col items-center justify-start">
    <div id="map" class="h-1/2 w-1/2" bind:this={mapContainer}></div>
    <div class="w-1/2 mt-4">
      <select class="form-select block w-full" bind:value={tripId} on:change={() => updateTripId()}>
        {#each validTripIds as ids}
          <option value={ids.id}>{ids.id}</option>
        {/each}
      </select>

      {#if selectedTripDetails}
      <div class="w-full mt-2">Helper: {selectedTripDetails.helper}</div>
      <div class="w-full">Driver: {selectedTripDetails.driver}</div>
      <div class="w-full">Route: {selectedTripDetails.route}</div>
    {/if}
    </div>
  </div>
</main>


<style>

</style>
