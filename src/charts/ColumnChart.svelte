<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
  import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';

	import Column from './shared/Column.svelte';
	import AxisX from './shared/AxisX.svelte';
	import AxisY from './shared/AxisY.svelte';
	import Legend from './shared/Legend.svelte';
	import Title from './shared/Title.svelte';
	import Footer from './shared/Footer.svelte';

  export let data;
	export let height = 250; // number of pixels or valid css height string
  export let animation = true;
  export let duration = 800;
	export let xKey = 'x';
	export let yKey = 'y';
	export let zKey = null;
  export let xAxis = true;
  export let yAxis = true;
	export let yTicks = 4;
	export let title = null;
	export let footer = null;
	export let legend = false;
	export let mode = 'default'; // options: 'default', 'comparison', 'marker', 'stacked'
	export let padding = { top: 0, bottom: 20, left: 35, right: 0 };
	export let colors = ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'];
	export let markerWidth = 2.5
	export let spacing = 0.05 // proportion of bar width (1 = 100%)
	export let interactive = true;

	const tweenOptions = {
		duration: 0,
		easing: cubicInOut
	};

	const distinct = (d, i, arr) => arr.indexOf(d) ==  i;

	function getTotals(data, keys) {
		let arr = [];
		keys.forEach(key => {
			let vals = data.filter(d => d[xKey] == key).map(d => d[yKey]);
			let sum = vals.reduce((a, b) => a + b, 0);
			arr.push(sum);
		});
		return arr;
	}

	$: xDomain = data.map(d => d[xKey]).filter(distinct);
	$: yDomain = mode == 'stacked' && yKey ? [0, Math.max(...getTotals(data, data.map(d => d[xKey]).filter(distinct)))] : [0, Math.max(...data.map(d => d[yKey]))];
	$: zDomain = zKey ? data.map(d => d[zKey]).filter(distinct) : null;
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
		{xDomain}
		{yDomain}
		{zDomain}
		xScale={scaleBand().paddingInner([spacing]).round(true)}
		zScale={scaleOrdinal()}
		zRange={colors}
		{data}
		custom={{
      points: tweened(null, tweenOptions),
      animation,
      duration
    }}
		let:width
	>
	  {#if width > 80} <!-- Hack to prevent rendering before xRange/yRange initialised -->
	  <slot name="back"/>
		<Svg pointerEvents={interactive}>
      {#if xAxis}
			  <AxisX gridlines={false}/>
      {/if}
      {#if yAxis}
			  <AxisY ticks={yTicks}/>
      {/if}
			<Column {mode} {markerWidth}/>
		</Svg>
	  <slot name="front"/>
		{/if}
	</LayerCake>
</div>
{#if legend && zDomain}
  <Legend domain={zDomain} {colors} {markerWidth} line={mode == 'barcode'} comparison={mode == 'comparison'}/>
{/if}
{#if footer}
  <Footer>{footer}</Footer>
{/if}

<style>
	.chart-container {
		width: 100%;
	}
</style>