<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import Navbar from './navbar.svelte';
  
    let mapContainer;
    let map;

    let emppp;

    let locations = [];

    function addMarkersAndPolyline() {
        console.log('locations:', locations);


        if (locations.length >= 2) {
        // Add marker at the start location
        L.marker(locations[0]).addTo(map);

        // Add marker at the end location
        L.marker(locations[locations.length - 1]).addTo(map);

        // Create a polyline connecting the locations
        const polyline = L.polyline(locations, { color: 'red' }).addTo(map);

        // Adjust the view to cover all markers
        map.fitBounds(polyline.getBounds());
    }

}
    let tripId = 1100;

    async function getcord() {
    // Request for trip id 1100
    const response = await fetch(`http://localhost:3000/api/trip/tracking?tripId=${tripId}`);
    const data = await response.json();
    console.log('data:', data);
      // Check if 'data' and 'data.path' are defined
      if (Array.isArray(data) && data.length > 0) {
    // Assuming the first element of the array has the 'path' key
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

  async function updateTripId(){
    const response = await fetch('http://localhost:3000/api/trip/validTripId');
    validTripIds = await response.json();
    getcord() ;
  }
  
    onMount(() => {
      map = L.map(mapContainer).setView([23.769213162447304, 90.36876120662684], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      
  
    updateTripId();
    tripId = 1100; 
    });
  </script>

  <main class="layout">
    <div><Navbar/></div>
    <div class="city-list"> 
        
    </div>
    <div class="map-area">
          <div bind:this={mapContainer} class="map-container"></div>
          <div><select bind:value={tripId}
            on:change={(event) =>
              updateTripId()}
          >
            {#each validTripIds as ids}
              <option value={ids.id}>{ids.id}</option>
            {/each}
          </select></div>
    </div>
  </main>
  
  <style>
    .layout {
        display: flex;
        height: 100vh;
    }
    .city-list {
        flex: 1;
        /* overflow-y: auto; For scrolling if the list is long */
        padding: 10px;
    }
    .map-area,
    .map-container {
        height: 100%;
        width: 100%;
    }
    .map-area {
        flex: 1;
        height: 50vh; /* Half of the viewport height */
    }
  </style>