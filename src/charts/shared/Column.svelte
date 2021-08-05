<script>
	import { getContext } from 'svelte';
	import { groupData, stackData } from '../../js/utils';

	const { data, xGet, xScale, yGet, yScale, zGet, zRange, zDomain, config, custom } = getContext('LayerCake');

	export let mode = 'default'; // options: 'default', 'comparison', 'marker', 'stacked', 'grouped'
	export let markerWidth = 2.5;

	let points = $custom.points;

	// Create a data series for each zKey (group)
	$: groups = mode == 'stacked' ? stackData($data, $zDomain, $config.y, $config.z) : groupData($data, $zDomain, $config.z);
	$: points.set(
		groups.map((d, i) => d.map((e, j) => {
			return {
				x: mode == 'grouped' && $xScale.bandwidth ? $xGet(e) + (i * (1 / groups.length) * $xScale.bandwidth()) :
				  mode == 'grouped' ? $xGet(e)[0] + (i * (1 / groups.length) * Math.max(0, ($xGet(e)[1] - $xGet(e)[0]))) :
				  $xScale.bandwidth ? $xGet(e) : $xGet(e)[0],
				y: mode == 'marker' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? $yGet(e) - (markerWidth / 2) :
				  $yGet(e),
				w: mode == 'grouped' && $xScale.bandwidth ? $xScale.bandwidth() / groups.length :
				  mode == 'grouped' ? Math.max(0, ($xGet(e)[1] - $xGet(e)[0])) / groups.length :
				  $xScale.bandwidth ? $xScale.bandwidth() :
				  Math.max(0, ($xGet(e)[1] - $xGet(e)[0])),
				h: mode == 'default' || mode == 'grouped' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? $yScale(0) - $yGet(e) :
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
</g>
