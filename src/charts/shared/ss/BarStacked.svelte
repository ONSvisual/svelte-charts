<script>
	import { getContext } from 'svelte';
	import { stackData } from '../../js/utils';

	const { data, xGet, xScale, yGet, zGet, yScale, zDomain, config } = getContext('LayerCake');

	$: groups = stackData($data, $zDomain, $config.x, $config.z);

	$: xPos = (i, j) => {
		return i == 0 ? $xScale(0) : $xGet(groups[i - 1][j]);
	}
	$: barWidth = (d, i, j) => {
		return i == 0 ? $xGet(d) : $xGet(d) - $xGet(groups[i - 1][j]);
	};
</script>

<g class="bar-group">
	{#each groups as group, i}
	  {#each group as d, j}
			<rect
				class='bar-rect'
				data-id="{j}"
				x="{xPos(i, j)}"
				y="{$yGet(d)}"
				height={$yScale.bandwidth()}
				width="{barWidth(d, i, j)}"
				fill={$zGet(d)}
			></rect>
		{/each}
	{/each}
</g>
