<script lang="ts">
    import { roomFullErrorModalVisible } from "../store/store";
    import { onDestroy, onMount } from "svelte";

    let visible: boolean;
    const unsubscribe = roomFullErrorModalVisible.subscribe((val) => {
        visible = val;
    });

    onDestroy(unsubscribe);
</script>

<div
    class="modal fixed top-0 z-50 box-border hidden h-screen w-screen bg-white"
    class:visible
/>
<div
    class="wrapper fixed top-0 z-50 box-border hidden h-screen w-screen items-center justify-center"
    class:visible
>
    <div class="m-4 block w-72 overflow-hidden rounded-xl bg-white p-6 lg:w-96">
        <h5 class="mb-2 text-2xl lg:text-xl font-medium">Oops!</h5>
        <p id="content" class="line-clamp-6 text-sm font-normal text-gray-700">
            Room is full! Try another room ;{")"}
        </p>
    </div>
</div>

<style>
    .visible {
        display: flex !important;
    }
</style>
