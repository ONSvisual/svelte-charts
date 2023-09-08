<script>
	import { getContext } from 'svelte';

	const { data, xScale, yScale, custom } = getContext('LayerCake');
	
	export let content = null;
	export let labelsToDisplay = [];
	
	let coords = $custom.coords;
	let idKey = $custom.idKey;
	let labelKey = $custom.labelKey;
	// let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
	// let colorSelect = $custom.colorSelect ? $custom.colorSelect : '#206095';
	console.log("script")
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
		{#if labelsToDisplay.includes($data[i][labelKey])}
			{console.log($data[i][labelKey])}
		<text
			class="label"
			transform="translate(5,-5)"
			fill="#333"
			fill-opacity="0.8"
		    x={$xScale(d.x)}
			y={$yScale(d.y)}>
			{content ? content : $data[i][labelKey]}
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