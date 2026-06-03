import React from 'react';
import { RHDeletePage } from "./history.js";
import { IconButton } from "./iconbutton.jsx";

export function EditSessionPageList(data) {
	//TODO: Edit btn to appear when edit page is
	const pages = Array.isArray(data?.data) ? data.data : [];
	return (
		<div>
			<b>Pages: </b><IconButton id="add_page" iconSrc="assets/add_icon.svg" label="Add Page" onClick={() => { }} />
			<ul>
			{pages.map((item, index2) => (
				<li id={index2} key={index2}>
					<IconButton
						id={`${index2}_edit`}
						iconSrc="assets/edit_icon.svg"
						label="Edit"
						showLabel={false}
						ariaLabel="Edit page"
						onClick={() =>{} }
					/>
				 	<IconButton
				 		iconSrc="assets/delete_icon.svg"
				 		label="Delete"
				 		showLabel={false}
				 		ariaLabel="Delete page"
				 		onClick={async () => { RHDeletePage(index2, data.session_key) }}
				 	/>
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
