<script>
	import { getContext } from 'svelte';
	import { stackData } from '../../js/utils';

	const { data, xGet, xScale, yGet, yScale, z, zGet, zDomain, zRange, extents, config } = getContext('LayerCake');
	
	export let opacity = 1; // Opacity of fills

	// Create a data series for each zKey (group), and stack by yKey (value)
	$: groups = stackData($data, $zDomain, $config.y, $config.z);

	// Function to make SVG path
	$: makeArea = (group, i) => {
		const yRange = $yScale.range();
		let path1 = 'M' + group
		.map(d => {
			return $xGet(d) + ',' + $yGet(d);
		})
		.join('L');
		let path2 = i == 0 ?
		  'L' + $xScale($extents.x ? $extents.x[1] : 0) + ',' + yRange[0] +
			'L' + $xScale($extents.x ? $extents.x[0] : 0) + ',' + yRange[0] :
			'L' + [...groups[i - 1]].reverse()
			.map(d => {
				return $xGet(d) + ',' + $yGet(d);
			})
			.join('L');
		let area = path1 + path2 + 'Z';
		return area;
	}
</script>

<g class="area-group">
	{#each groups as group, i}
	<path class='path-area' d='{makeArea(group, i)}' fill={$config.z ? $zGet(group[0]) : $zRange[0]} {opacity}></path>
	{/each}
</g>
