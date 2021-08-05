<script>
	import { Delaunay } from 'd3-delaunay';
	import { getContext } from 'svelte';
	import { uniques } from 'layercake';

	const { data, xGet, yGet, width, height, custom } = getContext('LayerCake');

	let points = $custom.points;

	$: pointsArray = Array.isArray($points) ? $points.map(d => [d.x, d.y]) : [];

	function log (point, i) {
		// hover function
	}

	$: voronoi = Delaunay.from(pointsArray).voronoi([0, 0, $width, $height]);

</script>

<style>
	.voronoi-cell {
		fill: none;
		stroke: none;
		pointer-events: all;
	}

	.voronoi-cell:hover {
		stroke: #000;
	}
</style>

{#if pointsArray}
{#each pointsArray as point, i}
	<path class="voronoi-cell" d={voronoi.renderCell(i)} on:mouseover="{log(point, i)}"></path>
{/each}
{/if}
