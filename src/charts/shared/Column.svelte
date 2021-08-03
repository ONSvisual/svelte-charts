<script>
	import { getContext } from 'svelte';
	import { groupData } from '../../js/utils';

	const { data, xGet, xScale, yGet, yRange, zGet, zRange, zDomain, config } = getContext('LayerCake');

	export let comparison = true;
	export let markerWidth = 2.5;

	// Create a data series for each zKey (group)
	$: groups = groupData($data, $zDomain, $config.z);

	$: columnWidth = d => {
		const vals = $xGet(d);
		return Math.max(0, (vals[1] - vals[0]));
	};

	$: columnHeight = d => {
		return $yRange[0] - $yGet(d);
	};
</script>

<g class="column-group">
	{#each groups as group, i}
	  {#each group as d, j}
		  {#if !comparison || i == 0}
		    <rect
    			class='column-rect'
		    	data-id="{j}"
			    x="{$xScale.bandwidth ? $xGet(d) : $xGet(d)[0]}"
			    y="{$yGet(d)}"
    			width="{$xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}"
		    	height="{columnHeight(d)}"
			    fill="{$config.z ? $zGet(d) : $zRange[0]}"
		    />
			{:else}
			  <rect
    			class='column-marker'
		    	data-id="{j}"
			    x="{$xScale.bandwidth ? $xGet(d) : $xGet(d)[0]}"
			    y="{$yGet(d) - (markerWidth / 2)}"
    			width="{$xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}"
		    	height="{markerWidth}"
			    fill="{$zGet(d)}"
		    />
		  {/if}
		{/each}
	{/each}
</g>
