<script>
	import { getContext } from 'svelte';
	import wrap from '../../js/wrap';

	const { containerWidth, padding, xRange, yScale } = getContext('LayerCake');

	export let ticks = 4;
	export let tickMarks = false;
	export let gridlines = true;
	export let trimGridlinesLeft = false;
	export let trimGridlinesRight = false;
	export let tickDashed = false;
	export let tickColor = '#b3b3b3';
	export let textColor = '#707070';
	export let formatTick = d => d;
	export let wrapTicks = false;
	export let xTick = 0;
	export let yTick = 0;
	export let dxTick = tickMarks ? 8 : 0;
	export let dyTick = -4;
	export let textAnchor = 'start';
	export let prefix = '';
	export let suffix = '';
	export let yAxisLabel = '';

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
					x1={!trimGridlinesLeft ? 0 : $padding.left}
					x2={!trimGridlinesRight ? $containerWidth : $containerWidth - $padding.right}
					y1={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					y2={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					class:dashed={tickDashed}
					style:stroke='{tickColor}'
					style:stroke-width='{tick === 0 ? 1.5 : 1}'
					style:filter={tick !== 0 ? `contrast(calc(1/3)) brightness(1.5)` : null}
				></line>
			{/if}
			{#if tickMarks === true}
				<line
					class='tick-mark'
					x1={!trimGridlinesLeft ? 0 : $padding.left}
					x2={(!trimGridlinesLeft ? 0 : $padding.left) + (isBandwidth ? -6 : 6)}
					y1={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					y2={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					style:stroke='{tickColor}'
					style:stroke-width='{tick === 0 ? 1.5 : 1}'
					style:filter={tick !== 0 ? `contrast(calc(1/3)) brightness(1.5)` : null}
				></line>
			{/if}
			<text
				x='{trimGridlinesLeft ? $padding.left - 4 : xTick + (isBandwidth ? -4 : dxTick)}'
				y='{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0) + (isBandwidth ? 4 : dyTick)}'
				text-anchor='{isBandwidth || trimGridlinesLeft ? 'end' : textAnchor}'
				dy={trimGridlinesLeft ? '0.6em' : 0}
				fill='{textColor}'
				use:wrap={{disable: !wrapTicks, width: $padding.left}}>
					{i == tickVals.length - 1 ? prefix + formatTick(tick) + suffix : formatTick(tick)}
				</text>
		</g>
	{/each}
	<!-- add in the y axis label -->
	{#if yAxisLabel}<text x={2} y={-15} text-anchor="start" class="axisLabel">{yAxisLabel}</text>{/if}
</g>

<style>
	.tick {
		font-size: 14px;
	}

	.dashed {
		stroke-dasharray: 2;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}
	.axisLabel {
		font-size: 14px;
		fill: #707071;
	}
</style>
