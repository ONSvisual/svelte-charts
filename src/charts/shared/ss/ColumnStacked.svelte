<script>
	import { getContext } from 'svelte';
	import { stackData } from '../../js/utils';

	const { data, xGet, xScale, yGet, yScale, zGet, zDomain, config } = getContext('LayerCake');

	$: groups = stackData($data, $zDomain, $config.y, $config.z);

	$: columnHeight = (d, i, j) => {
		return i == 0 ?  $yScale(0) - $yGet(d) : $yGet(groups[i - 1][j]) - $yGet(d);
	};
</script>

<g class="column-group">
	{#each groups as group, i}
	  {#each group as d, j}
			<rect
				class='column-rect'
				data-id="{j}"
				x="{$xGet(d)}"
				y="{$yGet(d)}"
				height="{columnHeight(d, i, j)}"
				width="{$xScale.bandwidth()}"
				fill={$zGet(d)}
			></rect>
		{/each}
	{/each}
</g>
