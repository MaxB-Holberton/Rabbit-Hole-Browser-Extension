import React from 'react';
import { useEffect, useState } from 'react';
import { RHDeletePage, RHEditPage } from "./history.js";
import { ShowSessionTags } from "./viewsessiondetails";



function CreateTitleInput(index2, title) {
	val = title;
	return (
		<input
		id={`${index2}_span`}
		onChange={evt => setInputVal(evt.target.value)}
		value={val}
		readOnly={true}/>
	);
}

export function EditSessionPageList(data) {
	const pages = Array.isArray(data?.data) ? data.data : [];
	const [val, setInputVal] = useState();

	return (
		<div>
			<b>Pages: </b>
			<br/>
			<button id="add_page">Add Page</button>
			<button id="toggle_tags" onClick={() => {/* This will toggle displaying the tags */}}>Toggle Tags</button>
			<ul>
			{pages.map((item, index2) => (
				<li id={index2} key={index2}>
 					<a id={`${index2}_a`} href={item.url}>Link</a>
 					{CreateTitleInput(index2, item.title)}
					<button id={`${index2}_edit`} onClick={() => { RHEditPage(index2, data.session_key); }}>Edit</button>
					<button id={`${index2}_delete`} onClick={async () => { RHDeletePage(index2, data.session_key) }}>Delete</button>
					<br/>
					<div id={`${index2}_tagdiv`}>
						<p>Category: <span>{item.category}</span></p>
						<p>structTag: <span>{item.structuralTags}</span></p>
						<p>ManualTags: <span>{item.manualTags}</span></p>
					</div>
				</li>
			))}
			</ul>
		</div>
	);
}

export function EditSessionTags(data) {
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

export function EditSessionMetadata(data) {
	//shows the metadata for each session
	return (
		<>
			<p><b>Topic: {data.title}</b></p>
			<p><b>Date: {data.start_time_datetime}</b></p>
			<p><b>Duration: {data.duration_string}</b></p>
		</>
	);
}
