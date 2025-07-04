<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleOrdinal, scaleLinear, scaleSymlog } from 'd3-scale';
  import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { groupData, commas } from '../js/utils';

	import SetCoords from './shared/SetCoords.svelte';
	import DotPlot from './shared/DotPlot.svelte';
	import AxisX from './shared/AxisX.svelte';
	import AxisY from './shared/AxisY.svelte';
	import Legend from './shared/Legend.svelte';
	import Title from './shared/Title.svelte';
	import Subtitle from './shared/Subtitle.svelte';
	import Footer from './shared/Footer.svelte';
	import Export from './shared/Export.svelte';
	import Table from './shared/Table.svelte';

  export let data;
	export let barHeight = 40; // height of individual bar (overridden if height is set)
	export let height = null; // number of pixels or valid css height string
	export let ssr = false;
  export let animation = true;
  export let duration = 800;
	export let xKey = 'x';
	export let yKey = 'y';
	export let zKey = null;
	export let idKey = yKey;
	export let xScale = 'linear';
	export let xFormatTick = commas;
	export let xMax = null;
	export let xMin = null;
  export let xAxis = true;
  export let yAxis = true;
	export let xTicks = 4; // Number of ticks or array of tick values, eg [0, 10, 100, 1000]
	export let zDomain = null;
	export let textColor = '#666';
	export let tickColor = '#d9d9d9';
	export let tickDashed = false;
	export let title = null;
	export let subtitle = null;
	export let alt = null;
	export let footer = null;
	export let legend = false;
	export let xAxisLabel = "";
	export let yAxisLabel = "";
	export let table = false;
	export let snapTicks = false;
	export let mode = 'default'; // No other options at present
	export let padding = { top: yAxisLabel ? 24: 0, bottom: xAxisLabel ? 55 : 20, left: 35, right: 0 };
	export let color = null; // Option to set a single colour
	export let colors = color ? [color] : ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'];
  export let radius = 6;
	export let lineWidth = 2.5;
  export let lineColor = 'darkgrey';
	export let interactive = true;
	export let xPrefix = "";
	export let xSuffix = "";
	export let yPrefix = "";
	export let ySuffix = "";
	export let hover = false;
	export let hovered = null; // idKey of hovered item(s)
	export let colorHover = 'orange';
	export let select = false; // idKey of selected item(s)
	export let selected = null;
	export let colorSelect = 'black';
	export let highlighted = []; // Array of idKeys to highlight multiple items
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

	// Functions to update xDomain
	function xDomSet(data, mode, xKey, xMax) {
		let vals = data.map(d => d[xKey]);
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
	$: _zDomain = Array.isArray(zDomain) ? zDomain :
		zKey && typeof zDomain === "function" ? data.map(d => d[zKey]).filter(distinct).sort(zDomain) : 
		zKey ? data.map(d => d[zKey]).filter(distinct) : null;
	
	// Create a data series for each yKey
	$: groupedData = groupData(data, yDomain, yKey);
</script>

<div bind:this={el}>
{#if title}
  <Title>{title}</Title>
{/if}
{#if subtitle}
  <Subtitle>{subtitle}</Subtitle>
{/if}
{#if alt}
	<h5 class="visuallyhidden">{alt}</h5>
{/if}
<slot name="options"/>
{#if false && legend && _zDomain}
  <Legend domain={_zDomain} {colors} horizontal={false} line={mode == 'barcode'} comparison={mode == 'comparison'} {yAxisLabel}/>
{/if}
<slot name="legend"/>
<div class="chart-container" style="height: {typeof height == 'number' ? `${height}px` : height ?  height : yDomain ? `${padding.top + padding.bottom + (barHeight * yDomain.length)}px` : "300px" }" aria-hidden="true">
	<LayerCake
		{padding}
		{ssr}
		x={xKey}
		y={yKey}
		z={zKey}
		xDomain={$xDomain}
		{yDomain}
		xScale={typeof xScale == 'function' ? xScale() : xScale == 'log' ? scaleSymlog() : scaleLinear()}
    yScale={scaleBand().round(true)}
		zScale={scaleOrdinal()}
		zDomain={_zDomain}
		zRange={colors}
		data={groupedData}
		flatData={data}
		custom={{
			type: 'dotplot',
			mode,
			idKey,
      coords,
      radius,
			lineWidth,
      lineColor,
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
			  <AxisX ticks={xTicks} formatTick={xFormatTick} {snapTicks} prefix={xPrefix} suffix={xSuffix} {textColor} {tickColor} {tickDashed} {xAxisLabel}/>
      {/if}
      {#if yAxis}
			  <AxisY gridlines={false} prefix={yPrefix} suffix={ySuffix} {textColor} {tickColor} {tickDashed} {yAxisLabel}/>
      {/if}
			<DotPlot {select} {selected} {hover} {hovered} {highlighted} on:hover on:select {overlayFill}/>
			<slot name="svg"/>
		</Svg>
	  <slot name="front"/>
	</LayerCake>
</div>
{#if table}
<div class="visuallyhidden">
	<Table {data} key1={yKey} key2={xKey}/>
</div>
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
	.visuallyhidden {
		position: absolute; 
		width: 1px; 
		height: 1px; 
		margin: -1px; 
		padding: 0; 
		overflow: hidden;
		clip: rect(0,0,0,0);  
		border: 0;
	}
</style>