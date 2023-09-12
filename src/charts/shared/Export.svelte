<script>
	import { getCSV, getPNG } from '../../js/utils';

  export let el;
  export let data;
  export let keys = [];
  export let title = null;
  export let output = {};
</script>

<div class="chart-export">
  {#if output.csv}
  <button on:click={() => getCSV(data, keys, title ? title : 'chart')}>Download data (CSV)</button>
  {/if}
  {#if output.csv && output.png}|{/if}
  {#if output.png}
  <button on:click={() => getPNG(el, title ? title : 'chart')}>Download image (PNG)</button>
  {/if}
</div>

<style>
  .chart-export {
    margin-top: 10px;
		font-size: .8em;
	}
  button {
    color: #206095;
    text-decoration: underline;
    text-underline-position: under;
    background: none;
    border: none;
    padding: 0 0 1px;
  }
  button:hover {
    cursor: pointer;
    color: #003c57;
    text-decoration-thickness: 2px;
  }
  button:focus {
    color: #222;
    background-color: #fbc900;
    text-decoration-thickness: 3px;
  }
</style>