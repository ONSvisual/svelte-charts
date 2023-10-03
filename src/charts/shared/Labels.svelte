<script>
	import { getContext } from 'svelte';
	import { raise } from 'layercake';
	import wrap from '../../js/wrap';

	const { data, xScale, yScale, padding, custom } = getContext('LayerCake');

	export let hovered = null;
	export let selected = null;
	export let content = null;
	export let marker = false;
	export let textWrap = false;
	
	let coords = $custom.coords;
	let idKey = $custom.idKey;
	let labelKey = $custom.labelKey;
	let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
	let colorSelect = $custom.colorSelect ? $custom.colorSelect : '#206095';

	const raiseMe = (e, options = {}) => { if (!options.disable) raise(e) };
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
<g class="chart-label-group">
	{#if $coords[0] && $coords[0].x}
	{#each $coords as d, i}
		{#if [hovered, selected].includes($data[i][idKey])}
		<text
			class="chart-label"
			transform="translate(5,-5)"
			filter="url(#bgfill)"
			fill="{$data[i][idKey] === hovered ? colorHover : colorSelect}"
		  x={$xScale(d.x)}
			y={$yScale(d.y)}>
			{content ? content : $data[i][labelKey]}
		</text>
		{/if}
	{/each}
	{:else if $coords[0] && $coords[0][0] && $coords[0][0].x}
	{#each $coords as d, i}
		{#if [hovered, selected].includes($data[i][0][idKey])}
		{#if marker}
		<circle
			cx={$xScale(d[d.length - 1].x)}
			cy={$yScale(d[d.length - 1].y)}
			r="5"
			fill="{$data[i][0][idKey] === hovered ? colorHover : colorSelect}"
			use:raiseMe={{disable: $data[i][0][idKey] !== hovered}}/>
		{/if}
		<text
			class="chart-label"
			transform="translate({marker ? 7 : 4},3)"
			filter="url(#bgfill)"
			fill="{$data[i][0][idKey] === hovered ? colorHover : colorSelect}"
		  x={$xScale(d[d.length - 1].x)}
			y={$yScale(d[d.length - 1].y)}
			use:wrap={{disable: !textWrap, width: $padding.right}}
			use:raiseMe={{disable: $data[i][0][idKey] !== hovered}}>
			{content ? content : $data[i][0][labelKey]}
		</text>
		{/if}
	{/each}
	{/if}
</g>
{/if}

<style>
	.chart-label {
		font-size: 0.8em;
	}
</style>