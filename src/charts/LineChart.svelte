<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleOrdinal } from 'd3-scale';

	import Line from './shared/Line.svelte';
	import Area from './shared/Area.svelte';
	import LineStacked from './shared/LineStacked.svelte';
	import AreaStacked from './shared/AreaStacked.svelte';
	import AxisX from './shared/AxisX.svelte';
	import AxisY from './shared/AxisY.svelte';
	import Legend from './shared/Legend.svelte';
	import Title from './shared/Title.svelte';
	import Footer from './shared/Footer.svelte';

  export let data;
	export let height = 250; // number of pixels or valid css height string
	export let xKey = 'x';
	export let yKey = 'y';
	export let zKey = null;
  export let xAxis = true;
  export let yAxis = true;
	export let xTicks = 4;
	export let yTicks = 4;
	export let title = null;
	export let footer = null;
	export let legend = false;
	export let snapTicks = true;
  export let line = true;
  export let area = true;
	export let stacked = false;
	export let areaOpacity = 1;
	export let padding = { top: 0, bottom: 20, left: 35, right: 0 };
	export let colors = ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'];
	export let lineWidth = 2.5;

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

	$: yDomain = stacked && zKey ? [0, Math.max(...getTotals(data, data.map(d => d[xKey]).filter(distinct)))] : [0, Math.max(...data.map(d => d[yKey]))];
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
		{yDomain}
		zScale={scaleOrdinal()}
		{zDomain}
		zRange={colors}
		{data}
	>
	  <slot name="back"/>
		<Svg>
      {#if xAxis}
			  <AxisX ticks={xTicks} {snapTicks}/>
      {/if}
      {#if yAxis}
			  <AxisY ticks={yTicks}/>
      {/if}
      {#if area}
			  {#if stacked && zKey}
		      <AreaStacked opacity={areaOpacity}/>
					{:else}
					<Area opacity={areaOpacity}/>
				{/if}
      {/if}
      {#if line}
			  {#if stacked && zKey}
			    <LineStacked {lineWidth}/>
				{:else}
			    <Line {lineWidth}/>
				{/if}
      {/if}
		</Svg>
	  <slot name="front"/>
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