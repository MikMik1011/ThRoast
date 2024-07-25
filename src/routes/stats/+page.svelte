<script lang="ts">
    import type { ProfileResponse } from "threads-api-wrapper";
    import type { UserInsights } from "./parseInsights";
    export let data: { insights: UserInsights, user: ProfileResponse };
</script>

<div>
    <img src={data.user.threads_profile_picture_url} alt="Profile Picture" style="width: 50px; height: 50px;" />
    <h2>Stats for @{data.user.username}:</h2>
</div>

<table>
    <thead>
        <tr>
            <th>Metric</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        {#each Object.entries(data.insights) as [metric, value]}
            <tr>
                <td>{metric}</td>
                <td>{value}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    td {
        padding-right: 20px; /* Adjust the value as needed */
    }
</style>