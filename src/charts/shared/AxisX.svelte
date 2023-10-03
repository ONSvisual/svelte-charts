<script>
	import { getContext } from 'svelte';

	const { height, xScale, xDomain, yRange } = getContext('LayerCake');

	export let gridlines = true;
	export let tickDashed = false;
	export let tickMarks = false;
	export let tickColor = '#b3b3b3';
	export let textColor = '#707070';
	export let formatTick = d => d;
	export let snapTicks = false;
	export let ticks = undefined;
	export let xTick = undefined;
	export let yTick = 16;
	export let forceTicks = false;
	export let dxTick = 0;
	export let dyTick = tickMarks ? 8 : 0;
	export let prefix = '';
	export let suffix = '';

	function fixTicks(domain, ticks) {
		if (
			ticks.length > 1 &&
			ticks.length < domain.length &&
			ticks[ticks.length - 1] !== domain[domain.length - 1]
		) {
			const interval = domain.indexOf(ticks[1]) - domain.indexOf(ticks[0]);
			let newticks = [];
			let i = domain.length - 1 - ((ticks.length - 1) * interval);
			while (i < domain.length) {
				newticks.push(domain[i]);
				i += interval;
			}
			return newticks;
		}
		return ticks;
	}

	$: isBandwidth = typeof $xScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks) ? ticks :
		isBandwidth ?
			$xScale.domain() :
			typeof ticks === 'function' ? ticks($xScale.ticks()) :
			typeof ticks === 'number' && forceTicks ? fixTicks($xScale.ticks(), $xScale.ticks(ticks)): 
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
		<g class='tick tick-{tick}' transform='translate({$xScale(tick)},{Math.max(...$yRange)})'>
			{#if gridlines !== false}
				<line class="gridline" class:dashed={tickDashed} y1='{$height * -1}' y2='0' x1='0' x2='0' style:stroke='{tickColor}' style:stroke-width='{tick === 0 ? 1.5 : 1}' style:filter={tick !== 0 ? `contrast(calc(1/3)) brightness(1.5)` : null}></line>
			{/if}
			{#if tickMarks === true}
				<line class="tick-mark" y1='{0}' y2='{dyTick}' x1='{xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}' x2='{xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}' style:stroke='{tickColor}' style:stroke-width='{tick === 0 ? 1.5 : 1}' style:filter={tick !== 0 ? `contrast(calc(1/3)) brightness(1.5)` : null}></line>
			{/if}
			<text
				x="{xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}"
				y='{yTick}'
				dx='{dxTick}'
				dy='{dyTick}'
				text-anchor='{textAnchor(i)}'
				fill='{textColor}'>
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

	.tick line {
		shape-rendering: crispEdges;
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
