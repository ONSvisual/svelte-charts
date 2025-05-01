<script>
  export let domain = null;
  export let colors = null;
  export let comparison = false; // true if chart uses bars + markers for comparison
  export let confidence = false; // true if chart uses confidence intervals
  export let horizontal = true; // true if marker lines should be horizontal, false if vertical
  export let markerWidth = 2.5;
  export let markerLength = 12;
  export let round = false; // to represent round markers
  export let yAxisLabel;

  $: _domain = confidence ? ["Estimate", "Confidence interval"] : domain;
</script>

<!-- {#if Array.isArray(_domain) && Array.isArray(colors)}
  <ul class="legend" aria-hidden="true" style:margin-bottom={yAxisLabel === "" ? "15px":"35px"}>
    {#each _domain as label, i}
      <li>
        <div
          class="bullet"
          class:round
          style:background-color="{confidence ? colors[0] : colors[i]}"
          style:width="{!horizontal && ((comparison && i != 0) || (confidence && i == 0)) ? markerWidth : markerLength}px"
          style:height="{horizontal && ((comparison && i != 0) || (confidence && i == 0)) ? markerWidth : markerLength}px"
          style:opacity="{confidence && i == 1 ? '0.3' : null}"
        />
        {label}
      </li>
    {/each}
  </ul>
{/if} -->

<!-- replaced the bullet approach with flex div approach so the legend items run better across multiple lines -->

{#if Array.isArray(_domain) && Array.isArray(colors)}
  <div id="legend" aria-hidden="true" style:margin-bottom={yAxisLabel === "" ? "15px":"35px"}>
    {#each _domain as label, i}
    <div class='legend--item'>
      <div
        class="legend--icon--circle"
        style:background-color="{confidence ? colors[0] : colors[i]}"
        style:width="{!horizontal && ((comparison && i != 0) || (confidence && i == 0)) ? markerWidth : markerLength}px"
        style:height="{horizontal && ((comparison && i != 0) || (confidence && i == 0)) ? markerWidth : markerLength}px"
        style:opacity="{confidence && i == 1 ? '0.3' : null}"
      />
      <div ><p class='legend--text'> {label}</p></div>
    </div>
    {/each}
  </div>
{/if}

<style>
  /* ul.legend {
    padding: 0;
    list-style-position: inside;
  }
  ul.legend li {
    display: inline;
    font-size: .8em;
  }
  .bullet {
		display: inline-block;
    vertical-align: middle;
    transform: translateY(-1px);
    border-radius: 50%;
    margin-left: 8px;

	}
  .round {
    border-radius: 50%;
  } */

  #legend {
  display: flex;
  flex-wrap: wrap;
  padding-top: 10px;
  margin-left: 1px;
  }

  .legend--item {
  display: flex;
  padding-right: 20px;
  padding-bottom: 12px;
}

.legend--icon--circle {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  align-self: center;
  flex-shrink: 0;
  forced-color-adjust: none;
}

.legend--text {
  color: #414042;
  line-height: 14px;
  font-size: 14px;
  padding-left: 6px;
  margin: 0;
}
</style>