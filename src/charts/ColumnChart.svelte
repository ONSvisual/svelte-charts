<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';

	import Column from './shared/Column.svelte';
	import ColumnStacked from './shared/ColumnStacked.svelte';
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
	export let yTicks = 4;
	export let title = null;
	export let footer = null;
	export let legend = false;
	export let stacked = false;
	export let comparison = true;
	export let padding = { top: 0, bottom: 20, left: 35, right: 0 };
	export let colors = ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'];
	export let markerWidth = 2.5;

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
	$: yDomain = stacked && yKey ? [0, Math.max(...getTotals(data, data.map(d => d[xKey]).filter(distinct)))] : [0, Math.max(...data.map(d => d[yKey]))];
	$: zDomain = zKey ? data.map(d => d[zKey]).filter(distinct) : null;
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
		xScale={scaleBand().paddingInner([0.05]).round(true)}
		zScale={scaleOrdinal()}
		{zDomain}
		zRange={colors}
		{data}
	>
	  <slot name="back"/>
		<Svg>
      {#if xAxis}
			  <AxisX gridlines={false}/>
      {/if}
      {#if yAxis}
			  <AxisY ticks={yTicks}/>
      {/if}
			{#if stacked}
		    <ColumnStacked/>
			{:else}
				<Column {comparison} {markerWidth}/>
			{/if}
		</Svg>
	  <slot name="front"/>
	</LayerCake>
</div>
{#if legend && zDomain}
  <Legend domain={zDomain} {colors} {markerWidth} comparison={!stacked && comparison}/>
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