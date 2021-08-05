const seed = 1;
const randomness1 = 5;
const randomness2 = 2;

export default class {
  constructor(items, radiusFun, xFun, padding, yOffset) {
    this.items = items;
    this.radiusFun = radiusFun;
    this.xFun = xFun;
    this.padding = padding;
    this.yOffset = yOffset;
    this.tieBreakFn = this._sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);
    this.maxR = Math.max(...items.map(d => radiusFun(d)));
    this.rng = this._sfc32(1, 2, 3, seed);
  }

  calculateYPositions() {
    let all = this.items
      .map((d, i) => ({
        datum: d,
        originalIndex: i,
        x: this.xFun(d),
        r: this.radiusFun(d) + this.padding,
        y: null,
        placed: false
      }))
      .sort((a, b) => a.x - b.x);
    all.forEach(function(d, i) {
      d.index = i;
    });
    let tieBreakFn = this.tieBreakFn;
    all.forEach(function(d) {
      d.tieBreaker = tieBreakFn(d.x);
    });
    let allSortedByPriority = [...all].sort((a, b) => {
      let key_a = this.radiusFun(a.datum) + a.tieBreaker * randomness1;
      let key_b = this.radiusFun(b.datum) + b.tieBreaker * randomness1;
      if (key_a != key_b) return key_b - key_a;
      return a.x - b.x;
    });
    for (let item of allSortedByPriority) {
      item.placed = true;
      item.y = this._getBestYPosition(item, all);
    }
    all.sort((a, b) => a.originalIndex - b.originalIndex);
    return all.map(d => ({
      x: d.x,
      y: d.y + this.yOffset,
      r: this.radiusFun(d.datum)
    }));
  }

  // Random number generator (for reproducibility)
  // https://stackoverflow.com/a/47593316
  _sfc32(a, b, c, d) {
    let rng = function() {
      a >>>= 0;
      b >>>= 0;
      c >>>= 0;
      d >>>= 0;
      var t = (a + b) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      d = (d + 1) | 0;
      t = (t + d) | 0;
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
    for (let i = 0; i < 10; i++) {
      rng();
    }
    return rng;
  }

  _getBestYPosition(item, all) {
    let forbiddenIntervals = [];
    for (let step of [-1, 1]) {
      let xDist;
      let r = item.r;
      for (
        let i = item.index + step;
        i >= 0 &&
        i < all.length &&
        (xDist = Math.abs(item.x - all[i].x)) < r + this.maxR;
        i += step
      ) {
        let other = all[i];
        if (!other.placed) continue;
        let sumOfRadii = r + other.r;
        if (xDist >= r + other.r) continue;
        let yDist = Math.sqrt(sumOfRadii * sumOfRadii - xDist * xDist);
        let forbiddenInterval = [other.y - yDist, other.y + yDist];
        forbiddenIntervals.push(forbiddenInterval);
      }
    }
    if (forbiddenIntervals.length == 0) {
      return item.r * (this.rng() - .5) * randomness2;
    }
    let candidatePositions = forbiddenIntervals.flat();
    candidatePositions.push(0);
    candidatePositions.sort((a, b) => {
      let abs_a = Math.abs(a);
      let abs_b = Math.abs(b);
      if (abs_a < abs_b) return -1;
      if (abs_a > abs_b) return 1;
      return a - b;
    });
    // find first candidate position that is not in any of the
    // forbidden intervals
    for (let i = 0; i < candidatePositions.length; i++) {
      let position = candidatePositions[i];
      if (
        forbiddenIntervals.every(
          interval => position <= interval[0] || position >= interval[1]
        )
      ) {
        return position;
      }
    }
  }
}