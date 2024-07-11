<script lang="ts">
    export let goNext: () => void;
</script>

<div
    class="steps step-1 flex h-full w-full shrink-0 flex-col items-center justify-center gap-1 p-8"
>
    <div class="flex max-w-[480px] flex-col gap-1">
        <h1 class="text-xl font-bold text-zinc-700">Welcome to nopeep</h1>
        <p class="text-base text-zinc-700">
            A few more steps before you're private ;{")"}
        </p>
        <button
            on:click={goNext}
            class="mt-4 flex w-fit items-center justify-center rounded-lg bg-zinc-300 px-4 py-2 text-lg text-black"
            >Next
            <span class="material-symbols-rounded ml-2">arrow_forward</span>
        </button>
    </div>
</div>
