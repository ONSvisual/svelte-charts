<script>
	import { getContext} from 'svelte';

	const {data, xGet, yGet, xScale, yScale, custom} = getContext('LayerCake');

	export let avgData = [];
	export let spacing = 0.2;

	let coords = $custom.coords;
	let n_groups = $data.length;
	let n_bars_per_group = $data[0].length;

	const makePath = (x0, x1, y_avg) => {
		let width = (x1 - x0) * (n_bars_per_group - (1 - 1 / (1 + spacing)));
		let overlap = 5;
		let start = x0 - overlap;
		let end = x0 + width + overlap;
		let path = 'M' + start + ', ' + $yScale(y_avg) + 'L' + end + ', ' + $yScale(y_avg) 
		return path;
	}
	
	$: mode = $custom.mode ? $custom.mode : 'default';

</script>


<g class="column-group">
	{#each $data as d, i}
		<path d="{makePath($xGet(d[0]), $xGet(d[1]), avgData[i])}" 
				stroke-dasharray="6, 6"
				stroke="#c3c3c3"
				fill="none"
				stroke-width="1.4"
			/>
	{/each}
</g>
