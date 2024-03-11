<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleOrdinal, scaleLinear, scaleSymlog, scaleTime } from 'd3-scale';
 	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { groupData, stackData, commas } from '../js/utils';

	import SetCoords from './shared/SetCoords.svelte';
	import Line from './shared/Line.svelte';
	import Area from './shared/Area.svelte';
	import AxisX from './shared/AxisX.svelte';
	import AxisY from './shared/AxisY.svelte';
	import Legend from './shared/Legend.svelte';
	import Title from './shared/Title.svelte';
	import Subtitle from './shared/Subtitle.svelte';
	import Footer from './shared/Footer.svelte';
	import Labels from './shared/Labels.svelte';
	import Export from './shared/Export.svelte';
	import Table from './shared/Table.svelte';

  export let data;
	export let height = 200; // number of pixels or valid css height string
	export let ssr = false;
	export let ssrWidth = 300; // for SSR only. Must be a number
	export let ssrHeight = typeof height == 'number' ? height : 200; // for SSR only. Number, or calculated from 'height'
	export let animation = true;
	export let duration = 800;
	export let xKey = 'x';
	export let yKey = 'y';
	export let zKey = null;
	export let idKey = zKey;
	export let labelKey = idKey;
	export let xScale = 'linear';
	export let yScale = 'linear';
	export let yFormatTick = commas;
	export let xFormatTick = d => d;
	export let xFormatTickString = null;
	export let yMax = null;
	export let yMin = 0;
	export let xAxis = true;
	export let yAxis = true;
	export let xTicks = 4;
	export let yTicks = 4;
	export let xTickMarks = true;
	export let xForceTicks = typeof xTicks === "number" && xScale === 'linear';
	export let xGridlines = false;
	export let zDomain = null;
	export let labelWrap = true;
	export let title = null;
	export let subtitle = null;
	export let alt = null;
	export let footer = null;
	export let legend = false;
	export let labels = false;
	export let spreadLabels = labels === "all";
	export let labelMarker = true;
	export let yTrimGridlines = labels !== false;
	export let table = false;
	export let snapTicks = true;
	export let line = true;
	export let mode = 'default';
	export let area = mode === 'stacked';
	export let areaOpacity = 1;
	export let padding = { top: 0, bottom: 28, left: 35, right: 0 };
	export let color = null;
	export let colors = color ? [color] : ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'];
	export let lineWidth = 2.5;
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
	export let colorSelect = '#206095';
	export let highlighted = [];
	export let colorHighlight = '#206095';
	export let output = null;

	let el; // Chart DOM element

	const tweenOptions = {
		duration: duration,
		easing: cubicInOut
	};
	const coords = tweened(undefined, tweenOptions);

	const distinct = (d, i, arr) => arr.indexOf(d) ==  i;
	const distinctTime = (d, i, arr) => arr.map(e=>e.getTime).indexOf(d.getTime())

	function getTotals(data, keys) {
		let arr = [];
		keys.forEach(key => {
			let vals = data.filter(d => d[xKey] == key).map(d => d[yKey]);
			let sum = vals.reduce((acc, curr) => acc + curr);
			arr.push(sum);
		});
		return arr;
	}

	// Functions to animate yDomain
	const yDomSet = (data, mode, yKey, yMax) => yMax ? [yMin, yMax] : mode == 'stacked' && yKey ? [yMin, Math.max(...getTotals(data, data.map(d => d[xKey]).filter(distinct)))] : [Math.min(...data.map(d => d[yKey])), Math.max(...data.map(d => d[yKey]))];
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
	
	// Function to update zDomain
	$: _zDomain = Array.isArray(zDomain) ? zDomain :
		zKey && typeof zDomain === "function" ? data.map(d => d[zKey]).filter(distinct).sort(zDomain) : 
		zKey ? data.map(d => d[zKey]).filter(distinct) : null;

	// Create a data series for each zKey (group)
	$: groupedData = mode == 'stacked' ? stackData(data, _zDomain, yKey, zKey) : groupData(data, _zDomain, zKey);
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
<div class="chart-container" style="height: {typeof height == 'number' ? height + 'px' : height }" aria-hidden="true">
	<LayerCake
		{padding}
		{ssr}
		height={ssr ? ssrHeight : null}
		width={ssr ? ssrWidth : null}
		x={xKey}
		y={yKey}
		z={zKey}
		yDomain={$yDomain}
		xScale={typeof xScale == 'function' ? xScale() : xScale == 'time' ? scaleTime() : scaleLinear()}
		yScale={typeof yScale == 'function' ? yScale() : yScale == 'log' ? scaleSymlog() : scaleLinear()}
		zScale={scaleOrdinal()}
		zDomain={_zDomain}
		zRange={colors}
		data={groupedData}
		flatData={data}
		custom={{
			type: 'line',
			mode,
			idKey,
			labelKey,
			coords,
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
			  <AxisX ticks={xTicks} formatTick={xFormatTick} {snapTicks} prefix={xPrefix} suffix={xSuffix} gridlines={xGridlines} tickMarks={xTickMarks} forceTicks={xForceTicks} formatTickString={xFormatTickString}/>
      {/if}
      {#if yAxis}
			  <AxisY ticks={yTicks} formatTick={yFormatTick} prefix={yPrefix} suffix={ySuffix} trimGridlines={yTrimGridlines}/>
      {/if}
      {#if area}
			  <Area {mode} opacity={areaOpacity}/>
      {/if}
      {#if line}
			  <Line {lineWidth} {select} bind:selected {hover} bind:hovered {highlighted} on:hover on:select/>
      {/if}
			{#if labels}
				<Labels {hovered} {selected} labelAll={labels === "all"} {spreadLabels} marker={labelMarker} textWrap={labelWrap}/>
			{/if}
			<slot name="svg"/>
		</Svg>
	  <slot name="front"/>
	</LayerCake>
</div>
{#if table}
<div class="visuallyhidden">
	<Table {data} key1={zKey} key2={xKey} key3={yKey}/>
</div>
{/if}
<slot name="legend"/>
{#if legend && _zDomain}
  <Legend domain={_zDomain} {colors} {line} markerWidth={lineWidth}/>
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