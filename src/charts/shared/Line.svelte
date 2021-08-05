<script>
	import { getContext } from 'svelte';
	import { groupData } from '../../js/utils';

	const { data, xGet, yGet, zGet, zDomain, config } = getContext('LayerCake');

	export let lineWidth = 2.5;

	let groups;

	// Create a data series for each zKey (group)
	$: groups = groupData($data, $zDomain, $config.z);

	// Create a data series for each zKey
	$: if ($data) {
		if ($config.z) {
			let grps = [];
			$config.zDomain.forEach(group => {
				grps.push($data.filter(d => d[$config.z] == group));
			});
			groups = grps;
		} else {
			groups = [$data];
		}
	}

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
		  class="path-line"
			d="{makePath(group)}"
			stroke="{$config.z ? $zGet(group[0]) : $config.zRange[0]}"
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


