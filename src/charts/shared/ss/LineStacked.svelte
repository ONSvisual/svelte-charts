<script>
	import { getContext } from 'svelte';
	import { stackData } from '../../../../js/utils';

	const { data, xGet, yGet, zGet, zDomain, config } = getContext('LayerCake');

	export let lineWidth = 2.5;

	// Create a data series for each zKey (group), and stack by yKey (value)
	$: groups = stackData($data, $zDomain, $config.y, $config.z);

	// Function to make SVG path
	$: makePath = (group) => {
		let path = 'M' + group
		.map(d => {
			return $xGet(d) + ',' + $yGet(d);
		})
		.join('L');
		return path;
	}
</script>

<g class="line-group">
	{#each groups as group}
	  <path
		  class='path-line'
			d='{makePath(group)}'
			stroke={$config.z ? $zGet(group[0]) : $config.zRange[0]}
			stroke-width={lineWidth}
		/>
	{/each}
</g>

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
</style>


