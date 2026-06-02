import React from 'react';
import { RHDeletePage } from "./history.js";

/*
 * For the Page Details - these functions contain the buttons to edit the information
 */

export function EditSessionPageList(data) {
	//TODO: Edit btn to appear when edit page is
	const pages = Array.isArray(data?.data) ? data.data : [];
	return (
		<div>
			<b>Pages: </b><button id="add_page">Add Page</button>
			<ul>
			{pages.map((item, index2) => (
				<li id={index2} key={index2}>
					<button id={`${index2}_edit`} onClick={() =>{} }>Edit</button>
 					<button onClick={async () => { RHDeletePage(index2, data.session_key) }}>Delete</button>
					<a id={`${index2}_a`} href={item.url}><span id={`${index2}_span`}>{item.title}</span></a>
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
