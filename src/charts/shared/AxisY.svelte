<script>
	import { getContext } from 'svelte';
	import wrap from '../../js/wrap';

	const { containerWidth, padding, xRange, yScale, width, height } = getContext('LayerCake');

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
	export let dyTick = 4;
	export let textAnchor = 'end';
	export let prefix = '';
	export let suffix = '';
	export let yAxisLabel = '';
	export let format = d => d;
	export let widestTickLen;
	export let charPixelWidth = 7.25;
	export let tickLen;
	export let tickMarkLength = undefined;
	export let tickGutter = 10;
	export let x1;

	//assign the ticklength
	$: tickLen =
		tickMarks === true ?
		(tickMarkLength ?? 6) : 0;

	//var to calculate the width of the widest tick string
	$: widestTickLen = Math.max(
    10,
    Math.max(...tickVals.map(d => format(d).toString().split('').reduce(calcStringLength, 0)))
  );

  //function to calculate the length of the widest tick string
  function calcStringLength(sum, val) {
    if (val === ',' || val === '.') return sum + charPixelWidth * 0.5;
    return sum + charPixelWidth;
  }

//set x1 for the line and the tick text
  	$: x1 = tickGutter - tickLen;

	$: isBandwidth = typeof $yScale.bandwidth === 'function';

	//calculate the width of the gridlines
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
					x1={x1 + widestTickLen}
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
					x1={x1}
					x2='{isBandwidth ? -6 : 6}'
					y1={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					y2={yTick + (isBandwidth ? ($yScale.bandwidth() / 2) : 0)}
					style:stroke='{tickColor}'
					style:stroke-width='{tick === 0 ? 1.5 : 1}'
					style:filter={tick !== 0 ? `contrast(calc(1/3)) brightness(1.5)` : null}
				></line>
			{/if}
			<text
				x='{xTick + (isBandwidth ? -4 : (x1 + widestTickLen - 5))}'
				y='{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0) + (isBandwidth ? 4 : dyTick)}'
				text-anchor='{isBandwidth ? 'end' : textAnchor}'
				fill='{textColor}'
				use:wrap={{disable: !wrapTicks, width: $padding.left}}>
					{i == tickVals.length - 1 ? prefix + formatTick(tick) + suffix : formatTick(tick)}
				</text>
		</g>
	{/each}
	<!-- add in the y axis label -->
	<text x={2} y={-15} text-anchor="start" class="axisLabel">{yAxisLabel}</text>
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
	.axisLabel {
		font-size: 14px;
		fill: #707071;
	}
</style>
