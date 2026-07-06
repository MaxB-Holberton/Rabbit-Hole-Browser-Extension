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
let pc;
let send_channel;

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

function ChannelOpened(session_key) {
	console.log("Send Channel Opened");
	send_channel.send("Hello World!");
	//we will want a buffer for truely massive files just in case
}

function ChannelClosed() {
	console.log("Channel Closed");
	pc.close();
	pc = null;
}

async function IceCandidate(evt) {
	const candidate = evt.candidate;
	if (!candidate) {
		console.log(JSON.stringify(pc.localDescription));
		//This will need to written to a textbox somewhere to paste
	}
	else {
		console.log(candidate.candidate);
	}
}

export async function CreateLocalChannel(session_key) {
	//Will need the session data to be grabbed when the connection is made
	pc = new RTCPeerConnection(servers);

	const data_channel_params = {ordered: true};//relilability over speed
	send_channel = pc.createDataChannel('sendDataChannel', data_channel_params);
	send_channel.addEventListener('open', async (evt) => ChannelOpened(session_key));
	send_channel.addEventListener('closed', ChannelClosed);
	pc.addEventListener('icecandidate', async (evt) => IceCandidate(evt));

	//Create the offer to pass to the receiver
	try {
		const new_offer = await pc.createOffer();
		pc.setLocalDescription(new_offer);
	} catch (err) {
		console.error('Failed to create Session... ', err);
	}
}

async function ReceivedData(evt) {
	console.log("data received", evt.data);
}

export async function CreateRemoteChannel(offer) {
	pc = new RTCPeerConnection(servers);
	const session_offer = new RTCSessionDescription(JSON.parse(offer));
	pc.addEventListener('icecandidate', async (evt) => IceCandidate(evt));
	pc.addEventListener('close', ChannelClosed);
	pc.addEventListener('ondatachannel', ReceivedData)
	try {
		pc.setRemoteDescription(session_offer);
		const answer_offer = await pc.createAnswer();
		pc.setLocalDescription(answer_offer);
	} catch (err) {
		console.error("Session offer failed...", err);
	}
}

