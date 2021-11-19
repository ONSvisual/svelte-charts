<script>
	import LineChart from './charts/LineChart.svelte';
	import BarChart from './charts/BarChart.svelte';
	import ColumnChart from './charts/ColumnChart.svelte';
	import ScatterChart from './charts/ScatterChart.svelte';
	import MarkerChart from './charts/MarkerChart.svelte';

	import data from './data/data';
	import dataScatter from './data/data-scatter';

	// Chart options
	let animation = true;
	let hover = true;
	let hovered = null;
	let hoveredScatter = null;
	let select = true;
	let selected = null;
	let selectedScatter = null;
	let barchart1 = {
		options: ['apples', 'bananas', 'cherries', 'dates'],
		selected: 'apples'
	};
	let barchart2 = {
		options: ['stacked', 'comparison', 'barcode', 'grouped'],
		selected: 'stacked'
	};
	let linechart = {
		stacked: true,
		line: true,
		area: true,
		transparent: true
	};
	let beeswarm = {
		yKey: false,
		zKey: false,
		rKey: true
	};

	const doHover = (e) => hovered = e.detail.id;
	const doSelect = (e) => selected = e.detail.id;
	const doHoverScatter = (e) => hoveredScatter = e.detail.id;
	const doSelectScatter = (e) => selectedScatter = e.detail.id;
</script>

<section>
	<div class="wrapper">
    <h1>ONS Svelte Charts Library</h1>
    <p>Below are a series of charts built using <a href="https://layercake.graphics" target="_blank">Layer Cake</a>, a responsive charts/graphics framework for <a href="https://svelte.dev" target="_blank">Svelte</a>. The charts are all responsive in that they fit to the width of their html container element, and will resize automatically when the screen/window is resized. The charts below can be used in the following ways:</p>
    <ol>
    	<li>The charts and/or their sub-components (axes etc) can be <strong>imported into Svelte projects</strong> via NPM.</li>
    	<li>The charts also have compiled versions that can be <strong>embedded in "vanilla" javascript projects</strong>.</li>
    	<li>This whole repository can be <strong>downloaded/cloned and hacked</strong> to create variations of the charts.</li> 
    </ol>
		<div class="controls">
			<label><input type="checkbox" bind:checked={animation}/> Animation enabled</label>
			<label><input type="checkbox" bind:checked={hover}/> Hover events enabled</label>
			<label><input type="checkbox" bind:checked={select}/> Select events enabled</label>
		</div>
  </div>
</section>

