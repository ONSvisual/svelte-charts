<script>
  import { getContext } from 'svelte';
	import AccurateBeeswarm from '../../js/accurate-beeswarm';

	const { data, y, r, xGet, yGet, rGet, xScale, yScale, yRange, rRange, custom, width } = getContext('LayerCake');

	let coords = $custom.coords;
  let type = $custom.type;
	let prevWidth = $width;

	$: setCoords($data, $custom, $y, $r, $width);

  function setCoords(data, custom, y, r, width) {
    let mode = custom.mode;
    let markerWidth = custom.markerWidth;
    let padding = custom.padding;
		let duration = custom.animation && width == prevWidth ? custom.duration : 0;
		
		prevWidth = width;

    let newcoords;
    if (type == 'bar') {
      newcoords = data.map((d, i) => d.map((e, j) => {
			  return {
				  x: mode == 'default' || mode =='grouped' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? $xScale(0) :
				    mode == 'stacked' ? $xGet(data[i - 1][j]) :
					  $xGet(e) - (markerWidth / 2),
				  y: mode == 'grouped' ? $yGet(e) + (i * (1 / data.length) * $yScale.bandwidth()) : $yGet(e),
				  w: mode == 'default' || mode =='grouped' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? $xGet(e) :
				    mode == 'stacked' ? $xGet(e) - $xGet(data[i - 1][j]) :
					  markerWidth,
				  h: mode == 'grouped' ? $yScale.bandwidth() / data.length : $yScale.bandwidth()
			  }
		  }));
    } else if (type == 'column') {
      newcoords = data.map((d, i) => d.map((e, j) => {
        return {
			    x: mode == 'grouped' && $xScale.bandwidth ? $xGet(e) + (i * (1 / data.length) * $xScale.bandwidth()) :
			      mode == 'grouped' ? $xGet(e)[0] + (i * (1 / data.length) * Math.max(0, ($xGet(e)[1] - $xGet(e)[0]))) :
			      $xScale.bandwidth ? $xGet(e) : $xGet(e)[0],
			    y: mode == 'marker' || (mode == 'comparison' && i > 0) ? $yGet(e) - (markerWidth / 2) :
				    $yGet(e),
				  w: mode == 'grouped' && $xScale.bandwidth ? $xScale.bandwidth() / data.length :
		        mode == 'grouped' ? Math.max(0, ($xGet(e)[1] - $xGet(e)[0])) / data.length :
			      $xScale.bandwidth ? $xScale.bandwidth() :
			      Math.max(0, ($xGet(e)[1] - $xGet(e)[0])),
				  h: mode == 'default' || mode == 'grouped' || ((mode == 'comparison' || mode == 'stacked') && i == 0) ? $yScale(0) - $yGet(e) :
				    mode == 'stacked' ? $yGet(data[i - 1][j]) - $yGet(e) :
				    markerWidth
		    }
	    }));
    } else if (type == 'scatter') {
      let rVal = (d) => r ? $rGet(d) : $rRange[0];
      newcoords = y ? data.map(
			  d => ({x: $xGet(d), y: $yGet(d), r: rVal(d)})
		  ) : new AccurateBeeswarm(
		    data,
		    d => rVal(d),
		    d => $xGet(d),
		    padding,
		    $yRange[0] / 2
		  ).calculateYPositions();
    } else if (type == 'line') {
			newcoords = data.map((d) => d.map((e) => {
				return {
					x: $xGet(e),
					y: $yGet(e)
				}
			}));
		}
    coords.set(newcoords, {duration});
  }
</script>