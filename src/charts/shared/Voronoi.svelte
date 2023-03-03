<script>
	import { Delaunay } from 'd3-delaunay';
	import { getContext, createEventDispatcher } from 'svelte';

	const { data, width, height, custom, xScale, yScale } = getContext('LayerCake');
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

	$: coordsArray = Array.isArray($coords) ? $coords.map(d => [$xScale(d.x), $yScale(d.y)]) : [];
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
<g class="voronoi-group">
{#each $data as d, i}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<path
		class="voronoi-cell"
		d={voronoi.renderCell(i)}
		on:mouseover={hover ? e => doHover(e, $data[i]) : null}
		on:mouseleave={hover ? e => doHover(e, null) : null}
		on:focus={select ? e => doHover(e, $data[i]): null}
		on:blur={select ? e => doHover(e, null) : null}
		on:click={select ? e => doSelect(e, $data[i]) : null}
		tabindex="{hover || select ? 0 : -1}"
	/>
{/each}
</g>
{/if}
