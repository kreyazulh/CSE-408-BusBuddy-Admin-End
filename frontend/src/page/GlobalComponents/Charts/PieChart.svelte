<script>
    import { onMount, onDestroy } from 'svelte';
    import Chart from 'chart.js/auto';
  
    export let pieData; // Ensure pieData is received as a prop
  
    let canvas;
    let chart;
  
    onMount(() => {
      createChart();
    });
  
    // Reactive statement to update the chart when pieData changes
    $: if (chart && pieData) {
      updateChart();
    }
  
    function createChart() {
      const ctx = canvas.getContext('2d');
      chart = new Chart(ctx, {
        type: 'pie',
        data: pieData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Total User Distribution',
            },
        },
        },
      });
    }
  
    function updateChart() {
      chart.data = pieData; // Update the chart data
      chart.update(); // Chart.js method to update the chart
    }
  
    onDestroy(() => {
      if (chart) {
        chart.destroy();
      }
    });
  </script>
  
  <canvas bind:this={canvas}></canvas>
  