import React from 'react';
import { useEffect, useState } from 'react';
import { GetBlacklist, SetBlacklist } from "./history.js";
import { Link } from 'react-router-dom';
import { SectionRibbon } from "./viewsessiondetails";
import { IconButton } from "./iconbutton.jsx";

async function SaveBlacklist(rabbithole_blacklist) {
	SetBlacklist(rabbithole_blacklist)
	alert('Blacklist Saved');
	window.location.href = `/index.html#/settings`;
}

function SettingsOptionsList() {
	return (
		<>
			<div className="rabbitHole">
				<ul>
					<li><Link to="/settings/blacklist">Edit Blacklist</Link></li>
				</ul>
			</div>
		</>
	)
}

export function BlacklistEditPage() {
	const [rabbithole_blacklist, UpdateBlacklist] = useState(
		[
			{ name: "facebook", active: false },
			{ name: "twitter", active: false }
		]

	);
	const [blacklist_item, NewInputOnChange] = useState("");
	useEffect(() => {}, [rabbithole_blacklist]);
	useEffect(() => {
		GetBlacklist().then(data => {
			if (data !== undefined) {
				UpdateBlacklist(data)
			}
		})
	}, []);

	function AddBlacklistItem() {
		new_data = [...rabbithole_blacklist];
		new_site = {};
		if (blacklist_item === "")
		{
			return;
		}
		new_site['name'] = blacklist_item;
		new_site['active'] = false;
		new_data.unshift(new_site);
		NewInputOnChange("");
		UpdateBlacklist(new_data);
	}

	function MakeItemActive(evt) {
		const i = evt.target.name;
		const new_data = rabbithole_blacklist.map((item, idx) => {
			if (idx == i) {
				return {...item, active: true};
			}
			else {
				return item;
			}
		});
		UpdateBlacklist(new_data);
	}

	function MakeItemInActive(evt) {
		const i = evt.target.name;
		const new_data = rabbithole_blacklist.map((item, idx) => {
			if (idx == i) {
				return {...item, active: false};
			}
			else {
				return item;
			}
		});
		UpdateBlacklist(new_data);
	}

	function DeleteItem(evt) {
		const new_data = [...rabbithole_blacklist];
		const i = evt.target.name;

		new_data.splice(parseInt(i), 1);
		UpdateBlacklist(new_data);
	}

	return (
		<>
			<div className="rabbitHole">
				<IconButton id="add_blacklist_item" iconSrc="assets/add_icon.svg" label="Add Blacklist Item" onClick={AddBlacklistItem} />
				<input
					name={`pages`}
					onChange={evt => NewInputOnChange(evt.target.value)}
					value={blacklist_item}
					placeholder={`facebook`}
					required={true}
				/>
				<ul>
					{rabbithole_blacklist.map((item, idx) => (
						!item.active && (
							<li key={idx}>
								<p>{item.name}</p>
								<p>{item.active + ""}</p>
								<button name={`${idx}`} onClick={DeleteItem}>{`X`}</button>
								<button name={`${idx}`} onClick={MakeItemActive}>{`>`}</button>
							</li>
						)
					))}
				</ul>

				<ul>
				{rabbithole_blacklist.map((item, idx) => (
					item.active && (
						<li key={idx}>
							<p>{item.name}</p>
							<p>{item.active + ""}</p>
							<button name={`${idx}`} onClick={MakeItemInActive}>{`<`}</button>
						</li>
					)
				))}
				</ul>
				<IconButton iconSrc="assets/save_icon.svg" onClick={() => { SaveBlacklist(rabbithole_blacklist) }} label="Save Blacklist"/>
			</div>
		</>
	);
}

export function SettingsPage() {
	return (
		<>
		<h2 id="white">My Rabbit Holes</h2>

		<div id="previousHeaderRow">
		{SectionRibbon('Settings')}
		</div>
		<section className="rabbitHole" id="settings">
		{SettingsOptionsList()}
		</section>
		<div id="previousPageContent">
		<section id="previousBannerSection">
		<img src="assets/previous_banner_white.svg" alt="Rabbit Hole Explorer Previous Banner" id="previousBanner" />
		</section>
		</div>
		</>
	);
}
