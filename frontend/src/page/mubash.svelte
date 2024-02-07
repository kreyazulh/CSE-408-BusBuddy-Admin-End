<script>
    import { onMount } from 'svelte';
    import 'leaflet-routing-machine'; // Import the routing machine plugin
    import L from 'leaflet';
  
    let mapContainer;
  
    onMount(() => {
      const map = L.map(mapContainer).setView([23.769213162447304, 90.36876120662684], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const marker1 = L.marker([23.76, 90.368]).addTo(map);
      const marker2 = L.marker([23.5, 90]).addTo(map);

      map.fitBounds([
        marker1.getLatLng(),
        marker2.getLatLng()
      ]);

        // @ts-ignore
        L.Routing.control({
            waypoints: [
            L.latLng(23.76, 90.368),
            L.latLng(23.5, 90)
            ],
            autoRoute: true
        }).addTo(map);
    });
  </script>
  
  <style>
    /* Ensure the map container takes up the full screen */
    :global(.map-container) {
      height: 100vh;
      width: 100%;
    }
  </style>
  
  <div class="map-container" bind:this={mapContainer}></div>
  