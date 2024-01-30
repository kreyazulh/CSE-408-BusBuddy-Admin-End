<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
  
    let mapContainer;
    let map;

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

    async function getcord() {
    // Request for trip id 1100
    const response = await fetch('http://localhost:3000/api/trip/tracking?tripId=1100');
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
  
    onMount(() => {
      map = L.map(mapContainer).setView([23.769213162447304, 90.36876120662684], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
  
    getcord() 
    });
  </script>
  
  <style>
    #map {
      height: 400px;
    }
  </style>
  
  <div bind:this={mapContainer} id="map"></div>