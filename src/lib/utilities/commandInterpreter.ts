import { get } from "svelte/store";
import {
    noOfToasts,
    otherDeviceInfo,
    otherDevicePeer,
    peerConnection,
    receiverSFrameClient,
    rejoinScreenVisible,
    remoteVideoStream,
    senderSFrameClient,
} from "../store/store";
import { endCall, getKeyPair, reset, showToast } from "./misc";
import { toast } from "@zerodevx/svelte-toast";
import Peer from "peer-lite";

const SENDERID = 0;
const RECEIVERID = 1;

const commandInterpreter = async (data: string, deviceID: string) => {
    var { command, action } = JSON.parse(data);

    switch (command) {
        case "info":
            otherDeviceInfo.set(action);
            let name = action.name;
            var $number = get(noOfToasts);
            if ($number) {
                noOfToasts.update((n) => n + 1);
                setTimeout(() => {
                    toast.pop(0);
                    noOfToasts.update((n) => n - 1);
                    showToast(name + " joined the room!", "success");
                }, 1000);
            } else {
                noOfToasts.update((n) => n + 1);
                showToast(name + " joined the room!", "success");
                setTimeout(() => {
                    noOfToasts.update((n) => n - 1);
                }, 1000);
            }
            const keyPair = await getKeyPair();
            const $otherPeer = get(otherDevicePeer);
            const keyInfo = JSON.stringify({
                command: "publickey",
                action: await window.crypto.subtle.exportKey(
                    "jwk",
                    keyPair.publicKey,
                ),
            });
            console.log(keyInfo);

            $otherPeer?.send(keyInfo);
            await get(senderSFrameClient).setSenderSigningKey(
                keyPair.privateKey,
            );
            break;
        case "publickey":
            console.log("Received publick key: ", action);
            await get(receiverSFrameClient).setReceiverVerifyKey(
                SENDERID,
                await window.crypto.subtle.importKey(
                    "jwk",
                    action,
                    {
                        name: "ECDSA",
                        namedCurve: "P-521",
                    },
                    true,
                    ["verify"],
                ),
            );
            const $peerConnection = get(peerConnection);

            //Encrypt it
            let stream = await Peer.getUserMedia({ video: true, audio: true });
            get(otherDevicePeer)!.addStream(stream);
            for (const transceiver of $peerConnection!.getTransceivers()) {
                get(senderSFrameClient).encrypt(
                    transceiver.mid,
                    transceiver.sender,
                );
                get(receiverSFrameClient).decrypt(
                    transceiver.mid,
                    transceiver.receiver,
                );
            }
            break;

        case "bye":
            showToast("Call Ended! Redirecting soon...", "error");
            await endCall();
            await reset();
            rejoinScreenVisible.set(true);

        default:
            console.log(action);
            break;
    }
};

export default commandInterpreter;
