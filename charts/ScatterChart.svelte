<svelte:options accessors={true} />

<script>
	import { LayerCake, Svg, WebGL, Html } from 'layercake';

	import Plot from './shared/Scatter.svelte';
	import AxisX from './shared/AxisX.svelte';
	import AxisY from './shared/AxisY.svelte';
	import QuadTree from './shared/QuadTree.svelte';
	
	export let data;
	export let diameter = 5;
	export let colors = [[128, 128, 128]];
	export let categories = null;
	export let selected = null;

	export let xKey = 'x';
	export let yKey = 'y';
	export let catKey = 'group';
	
	const padding = 6;
</script>

<style>
	.chart-container {
		width: 100%;
		height: calc(100% - 90px);
	}
	.tooltip {
		position: absolute;
		display: block;
		background-color: rgba(255, 255, 255, 0.7);
		padding: 5px;
		color: #000;
	}
	.circle {
		position: absolute;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		width: 8px;
		height: 8px;
		border: 2px solid #fff;
	}
</style>

<div class="chart-container">
	<LayerCake
		padding={{ top: 10, right: 5, bottom: 20, left: 25 }}
		x={xKey}
		y={yKey}
		xPadding={[padding, padding]}
		yPadding={[padding, padding]}
		{data}
	>
		<Svg>
			<AxisX
				ticks={5}
			/>
			<AxisY
				ticks={5}
			/>
		</Svg>

		<WebGL>
			<Plot
				{diameter}
				{colors}
				{categories}
				{catKey}
				{selected}
			/>
		</WebGL>
		
		<Html>
			<QuadTree
				let:x
				let:y
				let:visible
				let:found
				{selected}
			>
				<div
					class="circle"
					style="top:{y}px;left:{x}px;display: { visible ? 'block' : 'none' };"
				></div>
				<div
					class="tooltip"
					style="top:{y+ 5}px;left:{x + 10}px;display: { visible ? 'block' : 'none' };"
				>{#if found.lad_name}{found.lad_name} {found.lsoa_name}<br />{/if}{xKey}: {Number(found[xKey]).toFixed(2)}<br/>{yKey}: {Number(found[yKey]).toFixed(2)}<br/></div>
			</QuadTree>
		</Html>
	</LayerCake>
</div>