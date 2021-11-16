<script>
	import { getContext } from 'svelte';

	const { padding, xRange, yScale } = getContext('LayerCake');

	export let ticks = 4;
	export let tickMarks = false;
	export let gridlines = true;
	export let tickDashed = false;
	export let tickColor = '#bbb';
	export let textColor = '#666';
	export let formatTick = d => d;
	export let xTick = 0;
	export let yTick = 0;
	export let dxTick = 0;
	export let dyTick = -4;
	export let textAnchor = 'start';
	export let prefix = '';
	export let suffix = '';

	$: isBandwidth = typeof $yScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks) ? ticks :
		isBandwidth ?
			$yScale.domain() :
			typeof ticks === 'function' ?
				ticks($yScale.ticks()) :
					$yScale.ticks(ticks);
</script>

<g class='axis y-axis' transform='translate({-$padding.left}, 0)'>
	{#each tickVals as tick, i}
		<g class='tick tick-{tick}' transform='translate({$xRange[0] + (isBandwidth ? $padding.left : 0)}, {$yScale(tick)})'>
			{#if gridlines !== false}
				<line
					class="gridline"
					x2='100%'
					y1={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					y2={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					class:dashed={tickDashed}
					style='stroke: {tickColor}'
				></line>
			{/if}
			{#if tickMarks === true}
				<line
					class='tick-mark'
					x1='0'
					x2='{isBandwidth ? -6 : 6}'
					y1={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					y2={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					style='stroke: {tickColor}'
				></line>
			{/if}
			<text
				x='{xTick}'
				y='{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}'
				dx='{isBandwidth ? -4 : dxTick}'
				dy='{isBandwidth ? 4 : dyTick}'
				style="text-anchor:{isBandwidth ? 'end' : textAnchor}; fill: {textColor}">
					{i == tickVals.length - 1 ? prefix + formatTick(tick) + suffix : formatTick(tick)}
				</text>
		</g>
	{/each}
</g>

<style>
	.tick {
		font-size: .8em;
	}

	.dashed {
		stroke-dasharray: 2;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}
</style>
