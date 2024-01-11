<script>
	import { getContext } from 'svelte';
	import wrap from '../../js/wrap';

	const { containerWidth, padding, xRange, yScale } = getContext('LayerCake');

	export let ticks = 4;
	export let tickMarks = false;
	export let gridlines = true;
	export let trimGridlines = false;
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

	$: isBandwidth = typeof $yScale.bandwidth === 'function';
	$: gridlineWidth = (() => {
		let width = $containerWidth;
		if (isBandwidth) width -= $padding.left;
		if (trimGridlines) width -= $padding.right;
		return width;
	})();

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
					x1='0'
					x2='{gridlineWidth}'
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
					x1='0'
					x2='{isBandwidth ? -6 : 6}'
					y1={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					y2={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					style:stroke='{tickColor}'
					style:stroke-width='{tick === 0 ? 1.5 : 1}'
					style:filter={tick !== 0 ? `contrast(calc(1/3)) brightness(1.5)` : null}
				></line>
			{/if}
			<text
				x='{xTick + (isBandwidth ? -4 : dxTick)}'
				y='{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0) + (isBandwidth ? 4 : dyTick)}'
				text-anchor='{isBandwidth ? 'end' : textAnchor}'
				fill='{textColor}'
				use:wrap={{disable: !wrapTicks, width: $padding.left}}>
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
