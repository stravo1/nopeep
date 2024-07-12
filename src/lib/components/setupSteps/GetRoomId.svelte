<script lang="ts">
    import { onMount } from "svelte";
    import { roomId } from "../../store/store";

    export let goNext: () => void;
    export let goBack: () => void;

    let value: string;
    onMount(() => {
        value = localStorage.getItem("roomId") || "";
    });
</script>

<div
    class="steps step-3 mb-8 flex h-full w-full shrink-0 flex-col items-center justify-center gap-1 p-8"
>
    <div class="flex max-h-[480px] flex-col gap-1">
        <button
            on:click={goBack}
            class="mt-4 flex w-fit items-center justify-center rounded-lg rounded-r-none py-4 text-lg text-black"
        >
            <span class="material-symbols-rounded opacity-20">arrow_back</span>
        </button>
        <h1 class="text-xl font-bold text-zinc-700">Enter your room ID</h1>
        <p class="text-base text-zinc-700">
            Both of you need to have the same ID
        </p>
        <input
            type="text"
            class="mt-4 w-full rounded-lg border border-zinc-300 p-2"
            placeholder="Room Id"
            bind:value
        />
        <button
            on:click={() => {
                if (value.length < 8) {
                    alert("Room ID has to be more than 8 characters long!");
                    return;
                }
                roomId.set(value);
                localStorage.setItem("roomId", value);
                goNext();
            }}
            class="mt-4 flex w-fit items-center justify-center rounded-lg bg-zinc-300 px-4 py-2 text-lg text-black"
        >
            Next
            <span class="material-symbols-rounded ml-2">arrow_forward</span>
        </button>
    </div>
</div>
