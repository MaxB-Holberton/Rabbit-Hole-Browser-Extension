import React from 'react';
import { useEffect, useState } from 'react';
import { RHGetPage } from "./history.js";
import { Link } from 'react-router-dom';
import { SectionRibbon } from "./viewsessiondetails";

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
	const [current_blacklist, ActiveBlacklist] = useState([]);
	const [unselected_items, InActiveBlacklist] = useState([]);
	const [all_blacklist_items, AllBlacklistItems] = useState([]);

	useEffect(() => {
		RHGetPage("Rabbithole_active_blacklist").then(data => ActiveBlacklist(data));
		RHGetPage("Rabbithole_all_blacklist_items").then(data => AllBlacklistItems(data));
	});

	/*
	 * TODO: 2 lists (Inactive) | (Active)
	 * Make both lists scrollable
	 * Have btn to add/remove from active
	 */

	return (
		<>
			<div className="rabbitHole">
				<p>{current_blacklist}</p>
				<p>{all_blacklist_items}</p>
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
