<script>
	import { getContext } from 'svelte';

	const { data, z, zGet, zRange, custom } = getContext('LayerCake');

	export let hovered = null;
	export let selected = null;
	export let highlighted = [];

	let coords = $custom.coords;
	let idKey = $custom.idKey;

	let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
	let colorSelect = $custom.colorSelect ? $custom.colorSelect : 'black';
	let colorHighlight = $custom.colorHighlight ? $custom.colorHighlight : 'black';
	let lineWidth = $custom.lineWidth ? $custom.lineWidth : 2;
</script>

{#if $coords}
<g class="scatter-group">
	{#each $coords as d, i}
		<circle
			cx={d.x}
			cy={d.y}
			r={d.r}
			fill="{$z ? $zGet($data[i]) : $zRange[0]}"
			stroke="{$data[i][idKey] == hovered ? colorHover : $data[i][idKey] == selected ? colorSelect : colorHighlight}"
			stroke-width="{$data[i][idKey] == hovered || $data[i][idKey] == selected || highlighted.includes($data[i][idKey]) ? lineWidth : 0}"
		/>
	{/each}
</g>
{/if}
