<script lang="ts">
    export let data;
</script>

<button on:click={() => {
    window.location.href = data.authUrl;
}}>Connect to Threads</button>
