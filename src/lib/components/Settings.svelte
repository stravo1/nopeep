<script lang="ts">
    import { onMount } from "svelte";
    import { rejoinScreenVisible, settingsPageOpen } from "../store/store";
    import { fade } from "svelte/transition";
    import { showToast } from "../utilities/misc";

    let keyVal: string | null = "";
    let roomIdVal: string | null = "";
    let nameVal: string | null = "";
    let urlVal: string | null = "";
    let oldUrl: string | null = "";
    // let visibility;

    onMount(() => {
        keyVal = localStorage.getItem("enckey");
        urlVal = localStorage.getItem("url");
        oldUrl = localStorage.getItem("url");
        nameVal = localStorage.getItem("name");
        roomIdVal = localStorage.getItem("roomId");
        // visibility = localStorage.getItem("visibility");
    });

    const handleNameChange = (e: any) => {
        nameVal = e.target.value;
        localStorage.setItem("name", e.target.value);
    };

    const handleKeyChange = (e: any) => {
        keyVal = e.target.value;
        localStorage.setItem("enckey", e.target.value);
    };

    const handleRoomIdChange = (e: any) => {
        roomIdVal = e.target.value;
        localStorage.setItem("roomId", e.target.value);
    };

    const handleSelectChange = (e: any) => {
        if (e.target.value == "glitch") {
            urlVal = "https://nopeep-server.glitch.me";
            localStorage.setItem("url", "https://nopeep-server.glitch.me");
        } else {
            if (oldUrl != "https://waterdrop-server.glitch.me") {
                urlVal = oldUrl;
                localStorage.setItem("url", oldUrl!);
            } else {
                urlVal = "";
            }
        }
        showToast("Please refresh the page after making any changes!");
    };

    const handleURLChange = (e: any) => {
        urlVal = e.target.value;
        oldUrl = e.target.value;
        localStorage.setItem("url", e.target.value);
    };

    const closeSettings = () => {
        settingsPageOpen.set(false);
        rejoinScreenVisible.set(true);
    };
</script>

<div
    class="z-50 flex h-[100dvh] w-[100dvw] flex-col items-center justify-center bg-white"
>
    <button
        on:click={closeSettings}
        on:keypress={closeSettings}
        class="icon mb-6 flex w-full shrink-0 justify-start pl-3 pt-12 lg:cursor-pointer lg:pr-8 lg:pt-6"
    >
        <span class="material-symbols-rounded text-3xl"> arrow_back </span>
    </button>
    <div class="relative mx-8 flex h-full max-w-[370px] flex-col">
        <h1 class="mb-8 text-3xl font-medium">Settings</h1>
        <hr />
        <div class="settings-item my-6 w-full">
            <label for="name" class="mb-1 block text-lg font-medium"
                >Your name:</label
            >
            <div class="mb-4 text-xs text-gray-500">
                This name is visible to the other person when they join the
                room.
            </div>
            <input
                class="h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm"
                type="text"
                name="name"
                id="name"
                placeholder="enter name here"
                value={nameVal}
                on:change={handleNameChange}
            />
        </div>
        <hr />
        <div class="settings-item my-4 w-full">
            <label for="name" class="mb-2 block text-lg font-medium"
                >Server:</label
            >
            <div class="mb-4 text-xs text-gray-500">
                currently the public server for waterdrop is hosted on
                <a
                    class="underline"
                    href="http://www.glitch.com"
                    target="_blank">glitch</a
                >
                on their free plans with limited monthly quota. please use the public
                servers only when it's necessary. to learn how to setup your own
                local server for waterdrop,
                <a class="underline" href="/">click here</a>.
            </div>
            <select
                class="h-10 w-full rounded-lg bg-zinc-100 px-4 text-sm"
                name="name"
                id="name"
                on:change={handleSelectChange}
            >
                <option
                    value="glitch"
                    selected={urlVal == "https://nopeep-server.glitch.me"}
                    >public server - glitch</option
                >
                <option value="local" selected={true}>local server</option>
            </select>
            <input
                class="mt-2 h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm {urlVal ==
                'https://waterdrop-server.glitch.me'
                    ? 'hidden'
                    : ''}"
                type="text"
                name="name"
                id="name"
                placeholder="enter local server url"
                value={urlVal}
                on:change={handleURLChange}
            />
        </div>
        <hr />
        <div class="settings-item my-4 w-full">
            <label for="name" class="mb-2 block text-lg font-medium"
                >Encryption key:</label
            >
            <div class="mb-4 text-xs text-gray-500">
                This is the shared key used for encryption. It must be at least
                8 characters long.
            </div>
            <input
                class="h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm"
                type="text"
                name="name"
                id="name"
                placeholder="enter key here"
                value={keyVal}
                on:change={handleKeyChange}
            />
        </div>
        <hr />
        <div class="settings-item my-4 w-full">
            <label for="name" class="mb-2 block text-lg font-medium"
                >Room ID:</label
            >
            <div class="mb-4 text-xs text-gray-500">
                Both of you need to have the same ID. It must be at least 8
                characters long.
            </div>
            <input
                class="h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm"
                type="text"
                name="name"
                id="name"
                placeholder="enter room id here"
                value={roomIdVal}
                on:change={handleRoomIdChange}
            />
        </div>
        <hr />
        <div class="mt-8 text-center text-xs text-gray-500">
            settings are auto saved!
        </div>
    </div>
</div>
