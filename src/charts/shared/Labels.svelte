<script>
	import { getContext } from 'svelte';
	import { raise } from 'layercake';
	import wrap from '../../js/wrap';
	import spread from '../../js/spread-labels';

	const { data, xScale, yScale, zGet, padding, config, custom } = getContext('LayerCake');

	export let hovered = null;
	export let selected = null;
	export let labelAll = false;
	export let spreadLabels = false;
	export let content = null;
	export let marker = false;
	export let textWrap = false;
	
	let coords = $custom.coords;
	let idKey = $custom.idKey;
	let labelKey = $custom.labelKey;
	let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
	let colorSelect = $custom.colorSelect ? $custom.colorSelect : '#206095';
	let radius = 8; // For spreading labels

	const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/; //regex test for something that looks like a date 2017-01-01T00:00:00.000Z

	const raiseMe = (e, options = {}) => { if (!options.disable) raise(e) };
	const setRadius = (e, options = {}) => { if (options.first) radius = e.getBBox().height / 2 };
	const addLabelCoords = (coords, radius) => {
		
		const sortedIndex = Array.from(coords.keys())
			.sort((a, b) => coords[b][coords[b].length - 1].y - coords[a][coords[a].length - 1].y);
		
		const reverseIndex = Array.from(sortedIndex.keys()).map(i => sortedIndex.indexOf(i));
		
		let sortedCoords = coords.map((d, i) => coords[sortedIndex[i]]);
		
		const labelYs = spread(sortedCoords.map(c => $yScale(c[c.length - 1].y)), radius);
		
		sortedCoords = sortedCoords.map((c, i) => {
			const clone = JSON.parse(JSON.stringify(c));
			clone.forEach(
				d=>{if(regex.test(d.x)){d.x=new Date(d.x)}}//this goes through the clone and looks for stuff that looks like a date and turns it back into a date
			)
			clone[clone.length - 1].ly = labelYs[i];
			return clone;
		});
		return reverseIndex.map(i => sortedCoords[i]);
	};



	$: coordsWithLabels = $coords?.[0]?.[0]?.y && spreadLabels ? addLabelCoords($coords, radius) : $coords;
</script>

{#if coordsWithLabels}
	<defs>
		<filter x="0" y="0" width="1" height="1" id="bgfill">
			<feFlood flood-color="rgba(255,255,255,0.8)" result="bg" />
			<feMerge>
				<feMergeNode in="bg" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<g class="chart-label-group">
		{#if coordsWithLabels?.[0]?.x}
			{#each coordsWithLabels as d, i}
				{#if labelAll || [hovered, selected].includes($data[i][idKey])}
					<text
						class="chart-label"
						transform="translate(5,-5)"
						filter="url(#bgfill)"
						fill={labelAll && $config.z
							? $zGet($data[i])
							: $data[i][idKey] === hovered
								? colorHover
								: colorSelect}
						x={$xScale(d.x)}
						y={$yScale(d.y)}
					>
						{content ? content : $data[i][labelKey]}
					</text>
				{/if}
			{/each}
		{:else if coordsWithLabels?.[0]?.[0]?.x}
			{#each coordsWithLabels as d, i}
				{#if labelAll || [hovered, selected].includes($data[i][0][idKey])}
					{#if marker}
						<circle
							cx={$xScale(d[d.length - 1].x)}
							cy={$yScale(d[d.length - 1].y)}
							r="5"
							fill={labelAll && $config.z
								? $zGet($data[i][0])
								: $data[i][0][idKey] === hovered
									? colorHover
									: colorSelect}
							use:raiseMe={{
								disable: $data[i][0][idKey] !== hovered,
							}}
						/>
					{/if}
					<text
						class="chart-label"
						transform="translate({marker ? 7 : 4},3)"
						filter="url(#bgfill)"
						fill={labelAll && $config.z
							? $zGet($data[i][0])
							: $data[i][0][idKey] === hovered
								? colorHover
								: colorSelect}
						x={$xScale(d[d.length - 1].x)}
						y={spreadLabels && d[d.length - 1].ly
							? d[d.length - 1].ly
							: $yScale(d[d.length - 1].y)}
						use:wrap={{ disable: !textWrap, width: $padding.right }}
						use:raiseMe={{
							disable: $data[i][0][idKey] !== hovered,
						}}
						use:setRadius={{ first: i === 0 }}
					>
						{content ? content : $data[i][0][labelKey]}
					</text>
				{/if}
			{/each}
		{/if}
	</g>
{/if}

<style>
	.chart-label {
		font-size: 0.8em;
	}
</style>
