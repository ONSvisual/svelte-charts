<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleOrdinal } from 'd3-scale';

	import Line from './shared/Line.svelte';
	import Area from './shared/Area.svelte';
	import AxisX from './shared/AxisX.svelte';
	import AxisY from './shared/AxisY.svelte';

  export let data;
	export let xKey = 'x';
	export let yKey = 'y';
	export let zKey = null;
  export let xAxis = true;
  export let yAxis = true;
	export let xTicks = 4;
	export let yTicks = 4;
  export let line = true;
  export let area = true;
	export let stacked = false;
	export let areaOpacity = 0.3;
	export let padding = { top: 0, bottom: 20, left: 35 };
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

	$: yDomain = stacked && zKey ? [0, Math.max(...getTotals(data, data.map(d => d[xKey]).filter(distinct)))] : [0, Math.max(...data.map(d => d[yKey]))];
	$: zDomain = zKey ? data.map(d => d[zKey]).filter(distinct) : null;
</script>

<div class="chart-container">
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
		<Svg>
      {#if xAxis}
			  <AxisX ticks={xTicks}/>
      {/if}
      {#if yAxis}
			  <AxisY ticks={yTicks}/>
      {/if}
      {#if area}
		    <Area {stacked} opacity={areaOpacity}/>
      {/if}
      {#if line}
			  <Line {stacked}/>
      {/if}
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 100%;
	}
</style>