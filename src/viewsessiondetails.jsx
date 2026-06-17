import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RHGetSessionList, RHGetPage } from "./history.js";
import { useNavigate } from 'react-router-dom';
import { IconButton } from "./iconbutton.jsx";

export function SessionDetailsPage() {
	const params = useParams();
	const [page_data, setPageData] = useState([]);

	useEffect(() => {
		RHGetPage(params.session_id).then((data) => setPageData(data));
	});

	return (
		<>
			<h2 id="white">Session!</h2>
			{SectionRibbon(`${page_data.title}`)}
			<section className="rabbitHole" id="previous">
			<div className="rabbitHole">
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
		<Link to={`/session/${last_session.session_key}`}>
			<div id={last_session.session_key} className="rabbitHole">
			{ShowSessionMetadata(last_session)}
			{ShowSessionTags(last_session)}
			</div>
		</Link>
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


export function SectionRibbon(title_h3) {
	//returns the Section Ribbon
	return (
		<div>
			<h3 id="white">{title_h3}</h3>
		</div>
	);
}

function ShowSessionDetailBtns({ session }) {
	const navigate = useNavigate();

	return (
		<>
			<IconButton iconSrc="assets/edit_icon.svg" label="Edit Session" onClick={() => { navigate(`/session/${session.session_key}/edit`); }} />
			<IconButton iconSrc="assets/share_icon.svg" label="Share Session" onClick={() => { }} />
			<button type="button" onClick={() => navigate(`/previous`)}>Back</button>
		</>
	);
}


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
