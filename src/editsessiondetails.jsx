import React from 'react';
import { useEffect, useState } from 'react';
import { RHDeletePage, RHEditPage } from "./history.js";
import { ShowSessionTags } from "./viewsessiondetails";
import { IconButton } from "./iconbutton.jsx";

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
			<b>Pages: </b><IconButton id="add_page" iconSrc="assets/add_icon.svg" label="Add Page" onClick={() => { }} />
			<ul>
			{pages.map((item, index2) => (
				<li id={index2} key={index2}>
 					<a id={`${index2}_a`} href={item.url}>Link</a>
 					{CreateTitleInput(index2, item.title)}
					<button id={`${index2}_edit`} onClick={() => { RHEditPage(index2, data.session_key); }}>Edit</button>
					<button id={`${index2}_delete`} onClick={async () => { RHDeletePage(index2, data.session_key) }}>Delete</button>
					<IconButton
						id={`${index2}_edit`}
						iconSrc="assets/edit_icon.svg"
						label="Edit"
						showLabel={false}
						ariaLabel="Edit page"
						onClick={() => { RHEditPage(index2, data.session_key, item.url) }}
					/>
				 	<IconButton
						id={`${index2}_delete`}
				 		iconSrc="assets/delete_icon.svg"
				 		label="Delete"
				 		showLabel={false}
				 		ariaLabel="Delete page"
				 		onClick={async () => { RHDeletePage(index2, data.session_key) }}
				 	/>
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
			<IconButton id="add_tags" iconSrc="assets/tag_icon.svg" label="Add Tags" onClick={() => { }} />
			{tags.map((tag, index) => (
				<span key={index}>{tag}, </span>
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
