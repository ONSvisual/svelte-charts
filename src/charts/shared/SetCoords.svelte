<script>
  import { getContext } from 'svelte';
	import AccurateBeeswarm from '../../js/accurate-beeswarm';

	const { data, x, y, r, xGet, yGet, rGet, xScale, yScale, yRange, rRange, custom, width } = getContext('LayerCake');

	let coords = $custom.coords;
  let type = $custom.type;
	let prevWidth = $width;

	$: setCoords($data, $custom, $x, $y, $r, $width);

  function setCoords(data, custom, x, y, r, width) {
    let mode = custom.mode;
    let padding = custom.padding;
		let duration = custom.animation && width == prevWidth ? custom.duration : 0;
		
		prevWidth = width;

    let newcoords;
    if (type == 'bar') {
      newcoords = data.map((d, i) => d.map((e, j) => {
			  return {
				  x: mode == 'default' || mode =='grouped' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? 0 :
				    mode == 'stacked' ? x(data[i - 1][j]) :
					  x(e),
				  y: mode == 'grouped' ? $yGet(e) + (i * (1 / data.length) * $yScale.bandwidth()) : $yGet(e),
				  w: mode == 'default' || mode =='grouped' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? x(e) :
				    mode == 'stacked' ? x(e) - x(data[i - 1][j]) :
					  0,
				  h: mode == 'grouped' ? $yScale.bandwidth() / data.length : $yScale.bandwidth()
			  }
		  }));
    } else if (type == 'column') {
      newcoords = data.map((d, i) => d.map((e, j) => {
        return {
			    x: mode == 'grouped' && $xScale.bandwidth ? $xGet(e) + (i * (1 / data.length) * $xScale.bandwidth()) :
			      mode == 'grouped' ? $xGet(e)[0] + (i * (1 / data.length) * Math.max(0, ($xGet(e)[1] - $xGet(e)[0]))) :
			      $xScale.bandwidth ? $xGet(e) : $xGet(e)[0],
			    y: y(e),
				  w: mode == 'grouped' && $xScale.bandwidth ? $xScale.bandwidth() / data.length :
		        mode == 'grouped' ? Math.max(0, ($xGet(e)[1] - $xGet(e)[0])) / data.length :
			      $xScale.bandwidth ? $xScale.bandwidth() :
			      Math.max(0, ($xGet(e)[1] - $xGet(e)[0])),
				  h: mode == 'default' || mode == 'grouped' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? y(e) :
				    mode == 'stacked' ? y(e) - y(data[i - 1][j]) :
				    0
		    }
	    }));
    } else if (type == 'scatter') {
      let rVal = (d) => r ? $rGet(d) : $rRange[0];
      newcoords = y ? data.map(
			  d => ({x: x(d), y: y(d), r: rVal(d)})
		  ) : new AccurateBeeswarm(
		    data,
		    d => rVal(d),
		    d => $xGet(d),
		    padding,
		    $yRange[0] / 2
		  ).calculateYPositions().map(d => ({x: $xScale.invert(d.x), y: $yScale.invert(d.y), r: d.r}));
    } else if (type == 'line') {
			newcoords = data.map((d) => d.map((e) => {
				return {
					x: x(e),
					y: y(e)
				}
			}));
		}
    coords.set(newcoords, {duration});
  }
</script>