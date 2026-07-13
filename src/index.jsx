import React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { RHGetSessionList, RHGetPage } from "./history.js";
import { SectionRibbon, SessionDetailsPage,
  ShowLastSession, SessionsFilterAndShow } from "./viewsessiondetails";

import { SessionEditPage } from "./editsessionpage";
import { SettingsPage, BlacklistEditPage, ReportBugPage, TimeoutSettingsPage, AccessibilitySettingsPage } from "./settingspage";

function Header() {
  return (
    <header>
    <nav>
    <img src="assets/rbe_logo_390.png" alt="Rabbit Hole Explorer Static Logo" id="headerLogo" />
    <h1>Rabbit Hole Explorer</h1>
    </nav>
    </header>
  );
}

function ViewNav() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    RHGetSessionList().then(sessions => setSessions(sessions));
  }, []);

  return (
    <section className="rabbitHole">
      <div className="rabbitHole" id="counter">
        <p>You have {sessions.length} rabbit holes!</p>
        <div className="headerLinksRow" aria-label="View navigation">
          <Link to="/overview" className="headerLink" id="overviewHeaderLink" aria-label="">Overview</Link>
          <Link to="/recent" className="headerLink" id="recentHeaderLink">Most Recent</Link>
          <Link to="/previous" className="headerLink" id="previousHeaderLink">Previous</Link>
          <Link to="/settings" className="headerLink" id="settingsHeaderLink">Settings</Link>
        </div>
      </div>
    </section>
  );
}

function OverviewView() {
  return (
    <>
    {SectionRibbon('Overview')}
    <section className="rabbitHole" id="overviewIntroSection">
      <div className="rabbitHole" id="overviewIntroCard">
        <p id="questionBold">Find <b>How to Use Instructions</b> and the <b>FAQ</b> below!</p>
      </div>
    </section>
            <h2 id="white">How to Use Rabbit Hole Explorer</h2>
    <section className="rabbitHole" id="overviewGuideSection">
      <div className="rabbitHole" id="overviewGuideCard">

        <ol id="overviewStepsList">
          <li>Open the extension popup <img class="overviewIcon" src="./assets/rbe_logo_390.png" aria-label="Logo Image"></img>from Chrome.</li>
          <li>Press <b>Start</b> <img class="overviewIcon" src="./assets/start_icon.png" aria-label="Start Button Image"></img>to begin recording the websites you visit.</li>
          <li>Browse normally while the extension tracks your rabbit hole.</li>
          <li>Press <b>Stop</b> <img class="overviewIcon" src="./assets/stop_icon.png" aria-label="Stop Button Image"></img> when you are done recording.</li>
          <li>Press the <b>Home</b> <img class="overviewIcon" src="./assets/home_button_sc.png" aria-label="Home Button Image"></img> button to view your rabbit hole on the <b>Most Recent</b> <img class="overviewIcon" src="./assets/most_recent_sc.png" aria-label="Most Recent Button Image"></img> page.</li>
          <li>Click on your rabbit hole to see more details and the edit <img class="overviewIcon" src="./assets/edit_icon.svg" aria-label="Edit Button Image"></img> and download <img class="overviewIcon" src="./assets/save_icon.svg" aria-label="Save Button Image"></img>buttons.</li>
          <li><b>Edit</b> pages, tags, or the title if you want to clean up the rabbit hole.</li>
          <li><b>Save</b> <img class="overviewIcon" src="./assets/save_icon.svg" aria-label="Save Button Image"></img>your changes so they are ready the next time you explore.</li>
          <li>Use <b>Previous</b> <img class="overviewIcon" src="./assets/previous_sc.png" aria-label="Previous Button Image"></img> to find older rabbit holes you saved earlier.</li>
          <li>Open <b>Settings</b><img class="overviewIcon" src="./assets/settings_sc.png" aria-label="Settings Button Image"></img>to change the blacklist, timeout, or accessibility options.</li>
          
        </ol>
      </div>
    </section>
    <section className="rabbitHole" id="overviewScreenshotsSection">
      <div className="overviewScreenshotGrid">
        <div className="overviewScreenshotCard">
          <p className="overviewScreenshotTitle">Pop-up Buttons</p>
          <div className="overviewScreenshotPlaceholder" aria-label="Extension button screenshots">
            <img src="./assets/popup_diagram.jpg" aria-label="Diagram of Popup"></img>
          </div>
        </div>
        <div className="overviewScreenshotCard">
          <p className="overviewScreenshotTitle">Most Recent Rabbit Hole</p>
          <div className="overviewScreenshotPlaceholder" aria-label="Page screenshots">
            <img src="./assets/recent_diagram.jpg" aria-label="Diagram of Recent page"></img>
          </div>
        </div>
        <div className="overviewScreenshotCard">
          <p className="overviewScreenshotTitle">Saved pages</p>
          <div className="overviewScreenshotPlaceholder" aria-label="Page screenshots">
            <img src="./assets/previous_diagram.jpg" aria-label="Diagram of Previous page"></img>
          </div>
        </div>
      </div>
    </section>
                    <h2 id="white">FAQ</h2>
    <section className="rabbitHole" id="overviewDetailSection">
      <div className="rabbitHole" id="overviewDetailCard">
        <p id="questionBold">What happens after you stop recording?</p>
        <p>Rabbit Hole Explorer saves the session so you can look back at the sites you visited, rename the rabbit hole, and decide whether to keep it private or share it.</p>
        <p>On the edit pages, you can update the title, add tags, remove pages, and organize the rabbit hole before saving.</p>
      </div>
    </section>
    <section className="rabbitHole" id="overviewDetailSection">
      <div className="rabbitHole" id="overviewDetailCard">
        <p id="questionBold">Who can access my browser history after recording or saving it?</p>
        <p>Your browser history is stored locally. That means that <b>only you can access your rabbit holes.</b> None of your browser history is saved onto an external server.</p>
        <p>Nobody can access your data other than yourself. <b>The Rabbit Hole Explorer dev team cannot access any saved browser history.</b></p>
        <p>The only way that someone else can access your rabbit hole is if you download it as a JSON or txt file and send it to them.</p>
      
      </div>
    </section>
    <div id="overviewPageContent">
      <section id="overviewBannerSection">
      <img src="assets/overview_banner_white.svg" alt="Rabbit Hole Explorer Overview Banner" id="overviewBanner" />
    </section>
    </div>
    </>
  );
}

