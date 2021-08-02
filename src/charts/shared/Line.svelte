<script>
	import { getContext } from 'svelte';

	const { data, xGet, yGet, zGet, config } = getContext('LayerCake');
	
	export let stacked = false; // Option to be used in association with stacked area charts

	let groups;

	// Create a data series for each zKey
	$: if ($data) {
		if ($config.z && stacked) {
			let grps = [];
			let base = JSON.parse(JSON.stringify($data.filter(d => d[$config.z] == $config.zDomain[0])));
			base.forEach(d => d[$config.y] = 0);
			$config.zDomain.forEach(group => {
				let clone = JSON.parse(JSON.stringify($data.filter(d => d[$config.z] == group)));
				if (stacked) {
					clone.forEach((d, i) => {
						d[$config.y] += base[i][$config.y];
						base[i][$config.y] = d[$config.y];
					});
				}
				grps.push(clone);
			});
			groups = grps;
		} else if ($config.z) {
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
	<path class='path-line' d='{makePath(group)}' stroke={$config.z ? $zGet(group[0]) : $config.zRange[0]}></path>
	{/each}
</g>

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}
</style>


