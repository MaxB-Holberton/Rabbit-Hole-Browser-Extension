import React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { GetRabbitHoleHistory } from "./history.js";


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
        <h3 id="white">SPA Overview</h3>
      </div>
      <section className="rabbitHole">
        <div className="rabbitHole">
          <p><b>Use the links above to switch views.</b></p>
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

function BuildSessionsDiv() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    GetRabbitHoleHistory().then(sessions => setSessions(sessions));
  }, [])

  const display_sessions = sessions.map((session, index) =>
  <div className="rabbitHole" key={index}>
  <p><b>Topic: {session.title}</b></p>
  <p><b>Date: {session.start_time_datetime}</b></p>
  <p><b>Duration: {session.duration_string}</b></p>
  <p><b>Pages:</b></p>
  {session.data.map((item, index2) =>
    <div key={index2}>
    <p><a href={item.url}>{item.title}</a></p>
    </div>
  )}
  <button>Save</button>
  <button>Share</button>
  </div>
  );
  return display_sessions;
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
