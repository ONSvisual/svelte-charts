<script>
	import { getContext } from 'svelte';
	import { groupData } from '../../js/utils';

	const { data, xGet, yGet, zGet, zRange, zDomain, xScale, yScale, config } = getContext('LayerCake');

	export let comparison = true;
	export let markerWidth = 2.5;

	// Create a data series for each zKey (group)
	$: groups = groupData($data, $zDomain, $config.z);
</script>

<g class="bar-group">
	{#each groups as group, i}
	  {#each group as d, j}
		  {#if !comparison || i == 0}
		    <rect
			    class='bar-rect'
			    data-id="{j}"
			    x="{$xScale.range()[0]}"
			    y="{$yGet(d)}"
			    height={$yScale.bandwidth()}
			    width="{$xGet(d)}"
			    fill="{$config.z ? $zGet(d) : $zRange[0]}"
		    ></rect>
			{:else}
			  <rect
			    class='bar-marker'
			    data-id="{j}"
			    x="{$xGet(d) - (markerWidth / 2)}"
			    y="{$yGet(d)}"
			    height={$yScale.bandwidth()}
			    width="{markerWidth}"
			    fill="{$zGet(d)}"
		    ></rect>
			{/if}
	  {/each}
	{/each}
</g>
