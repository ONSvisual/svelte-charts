<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleOrdinal, scaleLinear, scaleSymlog } from 'd3-scale';
  import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { groupData, stackData } from '../js/utils';

	import SetCoords from './shared/SetCoords.svelte';
	import Line from './shared/Line.svelte';
	import Area from './shared/Area.svelte';
	import AxisX from './shared/AxisX.svelte';
	import AxisY from './shared/AxisY.svelte';
	import Legend from './shared/Legend.svelte';
	import Title from './shared/Title.svelte';
	import Footer from './shared/Footer.svelte';
	import Labels from './shared/Labels.svelte';

  export let data;
	export let height = 250; // number of pixels or valid css height string
  export let animation = true;
  export let duration = 800;
	export let xKey = 'x';
	export let yKey = 'y';
	export let zKey = null;
	export let idKey = zKey;
	export let labelKey = idKey;
	export let yScale = 'linear';
	export let yFormatTick = d => d;
	export let yMax = null;
	export let yMin = 0;
  export let xAxis = true;
  export let yAxis = true;
	export let xTicks = 4;
	export let yTicks = 4;
	export let title = null;
	export let footer = null;
	export let legend = false;
	export let labels = false;
	export let snapTicks = true;
  export let line = true;
  export let area = true;
	export let mode = 'default';
	export let areaOpacity = 1;
	export let padding = { top: 0, bottom: 20, left: 35, right: 0 };
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

	const tweenOptions = {
		duration: duration,
		easing: cubicInOut
	};
	const coords = tweened(undefined, tweenOptions);

	const distinct = (d, i, arr) => arr.indexOf(d) ==  i;

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
	const yDomSet = (data, mode, yKey, yMax) => yMax ? [yMin, yMax] : mode == 'stacked' && yKey ? [yMin, Math.max(...getTotals(data, data.map(d => d[xKey]).filter(distinct)))] : [yMin, Math.max(...data.map(d => d[yKey]))];
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
	$: zDomain = zKey ? data.map(d => d[zKey]).filter(distinct) : null;

	// Create a data series for each zKey (group)
	$: groupedData = mode == 'stacked' ? stackData(data, zDomain, yKey, zKey) : groupData(data, zDomain, zKey);
</script>

{#if title}
  <Title>{title}</Title>
{/if}
<slot name="options"/>
<div class="chart-container" style="height: {typeof height == 'number' ? height + 'px' : height }">
	<LayerCake
		{padding}
		x={xKey}
		y={yKey}
		z={zKey}
		yDomain={$yDomain}
		yScale={yScale == 'log' ? scaleSymlog() : scaleLinear()}
		zScale={scaleOrdinal()}
		{zDomain}
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
		let:width
	>
	  {#if width > 80} <!-- Hack to prevent rendering before xRange/yRange initialised -->
		<SetCoords/>
	  <slot name="back"/>
		<Svg pointerEvents={interactive}>
      {#if xAxis}
			  <AxisX ticks={xTicks} {snapTicks} prefix={xPrefix} suffix={xSuffix}/>
      {/if}
      {#if yAxis}
			  <AxisY ticks={yTicks} formatTick={yFormatTick} prefix={yPrefix} suffix={ySuffix}/>
      {/if}
      {#if area}
			  <Area {mode} opacity={areaOpacity}/>
      {/if}
      {#if line}
			  <Line {lineWidth} {select} bind:selected {hover} bind:hovered {highlighted} on:hover on:select/>
      {/if}
			{#if labels}
				<Labels {hovered} {selected}/>
			{/if}
			<slot name="svg"/>
		</Svg>
	  <slot name="front"/>
		{/if}
	</LayerCake>
</div>
{#if legend && zDomain}
  <Legend domain={zDomain} {colors} {line} markerWidth={lineWidth}/>
{/if}
{#if footer}
  <Footer>{footer}</Footer>
{/if}

<style>
	.chart-container {
		width: 100%;
	}
</style>