import React from 'react';
import { RHDeleteSession } from "./history.js";

export function SectionRibbon(title_h3) {
	//returns the Section Ribbon
	return (
		<div>
			<h3 id="white">{title_h3}</h3>
		</div>
	);
}

export function ShowSessionDetailBtns(session) {
	return (
		<>
			<button onClick={() => { RHEditSession(session.session_key); }}>Edit Session</button>
			<button onClick={() => { RHDeleteSession(session.session_key); }}>Delete Session</button>
		</>
	);
}

export function ShowSessionBtns() {
	//Creates the buttons for interecting with the session
	//These are generic buttons that do not have much detail required
	/*
	 * dev note - maybe make the link a button in here for accessing the details Page
	 */
	return (
		<>
			<button>Share</button>
		</>
	);
}

export function ShowSessionPageList(data) {
	//Shows all the visited pages from the last session
	//Will integrate with the page tags for more details
	//will need the ability to add/remove items
	//will need the ability to add/remove tags both manual and ai
	const pages = Array.isArray(data?.data) ? data.data : [];
	return (
		<div>
			<b>Pages: </b>
			<ul>
			{pages.map((item, index2) => (
				<li key={index2}>
				<a href={item.url}>{item.title}</a>
				</li>
			))}
			</ul>
		</div>
	);
}

export function ShowSessionTags(data) {
	//shows all the tags for each session itself
	const tags = Array.isArray(data?.tag_list) ? data.tag_list : [];
	return (
		<div>
			<b>Tags: </b>
			{tags.map((tag, index) => (
				<span>{tag}, </span>
			))}
		</div>
	);
}

export function ShowSessionMetadata(data) {
	//shows the metadata for each session
	return (
		<>
			<p><b>Topic: {data.title}</b></p>
			<p><b>Date: {data.start_time_datetime}</b></p>
			<p><b>Duration: {data.duration_string}</b></p>
		</>
	);
}
