<script>
	import { getContext } from 'svelte';
	import AccurateBeeswarm from '../../js/accurate-beeswarm';

	const { data, xGet, y, yGet, yRange, z, zGet, zRange, r, rGet, rRange, custom } = getContext('LayerCake');

	export let stroke = 'black';
	export let strokeWidth = 0;
	export let padding = 1

	let points = $custom.points;

	$: rVal = (d) => $r ? $rGet(d) : $rRange[0];

	$: points.set(
		$y ? $data.map(
			d => ({x: $xGet(d), y: $yGet(d), r: rVal(d)})
		) : new AccurateBeeswarm(
		  $data,
		  d => rVal(d),
		  d => $xGet(d),
		  padding,
		  $yRange[0] / 2
		).calculateYPositions(),
		{duration: $custom.animation ? $custom.duration : 0}
	);
</script>

<g class="scatter-group">
	{console.log(points)}
	{#each $points as d, i}
		<circle
			cx={d.x}
			cy={d.y}
			r={d.r}
			fill="{$z ? $zGet($data[i]) : $zRange[0]}"
			{stroke}
			stroke-width={strokeWidth}
		/>
	{/each}
</g>
