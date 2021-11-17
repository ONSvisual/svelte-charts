<script>
	import { getContext } from 'svelte';

	const { data, xScale, yScale, zGet, zRange, config, custom } = getContext('LayerCake');
	
	export let opacity = 1; // Opacity of fills
	
	let coords = $custom.coords;
	let idKey = $custom.idKey;

	// Function to make SVG path
	const makeArea = (group, i) => {
		let yRange = $yScale.range();
		let path1 = 'M' + group
		.map(d => {
			return $xScale(d.x) + ',' + $yScale(d.y);
		})
		.join('L');
		let path2 = i == 0 ?
		  'L' + group
		  .map(d => {
			  return $xScale(d.x) + ',' + yRange[0];
		  })
			.reverse()
		  .join('L') :
			'L' + [...$coords[i - 1]].reverse()
			.map(d => {
				return $xScale(d.x) + ',' + $yScale(d.y);
			})
			.join('L');
		let area = path1 + path2 + 'Z';
		return area;
	}
</script>

{#if $coords}
<g class="area-group">
	{#each $coords as group, i}
	<path class='path-area' d='{makeArea(group, i)}' fill={$config.z ? $zGet($data[i][0]) : $zRange[0]} {opacity}></path>
	{/each}
</g>
{/if}
