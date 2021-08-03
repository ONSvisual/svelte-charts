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