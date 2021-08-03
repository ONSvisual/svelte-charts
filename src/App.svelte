<script>
	import LineChart from './charts/LineChart.svelte';
	import BarChart from './charts/BarChart.svelte';
	import ColumnChart from './charts/ColumnChart.svelte';

	import data from './data/data';
</script>

<section>
	<div class="wrapper">
    <h1>ONS Svelte Charts Library</h1>
    <p>Below are a series of charts built using Layer Cake, a responsive charts/graphics framework for Svelte. The charts are all responsive in that they fit to the size (width and height) of their html container element, and will resize automatically when the screen/window is resized. The charts below can be used in the following ways:</p>
    <ol>
    	<li>The charts and/or their sub-components (axes etc) can be imported into Svelte projects via NPM.</li>
    	<li>The charts also have compiled versions that can be embedded in plain ("vanilla") javascript projects.</li>
    	<li>This whole repository can be downloaded/cloned and hacked to create variations of the charts.</li> 
    </ol>
  </div>
</section>

<section>
	<div class="grid">
		<div>
			<h2>Line chart with area</h2>
			<div class="chart">
				<LineChart data={data.filter(d => d.group == 'apples')} xKey="year" yKey="value" areaOpacity={0.3}/>
			</div>
		</div>
		<div>
			<h2>Multi-line chart</h2>
			<div class="chart">
				<LineChart data={data} xKey="year" yKey="value" zKey="group" area={false}/>
			</div>
		</div>
		<div>
			<h2>Stacked area chart</h2>
			<div class="chart">
				<LineChart data={data} xKey="year" yKey="value" zKey="group" stacked={true} line={false}/>
			</div>
		</div>
		<div>
			<h2>Stacked area chart with lines</h2>
			<div class="chart">
				<LineChart data={data} xKey="year" yKey="value" zKey="group" stacked={true} areaOpacity={0.3}/>
			</div>
		</div>
		<div>
			<h2>Bar chart</h2>
			<div class="chart">
				<BarChart data={data.filter(d => d.group == 'apples')} xKey="value" yKey="year"/>
				</div>
		</div>
		<div>
			<h2>Bar chart with comparison markers</h2>
			<div class="chart">
				<BarChart data={data} xKey="value" yKey="year" zKey="group"/>
			</div>
		</div>
		<div>
			<h2>Stacked bar chart</h2>
			<div class="chart">
				<BarChart data={data} xKey="value" yKey="year" zKey="group" stacked={true}/>
			</div>
		</div>
		<div>
			<h2>Column chart</h2>
			<div class="chart">
				<ColumnChart data={data.filter(d => d.group == 'apples')} xKey="year" yKey="value"/>
			</div>
		</div>
		<div>
			<h2>Column chart with comparison markers</h2>
			<div class="chart">
				<ColumnChart data={data} xKey="year" yKey="value" zKey="group"/>
			</div>
		</div>
		<div>
			<h2>Stacked column chart</h2>
			<div class="chart">
				<ColumnChart data={data} xKey="year" yKey="value" zKey="group" stacked={true}/>
			</div>
		</div>
	</div>
</section>

<section>
	<div class="wrapper">
    <h2>Features</h2>
    <p>In all of the above use cases, each top-level chart component (eg. bar chart, scatter chart) is able to take a series of parameters (data, colours, etc) to  initialise and customise it.</p>
		<p>As far as possible these parameters are consistent across chart types, and generally there are sensible default values for all parameters other than "data".</p>
		<h2>Examples of usage</h2>
		<p>You can see examples of how these charts can be used in a Svelte project in this REPL, and how they can be used in a plain/vanilla javascript project in <a href="https://codepen.io/bothness/pen/RwVJvav" target="_blank">this CodePen</a>.</p>
		<h2>In progress</h2>
		<p>It is the intention to translate all of the most useful charts from Layer Cake's examples into components, as well as a number of other custom charts (eg. spine charts). For each of the charts, it is the intention to support the following functionalities:</p>
		<ul>
			<li>Every chart type to support a standard Tidy Data format.</li>
			<li>To include standard legend types that can be added to charts.</li>
			<li>To include optional hover and click-to-select functionality on all relevant chart types with custom events.</li>
			<li>To include options/methods for inline labelling and annotations.</li>
			<li></li>
			<li>To include optional prefixes and suffixes for axis labels.</li>
			<li>Colour by group (z parameter) with colors = [array], and colours for hovered and highlighted/selected data points.</li>
			<li>Animated transitions when data or keys change (which can be enabled/disabled with animation = true/false).</li>
			<li>To group chart similar charts in a logical way to improve ease of use and allow for custom combinations and animated transitions (eg. scatter + beeswarm or line + area).</li>
			<li>Possibility to add custom LayerCake SVG/HTML/Canvas layers in front or behind standard layers of any chart.</li>
		</ul>
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
	.grid h2 {
		margin-top: 0;
		margin-bottom: 10px;
	}
	.chart {
		height: 250px;
	}
</style>
