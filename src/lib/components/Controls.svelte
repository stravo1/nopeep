<script lang="ts">
    import { get } from "svelte/store";
    import { localVideoStream, rejoinScreenVisible } from "../store/store";
    import { endCall, reset } from "../utilities/misc";
    import initializeSocket from "../utilities/initializeSocket";

    let micOff: boolean = false;
    let videoOff: boolean = false;

    const toggleAudio = () => {
        get(localVideoStream)
            ?.getAudioTracks()
            .forEach((track) => {
                if (track.enabled) {
                    micOff = true;
                    track.enabled = false;
                } else {
                    micOff = false;
                    track.enabled = true;
                }
            });
    };
    const toggleVideo = () => {
        get(localVideoStream)
            ?.getVideoTracks()
            .forEach((track) => {
                if (track.enabled) {
                    videoOff = true;
                    track.enabled = false;
                } else {
                    videoOff = false;
                    track.enabled = true;
                }
            });
    };
</script>

<div class="flex h-full w-full items-center justify-center gap-2 text-white">
    <button
        class={`flex h-14 w-14 items-center justify-center rounded-lg ${micOff ? "bg-red-600" : "bg-zinc-600"}`}
        on:click={toggleAudio}
    >
        <span class="material-symbols-rounded">
            {!micOff ? "mic" : "mic_off"}
        </span>
    </button>
    <button
        class={`flex h-14 w-14 items-center justify-center rounded-lg ${videoOff ? "bg-red-600" : "bg-zinc-600"}`}
        on:click={toggleVideo}
    >
        <span class="material-symbols-rounded">
            {!videoOff ? "videocam" : "videocam_off"}
        </span>
    </button>
    <button
        class={`flex h-14 w-14 items-center justify-center rounded-lg bg-red-600`}
        on:click={async () => {
            await endCall(true);
            await reset();
            rejoinScreenVisible.set(true);
        }}
    >
        <span class="material-symbols-rounded"> call_end </span>
    </button>
</div>
