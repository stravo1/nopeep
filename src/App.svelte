<script lang="ts">
    import Setup from "./lib/components/Setup.svelte";
    import {
        modalVisible,
        rejoinScreenVisible,
        setupVisible,
    } from "./lib/store/store";
    import { checkForAllInfo, getWorkingURL } from "./lib/utilities/misc";
    import { onMount } from "svelte";
    import initializeSocket from "./lib/utilities/initializeSocket";
    import LoadingModal from "./lib/components/LoadingModal.svelte";
    import RoomFullErrorModel from "./lib/components/RoomFullErrorModel.svelte";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    import Controls from "./lib/components/Controls.svelte";
    import MainScreen from "./lib/components/MainScreen.svelte";
    import Rejoin from "./lib/components/Rejoin.svelte";

    onMount(async () => {
        console.log("App mounted");
        let allInfoAvailable = checkForAllInfo();
        modalVisible.set(false);
        if (!allInfoAvailable) {
            setupVisible.set(true);
            return;
        } else {
            setupVisible.set(false);
        }
        await getWorkingURL();
        initializeSocket();
    });
</script>

<main class="flex h-screen w-screen items-center justify-center">
    {#if $setupVisible}
        <Setup />
    {:else if $rejoinScreenVisible}
        <Rejoin />
    {:else}
        <MainScreen />
    {/if}
</main>
<Controls />
<SvelteToast />
<LoadingModal />
<RoomFullErrorModel />
