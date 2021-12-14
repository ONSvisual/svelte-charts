<script>
	import { getContext, createEventDispatcher } from 'svelte';

	const { data, yScale, zGet, zRange, config, custom } = getContext('LayerCake');
	const dispatch = createEventDispatcher();

	export let hover = false;
	export let hovered = null;
	export let select = false;
	export let selected = null;
	export let highlighted = [];
	export let overlayFill = false;

	let coords = $custom.coords;
	let idKey = $custom.idKey;

	let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
	let colorSelect = $custom.colorSelect ? $custom.colorSelect : 'black';
	let colorHighlight = $custom.colorHighlight ? $custom.colorHighlight : 'black';
	let lineWidth = $custom.lineWidth ? $custom.lineWidth : 2;
	let markerWidth = $custom.markerWidth ? $custom.markerWidth : 2.5;
	$: mode = $custom.mode ? $custom.mode : 'default';

	$: makePoints = (x0, x1, y0, y1) => {
		y0 = Math.abs(y1 - y0) < markerWidth ? y1 + markerWidth : y0;
		return `${x0},${y0} ${x0},${y1} ${x1},${y1} ${x1},${y0}`;
	};

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
</script>

{#if $coords}
<g class="column-group">
	{#each $coords as group, i}
	  {#each group as d, j}
			<polygon
				class='column-rect'
				data-id="{j}"
				transform="translate(0 {mode == 'barcode' || (mode == 'comparison' && i > 0) ? -markerWidth / 2 : 0})"
			  points="{makePoints(d.x0, d.x1, $yScale(d.y0), $yScale(d.y1))}"
				stroke="{$data[i][j][idKey] == hovered ? colorHover : $data[i][j][idKey] == selected ? colorSelect : colorHighlight}"
				stroke-width="{$data[i][j][idKey] == hovered || $data[i][j][idKey] == selected || highlighted.includes($data[i][j][idKey]) ? lineWidth : 0}"
				fill="{overlayFill && $data[i][j][idKey] == selected ? colorSelect : overlayFill && highlighted.includes($data[i][j][idKey]) ? colorHighlight : $config.z ? $zGet($data[i][j]) : $zRange[0]}"
				on:mouseover={e => doHover(e, $data[i][j])}
				on:mouseleave={e => doHover(e, null)}
				on:focus={e => doHover(e, $data[i][j])}
				on:blur={e => doHover(e, null)}
				on:click={e => doSelect(e, $data[i][j])}
			/>
	  {/each}
	{/each}
</g>
{/if}
