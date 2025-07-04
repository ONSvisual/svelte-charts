<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
  import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';

	import Bar from './shared/Bar.svelte';
  import Stack from './shared/Stack.svelte';
	import AxisX from './shared/AxisX.svelte';
	import Title from './shared/Title.svelte';
	import Subtitle from './shared/Subtitle.svelte';
	import Footer from './shared/Footer.svelte';

  export let data;
	export let xTicks;
	export let height = 40; // number of pixels or valid css height string
  export let animation = true;
  export let duration = 800;
	export let xKey = 'x';
	export let zKey = null;
  export let xAxis = true;
	export let zDomain = null;
	export let title = null;
	export let subtitle = null;
	export let alt = null;
	export let footer = null;
	export let snapTicks = false;
	export let padding = { top: 0, bottom: 0, left: 0, right: 0 };
	export let colors = ['black'];
	export let markerWidth = 1;
	export let interactive = true;
	export let xPrefix = "";
	export let xSuffix = "";
	export let xAxisLabel = "";

	const tweenOptions = {
		duration: duration,
		easing: cubicInOut
	};

	const distinct = (d, i, arr) => arr.indexOf(d) ==  i;

	$: xDomain = [xTicks[0], xTicks[xTicks.length - 1]];
	$: _zDomain = Array.isArray(zDomain) ? zDomain :
		zKey && typeof zDomain === "function" ? data.map(d => d[zKey]).filter(distinct).sort(zDomain) : 
		zKey ? data.map(d => d[zKey]).filter(distinct) : null;
  $: intData = data.map(d => ({...d, y: 0}));
</script>

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
<slot name="legend"/>
<div class="chart-container" style="height: {typeof height == 'number' ? height + 'px' : height }" aria-hidden="true">
	<LayerCake
		{padding}
		x={xKey}
    y="y"
		z={zKey}
		{xDomain}
		yDomain={[0]}
		yScale={scaleBand()}
		zScale={scaleOrdinal()}
		zDomain={_zDomain}
		zRange={colors}
		data={intData}
		custom={{
      points: tweened(null, tweenOptions),
      animation,
      duration
    }}
		let:width
	>
	  {#if width > 100} <!-- Hack to prevent rendering before xRange/yRange initialised -->
	  <slot name="back"/>
		<Svg pointerEvents={interactive}>
      <Stack ticks={xTicks}/>
      {#if xAxis}
			  <AxisX ticks={xTicks} {snapTicks} prefix={xPrefix} suffix={xSuffix} {xAxisLabel}/>
      {/if}
			<Bar mode="marker" {markerWidth}/>
		</Svg>
	  <slot name="front"/>
		{/if}
	</LayerCake>
</div>
{#if footer}
  <Footer>{footer}</Footer>
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