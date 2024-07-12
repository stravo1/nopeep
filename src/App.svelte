<script lang="ts">
    import Setup from "./lib/components/Setup.svelte";
    import {
        rejoinScreenVisible,
        settingsPageOpen,
        setupVisible,
    } from "./lib/store/store";
    import { recheck } from "./lib/utilities/misc";
    import { onMount } from "svelte";
    import initializeSocket from "./lib/utilities/initializeSocket";
    import LoadingModal from "./lib/components/LoadingModal.svelte";
    import RoomFullErrorModel from "./lib/components/RoomFullErrorModel.svelte";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    import MainScreen from "./lib/components/MainScreen.svelte";
    import Rejoin from "./lib/components/Rejoin.svelte";
    import Settings from "./lib/components/Settings.svelte";

    const openSettings = (ev: Event) => {
        ev.stopPropagation();
        rejoinScreenVisible.set(false);
        settingsPageOpen.set(true);
    };

    onMount(async () => {
        console.log("App mounted");
        await recheck();
    });
</script>

<main class="relative flex h-[100dvh] w-[100dvw] items-center justify-center">
    {#if $setupVisible}
        <Setup />
    {:else if $rejoinScreenVisible}
        <button
            class="fixed right-0 top-0 z-[41] m-8"
            on:click={openSettings}
            on:keypress={openSettings}
        >
            <span class="material-symbols-rounded text-2xl"> tune </span>
        </button>
        <Rejoin />
    {:else if $settingsPageOpen}
        <Settings />
    {:else}
        <MainScreen />
    {/if}
</main>
<SvelteToast />
<LoadingModal />
<RoomFullErrorModel />
