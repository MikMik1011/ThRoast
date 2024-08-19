<script lang="ts">
    import { onMount } from "svelte";

    import type { ProfileResponse } from "@mikmik1011/threads-api-wrapper";
    export let data: { user: ProfileResponse, roast: string };
    let fetching = false;

    const getRoast = async () => {
        if (fetching) return;
        fetching = true;
        const response = await fetch(`/api/roast`);
        const roast = await response.json();
        data.roast = roast.roast;
        fetching = false;
    };

    onMount(getRoast);

</script>
<h2>{data.user.name} (@{data.user.username})</h2>
<h1>AI profile roast:</h1> <br>
<button on:click={getRoast}>Get Roasted!</button>
{#if fetching}
    <p>Fetching...</p>
{/if}
{#if data.roast}
    <p> {data.roast} </p>
{/if}

<style>
    td {
        padding-right: 20px; /* Adjust the value as needed */
    }
</style>