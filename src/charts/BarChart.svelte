<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';

	import Bar from './shared/Bar.svelte';
	import BarStacked from './shared/BarStacked.svelte';
	import AxisX from './shared/AxisX.svelte';
	import AxisY from './shared/AxisY.svelte';

  export let data;
	export let xKey = 'x';
	export let yKey = 'y';
	export let zKey = null;
  export let xAxis = true;
  export let yAxis = true;
	export let xTicks = 4;
	export let snapTicks = false;
	export let stacked = false;
	export let padding = { top: 0, bottom: 20, left: 35, right: 0 };
	export let colors = ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'];

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

	$: xDomain = stacked && zKey ? [0, Math.max(...getTotals(data, data.map(d => d[xKey]).filter(distinct)))] : [0, Math.max(...data.map(d => d[xKey]))];
	$: yDomain = data.map(d => d[yKey]).filter(distinct);
	$: zDomain = zKey ? data.map(d => d[zKey]).filter(distinct) : null;
</script>

<div class="chart-container">
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
				<Bar/>
			{/if}
		</Svg>
	  <slot name="front"/>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 100%;
	}
</style>