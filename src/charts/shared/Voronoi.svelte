<script>
	import { Delaunay } from 'd3-delaunay';
	import { getContext, createEventDispatcher } from 'svelte';

	const { data, width, height, custom } = getContext('LayerCake');
	const dispatch = createEventDispatcher();

	export let hover = false;
	export let hovered = null;
	export let select = false;
	export let selected = null;

	let coords = $custom.coords;
	let idKey = $custom.idKey;

	function doHover(e, d) {
		if (hover) {
			hovered = d ? d[idKey] : null;
			dispatch('hover', {
				id: hovered,
				data: d,
				event: e
			});
		}
	}

	function doSelect(e, d) {
		if (select) {
			selected = d ? d[idKey] : null;
			dispatch('select', {
				id: selected,
				data: d,
				event: e
			});
		}
	}

	$: coordsArray = Array.isArray($coords) ? $coords.map(d => [d.x, d.y]) : [];
	$: voronoi = Delaunay.from(coordsArray).voronoi([0, 0, $width, $height]);

</script>

<style>
	.voronoi-cell {
		fill: none;
		stroke: none;
		pointer-events: all;
	}
</style>

{#if voronoi}
{#each $data as d, i}
	<path
		class="voronoi-cell"
		d={voronoi.renderCell(i)}
		on:mouseover={e => doHover(e, $data[i])}
		on:mouseleave={e => doHover(e, null)}
		on:focus={e => doHover(e, $data[i])}
		on:blur={e => doHover(e, null)}
		on:click={e => doSelect(e, $data[i])}
	/>
{/each}
{/if}
