<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleOrdinal, scaleLinear, scaleSymlog } from 'd3-scale';
  import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { groupData } from '../js/utils';

	import SetCoords from './shared/SetCoords.svelte';
	import Bar from './shared/Bar.svelte';
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
	export let idKey = yKey;
	export let xScale = 'linear';
	export let xFormatTick = d => d;
	export let xMax = null;
	export let xMin = null;
  export let xAxis = true;
  export let yAxis = true;
	export let xTicks = 4;
	export let textColor = '#666';
	export let tickColor = '#ccc';
	export let tickDashed = false;
	export let title = null;
	export let footer = null;
	export let legend = false;
	export let snapTicks = false;
	export let mode = 'default'; // options: 'default', 'comparison', 'marker', 'stacked', 'grouped'
	export let padding = { top: 0, bottom: 20, left: 35, right: 0 };
	export let color = null;
	export let colors = color ? [color] : ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'];
	export let markerWidth = 2.5;
	export let spacing = 0.05; // proportion of bar width (1 = 100%)
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
			let vals = data.filter(d => d[yKey] == key).map(d => d[xKey]);
			vals.forEach(d => {
				if (d >= 0) { pos += d } else { neg += d }; 
			});
			if (pos != 0) arr.push(pos);
			if (neg != 0) arr.push(neg);
		});
		return arr;
	}

	// Functions to update xDomain
	function xDomSet(data, mode, xKey, xMax) {
		let vals = mode == 'stacked' && zKey ? getTotals(data, data.map(d => d[yKey]).filter(distinct)) : data.map(d => d[xKey]);
		let min = xMin ? xMin : Math.min(...vals) > 0 ? 0 : Math.min(...vals);
		let max = xMax ? xMax : Math.max(...vals) < 0 ? 0 : Math.max(...vals);
		return [min, max];
	}
	function xDomUpdate(data, mode, xKey, xMax) {
		let newXDom = xDomSet(data, mode, xKey, xMax);
		if (newXDom[0] != xDom[0] || newXDom[1] != xDom[1]) {
			xDomain.set(newXDom, {duration: animation ? duration : 0});
			xDom = newXDom;
		}
	}
	let xDom = xDomSet(data, mode, xKey, xMax);
	const xDomain = tweened(xDom, tweenOptions);
	$: xDomUpdate(data, mode, xKey, xMax);

	// Functions to update yDomain & zDomain
	$: yDomain = data.map(d => d[yKey]).filter(distinct);
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
		xDomain={$xDomain}
		{yDomain}
		xScale={typeof xScale == 'function' ? xScale() : xScale == 'log' ? scaleSymlog() : scaleLinear()}
		yScale={scaleBand().paddingInner([spacing]).round(true)}
		zScale={scaleOrdinal()}
		{zDomain}
		zRange={colors}
		data={groupedData}
		flatData={data}
		custom={{
			type: 'bar',
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
			  <AxisX ticks={xTicks} formatTick={xFormatTick} {snapTicks} prefix={xPrefix} suffix={xSuffix} {textColor} {tickColor} {tickDashed}/>
      {/if}
      {#if yAxis}
			  <AxisY gridlines={false} prefix={yPrefix} suffix={ySuffix} {textColor} {tickColor} {tickDashed}/>
      {/if}
			<Bar {select} {selected} {hover} {hovered} {highlighted} on:hover on:select {overlayFill}/>
			<slot name="svg"/>
		</Svg>
	  <slot name="front"/>
	</LayerCake>
</div>
{#if legend && zDomain}
  <Legend domain={zDomain} {colors} {markerWidth} horizontal={false} line={mode == 'barcode'} comparison={mode == 'comparison'}/>
{/if}
{#if footer}
  <Footer>{footer}</Footer>
{/if}
</div>
{#if output}
	<Export {el} {data} keys={[idKey, yKey, zKey, xKey]} {title} {output}/>
{/if}

<style>
	.chart-container {
		width: 100%;
	}
</style>