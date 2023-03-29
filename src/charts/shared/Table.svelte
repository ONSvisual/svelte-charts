<script>
  export let data;
	export let key1 = null;
	export let key2 = null;
	export let key3 = null;
	export let key4 = null;

	function makeKeys(key1, key2, key3, key4) {
		let keys = [];
		if (key1) keys.push(key1);
		if (key2) keys.push(key2);
		if (key3) keys.push(key3);
		if (key4) keys.push(key4);
		return keys;
	}
	$: keys = makeKeys(key1, key2, key3, key4);
</script>

{#if data && keys}
<table>
  <thead>
    <tr>
			{#each keys as key}
			<th>{key}</th>
			{/each}
    </tr>
  </thead>
  <tbody>
    {#each data as d}
		<tr>
			{#each keys as key}
			<td>{d[key]}</td>
			{/each}
		</tr>
		{/each}
  </tbody>
</table>
{/if}