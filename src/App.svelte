<script>
	import LineChart from './charts/LineChart.svelte';

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
    <p>In all of the above use cases, each top-level chart component (eg. bar chart, scatter chart) is able to take a series of parameters (data, colours, etc) to  initialise and customise it. As far as possible these parameters are consistent across chart types, and generally there are default values for all parameters other than "data".</p>
  </div>
</section>

<section>
	<div class="grid">
		<div>
			<LineChart data={data.filter(d => d.group == 'apples')} xKey="year" yKey="value"/>
		</div>
		<div>
			<LineChart data={data} xKey="year" yKey="value" zKey="group" area={false}/>
		</div>
		<div>
			<LineChart data={data} xKey="year" yKey="value" zKey="group" stacked={true}/>
		</div>
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
		grid-gap: 20px;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		justify-content: stretch;
	}
	.grid > div {
		min-height: 250px;
	}
</style>
