import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RHGetSessionList, RHGetPage } from "./history.js";
import { useNavigate } from 'react-router-dom';
import { IconButton } from "./iconbutton.jsx";

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
		new_data += `${item.title}\t${item.url}\n`;
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

export function SessionsFilterAndShow() {
	//Default_session stores the original call from storageArea
	//any filter updates should use that
	const [default_sessions, setDefaultList] = useState([]);
	const [sessions, setSessionsList] = useState([]);

	const [sort_options, setSortedItems] = useState([]);
	const [filter_options, setFilteredItems] = useState([]);

	useEffect(() => {
		RHGetSessionList().then((sessions) => {
			setSessionsList(sessions);
			setDefaultList(default_sessions);
		});
	}, []);

	useEffect(() => {}, [sessions]);

	function ApplySorted(evt) {
		//Get the sorted paramters and use them
		//Date: Old - New || Date: New -  Old
	}

	function ApplyFilters() {
		//Apply the filters
		//then apply the sorted options
		//ApplySorted
	}

	function SortItemInputChanged(evt) {
		const name = evt.target.name;
		const val = evt.target.val;
	}

	function FilterItemInputChanged(evt) {
		const name = evt.target.name;
		const val = evt.target.value;
		setFilteredItems(vals => ({...vals, [name]: val}));
		console.log(`${name} | ${val}`);
	}

	const session_display_arr = [10, 20, 30, 'All'];

	return (
		<>
			<span>
				<label for="num">Sessions per page: </label>
				<select defaultValue="All" name="num">
					{session_display_arr.map((val) => {
						return (<option value={val}>{`${val}`}</option>)
					})}
				</select>
				<label for="sort">Sort by: </label>
				<select defaultValue="Old" name="sort">
					<option value="Old">Date: Old - New</option>
					<option value="New">Date: New - Old</option>
					<option value="Short">Time: Shortest - Longest</option>
					<option value="Long">Time: Longest - Shortest</option>
				</select>
			</span>
			<span>
				<label for="tags">Search Tags: </label>
				<input
					name="tags"
					type="search"
					onChange={FilterItemInputChanged}
				/>
				<label for="date">Date Search: </label>
				<input
					name="date"
					type="date"
					onChange={FilterItemInputChanged}
				/>
				<button>Search</button>
				<button>Clear</button>
			</span>
			 <section className="rabbitHole" id="previous">
			{sessions.map((session, index) => {
				return (
					<Link className={"div-links"} key={index} to={`/session/${session.session_key}`}>
						<div className="rabbitHole">
							{ShowSessionMetadata(session)}
							{ShowSessionTags(session)}
						</div>
					</Link>
				);
			})}
			</section>
		</>
	);
}

export function SectionRibbon(title_h3) {
	//returns the Section Ribbon
	return (
		<div>
			<h3 id="white">{title_h3}</h3>
		</div>
	);
}
