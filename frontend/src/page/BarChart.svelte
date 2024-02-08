<script>
    import { onMount, onDestroy, afterUpdate } from 'svelte';
    import Chart from 'chart.js/auto';
  
    export let data;
    export let options;
  
    let canvas;
    let chart;
  
    onMount(() => {
      createChart();
    });
  
    afterUpdate(() => {
      if (chart) {
        chart.data = data;
        chart.options = options;
        chart.update();
      }
    });
  
    onDestroy(() => {
      if (chart) {
        chart.destroy();
      }
    });
  
    function createChart() {
      if (chart) {
        chart.destroy();
      }
      chart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data,
        options,
      });
    }
  </script>
  
  <canvas bind:this={canvas}></canvas>