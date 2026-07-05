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
			<div className="sessionMetadata" id="settingsMetadataCard">
				<p className="editP"><b>Settings:</b></p>
				<img src="./assets/settings_icon.svg" className="pageIcon" id="settingIcon"></img>
				<ul>
					<li id="settingsOptionBlacklistLink"><Link to="/settings/blacklist">Edit Blacklist</Link></li>
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

	function DeleteItem(index) {
		const new_data = [...rabbithole_blacklist];
		new_data.splice(index, 1);
		UpdateBlacklist(new_data);
	}

	return (
		<>
			<div className="sessionEditHeader" id="blacklistPageHeader">
				<h2 className="sessionEditHeading" id="blacklistPageHeading">My Rabbit Holes</h2>
				{SectionRibbon('Edit Blacklist')}
			</div>
			<section className="rabbitHole sessionEditSection" id="blacklistPageSection">
				<div className="sessionEditLayout" id="blacklistLayout">
					<div className="rabbitHole sessionEditCard" id="blacklistEditorCard">
						<p id="blacklistDescrip">Add the name of any website that you want hidden from your rabbit hole. No need for the full url!</p>
						<input
							id="blacklistInput"
							name={`pages`}
							onChange={evt => NewInputOnChange(evt.target.value)}
							value={blacklist_item}
							placeholder={`Example: facebook`}
							required={true}
						/>
						<IconButton id="add_blacklist_item" iconSrc="assets/add_icon.svg" label="Add Blacklist Item" onClick={AddBlacklistItem} />
						<ul id="blacklistItemsList">
							{rabbithole_blacklist.map((item, idx) => (
								<li className="blacklistItemRow" key={idx}>
									<p className="blacklistItemName">{item.name}</p>
									<label className="blacklistToggleSwitch" aria-label={`Toggle ${item.name}`}>
										<input
											type="checkbox"
											name={`${idx}`}
											checked={item.active}
											onChange={(evt) => {
												if (evt.target.checked) {
													MakeItemActive(evt);
												} else {
													MakeItemInActive(evt);
												}
											}}
										/>
										<span className="blacklistToggleSlider" />
									</label>
									<IconButton
										className="blacklistDeleteButton"
										iconSrc="assets/delete_icon.svg"
										label="Delete blacklist item"
										showLabel={false}
										ariaLabel={`Delete ${item.name}`}
										onClick={() => { DeleteItem(idx); }}
									/>
								</li>
							))}
						</ul>
						<IconButton iconSrc="assets/save_icon.svg" onClick={() => { SaveBlacklist(rabbithole_blacklist) }} label="Save Blacklist"/>
						<IconButton className="sessionEditBackButton" iconSrc="assets/back_icon.svg" label="Back" onClick={() => { window.location.href = `/index.html#/settings`; }} />
					</div>
				</div>
			</section>
			<div id="previousPageContent">
				<section id="previousBannerSection">
					<img src="assets/previous_banner_white.svg" alt="Rabbit Hole Explorer Previous Banner" id="previousBanner" />
				</section>
			</div>
		</>
	);
}

export function SettingsPage() {
	return (
		<>
		<div className="sessionEditHeader" id="settingsPageHeader">
		<h2 className="sessionEditHeading" id="settingsPageHeading">My Rabbit Holes</h2>
		{SectionRibbon('Settings')}
		</div>
		<section className="rabbitHole sessionEditSection" id="settings">
			<div className="sessionEditLayout" id="settingsLayout">
				<div className="rabbitHole sessionEditCard" id="settingsCard">
					{SettingsOptionsList()}
				</div>
			</div>
		</section>
		<div id="previousPageContent">
		<section id="previousBannerSection">
		<img src="assets/previous_banner_white.svg" alt="Rabbit Hole Explorer Previous Banner" id="previousBanner" />
		</section>
		</div>
		</>
	);
}
