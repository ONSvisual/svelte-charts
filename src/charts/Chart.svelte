<script>
  import BarChart from "./BarChart.svelte";
  import ColumnChart from "./ColumnChart.svelte";
  import LineChart from "./LineChart.svelte";
  import ScatterChart from "./ScatterChart.svelte";
  import DotPlotChart from "./DotPlotChart.svelte";

  /**
   * An alternative way to pass in all of the chart props as a single object {chartType, data, ...options}
   * @type {object|null}
   */
   export let section = null;
  /**
   * Type of chart
   * @type {"bar"|"column"|"line"|"scatter"|"dotplot"|"bar-highlight"|"column-highlight"|"line-highlight"|"scatter-highlight"}
   */
  export let type = section?.chartType;
  /**
   * The data array for the chart (equivalent to parsed rows of a CSV)
   * @type {array|null}
   */
  export let data = null;
  /**
   * Options for the chart as key:value pairs
   * @type {object|null}
   */
  export let options = null;

  const directions = ["left", "right", "top", "bottom"];
  const regex = /^\[(?:'[^']*'|"[^"]*"|\d+(?:\.\d+)?)(,?)*]$/;//this regex looks for an array

  function makeProps(type, data, options, section) {
    if (!section) section = {chartType: type, data, ...options};
    let props = {};
    let padding = {left: 50, right: 0, top: 0, bottom: 20};
    let keys = Object.keys(section).filter(key => ![
      "type", "chartType", ...directions.map(dir => `padding-${dir}`)
    ].includes(key));
    keys.forEach(key => {
      if(regex.test(section[key])){//this test if the string looks like an array
        props[key]=JSON.parse(section[key])//if it's an array, parse as an array
      }else{
        props[key]= section[key]
      }
    }
    );
    if (Array.isArray(section.data)) {
      let dims = Object.keys(section.data[0]);
      dims.forEach(dim => {
        if(["x","y","z","r"].includes(dim)){//if the key is either, x,y,z or r, add the string 'key' to it for the props object
          props[`${dim}Key`] = dim
        }else{
          props[dim] = dim
        }
      });
    }
    directions.forEach(dir => {
      if (section[`padding-${dir}`]) padding[dir] = section[`padding-${dir}`];
    });
    props.padding = padding;
    if (!props.legend && props.legend !== false) props.legend = props.zKey ? true : false;
    return props;
  }

  $: props = makeProps(type, data, options, section);
</script>

{#if props}
{#key props.data}
  {#if type.toLowerCase() === "bar" && props.xKey && props.yKey}
  <BarChart {...props}/>
  {:else if type.toLowerCase() === "bar-highlight" && props.xKey && props.yKey}
  <BarChart {...props} color="#bbb" colorSelect="#206095" colorHighlight="grey" overlayFill={true}/>
  {:else if type.toLowerCase() === "column" && props.xKey && props.yKey}
  <ColumnChart {...props}/>
  {:else if type.toLowerCase() === "column-highlight" && props.xKey && props.yKey}
  <ColumnChart {...props} color="#bbb" colorSelect="#206095" colorHighlight="grey" overlayFill={true}/>
  {:else if type.toLowerCase() === "line" && props.xKey && props.yKey}
  <LineChart {...props} area={false}/>
  {:else if type.toLowerCase() === "line-highlight" && props.xKey && props.yKey}
  <LineChart {...props} area={false} color="#bbb" lineWidth={1} legend={false} snapTicks={false} hover labels/>
  {:else if type.toLowerCase() === "scatter" && props.xKey}
  <ScatterChart {...props}/>
  {:else if type.toLowerCase() === "scatter-highlight" && props.xKey}
  <ScatterChart {...props} color="#bbb" colorSelect="#206095" colorHighlight="grey" overlayFill={true} hover labels/>
  {:else if type.toLowerCase() === "dotplot" && props.xKey && props.yKey}
  <DotPlotChart {...props}/>
  {/if}
{/key}
{/if}
