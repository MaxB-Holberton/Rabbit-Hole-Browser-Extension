import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { RHDeletePage, RHEditPage } from "./history.js";
import { IconButton } from "./iconbutton.jsx";

export function EditSessionActions(session) {
	return (
		<>
		<IconButton iconSrc="assets/save_icon.svg" label="Save Session" onClick={() => { /* Save all details and return */ }} />
		<IconButton iconSrc="assets/delete_icon.svg" label="Delete Session" onClick={() => { RHDeleteSession(session.session_key); }} />
		</>

export function EditSessionPageList(data) {
	const pages = Array.isArray(data?.data) ? data.data : [];

	const [input_vals, setInputVal] = useState({})

	useEffect(() => {
		for (let i = 0; i < pages.length; i++)
		{
			let key = `${i}`;
			setInputVal(values => ({...values, [key]: pages[i].title}));
		}
	}, []);

	// handles the input events
	function UpdateVal(evt) {
		const id = evt.target.name;
		const val = evt.target.value;
		setInputVal(vals => ({...vals, [id]: val}));
	}

	return (
		<div>
			<b>Pages: </b><IconButton id="add_page" iconSrc="assets/add_icon.svg" label="Add Page" onClick={() => { }} />
			<ul>
			{pages.map((item, index2) => (
				<li id={index2} key={index2}>
					<input
					id={`${index2}_input`}
					name={`${index2}`}
					onChange={UpdateVal}
					value={input_vals[`${index2}`]}
					readOnly={true}/>

					<IconButton
						id={`${index2}_edit`}
						iconSrc="assets/edit_icon.svg"
						label="Edit"
						showLabel={false}
						ariaLabel="Edit page"
						onClick={ async () => { /*change this to be ObjChange(index2, ) */ RHEditPage(index2, data.session_key) }}
					/>
				 	<IconButton
						id={`${index2}_delete`}
				 		iconSrc="assets/delete_icon.svg"
				 		label="Delete"
				 		showLabel={false}
				 		ariaLabel="Delete page"
				 		onClick={async () => { /*ObjChange(index_2, 'delete') */ RHDeletePage(index2, data.session_key) }}
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
