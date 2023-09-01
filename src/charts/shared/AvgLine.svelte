<script>
	import { getContext} from 'svelte';

	const {yScale, custom } = getContext('LayerCake');

	export let avgData = [];

	let coords = $custom.coords;

	const makePath = (x0, x1, y_avg) => {
		let overlap = 5;
		let start = x0 - overlap;
		let end = x1 + overlap;
		let path = 'M' + start + ', ' + $yScale(y_avg) + 'L' + end + ', ' + $yScale(y_avg) 
		return path;
	}

	$: mode = $custom.mode ? $custom.mode : 'default';

</script>

{#if $coords}
<g class="column-group">
	{#each $coords[0] as d, i}
		<path d="{makePath(d.x0, $coords[$coords.length - 1][i].x1, avgData[i])}" 
				stroke-dasharray="6, 6"
				stroke="#c3c3c3"
				fill="none"
				stroke-width="1.4"
			/>
	{/each}
</g>
{/if}
