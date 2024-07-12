<script lang="ts">
    import { onMount } from "svelte";
    import {
        decryptionSuccess,
        localVideoStream,
        modalVisible,
        otherDevicePeer,
        peerConnection,
        remoteVideoStream,
    } from "../store/store";
    import { secondsToHrsMinsSecs, showToast } from "../utilities/misc";
    import Controls from "./Controls.svelte";
    import { get } from "svelte/store";

    let counter = 0;

    localVideoStream.subscribe((stream) => {
        let localVideoPlayer = document.getElementById(
            "localVideoPlayer",
        ) as HTMLVideoElement;
        if (localVideoPlayer) {
            localVideoPlayer.srcObject = stream;
            setTimeout(() => {
                if (!get(decryptionSuccess)) {
                    get(otherDevicePeer)?.send(
                        JSON.stringify({
                            command: "failed",
                            action: "could not set encoded stream",
                        }),
                    );
                }
            }, 5000);
        }
    });

    remoteVideoStream.subscribe((stream) => {
        let remoteVideoPlayer = document.getElementById(
            "remoteVideoPlayer",
        ) as HTMLVideoElement;
        if (remoteVideoPlayer && stream) {
            remoteVideoPlayer.srcObject = stream;
        }
    });

    decryptionSuccess.subscribe((success) => {
        let remoteVideoPlayer = document.getElementById(
            "remoteVideoPlayer",
        ) as HTMLVideoElement;
        let localVideoPlayer = document.getElementById(
            "localVideoPlayer",
        ) as HTMLVideoElement;
        if (success) {
            if (remoteVideoPlayer.paused) {
                showToast("Connected successfuly!", "success");
                remoteVideoPlayer.play();
                localVideoPlayer.play();
                modalVisible.set(false);
            }
        }
    });

    onMount(() => {
        setInterval(() => {
            if (get(peerConnection)) counter++;
            else {
                counter = 0;
            }
        }, 1000);
    });
</script>

<div class="flex h-full w-full flex-col bg-zinc-800 px-4">
    <div
        class="top box-border flex h-16 w-full shrink-0 items-center justify-start bg-zinc-800 p-4 text-white"
    >
        {secondsToHrsMinsSecs(counter)}
    </div>
    <div
        class="relative h-full w-full shrink overflow-hidden rounded-lg bg-white"
    >
        <video
            class="h-full w-full rounded-lg object-cover"
            id="remoteVideoPlayer"
        >
            <track kind="captions" />
        </video>
        <video
            muted
            class="absolute bottom-0 right-0 h-40 w-40 shrink-0 shadow-lg"
            id="localVideoPlayer"
        >
            <track kind="captions" />
        </video>
    </div>

    <div class="top h-24 w-full bg-zinc-800">
        <Controls />
    </div>
</div>
