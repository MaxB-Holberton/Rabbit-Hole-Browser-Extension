import React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { RHGetSessionList, RHGetPage } from "./history.js";
import { SectionRibbon, SessionDetailsPage,
  ShowLastSession, ShowAllSessions } from "./viewsessiondetails";

import { SessionEditPage } from "./editsessionpage";
import { SettingsPage, BlacklistEditPage } from "./settingspage";

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
  });

  return (
    <section className="rabbitHole">
      <div className="rabbitHole" id="counter">
        <p>Topic:</p>
        <p>You have {sessions.length} rabbit holes!</p>
        <p>
        <Link to="/overview">Overview</Link> | <Link to="/recent">Most Recent</Link> |{' '}
        <Link to="/previous">Previous</Link> | <Link to="/settings">Settings</Link>
        </p>
      </div>
    </section>
  );
}

function OverviewView() {
  return (
    <>
    <h2 id="white">My Rabbit Holes</h2>
    {SectionRibbon('Overview')}
    <section className="rabbitHole">
    <div className="rabbitHole">
    <p>Ready to explore your rabbit holes?</p>
    <p><b>Use the links above to switch views.</b></p>
    </div>
    </section>
    <section className="rabbitHole">
    <div className="rabbitHole">
    <p><b>How does Rabbit Hole Explorer work?</b></p>
    <p>Rabbit Hole Explorer is a Chrome browser extension that helps you remember the websites you visit. When you press the 'start' button, the extension records your browser history until you press 'Stop'. Then, it will save your Rabbit Hole on this page, where you can edit or delete it. Finally, you can save the rabbit hole or even share it with others!</p>
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
      <h2 id="white">My Rabbit Holes</h2>
      {SectionRibbon('Most Recent Rabbit Hole')}
      <section className="rabbitHole">
        {ShowLastSession()}
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
      <h2 id="white">My Rabbit Holes</h2>

      <div id="previousHeaderRow">
        {SectionRibbon('Previous Rabbit Holes')}
      </div>
      <section className="rabbitHole" id="previous">
        {ShowAllSessions()}
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
          <Route path="/session/:session_id" element={<SessionDetailsPage />} />
          <Route path="/session/:session_id/edit" element={<SessionEditPage />} />
        </Routes>
      </main>
      <footer>
        <p id="footerP">2026 Rabbit Hole Explorer. Andrew Kasapidis, Uliana Deshin, Max Brook, Pavith Raj.</p>
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
