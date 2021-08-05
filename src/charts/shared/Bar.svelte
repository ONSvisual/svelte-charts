<script>
	import { getContext } from 'svelte';
	import { groupData, stackData } from '../../js/utils';

	const { data, xGet, yGet, zGet, zRange, zDomain, xScale, yScale, config, custom } = getContext('LayerCake');

	export let mode = 'default'; // options: 'default', 'comparison', 'marker'
	export let markerWidth = 2.5;

	let points = $custom.points;

	// Create a data series for each zKey (group)
	$: groups = mode == 'stacked' ? stackData($data, $zDomain, $config.x, $config.z) : groupData($data, $zDomain, $config.z);
	$: points.set(
		groups.map((d, i) => d.map((e, j) => {
			return {
				x: mode == 'default' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? $xScale(0) :
				  mode == 'stacked' ? $xGet(groups[i - 1][j]) :
					$xGet(e) - (markerWidth / 2),
				y: $yGet(e),
				w: mode == 'default' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? $xGet(e) :
				  mode == 'stacked' ? $xGet(e) - $xGet(groups[i - 1][j]) :
					markerWidth,
				h: $yScale.bandwidth()
			}
		})),
		{duration: $custom.animation ? $custom.duration : 0}
	);

</script>

<g class="bar-group">
	{#each $points as group, i}
	  {#each group as d, j}
		  <rect
			  class='bar-rect'
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
