<script>
	import { getContext } from 'svelte';

	const { width, height, xScale, yRange } = getContext('LayerCake');

	export let gridlines = true;
	export let tickDashed = false;
	export let tickMarks = false;
	export let tickColor = '#bbb';
	export let textColor = '#666';
	export let formatTick = d => d;
	export let snapTicks = false;
	export let ticks = undefined;
	export let xTick = undefined;
	export let yTick = 16;
	export let dxTick = 0;
	export let dyTick = 0;
	export let prefix = '';
	export let suffix = '';

	$: isBandwidth = typeof $xScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks) ? ticks :
		isBandwidth ?
			$xScale.domain() :
			typeof ticks === 'function' ?
				ticks($xScale.ticks()) :
					$xScale.ticks(ticks);

	function textAnchor(i) {
		if (snapTicks === true) {
			if (i === 0) {
				return 'start';
			}
			if (i === tickVals.length - 1) {
				return 'end';
			}
		}
		return 'middle';
	}
</script>

<g class='axis x-axis' class:snapTicks>
	{#each tickVals as tick, i}
		<g class='tick tick-{tick}' transform='translate({$xScale(tick)},{$yRange[0]})'>
			{#if gridlines !== false}
				<line class="gridline" class:dashed={tickDashed} y1='{$height * -1}' y2='0' x1='0' x2='0' style='stroke: {tickColor}'></line>
			{/if}
			{#if tickMarks === true}
				<line class="tick-mark" y1='{0}' y2='{6}' x1='{xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}' x2='{xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}' style='stroke: {tickColor}'></line>
			{/if}
			<text
				x="{xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}"
				y='{yTick}'
				dx='{dxTick}'
				dy='{dyTick}'
				text-anchor='{textAnchor(i)}'
				style='fill: {textColor}'>
					{i == tickVals.length - 1 ? prefix + formatTick(tick) + suffix : formatTick(tick)}
				</text>
		</g>
	{/each}
</g>

<style>
	.tick {
		font-size: .8em;
	}

	.tick .tick-mark,
	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.dashed {
		stroke-dasharray: 2;
	}
	/* This looks slightly better */
	.axis.snapTicks .tick:last-child text {
		transform: translateX(3px);
	}
	.axis.snapTicks .tick.tick-0 text {
		transform: translateX(-3px);
	}
</style>
