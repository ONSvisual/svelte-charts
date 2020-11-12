<script>
  import reglWrapper from 'regl';
  import reglTween from 'regl-tween';
  import { getContext } from 'svelte';

  const { data, xGet, yGet, width, height, padding } = getContext('LayerCake');
  const { gl } = getContext('gl');

  export let diameter;
	export let colors;
	export let categories;
	export let catKey;
	export let selected;
	
	let catColors;

	if (colors && categories && colors.length >= categories.length) {
		catColors = {}
		categories.forEach((cat, i) => {
			catColors[cat] = [colors[i][0] / 255, colors[i][1] / 255, colors[i][2] / 255];
		});
	}
	
	let regl;
	let tween;
	let positionBuffer;
	let drawParticles;

	let points;
	let pointColors;
	
	function initiate() {
		// Fix for a positioning discrepancy I can't seem to resolve
		let xfactor = $width / ($width + $padding.left + $padding.right);
		let yfactor = $height / ($height + $padding.top + $padding.bottom);
		
		// Map intial points from data
		points = $data.map(d => {
			let point = [(($xGet(d) * xfactor * 2) / $width) - 1, -((($yGet(d) * yfactor * 2) / $height) - 1)];
			let opacity = 0.8;
			if (selected) {
				opacity = d[selected.col] == selected.value ? 1 : 0.02;
			}
			return [...point, opacity];
		});
		
		// Set point colours
		if (catColors) {
			pointColors = $data.map(d => {
				let color = Array.isArray(catColors[d[catKey]]) ? catColors[d[catKey]] : [0, 0, 0];
				return color;
			});
		} else {
			let staticColor = [colors[0][0] / 255, colors[0][1] / 255, colors[0][2] / 255];
			pointColors = $data.map(d => {
				return staticColor;
			});
		}
		
		// Set up regl and tween contexts
		regl = reglWrapper({
			gl: $gl
		});
		regl.clear({
				color: [0, 0, 0, 0],
				depth: 1
			});
		tween = reglTween(regl);
		
		var COUNT = points.length;

    // Pass in the initial data and optionally provide some customizations to
    // the interpolation function.
    positionBuffer = tween.buffer(points, { duration: 1000 });

    // Wrap your command in tween() instead of in regl()
    // A modified regl command is returned.
    drawParticles = tween({
      vert: `
precision mediump float;
attribute vec3 position;
attribute vec3 color;
uniform float pointSize;
varying vec3 fragColor;
varying float opacity;

void main() {
  gl_PointSize = pointSize;
  gl_Position = vec4(position[0], position[1], 0, 1);
  fragColor = color;
  opacity = position[2];
}`,
      frag: `
precision lowp float;
varying vec3 fragColor;
varying float opacity;

void main() {
  if (length(gl_PointCoord.xy - 0.5) > 0.5) {
    discard;
  }
  gl_FragColor = vec4(fragColor, opacity);
}`,

      attributes: {
        position: positionBuffer,
				color: pointColors
      },

      uniforms: {
        pointSize: diameter
      },

      
  
  blend: {
  	enable: true,
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 'src alpha',
      dstRGB: 'one minus src alpha',
      dstAlpha: 'one minus src alpha',
    },
  },
  
  depth: { enable: false },

  count: COUNT,
      primitive: 'points'
    })
		
		regl.frame(() => {
			drawParticles();
		})
	}

  function resize() {
    if ($gl) {
      const canvas = $gl.canvas;
      // Lookup the size the browser is displaying the canvas.
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      // Check if the canvas is not the same size.
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
      $gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }
	
	$: if (!points && $gl) {
		initiate();
	} else if (points && $gl) {
		// Fix for a positioning discrepancy I can't seem to resolve
		let xfactor = $width / ($width + $padding.left + $padding.right);
		let yfactor = $height / ($height + $padding.top + $padding.bottom);
		
		// Map new points from data
		points = $data.map(d => {
			let point = [(($xGet(d) * xfactor * 2) / $width) - 1, -((($yGet(d) * yfactor * 2) / $height) - 1)];
			let opacity = 0.8;
			if (selected) {
				opacity = d[selected.col] == selected.value ? 1 : 0.02;
			}
			return [...point, opacity];
		});
		
		positionBuffer.update(points);
	}
	
  $: ($width, $height, $gl, resize());

</script>
