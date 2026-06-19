import React from 'react';
import { useEffect, useState } from 'react';
import { RHGetPage } from "./history.js";
import { Link } from 'react-router-dom';
import { SectionRibbon } from "./viewsessiondetails";
import { IconButton } from "./iconbutton.jsx";

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
	const [rabbithole_blacklist, UpdateBlacklist] = useState([
		{
			name: "facebook",
			active: false,
		}
	]);
	const [blacklist_item, NewInputOnChange] = useState([]);

	useEffect(() => {},[rabbithole_blacklist]);
	useEffect(() => {
		RHGetPage("Rabbithole_blacklist_data").then(data => {
			if (data !== undefined) {
				UpdateBlacklist(data)
			}
		})
	}, []);

	/*
	 * TODO: 2 lists (Inactive) | (Active)
	 * Make both lists scrollable
	 * Have btn to add/remove from active
	 */
	function AddBlacklistItem() {
		//check if it contains (https://www.)

		new_data = [...rabbithole_blacklist];

		new_site = {};
		new_site['name'] = blacklist_item;
		new_site['active'] = false;
		new_data.unshift(new_site);
		NewInputOnChange("");
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
							</li>
						)
					))}
				</ul>
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