function MostRecentView() {
  return (
    <>
      <div className="sessionEditHeader" id="recentPageHeader">
        <h2 className="sessionEditHeading" id="recentPageHeading">My Rabbit Holes</h2>
        {SectionRibbon('Most Recent Rabbit Hole')}
      </div>
      <section className="rabbitHole sessionEditSection" id="recent">
        <div className="sessionEditLayout" id="recentLayout">
          <div className="rabbitHole sessionEditCard" id="recentCard">
            {ShowLastSession()}
          </div>
        </div>
      </section>
      <div id="recentPageContent">
        <section id="recentBannerSection">
          <img src="assets/recent_banner_white.svg" alt="Rabbit Hole Explorer Recent Banner" id="recentBanner" />
      </section>
      </div>
    </>
  );
}

function PreviousView() {
  return (
    <>
      <div className="sessionEditHeader" id="previousPageHeader">
        <h2 className="sessionEditHeading" id="previousPageHeading">My Rabbit Holes</h2>
        {SectionRibbon('Previous Rabbit Holes')}
      </div>
      <section className="rabbitHole sessionEditSection" id="previousPageSection">
        <div className="sessionEditLayout" id="previousLayout">
          <div className="rabbitHole sessionEditCard" id="previousCard">
            {SessionsFilterAndShow()}
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

function AppShell() {
  return (
    <>
      <Header />
      <main>
        <ViewNav />
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewView />} />
          <Route path="/recent" element={<MostRecentView />} />
          <Route path="/previous" element={<PreviousView />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/blacklist" element={<BlacklistEditPage/>} />
          <Route path="/settings/timeout" element={<TimeoutSettingsPage/>} />
          <Route path="/settings/accessibility" element={<AccessibilitySettingsPage/>} />
          <Route path="/settings/report-bug" element={<ReportBugPage/>} />
          <Route path="/session/:session_id" element={<SessionDetailsPage />} />
          <Route path="/session/:session_id/edit" element={<SessionEditPage />} />
        </Routes>
      </main>
      <footer>
        <p id="footerP">Copyright © 2026 Andrew Kasapidis, Uliana Deshin, Max Brook, Pavith Raj. All rights reserved.</p>
      </footer>
    </>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id "root" was not found.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <HashRouter>
      <AppShell />
    </HashRouter>
  </React.StrictMode>
);
