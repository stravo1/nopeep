import { io } from "socket.io-client";
import {
    connected,
    otherDevicePeer,
    deviceInfo,
    modalMessage,
    modalVisible,
    myID,
    otherDeviceId,
    roomFullErrorModalVisible,
    workingURL,
    roomId,
    mySocket,
} from "../store/store";
import { get } from "svelte/store";
import { createAnsweringPeer, createOfferingPeer } from "./peerMaker";
import { showToast } from "./misc";

const JOINING_ROOM = "room-members";
const NEW_MEMBER_IN_ROOM = "new-room-member";
const MEMBER_LEAVING_ROOM = "remove-room-member";

const RECEIVE_SIGNALLING_OFFER = "receive-offer";
const RECEIVE_SIGNALLING_ANSWER = "receive-answer";
const RECEIVE_ICE_CANDIDATES = "receive-ice";

const ROOM_FULL_ERROR = "room-full";

const addSignallingData = async (data: RTCSessionDescriptionInit) => {
    const unsub = otherDevicePeer.subscribe((peer) => {
        if (peer) {
            peer.signal(data);
            setTimeout(() => {
                unsubscribe();
            });
        }
    });
    const unsubscribe = unsub;
};

const addICEcandidates = async (candidates: RTCIceCandidate[]) => {
    var peer = get(otherDevicePeer);
    const promises = candidates.map(async (candidate) =>
        peer!.addIceCandidate(candidate),
    );
    await Promise.all(promises);
};

const initializeSocket = (forced: "forced" | null = null) => {
    modalMessage.set("Waiting for partner");
    modalVisible.set(true);

    let deviceName = get(deviceInfo).name;

    let URL = get(workingURL);
    console.log(URL);

    const socket = io(URL, {
        auth: {
            roomId: get(roomId),
            forced: forced == "forced" ? true : false,
        },
    });

    socket.on(JOINING_ROOM, (deviceAlreadyInRoom: string[]) => {
        deviceAlreadyInRoom.forEach((deviceID) => {
            if (deviceID != socket.id) {
                otherDeviceId.set(deviceID);
                createOfferingPeer(deviceID, socket);
                modalMessage.set("Connecting securely");
            }
        });
    });

    socket.on(NEW_MEMBER_IN_ROOM, (deviceID: string) => {
        if (deviceID != socket.id) {
            otherDeviceId.set(deviceID);
            createAnsweringPeer(deviceID, socket);
            modalMessage.set("Connecting securely");
        }
    });

    socket.on(MEMBER_LEAVING_ROOM, (deviceID: string) => {
        otherDeviceId.set(null);
    });

    socket.on(
        RECEIVE_SIGNALLING_OFFER,
        async (from: string, data: RTCSessionDescriptionInit) => {
            if (from != socket.id) addSignallingData(data);
        },
    );

    socket.on(
        RECEIVE_SIGNALLING_ANSWER,
        async (from: string, data: RTCSessionDescriptionInit) => {
            if (from != socket.id) addSignallingData(data);
        },
    );

    socket.on(
        RECEIVE_ICE_CANDIDATES,
        async (from: string, iceCandidates: RTCIceCandidate[]) => {
            addICEcandidates(iceCandidates);
        },
    );

    socket.on("connect", () => {
        connected.set(true);
        myID.set(socket.id!);
        console.log("Connected to server: " + socket.id);
    });

    socket.on("disconnect", () => {
        showToast("Disconnected from server", "error");
    });

    socket.on("reconnect", () => {
        showToast("Reconnecting to server", "warning");
    });

    socket.on("connect_error", (err) => {
        if (err.message == ROOM_FULL_ERROR) {
            roomFullErrorModalVisible.set(true);
        }
    });
    mySocket.set(socket);

    return socket;
};

export default initializeSocket;
