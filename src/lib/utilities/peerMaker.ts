import Peer from "peer-lite";
import type { Socket } from "socket.io-client";
import { get } from "svelte/store";
import {
    deviceInfo,
    otherDeviceInfo,
    otherDeviceId,
    otherDevicePeer,
    localVideoStream,
    remoteVideoStream,
    peerConnection,
    rejoinScreenVisible,
    senderSFrameClient,
    receiverSFrameClient,
} from "../store/store";
import commandInterpreter from "./commandInterpreter";
import { endCall, setUpSFrame, showToast } from "./misc";

const SEND_SIGNALLING_OFFER = "transfer-offer";
const SEND_SIGNALLING_ANSWER = "transfer-answer";
const SEND_ICE_CANDIDATES = "transfer-ice";
const SENDING_CHANNEL = "send";
const iceServers = [
    {
        urls: "stun:stun.relay.metered.ca:80",
    },
    {
        urls: "turn:global.relay.metered.ca:80",
        username: "47e829c26e817f10c2137367",
        credential: "rlQd1xFWj7o30Jhm",
    },
    {
        urls: "turn:global.relay.metered.ca:80?transport=tcp",
        username: "47e829c26e817f10c2137367",
        credential: "rlQd1xFWj7o30Jhm",
    },
    {
        urls: "turn:global.relay.metered.ca:443",
        username: "47e829c26e817f10c2137367",
        credential: "rlQd1xFWj7o30Jhm",
    },
    {
        urls: "turns:global.relay.metered.ca:443?transport=tcp",
        username: "47e829c26e817f10c2137367",
        credential: "rlQd1xFWj7o30Jhm",
    },
];

const sendOffer = (
    socket: Socket,
    from: string,
    to: string,
    data: RTCSessionDescriptionInit,
) => {
    socket.emit(SEND_SIGNALLING_OFFER, from, to, data);
};

const sendAnswer = (
    socket: Socket,
    from: string,
    to: string,
    data: RTCSessionDescriptionInit,
) => {
    socket.emit(SEND_SIGNALLING_ANSWER, from, to, data);
};

const sendICEcandidates = (
    socket: Socket,
    from: string,
    to: string,
    candidates: RTCIceCandidate[],
) => {
    socket.emit(SEND_ICE_CANDIDATES, from, to, candidates);
};

const removeDeviceFromConnectedList = (deviceID: string) => {
    var $info = get(otherDeviceInfo);
    try {
        showToast("Disconnected from " + $info!.name, "error");
        otherDeviceId.set(null);
        otherDevicePeer.set(null);
        otherDeviceInfo.set(null);
    } catch (err) {
        console.log("Error: ", err);
    }
};

const handleData = (
    peer: Peer,
    deviceID: string,
    source: "outgoing" | "incoming",
    data: string | ArrayBufferView | ArrayBuffer | Blob,
) => {
    if (source === "outgoing") {
        return;
    } else {
        commandInterpreter(data.toString(), deviceID);
    }
    console.log(data, deviceID);
};

const createOfferingPeer = async (deviceID: string, socket: Socket) => {
    const peer = new Peer({
        enableDataChannels: true,
        channelLabel: SENDING_CHANNEL,
        config: {
            iceServers,
        },
    });
    otherDevicePeer.set(peer);

    peer.on("signal", (data) => {
        if (data.type !== "offer") return;
        console.log("offer", data);

        sendOffer(socket, socket.id!, deviceID, data);
    });

    peer.on("onicecandidates", (data) => {
        sendICEcandidates(socket, socket.id!, deviceID, data);
    });

    peer.on("connected", () => {
        otherDeviceId.set(deviceID);
    });

    peer.on("channelOpen", async ({ channel }) => {
        if (channel.label == SENDING_CHANNEL) {
            peer.send(
                JSON.stringify({ command: "info", action: get(deviceInfo) }),
                SENDING_CHANNEL,
            );
        }
    });

    peer.on("channelClosed", async ({ channel }) => {
        await endCall();
        rejoinScreenVisible.set(true);
    });

    peer.on("channelData", ({ channel, source, data }) => {
        handleData(peer, deviceID, source, data);
    });

    peer.on("streamLocal", (stream) => {
        localVideoStream.set(stream);
    });

    peer.on("streamRemote", (stream) => {
        remoteVideoStream.set(stream);
    });

    // peer.on("disconnected", async () => {
    //     await endCall();
    //     reset();
    // });

    await setUpSFrame();

    peerConnection.set(peer.init());
    peer.start();
};

const createAnsweringPeer = async (deviceID: string, socket: Socket) => {
    const peer = new Peer({
        enableDataChannels: true,
        config: {
            iceServers,
        },
    });
    otherDevicePeer.set(peer);

    peer.on("signal", (data) => {
        if (data.type !== "answer") return;
        console.log("answer", data);
        sendAnswer(socket, socket.id!, deviceID, data);
    });

    peer.on("onicecandidates", (data) => {
        sendICEcandidates(socket, socket.id!, deviceID, data);
    });

    peer.on("connected", () => {
        otherDeviceId.set(deviceID);
    });

    peer.on("channelOpen", async ({ channel }) => {
        if (channel.label == SENDING_CHANNEL) {
            peer.send(
                JSON.stringify({ command: "info", action: get(deviceInfo) }),
                SENDING_CHANNEL,
            );
        }
    });

    peer.on("channelClosed", async ({ channel }) => {
        await endCall();
        rejoinScreenVisible.set(true);
    });

    peer.on("channelData", ({ channel, source, data }) => {
        handleData(peer, deviceID, source, data);
    });

    peer.on("streamLocal", (stream) => {
        localVideoStream.set(stream);
    });

    peer.on("streamRemote", (stream) => {
        remoteVideoStream.set(stream);
    });

    // peer.on("disconnected", async () => {
    //     await endCall();
    //     await reset();
    //     rejoinScreenVisible.set(true);
    // });

    await setUpSFrame();

    peerConnection.set(peer.init());
    // peer.start();
};

export { createOfferingPeer, createAnsweringPeer };
