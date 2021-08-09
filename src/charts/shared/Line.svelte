<script>
	import { getContext } from 'svelte';
	import { groupData, stackData } from '../../js/utils';

	const { data, xGet, yGet, zGet, zDomain, config, custom } = getContext('LayerCake');

	export let lineWidth = 2.5;
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
	const makePath = (group) => {
		let path = 'M' + group
		.map(d => {
			return d.x + ',' + d.y;
		})
		.join('L');
		return path;
	}
</script>

<g class="line-group">
	{#each $points as group, i}
	  <path
		  class="path-line"
			d="{makePath(group)}"
			stroke="{$config.z ? $zGet(groups[i][0]) : $config.zRange[0]}"
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


