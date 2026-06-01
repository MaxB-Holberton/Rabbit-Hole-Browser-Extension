import React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { GetRabbitHoleHistory, DeleteRabbitHoleSession, StartSessionEditing, GetRabbitHolePage } from "./history.js";


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
    GetRabbitHoleHistory().then(sessions => setSessions(sessions));
  }, []);

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
      <div>
        <h3 id="white">Overview</h3>
      </div>
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
      <div>
        <h3 id="white">Most Recent Rabbit Hole</h3>
      </div>
      <section className="rabbitHole">
        {BuildSessionsDiv()}
      </section>
    </>
  );
}

function PreviousView() {
  return (
    <>
    <h2 id="white">My Rabbit Holes</h2>
    <div>
    <h3 id="white">Previous Rabbit Holes</h3>
    </div>
    <section className="rabbitHole" id="previous">
    {BuildSessionsDiv()}
    </section>
    </>
  );
}

function BuildTagsDiv(sessionTags) {
  return (
    <div>
    <b>Tags: </b>
    <button className="EditBtnGroup" onClick={() => {}}>Edit Tags</button>
    <ul>
    {sessionTags.map((tag, indextag) => (
      <li key={indextag}>
      <span>{tag}</span>
      <button className="EditTagBtnGroup">x</button>
      </li>
    ))}
    </ul>
    </div>
  );
}

function BuildPagesDiv(sessionPages) {
  return (
    <div>
    <button>Ex</button>
    <b>Pages: </b>
    <button className="EditBtnGroup">Edit Pages</button>
    <ul>
    {sessionPages.map((item, index2) => (
      <li key={index2}>
      <button className="EditPagesBtnGroup">Edit</button>
      <button className="EditPagesBtnGroup">Delete</button>
      <a href={item.url}>{item.title}</a>
      </li>
    ))}
    </ul>
    </div>
  );
}

function BuildSessionsDiv() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    GetRabbitHoleHistory().then(sessions => setSessions(sessions));
  }, [])

  const display_all_sessions = sessions.map((session, index) => {
    const sessionPages = Array.isArray(session?.data) ? session.data : [];
    const sessionTags = Array.isArray(session?.tag_list) ? session.tag_list : [];

    return (
      <div id={session.session_key} className="rabbitHole" key={index}>
        <p><b>Topic: {session.title}</b></p>
        <p><b>Date: {session.start_time_datetime}</b></p>
        <p><b>Duration: {session.duration_string}</b></p>

        {BuildTagsDiv(sessionTags)}
        {BuildPagesDiv(sessionPages)}

        <button onClick={() => { StartSessionEditing(session.session_key) }}>Edit</button>
        <button onClick={() => { DeleteRabbitHoleSession(session.session_key); }}>Delete</button>
        <button>Share</button>
        <Link to={`/session/${session.session_key}`}>Open Session</Link>
      </div>
    );
  });
  return display_all_sessions;
}

function SessionPage() {
  const session_id = useParams();

  const [page_data, setData] = useState([]);

  useEffect(() => {
    GetRabbitHolePage(session_id).then(page_data => setData(page_data));
  }, [])
  console.log(page_data);
  return (
    <>
    <h2 id="white">Session!</h2>
    <div>
    <h3 id="white">Yippee!!!</h3>
    </div>
    <section className="rabbitHole" id="session">
      <p><b>Topic: {page_data.title}</b></p>
      <p><b>Date: {page_data.start_time_datetime}</b></p>
      <p><b>Duration: {page_data.duration_string}</b></p>
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
          <Route path="/session/:session_id" element={<SessionPage />} />
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
