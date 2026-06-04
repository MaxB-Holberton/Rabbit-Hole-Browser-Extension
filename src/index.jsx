import React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { RHGetSessionList, RHGetPage } from "./history.js";

import { SectionRibbon, ShowSessionDetailBtns,
  ShowSessionPageList, ShowSessionTags,
  ShowSessionMetadata } from "./viewsessiondetails";

import { SessionEditPage } from "./editsessionpage";


/*
 * Display Functions to use within the routes
 */

function ShowLastSession() {
  const [last_session, setLastSession] = useState([]);

  useEffect(() => {
    RHGetSessionList().then((sessions) => {
      if (sessions.length > 0) {
        setLastSession(sessions[sessions.length - 1]);
      }
    })
  });

  return (
    <Link to={`/session/${last_session.session_key}`}>
      <div id={last_session.session_key} className="rabbitHole">
        {ShowSessionMetadata(last_session)}
        {ShowSessionTags(last_session)}
      </div>
    </Link>
  );
}


function ShowAllSessions() {
  const [sessions, setSessionsList] = useState([]);

  useEffect(() => {
    RHGetSessionList().then((sessions) => setSessionsList(sessions));
  });

  return sessions.map((session, index) => {
    return (
      <Link className={"div-links"} key={index} to={`/session/${session.session_key}`}>
        <div className="rabbitHole">
            {ShowSessionMetadata(session)}
            {ShowSessionTags(session)}
        </div>
      </Link>
    );
  });
}

/*
 * Show the full details of a single session
 */
function SessionDetailsPage() {
  const params = useParams();
  const [page_data, setPageData] = useState([]);

  useEffect(() => {
    RHGetPage(params.session_id).then((data) => setPageData(data));
  });

  return (
    <>
    <h2 id="white">Session!</h2>
    {SectionRibbon(`${page_data.title}`)}
    <section className="rabbitHole" id="previous">
      <div className="rabbitHole">
        {ShowSessionMetadata(page_data)}
        <br/>
        {ShowSessionTags(page_data)}
        <br/>
        {ShowSessionPageList(page_data)}
        <br/>
        <ShowSessionDetailBtns session={page_data} />
      </div>
    </section>
    </>
  );
}

/*
function SessionEditPage() {
  const params = useParams();
  const [page_data, setPageData] = useState([]);

  useEffect(() => {
    RHGetPage(params.session_id).then((data) => setPageData(data));
  });

  return (
    <>
    <h2 id="white">Session!</h2>
    {SectionRibbon(`${page_data.title}`)}
    <section className="rabbitHole" id="previous">
      <div className="rabbitHole">
        {EditSessionMetadata(page_data)}
        <br/>
        {EditSessionTags(page_data)}
        <br/>
        {EditSessionPageList(page_data)}
        <br/>
        {EditSessionActions(page_data)}
        <br/>
        <button type="button" onClick={() => window.history.back()}>Back</button>
      </div>
    </section>
    </>
  );
}
*/
/*
 * Routes functions
 */
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
        <Link to="/previous">Previous</Link>
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
    </>
  );
}

function PreviousView() {
  return (
    <>
    <h2 id="white">My Rabbit Holes</h2>
    {SectionRibbon('Previous Rabbit Holes')}
    <section className="rabbitHole" id="previous">
    {ShowAllSessions()}
    </section>
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
