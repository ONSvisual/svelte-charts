<script>
	import { getContext, createEventDispatcher } from 'svelte';

	const { data, xScale, yScale, zGet, config, custom } = getContext('LayerCake');
	const dispatch = createEventDispatcher();

	export let lineWidth = 2.5;
	export let hover = false;
	export let hovered = null;
	export let select = false;
	export let selected = null;
	export let highlighted = [];
	
	let coords = $custom.coords;
	let idKey = $custom.idKey;
	let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
	let colorSelect = $custom.colorSelect ? $custom.colorSelect : '#206095';
	let colorHighlight = $custom.colorHighlight ? $custom.colorHighlight : '#206095';

  const makeLookup = (data, coords) => {
    const lkp = {};
    for (let i = 0; i < data.length; i ++) {
      lkp[data[i][0][idKey]] = {id: data[i][0][idKey], coords: coords[i]};
    }
    return lkp;
  }
  $: lookup = idKey ? makeLookup($data, $coords) : null;

	// Function to make SVG path
	const makePath = (group) => {
		let path = 'M' + group
		.map(d => {
			return $xScale(d.x) + ',' + $yScale(d.y);
		})
		.join('L');
		return path;
	}

	function doHover(e, d) {
		if (hover) {
			hovered = d ? d[0][idKey] : null;
			dispatch('hover', {
				id: hovered,
				data: d,
				event: e
			});
		}
	}

	function doSelect(e, d) {
		if (select) {
			selected = d ? d[0][idKey] : null;
			dispatch('select', {
				id: selected,
				data: d,
				event: e
			});
		}
	}
</script>

{#if $coords}
<g class="line-group">
	{#each $coords as group, i}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<path
		  class="path-hover"
			d="{makePath(group)}"
			on:mouseover={hover ? (e) => doHover(e, $data[i]) : null}
			on:mouseleave={hover ? (e) => doHover(e, null) : null}
			on:focus={select ? (e) => doHover(e, $data[i]) : null}
			on:blur={select ? (e) => doHover(e, null) : null}
			on:click={select ? (e) => doSelect(e, $data[i]) : null}
			tabindex="{hover || select ? 0 : -1}"
		/>
	  <path
		  class="path-line"
			d="{makePath(group)}"
			stroke="{
				$config.z ? $zGet($data[i][0]) : $config.zRange[0]}"
			stroke-width="{
				lineWidth
			}"
		/>
	{/each}
	
  {#if lookup}
    {#if highlighted[0]}
    {#each highlighted.map(d => lookup[d]) as group}
      <path
        class="path-overlay"
        d="{makePath(group.coords)}"
        stroke="{colorHighlight}"
        stroke-width="{lineWidth + 1.5}"
      />
    {/each}
    {/if}
    {#if hovered || selected}
    {#each [hovered, selected].filter(d => d !== null).map(d => lookup[d]) as group}
      <path
        class="path-overlay"
        d="{makePath(group.coords)}"
        stroke="{
          group.id == hovered ? colorHover :
          colorSelect
        }"
        stroke-width="{lineWidth + 1.5}"
      />
    {/each}
    {/if}
  {/if}
</g>
{/if}

<style>
	path {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.path-hover {
		stroke: rgba(255,255,255,0);
		stroke-width: 7;
	}
	.path-line, .path-overlay {
		pointer-events: none;
	}
</style>


