<script lang="ts">
    import { goto } from "$app/navigation";

    import { invoke } from "@tauri-apps/api/core";

    let pbPass = $state("");

    async function getPBCreds(event: Event) {
        event.preventDefault();
        pbPass = await invoke("get_pb_creds");
    }
</script>

help me!
<button
    class="btn"
    onclick={() => {
        goto("/");
    }}>go back</button
>
<button class="btn btn-primary" onclick={getPBCreds}>get pb creds</button>

<div>
    pocketbase password is {pbPass}
</div>
