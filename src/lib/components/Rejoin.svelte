<script lang="ts">
    import { rejoinScreenVisible } from "../store/store";
    import initializeSocket from "../utilities/initializeSocket";
    import { recheck } from "../utilities/misc";
</script>

<div
    class="z-40 flex h-full w-full flex-col items-center justify-center gap-3 bg-white"
>
    <button
        class="flex items-center justify-center rounded-full bg-sky-800 p-4 text-white"
        on:click={async () => {
            await recheck();
            initializeSocket();
            rejoinScreenVisible.set(false);
        }}
    >
        <span class="material-symbols-rounded"> phone_in_talk </span>
    </button>
</div>
