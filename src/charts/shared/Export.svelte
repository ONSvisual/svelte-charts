<script>
	import { getCSV, getPNG } from '../../js/utils';

  export let el;
  export let data;
  export let keys = [];
  export let title = null;
  export let output = {};
</script>

<div class="export">
  Export: 
  {#if output.csv}
  <button on:click={() => getCSV(data, keys, title ? title : 'chart')}>CSV</button>
  {/if}
  {#if output.png}
  <button on:click={() => getPNG(el, title ? title : 'chart')}>PNG</button>
  {/if}
</div>

<style>
  .export {
    margin-top: 10px;
		font-size: .8em;
	}
  button {
    color: white;
    background-color: #0f8243;
    border: none;
    padding: 5px 10px;
  }
  button:hover {
    cursor: pointer;
    background-color:#295b34;
  }
</style>