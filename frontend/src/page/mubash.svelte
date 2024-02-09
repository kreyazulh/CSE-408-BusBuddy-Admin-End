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

      const marker1 = L.marker([23.72772109504178,90.39169264466838]).addTo(map);
      const marker2 = L.marker([23.763809074127288,90.36564046785911]).addTo(map);

      map.fitBounds([
        marker1.getLatLng(),
        marker2.getLatLng()
      ]);
      

        // @ts-ignore
        L.Routing.control({
            waypoints: [
            L.latLng(23.72772109504178,90.39169264466838),
            L.latLng(23.73909098406254,90.37553336535188),
            L.latLng(23.744501003619725,90.37244046931268),
            L.latLng(23.750650301853547, 90.36821656808486),
            L.latLng(23.757614175962193,90.36241335180047),
            L.latLng(23.763809074127288,90.36564046785911),
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