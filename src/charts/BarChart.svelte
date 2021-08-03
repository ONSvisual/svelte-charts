<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';

	import Bar from './shared/Bar.svelte';
	import BarStacked from './shared/BarStacked.svelte';
	import AxisX from './shared/AxisX.svelte';
	import AxisY from './shared/AxisY.svelte';
	import Legend from './shared/Legend.svelte';

  export let data;
	export let height = 250; // number of pixels or valid css height string
	export let xKey = 'x';
	export let yKey = 'y';
	export let zKey = null;
  export let xAxis = true;
  export let yAxis = true;
	export let xTicks = 4;
	export let title = null;
	export let footer = null;
	export let legend = false;
	export let snapTicks = false;
	export let stacked = false;
	export let comparison = true;
	export let padding = { top: 0, bottom: 20, left: 35, right: 0 };
	export let colors = ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'];
	export let markerWidth = 2.5;

	const distinct = (d, i, arr) => arr.indexOf(d) ==  i;

	function getTotals(data, keys) {
		let arr = [];
		keys.forEach(key => {
			let vals = data.filter(d => d[yKey] == key).map(d => d[xKey]);
			let sum = vals.reduce((a, b) => a + b, 0);
			arr.push(sum);
		});
		console.log(data, keys, arr);
		return arr;
	}

	$: xDomain = stacked && zKey ? [0, Math.max(...getTotals(data, data.map(d => d[yKey]).filter(distinct)))] : [0, Math.max(...data.map(d => d[xKey]))];
	$: yDomain = data.map(d => d[yKey]).filter(distinct);
	$: zDomain = zKey ? data.map(d => d[zKey]).filter(distinct) : null;
	$: console.log(xDomain);
</script>

{#if title}
  <div class="title">{title}</div>
{/if}
<div class="chart-container" style="height: {typeof height == 'number' ? height + 'px' : height }">
	<LayerCake
		{padding}
		x={xKey}
		y={yKey}
		z={zKey}
		{xDomain}
		{yDomain}
		yScale={scaleBand().paddingInner([0.05]).round(true)}
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
			  <AxisY gridlines={false}/>
      {/if}
			{#if stacked}
		    <BarStacked/>
			{:else}
				<Bar {comparison} {markerWidth}/>
			{/if}
		</Svg>
	  <slot name="front"/>
	</LayerCake>
</div>
{#if legend && zDomain}
  <Legend domain={zDomain} {colors} {markerWidth} horizontal={false} comparison={!stacked && comparison}/>
{/if}
{#if footer}
  <div class="footer">{footer}</div>
{/if}

<style>
	.chart-container {
		width: 100%;
	}
	.title {
		font-size: 1.1em;
		font-weight: bold;
		margin-bottom: 10px;
	}
	.footer {
		font-size: .8em;
		color: grey;
		margin-top: 5px;
	}
</style>