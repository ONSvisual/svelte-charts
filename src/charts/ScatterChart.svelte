<svelte:options accessors={true} />

<script>	
	import { LayerCake, Svg } from 'layercake';
	import { scaleOrdinal } from 'd3-scale';
  import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';

	import Scatter from './shared/Scatter.svg.svelte';
	import Voronoi from './shared/Voronoi.svelte';
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
	export let yKey = null;
	export let zKey = null;
  export let rKey = null;
  export let xAxis = true;
  export let yAxis = true;
	export let xTicks = 4;
  export let yTicks = 4;
	export let title = null;
	export let footer = null;
	export let legend = false;
	export let snapTicks = false;
  export let padding = { top: 0, bottom: 20, left: 35, right: 0 };
  export let buffer = 5;
	export let colors = ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey'];
  export let r = 4;
	export let interactive = true;

	const tweenOptions = {
		duration: 0,
		easing: cubicInOut
	};
  
  const distinct = (d, i, arr) => arr.indexOf(d) ==  i;

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
    r={rKey}
    zScale={scaleOrdinal()}
		{zDomain}
		zRange={colors}
    rRange={Array.isArray(r) ? r : [r, r]}
		data={data}
    xPadding={[buffer, buffer]}
    yPadding={yKey ? [buffer, buffer] : null}
    custom={{
      points: tweened(undefined, tweenOptions),
      animation,
      duration
    }}
		let:width
	>
	  {#if width > 80} <!-- Hack to prevent rendering before xRange/yRange initialised -->
    <slot name="back"/>
		<Svg pointerEvents={interactive}>
      {#if xAxis}
			  <AxisX ticks={xTicks} {snapTicks}/>
      {/if}
      {#if yAxis && yKey}
			  <AxisY ticks={yTicks}/>
      {/if}
			<Scatter/>
      <Voronoi/>
		</Svg>
	  <slot name="front"/>
		{/if}
	</LayerCake>
</div>
{#if legend && zDomain}
  <Legend domain={zDomain} {colors} markerLength={Array.isArray(r) ? r[0] * 2 : r * 2} round={true}/>
{/if}
{#if footer}
  <Footer>{footer}</Footer>
{/if}

<style>
	.chart-container {
		width: 100%;
	}
</style>