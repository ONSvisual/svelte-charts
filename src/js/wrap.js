// Based on https://observablehq.com/@jtrim-ons/svg-text-wrapping
// Adapted to remove D3 dependency
export default function (node, options = {}) {
  if (!options.disable) {
    const getVal = (val, fallback) => typeof val === "number" ? val : fallback;
    const width = getVal(options.width, 100);
    const dyAdjust = getVal(options.dyAdjust, 0.05);
    const lineHeightEms = getVal(options.lineHeightEms, 1);
    const lineHeightSquishFactor = getVal(options.lineHeightSquishFactor, 1);
    const splitOnHyphen = options.splitOnHyphen || true;
    const centreVertically = options.centreVertically || true;

    const x = +node.getAttribute("x");
    const y = +node.getAttribute("y");
    const anchor = node.getAttribute("text-anchor");

    const svgNode = (parent, type, content = null) => {
      const node = document.createElementNS("http://www.w3.org/2000/svg", type);
      if (content) node.textContent = content;
      parent.append(node);
      return node;
    }

    const words = [];
    node.textContent
      .split(/\s+/)
      .forEach(function (w) {
        if (splitOnHyphen) {
          var subWords = w.split("-");
          for (var i = 0; i < subWords.length - 1; i++)
            words.push(subWords[i] + "-");
          words.push(subWords[subWords.length - 1] + " ");
        } else {
          words.push(w + " ");
        }
    });

    node.textContent = ""; // Empty the text element

    // `tspan` is the tspan element that is currently being added to
    let tspan = svgNode(node, "tspan");

    let line = ""; // The current value of the line
    let prevLine = ""; // The value of the line before the last word (or sub-word) was added
    let nWordsInLine = 0; // Number of words in the line
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      prevLine = line;
      line = line + word;
      ++nWordsInLine;
      tspan.textContent = line.trim();
      if (tspan.getComputedTextLength() > width && nWordsInLine > 1) {
        // The tspan is too long, and it contains more than one word.
        // Remove the last word and add it to a new tspan.
        tspan.textContent = prevLine.trim();
        prevLine = "";
        line = word;
        nWordsInLine = 1;
        tspan = svgNode(node, "tspan", word.trim());
      }
    }

    const tspans = node.childNodes;

    let h = lineHeightEms;
    // Reduce the line height a bit if there are more than 2 lines.
    if (tspans.length > 2)
      for (let i = 0; i < tspans.length; i++) h *= lineHeightSquishFactor;

    let dx = 0;
    tspans.forEach((d, i) => {
      // Calculate the y offset (dy) for each tspan so that the vertical centre
      // of the tspans roughly aligns with the text element's y position.
      if (anchor === "end" && i !== 0) dx = -d.getComputedTextLength();
      let dy = i === 0 ? dyAdjust : 1;
      if (centreVertically && i === 0) dy -= ((tspans.length - 1) * h) / 2;

      d.setAttribute("dx", dx);
      d.setAttribute("dy", dy + "em");
      if (anchor !== "end") dx = -d.getComputedTextLength();
    });
  }
}