<script>
	import { getContext, createEventDispatcher } from 'svelte';
	
	const { data, xScale, zGet, zRange, config, custom } = getContext('LayerCake');
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
<g class="bar-group">
	{#each $coords as group, i}
	  {#each group as d, j}
		  <rect
			  class='bar-rect'
			  data-id="{j}"
			  x="{mode == 'barcode' || (mode == 'comparison' && i > 0) ? $xScale(d.x) - (markerWidth / 2) : $xScale(d.x)}"
			  y="{d.y}"
			  height={d.h}
			  width="{(mode == 'barcode' || (mode == 'comparison' && i > 0)) && $xScale(d.w) < markerWidth ? markerWidth : $xScale(d.w)}"
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