<script lang="ts">
    import PocketBase from "pocketbase";

    import { invoke } from "@tauri-apps/api/core";
    import { listen } from "@tauri-apps/api/event";
    import { goto } from "$app/navigation";
    import { onDestroy } from "svelte";

    let name = $state("");
    let greetMsg = $state("");

    let eventMsg = $state("NOTHING");

    const pb = new PocketBase("http://127.0.0.1:8090");

    async function greet(event: Event) {
        event.preventDefault();
        greetMsg = await invoke("greet", { name });
    }

    async function swear(event: Event) {
        greetMsg = await invoke("swear", { name });
    }

    listen("swear", (event) => {
        eventMsg = event.payload as string;
    });

    onDestroy(() => {
        console.log("Destroyed!");
    });
</script>

<button
    class="btn"
    onclick={() => {
        goto("/help");
    }}>Need help?</button
>

<main class="container">
    <form class="row" onsubmit={greet}>
        <input
            class="input"
            id="greet-input"
            placeholder="Enter a name..."
            bind:value={name}
        />
        <button class="btn btn-primary" type="submit">Greet</button>
        <button class="btn" onclick={swear} type="button">Swear</button>
    </form>

    <p>{greetMsg}</p>

    <p>Event noise DUDE: {eventMsg}</p>
</main>
