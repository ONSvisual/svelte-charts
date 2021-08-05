<script>
	import { getContext } from 'svelte';
	import { groupData, stackData } from '../../js/utils';

	const { data, xGet, xScale, yGet, yScale, yRange, zGet, zRange, zDomain, config, custom } = getContext('LayerCake');

	export let mode = 'default'; // options: 'default', 'comparison', 'marker', 'stacked'
	export let markerWidth = 2.5;

	let points = $custom.points;

	// Create a data series for each zKey (group)
	$: groups = mode == 'stacked' ? stackData($data, $zDomain, $config.y, $config.z) : groupData($data, $zDomain, $config.z);
	$: points.set(
		groups.map((d, i) => d.map((e, j) => {
			return {
				x: $xScale.bandwidth ? $xGet(e) : $xGet(e)[0],
				y: mode == 'marker' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? $yGet(e) - (markerWidth / 2) :
				  $yGet(e),
				w: $xScale.bandwidth ? $xScale.bandwidth() : Math.max(0, ($xGet(e)[1] - $xGet(e)[0])),
				h: mode == 'default' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? $yScale(0) - $yGet(e) :
				  mode == 'stacked' ? $yGet(groups[i - 1][j]) - $yGet(e) :
					markerWidth
			}
		})),
		{duration: $custom.animation ? $custom.duration : 0}
	);
</script>

<g class="column-group">
	{#each $points as group, i}
	  {#each group as d, j}
		  <rect
			  class='column-rect'
			  data-id="{j}"
			  x="{d.x}"
			  y="{d.y}"
			  height={d.h}
			  width="{d.w}"
			  fill="{$config.z ? $zGet(groups[i][j]) : $zRange[0]}"
		  ></rect>
	  {/each}
	{/each}
	{#if false}
	{#each groups as group, i}
	  {#each group as d, j}
		  {#if mode == 'default' || (mode == 'comparison' && i == 0)}
		    <rect
    			class='column-rect'
		    	data-id="{j}"
			    x="{$xScale.bandwidth ? $xGet(d) : $xGet(d)[0]}"
			    y="{$yGet(d)}"
    			width="{$xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}"
		    	height="{columnHeight(d)}"
			    fill="{$config.z ? $zGet(d) : $zRange[0]}"
		    />
			{:else}
			  <rect
    			class='column-marker'
		    	data-id="{j}"
			    x="{$xScale.bandwidth ? $xGet(d) : $xGet(d)[0]}"
			    y="{$yGet(d) - (markerWidth / 2)}"
    			width="{$xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}"
		    	height="{markerWidth}"
			    fill="{$zGet(d)}"
		    />
		  {/if}
		{/each}
	{/each}
	{/if}
</g>
