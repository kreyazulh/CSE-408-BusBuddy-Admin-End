<script>
    import { onMount, onDestroy } from 'svelte';
    import L from 'leaflet';
    import Navbar from './navbar.svelte';
    

    let mapContainer;
    let map;
    let selectedTripDetails = null;
  
    let locations = [];
  
    let tripId = '';
    let intervalId; 
  
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

    let validTrips = [];
  
    async function getcord(tripId) {
      // Request for trip id
      const response = await fetch(`http://localhost:3000/api/proxyGetTripData`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ trip_id: tripId }),
          });
      const data = await response.json();
      console.log('data:', data);
      console.log('tripId:', tripId);

      if (data.success && data.id === tripId) {

        selectedTripDetails = data;

        const pathData = data.path;
        console.log('pathData:', pathData);
        if (data.path && Array.isArray(data.path) && data.path.length > 0) {
          locations = pathData.map(item => [item.latitude, item.longitude]);
  
          // Add markers and polyline after fetching data
          addMarkersAndPolyline();

        } else {
          console.error('Path data is undefined');
        }
      }
    }
  
  
    onMount(() => {

    const urlParams = new URLSearchParams(window.location.search);
      tripId = urlParams.get('tripId');
      console.log('tripId:', tripId);

      console.log(selectedTripDetails);
      map = L.map(mapContainer).setView([23.769213162447304, 90.36876120662684], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      getcord(tripId);

      console.log('selectedTripDetails:', selectedTripDetails);

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
  
  <main class="flex min-h-screen w-full">
    <Navbar /> <!-- Adjust the width as needed -->
    <div class="flex-1 flex flex-col items-center justify-start">
      <div id="map" class="h-1/2 w-1/2" bind:this={mapContainer}></div>
      <div class="w-1/2 mt-4">
        {#if selectedTripDetails}
        <div class="w-full">Trip ID: {selectedTripDetails.id}</div>
        <div class="w-full">Bus: {selectedTripDetails.bus}</div>
        <div class="w-full">Route: {selectedTripDetails.route}</div>
        <div class="w-full">Direction: {selectedTripDetails.travel_direction}</div>
        <div class="w-full">Shift: {selectedTripDetails.time_type}</div>
        <div class="w-full mt-2">Helper: {selectedTripDetails.helper}</div>
        <div class="w-full">Driver: {selectedTripDetails.driver}</div>
      {/if}
      </div>
    </div>
  </main>
  
  
  <style>
  
  </style>
  