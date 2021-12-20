import html2canvas from 'html2canvas';

export function groupData(data, domain, key) {
  let groups = [];
  if (key) {
    domain.forEach(group => {
      groups.push(data.filter(d => d[key] == group));
    });
  } else {
    groups = [data];
  }
  return groups;
}

export function stackData(data, domain, valKey, grpKey) {
  let groups = [];
  let base = JSON.parse(JSON.stringify(data.filter(d => d[grpKey] == domain[0])));
  base.forEach(d => d[valKey] = 0);
  domain.forEach(group => {
    let clone = JSON.parse(JSON.stringify(data.filter(d => d[grpKey] == group)));
    clone.forEach((d, i) => {
      d[valKey] += base[i][valKey];
      base[i][valKey] = d[valKey];
    });
    groups.push(clone);
  });
  return groups;
}

export function getCSV(data, keys = [], filename) {
  let str = '';
  let newkeys = [];
  keys.forEach(key => {
    if (key && !newkeys.includes(key)) {
      newkeys.push(key);
    }
  });
  str += newkeys.join(',') + '\n';
  data.forEach(d => {
    str += newkeys.map(key => d[key]).join(',') + '\n';
  });
  let content = 'data:text/csv;charset=utf-8,' + encodeURI(str);
  download(content, filename + '.csv');
}

export function getPNG(target, filename) {
  html2canvas(target)
  .then(canvas => {
    let content = canvas.toDataURL();
    download(content, filename + '.png');
  });
}

function download(content, filename) {
  var a = document.createElement('a');
  a.href = content;
  a.download = filename;
  a.click();
}