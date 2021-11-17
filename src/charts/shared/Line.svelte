<script>
	import { getContext } from 'svelte';

	const { data, xScale, yScale, zGet, config, custom } = getContext('LayerCake');

	export let lineWidth = 2.5;
	
	let coords = $custom.coords;
	let idKey = $custom.idKey;

	// Function to make SVG path
	const makePath = (group) => {
		let path = 'M' + group
		.map(d => {
			return $xScale(d.x) + ',' + $yScale(d.y);
		})
		.join('L');
		return path;
	}
</script>

{#if $coords}
<g class="line-group">
	{#each $coords as group, i}
	  <path
		  class="path-line"
			d="{makePath(group)}"
			stroke="{$config.z ? $zGet($data[i][0]) : $config.zRange[0]}"
			stroke-width={lineWidth}
		/>
	{/each}
</g>
{/if}

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
</style>


