<script>
	import { getContext } from 'svelte';
	import { groupData, stackData } from '../../js/utils';

	const { data, xGet, yGet, xScale, yScale, z, zGet, zDomain, zRange, extents, config, custom } = getContext('LayerCake');
	
	export let opacity = 1; // Opacity of fills
	export let mode = 'default'; // options: 'default', 'stacked'
	
	let points = $custom.points;

	// Create a data series for each zKey (group)
	$: groups = mode == 'stacked' ? stackData($data, $zDomain, $config.y, $config.z) : groupData($data, $zDomain, $config.z);

	// Calculate points for data groups
	$: points.set(
		groups.map((d) => d.map((e) => {
			return {
				x: $xGet(e),
				y: $yGet(e)
			}
		})),
		{duration: $custom.animation ? $custom.duration : 0}
	);

	// Function to make SVG path
	const makeArea = (group, i) => {
		let yRange = $yScale.range();
		let path1 = 'M' + group
		.map(d => {
			return d.x + ',' + d.y;
		})
		.join('L');
		let path2 = i == 0 ?
		  'L' + group
		  .map(d => {
			  return d.x + ',' + yRange[0];
		  })
			.reverse()
		  .join('L') :
			'L' + [...$points[i - 1]].reverse()
			.map(d => {
				return d.x + ',' + d.y;
			})
			.join('L');
		let area = path1 + path2 + 'Z';
		return area;
	}
</script>

<g class="area-group">
	{#each $points as group, i}
	<path class='path-area' d='{makeArea(group, i)}' fill={$config.z ? $zGet(groups[i][0]) : $zRange[0]} {opacity}></path>
	{/each}
</g>
