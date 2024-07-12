<script lang="ts">
    import { onMount } from "svelte";
    import { deviceInfo } from "../../store/store";

    export let goNext: () => void;
    export let goBack: () => void;

    let value: string;
    onMount(() => {
        value = localStorage.getItem("name") || "";
    });
</script>

<div
    class="steps step-2 mb-8 flex h-full w-full shrink-0 flex-col items-center justify-center gap-1 p-8"
>
    <div class="flex max-w-[480px] flex-col gap-1">
        <button
            on:click={goBack}
            class="mt-4 flex w-fit items-center justify-center rounded-lg rounded-r-none py-4 text-lg text-black"
        >
            <span class="material-symbols-rounded opacity-20">arrow_back</span>
        </button>
        <h1 class="text-xl font-bold text-zinc-700">What is your nickname?</h1>
        <p class="text-base text-zinc-700">
            This is the name with which you will join a room
        </p>
        <input
            type="text"
            class="mt-4 w-full rounded-lg border border-zinc-300 p-2"
            placeholder="Your name"
            bind:value
        />
        <button
            on:click={() => {
                if (!value) {
                    alert("Heh? No name? You must have one!");
                    return;
                }
                deviceInfo.set({ name: value, own: true });
                localStorage.setItem("name", value);
                goNext();
            }}
            class="mt-4 flex w-fit items-center justify-center rounded-lg bg-zinc-300 px-4 py-2 text-lg text-black"
            >Next
            <span class="material-symbols-rounded ml-2">arrow_forward</span>
        </button>
    </div>
</div>
