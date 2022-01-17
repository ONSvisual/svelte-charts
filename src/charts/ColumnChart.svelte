<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleOrdinal, scaleLinear, scaleSymlog } from 'd3-scale';
  import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { groupData } from '../js/utils';

	import SetCoords from './shared/SetCoords.svelte';
	import Column from './shared/Column.svelte';
	import AxisX from './shared/AxisX.svelte';
	import AxisY from './shared/AxisY.svelte';
	import Legend from './shared/Legend.svelte';
	import Title from './shared/Title.svelte';
	import Footer from './shared/Footer.svelte';
	import Export from './shared/Export.svelte';

  export let data;
	export let height = 300; // number of pixels or valid css height string
	export let ssr = false;
	export let ssrWidth = 300; // for SSR only. Must be a number
	export let ssrHeight = typeof height == 'number' ? height : 300; // for SSR only. Number, or calculated from 'height'
  export let animation = true;
  export let duration = 800;
	export let xKey = 'x';
	export let yKey = 'y';
	export let zKey = null;
	export let idKey = xKey;
	export let yScale = 'linear';
	export let yFormatTick = d => d;
	export let yMax = null;
	export let yMin = null;
  export let xAxis = true;
  export let yAxis = true;
	export let yTicks = 4;
	export let title = null;
	export let footer = null;
	export let legend = false;
	export let mode = 'default'; // options: 'default', 'comparison', 'marker', 'stacked', 'grouped'
	export let padding = { top: 0, bottom: 20, left: 35, right: 0 };
	export let color = null;
	export let colors = color ? [color] : ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'];
	export let markerWidth = 2.5
	export let spacing = 0.05 // proportion of bar width (1 = 100%)
	export let interactive = true;
	export let xPrefix = "";
	export let xSuffix = "";
	export let yPrefix = "";
	export let ySuffix = "";
	export let hover = false;
	export let hovered = null;
	export let colorHover = 'orange';
	export let select = false;
	export let selected = null;
	export let colorSelect = 'black';
	export let highlighted = [];
	export let colorHighlight = 'black';
	export let overlayFill = false;
	export let output = null;

	let el; // Chart DOM element

	const tweenOptions = {
		duration: duration,
		easing: cubicInOut
	};
	const coords = tweened(undefined, tweenOptions);

	const distinct = (d, i, arr) => arr.indexOf(d) ==  i;

	function getTotals(data, keys) {
		let arr = [];
		keys.forEach(key => {
			let pos = 0;
			let neg = 0;
			let vals = data.filter(d => d[xKey] == key).map(d => d[yKey]);
			vals.forEach(d => {
				if (d >= 0) { pos += d } else { neg += d }; 
			});
			if (pos != 0) arr.push(pos);
			if (neg != 0) arr.push(neg);
		});
		return arr;
	}

	// Functions to animate yDomain
	function yDomSet(data, mode, yKey, yMax) {
		let vals = mode == 'stacked' && zKey ? getTotals(data, data.map(d => d[xKey]).filter(distinct)) : data.map(d => d[yKey]);
		let min = yMin ? yMin : Math.min(...vals) > 0 ? 0 : Math.min(...vals);
		let max = yMax ? yMax : Math.max(...vals) < 0 ? 0 : Math.max(...vals);
		return [min, max];
	}
	function yDomUpdate(data, mode, yKey, yMax) {
		let newYDom = yDomSet(data, mode, yKey, yMax);
		if (newYDom[0] != yDom[0] || newYDom[1] != yDom[1]) {
			yDomain.set(newYDom, {duration: animation ? duration : 0});
			yDom = newYDom;
		}
	}
	let yDom = yDomSet(data, mode, yKey, yMax);
	const yDomain = tweened(yDom, tweenOptions);
	$: yDomUpdate(data, mode, yKey, yMax);

	// Functions to update xDomain & zDomain
	$: xDomain = data.map(d => d[xKey]).filter(distinct);
	$: zDomain = zKey ? data.map(d => d[zKey]).filter(distinct).sort((a, b) => a.localeCompare(b)) : null;

	// Create a data series for each zKey (group)
	$: groupedData = groupData(data, zDomain, zKey);
</script>

<div bind:this={el}>
{#if title}
  <Title>{title}</Title>
{/if}
<slot name="options"/>
<div class="chart-container" style="height: {typeof height == 'number' ? height + 'px' : height }">
	<LayerCake
		{padding}
		{ssr}
		height={ssr ? ssrHeight : null}
		width={ssr ? ssrWidth : null}
		x={xKey}
		y={yKey}
		z={zKey}
		{xDomain}
		yDomain={$yDomain}
		{zDomain}
		xScale={scaleBand().paddingInner([spacing]).round(true)}
		yScale={typeof yScale == 'function' ? yScale() : yScale == 'log' ? scaleSymlog() : scaleLinear()}
		zScale={scaleOrdinal()}
		zRange={colors}
		data={groupedData}
		flatData={data}
		custom={{
			type: 'column',
			mode,
			idKey,
      coords,
			markerWidth,
			colorSelect,
			colorHover,
			colorHighlight,
      animation,
      duration
    }}
	>
		<SetCoords/>
	  <slot name="back"/>
		<Svg pointerEvents={interactive}>
      {#if xAxis}
			  <AxisX gridlines={false} prefix={xPrefix} suffix={xSuffix}/>
      {/if}
      {#if yAxis}
			  <AxisY ticks={yTicks} formatTick={yFormatTick} prefix={yPrefix} suffix={ySuffix}/>
      {/if}
			<Column {select} {selected} {hover} {hovered} {highlighted} on:hover on:select {overlayFill}/>
			<slot name="svg"/>
		</Svg>
	  <slot name="front"/>
	</LayerCake>
</div>
{#if legend && zDomain}
  <Legend domain={zDomain} {colors} {markerWidth} line={mode == 'barcode'} comparison={mode == 'comparison'}/>
{/if}
{#if footer}
  <Footer>{footer}</Footer>
{/if}
</div>
{#if output}
	<Export {el} {data} keys={[idKey, xKey, zKey, yKey]} {title} {output}/>
{/if}

<style>
	.chart-container {
		width: 100%;
	}
</style>