<script>
	import { getContext } from 'svelte';

	const { data, z, xScale, yScale, zGet, zRange, custom, yDomain } = getContext('LayerCake');

	export let hovered = null;
	export let selected = null;
	export let highlighted = [];
	export let overlayFill = false;

	let coords = $custom.coords;
	let idKey = $custom.idKey;

	let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
	let colorSelect = $custom.colorSelect ? $custom.colorSelect : 'black';
	let colorHighlight = $custom.colorHighlight ? $custom.colorHighlight : 'black';
	let lineColor = $custom.lineColor ? $custom.lineColor : 'grey';
	let lineWidth = $custom.lineWidth ? $custom.lineWidth : 2;
	let radius = $custom.radius ? $custom.radius : 6;
</script>

{#if $coords}
<g class="line-group">
	{#each $coords.map(d => ({x: d.map(e => e.x), y: d[0].y})) as d}
	<line
		x1="{$xScale(Math.min(...d.x))}"
		x2="{$xScale(Math.max(...d.x))}"
		y1="{$yScale(d.y) + ($yScale.bandwidth() / 2)}"
		y2="{$yScale(d.y) + ($yScale.bandwidth() / 2)}"
		stroke="{lineColor}"
		stroke-width="{lineWidth}"
	/>
	{/each}
</g>
<g class="dot-group">
	{#each $coords as group, i}
	  {#each group as d, j}
			<circle
				cx={$xScale(d.x)}
				cy={$yScale(d.y) + ($yScale.bandwidth() / 2)}
				r="{radius}"
				fill="{$z ? $zGet($data[i][j]) : $zRange[0]}"
			/>
		{/each}
	{/each}

	{#if idKey && (hovered || selected || highlighted[0])}
	{#each $coords as group, i}
		{#each group as d, j}
			{#if [...highlighted, selected, hovered].includes($data[i][idKey])}
			<circle
				class
				cx={$xScale(d.x)}
				cy={$yScale(d.y)}
				r={radius}
				fill="{overlayFill && $data[i][j][idKey] == selected ? colorSelect : overlayFill & highlighted.includes($data[i][j][idKey]) ? colorHighlight : 'none'}"
				stroke="{$data[i][j][idKey] == hovered ? colorHover : $data[i][j][idKey] == selected ? colorSelect : colorHighlight}"
				stroke-width="{$data[i][j][idKey] == hovered || $data[i][j][idKey] == selected || highlighted.includes($data[i][j][idKey]) ? lineWidth : 0}"
			/>
			{/if}
		{/each}
	{/each}
	{/if}
</g>
{/if}
