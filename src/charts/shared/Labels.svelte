<script>
	import { getContext } from 'svelte';

	const { data, xScale, yScale, custom } = getContext('LayerCake');

	export let hovered = null;
	export let selected = null;
	export let content = null;
	
	let coords = $custom.coords;
	let idKey = $custom.idKey;
	let labelKey = $custom.labelKey;
	// let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
	// let colorSelect = $custom.colorSelect ? $custom.colorSelect : '#206095';
</script>

{#if $coords}
<defs>
	<filter x="0" y="0" width="1" height="1" id="bgfill">
		<feFlood flood-color="rgba(255,255,255,0.8)" result="bg" />
		<feMerge>
			<feMergeNode in="bg"/>
			<feMergeNode in="SourceGraphic"/>
		</feMerge>
	</filter>
</defs>
<g class="label-group">
	{#if $coords[0] && $coords[0].x}
	{#each $coords as d, i}
		{#if [hovered, selected].includes($data[i][idKey])}
		<text
			class="label"
			transform="translate(5,-5)"
			filter="url(#bgfill)"
			fill="#333"
		  x={$xScale(d.x)}
			y={$yScale(d.y)}>
			{content ? content : $data[i][labelKey]}
		</text>
		{/if}
	{/each}
	{:else if $coords[0] && $coords[0][0] && $coords[0][0].x}
	{#each $coords as d, i}
		{#if [hovered, selected].includes($data[i][0][idKey])}
		<text
			class="label"
			transform="translate(2,3)"
			filter="url(#bgfill)"
			fill="#333"
		  x={$xScale(d[d.length - 1].x)}
			y={$yScale(d[d.length - 1].y)}>
			{content ? content : $data[i][0][labelKey]}
		</text>
		{/if}
	{/each}
	{/if}
</g>
{/if}

<style>
	.label {
		font-size: 0.8em;
	}
</style>