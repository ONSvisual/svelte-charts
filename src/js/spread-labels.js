// https://observablehq.com/@jtrim-ons/label-placement-for-a-slope-chart-2
export default (ys, radius) => {
  let zs = ys.map((y, i) => y - i * radius * 2);
  return f(zs).map((x, i) => x + i * radius * 2);
}

const f = (zs) => {
  let batches = [];
  for (let z of zs) {
    batches.push({ size: 1, mean: z });
    while (batches.length > 1) {
      let b = batches[batches.length - 2];
      let c = batches[batches.length - 1];
      if (b.mean < c.mean) break;
      b.mean = (b.mean * b.size + c.mean * c.size) / (b.size + c.size);
      b.size = b.size + c.size;
      batches.pop();
    }
  }
  let xs = [];
  for (const batch of batches)
    for (let i = 0; i < batch.size; i++) xs.push(batch.mean);
  return xs;
}