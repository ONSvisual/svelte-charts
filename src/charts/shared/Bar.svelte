<script>
	import { getContext, createEventDispatcher } from 'svelte';
	
	const { data, xScale, zGet, xDomain, zRange, config, custom } = getContext('LayerCake');
	const dispatch = createEventDispatcher()

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
		x1 = Math.abs(x1 - x0) < markerWidth ? x0 + markerWidth : x1;
		return `${x0},${y0} ${x0},${y1} ${x1},${y1} ${x1},${y0}`;
	};
	$: mapData = (coords) => {
		const arr = [];
		for (let i = 0; i < coords[0].length; i ++) {
			const x0 = Math.min(...coords.map(d => d[i].x1));
			const x1 = Math.max(...coords.map(d => d[i].x1));
			arr.push({x0, x1, y0: coords[0][i].y0, y1: coords[0][i].y1});
		}
		return arr;
	}

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
{#if mode === "confidence"}
<g class="line-group">
	{#each mapData($coords) as d, i}
		<polygon
			class='line-confidence'
			data-id="{i}"
			points="{makePoints($xScale(d.x0), $xScale(d.x1), d.y0, d.y1)}"
			fill="{overlayFill && $data[0][i][idKey] == selected ? colorSelect : overlayFill && highlighted.includes($data[0][i][idKey]) ? colorHighlight : $config.z ? $zGet($data[0][i]) : $zRange[0]}"
			opacity={0.3}
		/>
	{/each}
</g>
{/if}
<g class="bar-group">
	{#each $coords as group, i}
	  {#each group as d, j}
			{#if !(mode === 'confidence' && i > 0)}
		  <!-- svelte-ignore a11y-click-events-have-key-events -->
		  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		  <polygon
			  class='bar-rect'
			  data-id="{j}"
				transform="translate({mode == 'barcode' || (mode == 'comparison' && i > 0) ? -markerWidth / 2 : 0} 0)"
			  points="{makePoints($xScale(d.x0), $xScale(d.x1), d.y0, d.y1)}"
				stroke="{$data[i][j][idKey] == hovered ? colorHover : $data[i][j][idKey] == selected ? colorSelect : colorHighlight}"
				stroke-width="{$data[i][j][idKey] == hovered || $data[i][j][idKey] == selected || highlighted.includes($data[i][j][idKey]) ? lineWidth : 0}"
			  fill="{overlayFill && $data[i][j][idKey] == selected ? colorSelect : overlayFill && highlighted.includes($data[i][j][idKey]) ? colorHighlight : $config.z ? $zGet($data[i][j]) : $zRange[0]}"
				on:mouseover={hover ? (e) => doHover(e, $data[i][j]) : null}
				on:mouseleave={hover ? (e) => doHover(e, null) : null}
				on:focus={select ? (e) => doHover(e, $data[i][j]) : null}
				on:blur={select ? (e) => doHover(e, null) : null}
				on:click={select ? (e)  => doSelect(e, $data[i][j]) : null}
				tabindex="{hover || select ? 0 : -1}"
		  />
			{/if}
	  {/each}
	{/each}
</g>
{/if}

<style>
	.bar-group polygon, .line-group polygon {
		shape-rendering: crispEdges;
	}
</style>