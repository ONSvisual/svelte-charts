<script>
  export let domain = null;
  export let colors = null;
  export let line = false; // true if line chart
  export let comparison = false; // true if chart uses bars + markers for comparison
  export let confidence = false; // true if chart uses confidence intervals
  export let horizontal = true; // true if marker lines should be horizontal, false if vertical
  export let markerWidth = 2.5;
  export let markerLength = 13;
  export let round = false; // to represent round markers

  $: _domain = confidence ? ["Estimate", "Confidence interval"] : domain;
</script>

{#if Array.isArray(_domain) && Array.isArray(colors)}
  <ul class="legend" aria-hidden="true">
    {#each _domain as label, i}
      <li>
        <div
          class="bullet"
          class:round
          style:background-color="{confidence ? colors[0] : colors[i]}"
          style:width="{!horizontal && (line || (comparison && i != 0) || (confidence && i == 0)) ? markerWidth : markerLength}px"
          style:height="{horizontal && (line || (comparison && i != 0) || (confidence && i == 0)) ? markerWidth : markerLength}px"
          style:opacity="{confidence && i == 1 ? '0.3' : null}"
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
    transform: translateY(-1px);
	}
  .round {
    border-radius: 50%;
  }
</style>