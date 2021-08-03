<script>
  export let domain = null;
  export let colors = null;
  export let line = false; // true if line chart
  export let comparison = false; // true if chart uses bars + markers for comparison
  export let horizontal = true; // true if marker lines should be horizontal, false if vertical
  export let markerWidth = 2.5;
</script>

{#if Array.isArray(domain) && Array.isArray(colors)}
  <ul class="legend">
    {#each domain as label, i}
      <li>
        <div
          class="bullet"
          style="background-color: {colors[i]}; width: {!horizontal && (line || (comparison && i != 0)) ? markerWidth : 13}px; height: {horizontal && (line || (comparison && i != 0)) ? markerWidth : 13}px"
        />
        {label}
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul.legend {
    margin: 0;
    padding: 0;
  }
  ul.legend li {
    display: inline;
    font-size: .8em;
  }
  ul.legend li + li {
    margin-left: 8px;
  }
  .bullet {
		display: inline-block;
    vertical-align: middle;
	}
</style>