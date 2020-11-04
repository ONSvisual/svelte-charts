<script>
	import ScatterChart from '../charts/ScatterChart.svelte';
	import { getData } from '../js/utils.js';
	
	const regions = [
		{
			code: 'E12000001',
			name: 'North East'
		},
		{
			code: 'E12000002',
			name: 'North West'
		},
		{
			code: 'E12000003',
			name: 'Yorkshire and The Humber'
		},
		{
			code: 'E12000004',
			name: 'East Midlands'
		},
		{
			code: 'E12000005',
			name: 'West Midlands'
		},
		{
			code: 'E12000006',
			name: 'East of England'
		},
		{
			code: 'E12000007',
			name: 'London'
		},
		{
			code: 'E12000008',
			name: 'South East'
		},
		{
			code: 'E12000009',
			name: 'South West'
		}
	];
	const categories = regions.map(d => d.code);
	const colors = [
		[208, 88, 126],
		[218, 123, 145],
		[227, 156, 165],
		[234, 188, 185],
		[240, 220, 205],
		[230, 245, 208],
		[191, 228, 171],
		[151, 210, 135],
		[108, 192, 100],
		[55, 174, 63]
	];
	const datakeys = {
		imd: 'Overall',
		income: 'Income',
		employment: 'Employment',
		education: 'Education',
		health: 'Health',
		crime: 'Crime',
		housing: 'Housing',
		environment: 'Environment'
	}
	const url = 'https://raw.githubusercontent.com/bothness/geo-data/main/csv/imd-values-2019.csv';
	const catKey = 'region_code';
	
	let data;
	let places;
	let selected;
	let place;
	let region;
	let xKey = 'income';
	let yKey = 'employment';
	
	getData(url)
	.then(result => data = result)
	.then(() => {
		let codes = [];
		let array = [];
		data.forEach(d => {
			if (!codes.includes(d.lad_code)) {
				codes.push(d.lad_code);
				array.push({
					code: d.lad_code,
					name: d.lad_name
				});
			}
		});
		array.sort((a, b) => a.name.localeCompare(b.name));
		places = array;
	});
	
	function selectRegion() {
		selected = region;
		place = null;
	}
	function selectPlace() {
		selected = place;
		region = null;
	}
</script>

<style>
	:global(body) {
		background-color: #222;
		color: #ccc;
	}
	select {
		max-width: 190px;
	}
</style>

{#if data}
X Axis
<select bind:value={xKey}>
	{#each Object.keys(datakeys) as key}
		<option value={key}>{datakeys[key]}</option>
	{/each}
</select>
Y Axis
<select bind:value={yKey}>
	{#each Object.keys(datakeys) as key}
		<option value={key}>{datakeys[key]}</option>
	{/each}
</select><br/>
Region
<!-- svelte-ignore a11y-no-onchange -->
<select bind:value={region} on:change={selectRegion}>
	<option value={null}>Select one</option>
	{#each regions as region}
		<option value={{value: region.code, col: 'region_code'}}>{region.name}</option>
	{/each}
</select>
{#if places}
District
<!-- svelte-ignore a11y-no-onchange -->
<select bind:value={place} on:change={selectPlace}>
	<option value={null}>Select one</option>
	{#each places as place}
		<option value={{value: place.code, col: 'lad_code'}}>{place.name}</option>
	{/each}
</select>
{/if}

{#if xKey && yKey}
<ScatterChart diameter={4} {data} {xKey} {yKey} {catKey} {colors} {categories} {selected} />
{/if}
{/if}