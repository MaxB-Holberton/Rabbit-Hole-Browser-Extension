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
        <div className="rabbitHole" id="recent">
          <p><b>Topic:</b></p>
          <p><b>Date:</b></p>
          <p><b>Duration:</b></p>
          <p><b>Pages:</b></p>
          <button>Save</button>
          <button>Share</button>
        </div>
      </section>
    </>
  );
}

function PreviousView() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    GetRabbitHoleHistory().then(sessions => setSessions(sessions));
  }, [])

  const display_sessions = sessions.map((session, index) =>
    <div className="rabbitHole" key={index}>
      <p><b>Topic: {session.title}</b></p>
      <p><b>Date: {session.start_time}</b></p>
      <p><b>Duration: {session.end_time - session.start_time}</b></p>
      <p><b>Pages:</b></p>
      <button>Save</button>
      <button>Share</button>
    </div>
  );

  return (
    <>
    <h2 id="white">My Rabbit Holes</h2>
    <div>
    <h3 id="white">Previous Rabbit Holes</h3>
    </div>
    <section className="rabbitHole" id="previous">
    {display_sessions}
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
