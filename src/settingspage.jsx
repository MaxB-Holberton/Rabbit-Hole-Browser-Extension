import React from 'react';
import { SectionRibbon } from "./viewsessiondetails";

function SettingsOptionsList() {
	return (
		<>
		<div className="rabbitHole">
			<ul>
				<li>Edit Blacklist</li>
			</ul>
		</div>
		</>
	)
}

export function BlacklistEditPage() {
	/*
	 * TODO: Get blacklist edit array from local storage
	 *
	 */
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
