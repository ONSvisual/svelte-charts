<script>
	import { getContext } from 'svelte';
  import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';

	const { data, xGet, yGet, zGet, zRange, zDomain, xScale, yScale, config, custom } = getContext('LayerCake');

	export let ticks;
  export let opacity = 1;

  const tweenOptions = {
		duration: 0,
		easing: cubicInOut
	};

	let points = tweened(null, tweenOptions);

	// Generate array from ticks
	$: points.set(ticks.map(tick => $xGet(tick)),
		{duration: $custom.animation ? $custom.duration : 0}
	);

</script>

<g class="stack-group" {opacity}>
	{#each $points as d, i}
  {#if i < $points.length - 1}
		<rect
			class='stack-rect'
			data-id="{i}"
			x="{d}"
			y="{$yScale(0)}"
			height=10
			width="{$points[i + 1] - d}"
			fill="{$zRange[i]}"
		></rect>
  {/if}
	{/each}
</g>