<section>
	<div class="grid">
		<div>
			<BarChart
			  data={data.filter(d => d.group == barchart1.selected)}
				xKey="value" yKey="year"
				title="Single variable bar chart"
				footer="Source: Fictitious data about fruit, 2020."
				{hover} {hovered} on:hover={doHover}
				{select} {selected} on:select={doSelect}
				{animation}>
				<div slot="options" class="controls small">
					{#each barchart1.options as option}
					  <label><input type="radio" bind:group={barchart1.selected} value={option}/> {option}</label>
					{/each}
				</div>
			</BarChart>
		</div>
		<div>
			<BarChart
				data={data}
				xKey="value" yKey="year" zKey="group"
				title="Stacked / comparative bar chart"
				mode="{barchart2.selected}"
				{hover} {hovered} on:hover={doHover}
				{select} {selected} on:select={doSelect}
				{animation} legend>
				<div slot="options" class="controls small">
					{#each barchart2.options as option}
					  <label><input type="radio" bind:group={barchart2.selected} value={option}/> {option}</label>
					{/each}
				</div>
			</BarChart>
		</div>
		<div>
			<BarChart data={data.filter(d => d.year == 2020)} xKey="value" yKey="group" zKey="group" title="Coloured bar chart"/>
		</div>
		<div>
			<ColumnChart
				data={data.filter(d => d.group == barchart1.selected)}
				xKey="year" yKey="value"
				title="Single variable column chart"
				{hover} {hovered} on:hover={doHover}
				{select} {selected} on:select={doSelect}
				{animation}>
				<div slot="options" class="controls small">
					{#each barchart1.options as option}
					  <label><input type="radio" bind:group={barchart1.selected} value={option}/> {option}</label>
					{/each}
				</div>
			</ColumnChart>
		</div>
		<div>
			<ColumnChart
				data={data}
				xKey="year" yKey="value" zKey="group"
				mode="{barchart2.selected}"
				title="Stacked / comparative column chart"
				{hover} {hovered} on:hover={doHover}
				{select} {selected} on:select={doSelect}
				{animation} legend>
				<div slot="options" class="controls small">
					{#each barchart2.options as option}
					  <label><input type="radio" bind:group={barchart2.selected} value={option}/> {option}</label>
					{/each}
				</div>
			</ColumnChart>
		</div>
		<div>
			<ColumnChart data={data.filter(d => d.year == 2020)} xKey="group" yKey="value" zKey="group" title="Coloured column chart"/>
		</div>
		<div>
			<LineChart data={data.filter(d => d.group == barchart1.selected)} xKey="year" yKey="value" areaOpacity={0.3} title="Line chart with area" animation={animation} >
				<div slot="options" class="controls small">
					{#each barchart1.options as option}
					  <label><input type="radio" bind:group={barchart1.selected} value={option}/> {option}</label>
					{/each}
				</div>
			</LineChart>
		</div>
		<div>
			<LineChart
				data={data}
				xKey="year" yKey="value" zKey="group"
				line={linechart.line} area={linechart.area} areaOpacity={linechart.transparent ? 0.3 : 1}
				title="Line/area chart with options" mode={linechart.stacked ? 'stacked' : 'default'}
				{animation} legend={linechart.line || linechart.area}>
				<div slot="options" class="controls small">
					<label><input type="checkbox" bind:checked={linechart.line}/> Show line</label>
					<label><input type="checkbox" bind:checked={linechart.area}/> Show area</label>
					<label><input type="checkbox" bind:checked={linechart.stacked}/> Stacked</label>
					<label><input type="checkbox" bind:checked={linechart.transparent}/> Transparency</label>
				</div>
			</LineChart>
		</div>
		<div>
			<LineChart
				data={data}
				xKey="year" yKey="value" zKey="group"
				color="grey" lineWidth={1}
				area={false}
				title="Line chart with hover, select and labels"
				padding={{ top: 0, bottom: 20, left: 35, right: 60 }}
				{animation} legend labels
				{hover} {select}/>
		</div>
		<div>
			<ScatterChart
				data={dataScatter}
				xKey="year" yKey="value" zKey="group" rKey="alt"
				r={[3, 6]}
				title="Scatter chart with radius, colour, hover, select and labels"
				{hover} hovered={hoveredScatter} on:hover={doHoverScatter}
				{select} selected={selectedScatter} on:select={doSelectScatter}
				legend labels/>
		</div>
		<div>
			<ScatterChart
				data={dataScatter}
				xKey="year" yKey={beeswarm.yKey ? "value" : null} zKey={beeswarm.zKey ? "group": null} rKey={beeswarm.rKey ? "alt" : null}
				r={[3, 6]} animation={animation}
				title="Beeswarm/scatter plot with animation"
				legend={beeswarm.zKey}>
				<div slot="options" class="controls small">
					<label><input type="checkbox" bind:checked={beeswarm.yKey}/> Y variable</label>
					<label><input type="checkbox" bind:checked={beeswarm.rKey}/> Radius</label>
					<label><input type="checkbox" bind:checked={beeswarm.zKey}/> Colours</label>
				</div>
			</ScatterChart>
		</div>
		{#if false}
		<div>
			<MarkerChart data={dataScatter} xTicks={[3,4,5,6,7,8]} xKey="value" animation={animation} title="Breaks chart with markers" legend/>
		</div>
		{/if}
	</div>
</section>

<section>
	<div class="wrapper">
    <h2>Current features</h2>
    <p>In all use cases, each top-level chart component (eg. bar chart, scatter chart) is able to take a series of parameters (data, colours, title, etc) to  initialise and customise it.</p>
		<p>As far as possible these parameters are consistent across chart types, and generally there are sensible default values for all parameters (eg. height = 250 pixels) other than "data", which always requires a Tidy Data array.</p>
		<h2>Examples of usage</h2>
		<p>You can see examples of how these charts can be used in a Svelte project in <a href="https://svelte.dev/repl/324b696de5304ceebbe0213511e7ed23?version=3.41.0" target="_blank">this REPL</a>, and how they can be used in a plain/vanilla javascript project in <a href="https://codepen.io/bothness/pen/RwVJvav" target="_blank">this CodePen</a>.</p>
		<h2>Intended features</h2>
		<p>It is the intention to translate all of the most useful charts from Layer Cake's examples into components, as well as a number of other custom charts (eg. spine charts). For each of the charts, it is the intention to support the following functionalities:</p>
		<ul>
			<li>Every chart type to support a standard Tidy Data format.</li>
			<li>Optional title, legend and footnote types that can be added to charts.</li>
			<li>Optional hover and click-to-select functionality on all relevant chart types with custom events.</li>
			<li>Options/methods for inline labels, tooltips and annotations.</li>
			<li>Optional prefixes and suffixes for axis labels.</li>
			<li>Colour by group (z parameter) with colors = [array], and colours for hovered and highlighted/selected data points.</li>
			<li>Animated transitions when data or keys change (which can be enabled/disabled with animation = true/false).</li>
			<li>To group similar charts in a logical way to improve ease of use and allow for custom combinations and animated transitions (eg. scatter + beeswarm or line + area).</li>
			<li>Possibility to add custom LayerCake SVG/HTML/Canvas layers in front or behind standard layers of any chart.</li>
			<li>Support for pre-rendering and progressive enhancement.</li>
		</ul>
		<h2>Acknowledgement</h2>
		<p>These charts are largely based on the chart examples by <a href="https://twitter.com/mhkeller" target="
			_blank">Michael Keller</a>, the author of the Layer Cake charts/graphics framework for Svelte.</p>
  </div>
</section>

<style>
	section {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
	  background-position: center;
	  background-repeat: no-repeat;
	  background-size: cover;
	  margin: 0;
		margin-bottom: 20px;
	  padding: 0;
	}
	.wrapper {
		width: 100%;
		max-width: 768px;
		margin: 0 16;
	}
	.grid {
		display: grid;
		width: 100%;
		max-width: 768px;
		margin: 0 16;
		grid-gap: 30px;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		justify-content: stretch;
	}
	h2 {
		font-size: 1.2em;
		font-weight: bold;
	}
	.controls > label {
		display: inline;
		margin-right: 8px;
	}
	.small {
		font-size: .8em;
	}
</style>
