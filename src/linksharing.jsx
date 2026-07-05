import React from 'react';
import { useEffect, useState } from 'react';

/*
 * ==================================
 * JSON AS STRINGIFY IMPLEMENTATION
 * = this just converts the json into a string to paste into another browser
 * = will work for smaller datasets but sending could be a struggle
 * ==================================
 */

/*
 * ==================================
 * WEBRTC IMPLEMENTATION
 * = this attempts to use webrtc to send the file
 * = main point is attempting to linkify the peerconnection data to send to a user
 * = then user uses that data to establish the connection and the data is then transferred
 * = if this doesn't work then look into Peer to Peer Torrenting
 * ==================================
 */
/*
 * Global scope variables
 */
let pc1;
let send_channel;

let pc2;
let recieve_channel;

/*
const servers = [
	{ urls: "stun:stun.l.google.com:19302" },
	{ urls: "stun:stun.l.google.com:5349" },
	{ urls: "stun:stun1.l.google.com:3478" },
	{ urls: "stun:stun1.l.google.com:5349" },
	{ urls: "stun:stun2.l.google.com:19302" },
	{ urls: "stun:stun2.l.google.com:5349" }
];
*/

const servers = null; //null is localhost only

//Function to generate local host connection
//fired by the 'link ' in a session's details
export async function createLocalChannel() {
	pc1 = new RTCPeerConnection(servers);

	const data_channel_params = {ordered: true};//make it ordered for better reliability -- reduces speed
	send_channel = pc1.createDataChannel('sendDataChannel', data_channel_params);
	send_channel.addEventListener('open', onChannelOpened);
	send_channel.addEventListener('closed', onChannelClosed);

	console.log(send_channel);

	pc1.addEventListener('icecandidate', evt => onIceCandidate(pc1, evt));

	try {
		const server_offer = await pc1.createOffer();
		await handleLocalDescription(server_offer);
	} catch (err) {
		console.error('Failed to create Session... ', err);
	}
}

//function to generate a remote connection
export async function createRemoteChannel() {
	pc2 = new RTCPeerConnection(servers);
	pc2.addEventListener('icecandidate', evt => onIceCandidate(pc2, evt));
	pc2.addEventListener('datachannel', onChannelCallback);

}
