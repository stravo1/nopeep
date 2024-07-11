<script lang="ts">
    import { onMount } from "svelte";
    import GetName from "./setupSteps/GetName.svelte";
    import Intro from "./setupSteps/Intro.svelte";
    import GetRoomId from "./setupSteps/GetRoomId.svelte";
    import GetKey from "./setupSteps/GetKey.svelte";
    import initializeSocket from "../utilities/initializeSocket";
    import { getWorkingURL } from "../utilities/misc";
    import { setupVisible } from "../store/store";

    let step = 0;

    let scrollWrapRef: HTMLElement;
    onMount(() => {
        scrollWrapRef = document.getElementById("scrollWrap")!;
    });
    let goNext = async () => {
        if (step == 3) {
            console.log("All steps completed");
            setupVisible.set(false);
            await getWorkingURL();
            initializeSocket();
            return;
        }

        if (scrollWrapRef) {
            console.log(scrollWrapRef.scrollWidth, window.innerWidth);
            scrollWrapRef.scrollBy(window.innerWidth, 0);
            step++;
        }
    };
    let goBack = () => {
        if (scrollWrapRef) {
            scrollWrapRef.scrollBy(-window.innerWidth, 0);
            step--;
        }
    };
</script>

<div
    class="flex h-full w-full items-center overflow-hidden scroll-smooth"
    id="scrollWrap"
>
    <Intro {goNext} />
    <GetName {goNext} {goBack} />
    <GetRoomId {goNext} {goBack} />
    <GetKey {goNext} {goBack} />
</div>
