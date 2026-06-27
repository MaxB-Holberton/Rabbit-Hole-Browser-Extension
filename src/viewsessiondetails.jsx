import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RHGetSessionList, RHGetPage } from "./history.js";
import { useNavigate } from 'react-router-dom';
import { IconButton } from "./iconbutton.jsx";

async function DeleteSessionFromPrevious(session_key, setSessionsList) {
	if (!confirm("Are you sure you want to delete this rabbit hole?")) {
		return;
	}

	await chrome.storage.local.remove([session_key]);
	setSessionsList((currentSessions) => currentSessions.filter((session) => session.session_key !== session_key));
}

async function DeleteRecentSession(session_key, setLastSession) {
	if (!confirm("Are you sure you want to delete this rabbit hole?")) {
		return;
	}

	await chrome.storage.local.remove([session_key]);
	setLastSession(null);
}

/*
 * function to download the file as a JSON
 */
async function DownloadJsonFile(session_key) {
	const data = await RHGetPage(session_key);
	const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `${session_key}.json`;
	link.click();
	URL.revokeObjectURL(link.href);
}

async function DownloadTxtFile(session_key) {
	const data = await RHGetPage(session_key);
	let new_data;
	for (item of data.data) {
		new_data += `${item.title} \t ${item.url}\n`;
	}
	const blob = new Blob([new_data], {type: "text/plain"});
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `${session_key}.txt`;
	link.click();
	URL.revokeObjectURL(link.href);
}

/*
 *
 */
function ShowSessionPageList(data) {
	// Shows the pages from the session
	//TODO: create pagination and add it here
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

function ShowSessionTags(data) {
	//shows the session tags
	const tags = Array.isArray(data?.tag_list) ? data.tag_list : [];
	return (
		<div>
			<b>Tags: </b>
			{tags.map((tag, index) => (
				<span key={index}>{tag}, </span>
			))}
		</div>
	);
}

function ShowSessionMetadata(data) {
	//shows the metadata for each session
	return (
		<>
			<p><b>Topic: {data.title}</b></p>
			<p><b>Date: {data.start_time_datetime}</b></p>
			<p><b>Duration: {data.duration_string}</b></p>
		</>
	);
}

function ShowSessionDetailBtns({ session }) {
	const navigate = useNavigate();

	return (
		<>
			<IconButton iconSrc="assets/edit_icon.svg" label="Edit Session" onClick={() => { navigate(`/session/${session.session_key}/edit`); }} />
			<IconButton iconSrc="assets/save_icon.svg" label="JSON" onClick={async () => { DownloadJsonFile(session.session_key); }} />
			<IconButton iconSrc="assets/save_icon.svg" label="TXT" onClick={async () => { DownloadTxtFile(session.session_key); }} />
			<IconButton iconSrc="assets/share_icon.svg" label="Share Session" onClick={() => { }} />
			<button type="button" onClick={() => navigate(`/previous`)}>Back</button>
		</>
	);
}

export function SessionDetailsPage() {
	const params = useParams();
	const navigate = useNavigate();
	const [page_data, setPageData] = useState([]);

	async function DeleteSessionFromDetails(session_key) {
		if (!confirm("Are you sure you want to delete this rabbit hole?")) {
			return;
		}

		await chrome.storage.local.remove([session_key]);
		navigate('/previous');
	}

	useEffect(() => {
		RHGetPage(params.session_id).then((data) => setPageData(data));
	});

	return (
		<>
			<h2 id="white">Session!</h2>
			{SectionRibbon(`${page_data.title}`)}
			<section className="rabbitHole" id="previous">
			<div className="rabbitHole previousSessionCard">
			<IconButton
				className="previousSessionDelete"
				iconSrc="assets/delete_icon.svg"
				label="Delete Session"
				onClick={() => { DeleteSessionFromDetails(page_data.session_key); }}
			/>
			{ShowSessionMetadata(page_data)}
			<br/>
			{ShowSessionTags(page_data)}
			<br/>
			{ShowSessionPageList(page_data)}
			<br/>
			<ShowSessionDetailBtns session={page_data} />
			</div>
			</section>
		</>
	);
}

export function ShowLastSession() {
	const [last_session, setLastSession] = useState([]);

	useEffect(() => {
		RHGetSessionList().then((sessions) => {
			if (sessions.length > 0) {
				setLastSession(sessions[sessions.length - 1]);
			}
		})
	});

	return (
		<div id={last_session.session_key} className="rabbitHole previousSessionCard">
			<IconButton
				className="previousSessionDelete"
				iconSrc="assets/delete_icon.svg"
				label="Delete Session"
				onClick={() => { DeleteRecentSession(last_session.session_key, setLastSession); }}
			/>
			<Link className={"div-links"} to={`/session/${last_session.session_key}`}>
				{ShowSessionMetadata(last_session)}
				{ShowSessionTags(last_session)}
			</Link>
		</div>
	);
}

export function ShowAllSessions() {
	const [sessions, setSessionsList] = useState([]);

	useEffect(() => {
		RHGetSessionList().then((sessions) => setSessionsList(sessions));
	});

	return sessions.map((session, index) => {
		return (
			<Link className={"div-links"} key={index} to={`/session/${session.session_key}`}>
				<div className="rabbitHole">
				{ShowSessionMetadata(session)}
				{ShowSessionTags(session)}
				</div>
			</Link>
		);
	});
}

export function SessionsFilterAndShow() {
	const [sessions, setSessionsList] = useState([]);

	useEffect(() => {
		RHGetSessionList().then((sessions) => setSessionsList(sessions));
	});
	return (
		<>
			<span>
				<h3>Items per page: </h3>
				<select>
					<option>10</option>
					<option>20</option>
					<option>30</option>
				</select>
			</span>
			{sessions.map((session, index) => {
				return (
					<div className="rabbitHole previousSessionCard" key={index}>
						<IconButton
							className="previousSessionDelete"
							iconSrc="assets/delete_icon.svg"
							label="Delete Session"
							onClick={() => { DeleteSessionFromPrevious(session.session_key, setSessionsList); }}
						/>
						<Link className={"div-links"} to={`/session/${session.session_key}`}>
							{ShowSessionMetadata(session)}
							{ShowSessionTags(session)}
						</Link>
					</div>
				);
			})}
		</>
	);

	return sessions.map((session, index) => {
		return (
			<Link className={"div-links"} key={index} to={`/session/${session.session_key}`}>
			<div className="rabbitHole">
			{ShowSessionMetadata(session)}
			{ShowSessionTags(session)}
			</div>
			</Link>
		);
	});
}

export function SectionRibbon(title_h3) {
	//returns the Section Ribbon
	return (
		<div className="sectionRibbon">
			<h3 id="white">{title_h3}</h3>
		</div>
	);
}
