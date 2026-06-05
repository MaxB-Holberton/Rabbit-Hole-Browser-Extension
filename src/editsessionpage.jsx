import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RHSaveSession, RHDeleteSession, RHGetPage } from "./history.js";
import { IconButton } from "./iconbutton.jsx";
import { SectionRibbon } from "./viewsessiondetails";

/*
 * For session edit + saving
 * Get list of changes and pass to save session
 * function SaveSessionChanges(page_data, page_changes, session_key)
 */

export function SessionEditPage() {
	const params = useParams();//get session_id from url
	const [page_data, setPageData] = useState([]);
	const [pages_vals, setPageVal] = useState({});
	const [tags_vals, setTagsVal] = useState({});

	//Updates the pages title box
	function UpdatePageInput(evt) {
		const name = evt.target.name;
		const val = evt.target.value;
		setPageVal(vals => ({...vals, [name]: val}));
	}

	function UpdateMetadata(evt) {
		const name = evt.target.name;
		const val = evt.target.value;
		setPageData(vals => ({...vals, [name]: val}));
	}

	function DeletePage(index) {
		const new_data = {...page_data};
		new_data.data.splice(index, 1);
		setPageVal(vals => (delete vals[index]));
		setPageData(new_data);
	}

	useEffect(() => {
		//Renders all the information from
		RHGetPage(params.session_id).then((data) => setPageData(data));
	},[]);

	useEffect(() => {}, [page_data]);

	return (
		<>
			<h2 id="white">Session!</h2>
			{SectionRibbon(`${page_data.title}`)}
			<section className="rabbitHole" id="previous">
				<div className="rabbitHole">
					{EditSessionMetadata(page_data, UpdateMetadata)}
					<br/>
					{EditSessionTags(page_data)}
					<br/>
					{EditSessionPageList(page_data, UpdatePageInput, DeletePage)}
					<br/>
					{EditSessionActions(page_data, pages_vals, tags_vals)}
					<br/>
					<button type="button" onClick={() => window.history.back()}>Back</button>
				</div>
			</section>
		</>
	);
}

function EditSessionActions(page_data, pages_vals, tags_vals) {
	return (
		<>
			<IconButton iconSrc="assets/save_icon.svg" label="Save Session" onClick={() => { RHSaveSession(page_data, pages_vals, tags_vals) }} />
			<IconButton iconSrc="assets/delete_icon.svg" label="Delete Session" onClick={() => { RHDeleteSession(page_data.session_key); }} />
		</>
	);
}

function EditSessionPageList(page_data, UpdatePageInput, DeletePage) {
	const pages = Array.isArray(page_data?.data) ? page_data.data : [];
	return (
		<div>
			<b>Pages: </b><IconButton id="add_page" iconSrc="assets/add_icon.svg" label="Add Page" onClick={() => { /* add page and add it to values to add*/ }} />
			<ul>
			{pages.map((item, index2) => (
				<li id={index2} key={index2}>
					<input
						id={`${index2}_input`}
						name={`${index2}`}
						onChange={UpdatePageInput}
						defaultValue={item.title}
						readOnly={false}
					/>
					<IconButton
						id={`${index2}_edit`}
						iconSrc="assets/edit_icon.svg"
						label="Edit"
						showLabel={false}
						ariaLabel="Edit page"
						onClick={() => {}}
					/>
				 	<IconButton
						id={`${index2}_delete`}
				 		iconSrc="assets/delete_icon.svg"
				 		label="Delete"
				 		showLabel={false}
				 		ariaLabel="Delete page"
				 		onClick={() => { DeletePage(index2) }}
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

function EditSessionTags(data) {
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

function EditSessionMetadata(data, UpdateMetadata) {
	//shows the metadata for each session
	return (
		<>
			<p>
				<b>Topic:</b>
				<input
					name={`title`}
					onChange={UpdateMetadata}
					defaultValue={data.title}
				/>
			</p>
			<p><b>Date: {data.start_time_datetime}</b></p>
			<p><b>Duration: {data.duration_string}</b></p>
		</>
	);
}
