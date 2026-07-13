import React from 'react';
import { useEffect, useState } from 'react';
import { GetBlacklist, SetBlacklist, GetStaleThresholdMinutes, SetStaleThresholdMinutes, DEFAULT_STALE_THRESHOLD_MIN } from "./history.js";
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
          <li id="settingsOptionTimeoutLink"><Link to="/settings/timeout">Change Timeout</Link></li>
          <li id="settingsOptionAccessibilityLink"><Link to="/settings/accessibility">Accessibility</Link></li>
          <li id="settingsOptionReportBugLink"><Link to="/settings/report-bug">Report a Bug</Link></li>
        </ul>
      </div>
    </>
  )
}

export function AccessibilitySettingsPage() {
  return (
    <>
      <div className="sessionEditHeader" id="accessibilityPageHeader">
        <h2 className="sessionEditHeading" id="accessibilityPageHeading">My Rabbit Holes</h2>
        {SectionRibbon('Accessibility')}
      </div>
      <section className="rabbitHole sessionEditSection" id="accessibilityPageSection">
        <div className="sessionEditLayout" id="accessibilityLayout">
          <div className="rabbitHole sessionEditCard" id="accessibilityCard">
            <p id="accessibilityDescription">Accessibility settings are coming soon.</p>
            <p className="reportBugBodyText">Placeholder text: this page will include controls for improving readability, contrast, and keyboard navigation.</p>
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

export function ReportBugPage() {
  return (
    <>
      <div className="sessionEditHeader" id="reportBugPageHeader">
        <h2 className="sessionEditHeading" id="reportBugPageHeading">My Rabbit Holes</h2>
        {SectionRibbon('Report a Bug')}
      </div>
      <section className="rabbitHole sessionEditSection" id="reportBugPageSection">
        <div className="sessionEditLayout" id="reportBugLayout">
          <div className="rabbitHole sessionEditCard" id="reportBugCard">
            <p id="reportBugDescription">Found something broken or not working as expected?</p>
            <p className="reportBugBodyText">Send a quick note to the Rabbit Hole Explorer dev team and include what happened, what you expected, and any steps to reproduce it.</p>
            <div className="chromeStore" id="reportBugEmailCard" aria-label="Google Support Link">
              <p><b>Google Support Form</b></p>
              <div className="reportBugLinkRow">
                <a id="reportBugEmailLink" target="_blank" href="https://chromewebstore.google.com/detail/minboipknnbkihdbbihjfahaligkdeno/support?authuser=1">Click here for Rabbit Hole Explorer Google Support</a>
                <img className="pageIcon" id="settingIcon" src="./assets/Google_Chrome_Web_Store_icon_2022.jpeg"></img>
              </div>
            </div>
            <div id="reportBugEmailCard" aria-label="Rabbit Hole Explorer support email">
              <p className="reportBugEmailLabel"><b>Contact email</b></p>
              <p id="reportBugEmailLink">rabbitholeexplorerdev@gmail.com</p>
            </div>
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

async function SaveStaleThreshold(minutes) {
  await SetStaleThresholdMinutes(minutes);
  alert('Timeout timer Saved');
  window.location.href = `/index.html#/settings`;
}

export function TimeoutSettingsPage() {
  const [minutes, SetMinutes] = useState(DEFAULT_STALE_THRESHOLD_MIN);

  useEffect(() => {
    GetStaleThresholdMinutes().then(value => SetMinutes(value));
  }, []);

  function OnMinutesChange(evt) {
    const value = evt.target.value;
    // Allow the field to be cleared while typing, but never store NaN/invalid values
    if (value === "") {
      SetMinutes("");
      return;
    }
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      SetMinutes(parsed);
    }
  }

  function HandleSave() {
    const parsed = Number(minutes);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      alert('Please enter a timeout of at least 1 minute.');
      return;
    }
    SaveStaleThreshold(parsed);
  }

  return (
    <>
      <div className="sessionEditHeader" id="timeoutPageHeader">
        <h2 className="sessionEditHeading" id="timeoutPageHeading">My Rabbit Holes</h2>
        {SectionRibbon('Still Watching? Timeout')}
      </div>
      <section className="rabbitHole sessionEditSection" id="timeoutPageSection">
        <div className="sessionEditLayout" id="timeoutLayout">
          <div className="rabbitHole sessionEditCard" id="timeoutEditorCard">
            <p id="timeoutDescrip">Choose how many minutes of inactivity should pass before Rabbit Hole Explorer asks "Still down the rabbit hole?"</p>
            <label htmlFor="timeoutInput" id="timeoutInputLabel">Minutes of inactivity:</label>
            <input
              id="timeoutInput"
              type="number"
              min="1"
              step="1"
              name="staleThresholdMinutes"
              onChange={OnMinutesChange}
              value={minutes}
              placeholder={`${DEFAULT_STALE_THRESHOLD_MIN}`}
              required={true}
            />
            <IconButton id="save_timeout_setting" iconSrc="assets/save_icon.svg" onClick={HandleSave} label="Save Timeout" />
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

export function BlacklistEditPage() {
  const [rabbithole_blacklist, UpdateBlacklist] = useState(
    [
      { name: "facebook", active: false },
      { name: "twitter", active: false }
    ]

  );
  const [blacklist_item, NewInputOnChange] = useState("");
  useEffect(() => { }, [rabbithole_blacklist]);
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
    if (blacklist_item === "") {
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
        return { ...item, active: true };
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
        return { ...item, active: false };
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
            <IconButton iconSrc="assets/save_icon.svg" onClick={() => { SaveBlacklist(rabbithole_blacklist) }} label="Save Blacklist" />
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
