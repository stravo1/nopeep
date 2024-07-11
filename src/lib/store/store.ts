import type Peer from "peer-lite";
import { Socket } from "socket.io-client";
import { derived, writable } from "svelte/store";

/* TODO: put interfaces in separate files and use them in other places */
type id = string;

interface deviceInfo {
    name: string;
    own: boolean;
}

export const noOfToasts = writable<number>(0);

export const modalMessage = writable<string>("Loading");
export const modalVisible = writable<boolean>(true);

export const rejoinScreenVisible = writable<boolean>(false);

export const setupVisible = writable<boolean>(false);

export const roomFullErrorModalVisible = writable<boolean>(false);

export const settingsPageOpen = writable<boolean>(false);

export const textInput = writable<string>();

export const connected = writable<boolean>(false);
export const workingURL = writable<string>();

export const roomId = writable<string>();
export const key = writable<string>();

export const myID = writable<string>();
export const deviceInfo = writable<deviceInfo>();
export const mySocket = writable<Socket | null>();

export const otherDeviceId = writable<id | null>();
export const otherDeviceInfo = writable<deviceInfo | null>();
export const otherDevicePeer = writable<Peer | null>();

export const localVideoStream = writable<MediaStream | null>();
export const remoteVideoStream = writable<MediaStream | null>();

export const peerConnection = writable<RTCPeerConnection | null>();

export const senderSFrameClient = writable<any | null>();
export const receiverSFrameClient = writable<any | null>();
