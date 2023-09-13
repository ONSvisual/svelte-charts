<script>
  import BarChart from "./BarChart.svelte";
  import ColumnChart from "./ColumnChart.svelte";
  import LineChart from "./LineChart.svelte";
  import ScatterChart from "./ScatterChart.svelte";
  import DotPlotChart from "./DotPlotChart.svelte";

  export let section;

  const directions = ["left", "right", "top", "bottom"];

  function makeProps(section) {
    let props = {};
    let padding = {left: 50, right: 0, top: 0, bottom: 20};
    let keys = Object.keys(section).filter(key => ![
      "type", "chartType", ...directions.map(dir => `padding-${dir}`)
    ].includes(key));
    keys.forEach(key => props[key] = section[key]);
    if (Array.isArray(section.data)) {
      let dims = Object.keys(section.data[0]);
      dims.forEach(dim => props[`${dim}Key`] = dim);
    }
    directions.forEach(dir => {
      if (section[`padding-${dir}`]) padding[dir] = section[`padding-${dir}`];
    });
    props.padding = padding;
    if (!props.legend && props.legend !== false) props.legend = props.zKey ? true : false;
    return props;
  }

  $: props = makeProps(section);
</script>

{#if props}
{#key props.data}
  {#if section.chartType.toLowerCase() === "bar" && props.xKey && props.yKey}
  <BarChart {...props}/>
  {:else if section.chartType.toLowerCase() === "bar-highlight" && props.xKey && props.yKey}
  <BarChart {...props} color="#bbb" colorSelect="#206095" colorHighlight="grey" overlayFill={true}/>
  {:else if section.chartType.toLowerCase() === "column" && props.xKey && props.yKey}
  <ColumnChart {...props}/>
  {:else if section.chartType.toLowerCase() === "column-highlight" && props.xKey && props.yKey}
  <ColumnChart {...props} color="#bbb" colorSelect="#206095" colorHighlight="grey" overlayFill={true}/>
  {:else if section.chartType.toLowerCase() === "line" && props.xKey && props.yKey}
  <LineChart {...props} area={false}/>
  {:else if section.chartType.toLowerCase() === "line-highlight" && props.xKey && props.yKey}
  <LineChart {...props} area={false} color="#bbb" lineWidth={1} legend={false} snapTicks={false} hover labels/>
  {:else if section.chartType.toLowerCase() === "scatter" && props.xKey}
  <ScatterChart {...props}/>
  {:else if section.chartType.toLowerCase() === "scatter-highlight" && props.xKey}
  <ScatterChart {...props} color="#bbb" colorSelect="#206095" colorHighlight="grey" overlayFill={true} hover labels/>
  {:else if section.chartType.toLowerCase() === "dotplot" && props.xKey && props.yKey}
  <DotPlotChart {...props}/>
  {/if}
{/key}
{/if}