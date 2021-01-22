<script>
  import {
    getContext
  } from 'svelte';

  const {
    data,
    xGet,
    yGet,
    xScale,
    yScale
  } = getContext('LayerCake');

  export let fill = "#ccc"
</script>
<g class="bubble-group">
  {#each $data as d,i}
  <circle class='circle-bubble' , data-id="{i}" cx="{$xGet.(d)}" cy="{$yGet.(d)}" r="{$rGet(d)}" {fill}></circle>
  {/each}
</g>
