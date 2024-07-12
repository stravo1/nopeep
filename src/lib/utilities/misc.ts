import { toast } from "@zerodevx/svelte-toast";
import {
    decryptionSuccess,
    deviceInfo,
    key,
    localVideoStream,
    modalMessage,
    modalVisible,
    mySocket,
    otherDeviceId,
    otherDeviceInfo,
    otherDevicePeer,
    peerConnection,
    receiverSFrameClient,
    remoteVideoStream,
    roomId,
    senderSFrameClient,
    setupVisible,
    workingURL,
} from "../store/store";
import { get } from "svelte/store";
import Notification from "../components/Notification.svelte";

import { SFrame } from "sframe";

const SENDING_CHANNEL = "send";
const SENDERID = 0;
const RECEIVERID = 1;

async function fetchWithTimeout(resource: string) {
    const timeout = 10000;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        signal: controller.signal,
    });
    clearTimeout(id);
    return response;
}

const getKeyPair = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-521",
        },
        true,
        ["sign", "verify"],
    );
    return keyPair;
};

async function getRoomKey(roomId: string, secret: string) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"],
    );
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode(roomId),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-CTR", length: 256 },
        true,
        ["encrypt", "decrypt"],
    );
}

const setUpSFrame = async () => {
    console.log("Setting up SFrame");
    let authCount = 0;
    const sharedKey = await getRoomKey(get(roomId), get(key));
    try {
        const senderClient = await SFrame.createClient(SENDERID, {
            skipVp8PayloadHeader: true,
        });
        const receiverClient = await SFrame.createClient(RECEIVERID, {
            skipVp8PayloadHeader: true,
        });

        await senderClient.setSenderEncryptionKey(sharedKey);
        await receiverClient.addReceiver(SENDERID);
        await receiverClient.setReceiverEncryptionKey(SENDERID, sharedKey);
        receiverClient.addEventListener("authenticated", (event: any) => {
            console.log(
                "Authenticated receiver " +
                    event.id +
                    " for sender " +
                    event.senderId,
            );
            authCount++;
            if (authCount === 2) decryptionSuccess.set(true);
        });
        receiverClient.addEventListener("decryptFailed", () => {
            console.log("decrypt failed");
            showToast("Decryption failed", "error");
            get(otherDevicePeer)?.send(
                JSON.stringify({ command: "failed", action: "decryptFailed}" }),
            );
        });
        receiverClient.addEventListener("decryptionRestored", () => {
            console.log("decrypt restored");
        });
        senderSFrameClient.set(senderClient);
        receiverSFrameClient.set(receiverClient);
    } catch (err) {
        console.log(err);
    }
};

/* --- app initializer functions ---*/
const getWorkingURL = async () => {
    modalMessage.set("Connecting to server");
    modalVisible.set(true);
    let URL: string | null = "";
    if (
        window.location.pathname.includes("localhost") ||
        window.location.port === "5173"
    )
        URL = localStorage.getItem("url")
            ? localStorage.getItem("url")
            : "http://localhost:8080";

    // console.log(URL);

    if (!URL) {
        // no URL was saved
        localStorage.setItem("url", "https://nopeep-server.glitch.me");
        URL = "https://nopeep-server.glitch.me";
        workingURL.set(URL);
    }

    try {
        // test if local server is functional
        await fetchWithTimeout(URL);
        workingURL.set(URL);
    } catch (error) {
        showToast("Local server unavailable!", "warning");
        modalMessage.set("Trying public servers");
        try {
            // probe glitch server
            await fetch("https://waterdrop-server.glitch.me");
            workingURL.set("https://waterdrop-server.glitch.me");
        } catch (error) {
            // last option
            workingURL.set("https://waterdrop-sqxs.onrender.com");
        }
    }
    modalVisible.set(false);
};

const checkForAllInfo = () => {
    let roomIdFromStorage = localStorage.getItem("roomId");
    let encKeyFromStorage = localStorage.getItem("enckey");
    let nameFromStorage = localStorage.getItem("name");
    if (!nameFromStorage || !encKeyFromStorage || !roomIdFromStorage) {
        console.log("Missing info");
        return false;
    } else {
        deviceInfo.set({ name: nameFromStorage, own: true });
        key.set(encKeyFromStorage);
        roomId.set(roomIdFromStorage);
        return true;
    }
};

/* --- functions used by components --- */
const showToast = (message: string, type: string = "misc") => {
    toast.push({
        component: {
            src: Notification,
            props: { message: message, type: type },
        },
        dismissable: false,
        duration: 1000,
        initial: 1,
        intro: { y: -100 },
    });
};

const endCall = (sender: boolean = false) => {
    // showToast("Call ended", "misc");
    let outResolver: (val?: any) => void;
    let promise = new Promise((res, rej) => {
        outResolver = res;
    });
    get(mySocket)?.disconnect();
    decryptionSuccess.set(false);
    if (sender)
        get(otherDevicePeer)?.send(
            JSON.stringify({ command: "bye", action: "" }),
        );
    setTimeout(
        () => {
            if (sender) get(otherDevicePeer)?.destroy();
            otherDeviceId.set(null);
            otherDevicePeer.set(null);
            otherDeviceInfo.set(null);
            peerConnection.set(null);
            localVideoStream.set(null);
            remoteVideoStream.set(null);
            senderSFrameClient.set(null);
            receiverSFrameClient.set(null);
            mySocket.set(null);
            outResolver();
        },
        sender ? 500 : 0,
    );
    return promise;
};

const recheck = async () => {
    let allInfoAvailable = checkForAllInfo();
    modalVisible.set(false);
    if (!allInfoAvailable) {
        setupVisible.set(true);
        return;
    } else {
        setupVisible.set(false);
    }
    await getWorkingURL();
};

const secondsToHrsMinsSecs = (sec: number) => {
    const hours = Math.floor(sec / 3600)
        .toString()
        .padStart(2, "0");
    const minutes = Math.floor((sec % 3600) / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
};

export {
    showToast,
    getWorkingURL,
    checkForAllInfo,
    getRoomKey,
    setUpSFrame,
    getKeyPair,
    endCall,
    recheck,
    secondsToHrsMinsSecs,
};
