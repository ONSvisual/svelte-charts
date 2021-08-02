<script>
	import { getContext } from 'svelte';

	const { data, xGet, yGet, xScale, yScale, zGet, extents, config } = getContext('LayerCake');
	
	export let opacity = 1; // Opacity of fills
	export let stacked = false; // True for stacked areas instead of overlaid

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
	<path class='path-area' d='{makeArea(group, i)}' fill={$config.z ? $zGet(group[0]) : $config.zRange[0]} {opacity}></path>
	{/each}
</g>
