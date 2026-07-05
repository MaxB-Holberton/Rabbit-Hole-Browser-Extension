import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RHGetSessionList, RHGetPage } from "./history.js";
import { useNavigate } from 'react-router-dom';
import { IconButton } from "./iconbutton.jsx";

async function DeleteRecentSession(session_key, setLastSession) {
  if (!confirm("Are you sure you want to delete this rabbit hole?")) {
    return;
  }

  await chrome.storage.local.remove([session_key]);
  setLastSession(null);
}

/*
 * function to download the file as a JSON
 */
async function DownloadJsonFile(session_key) {
  const data = await RHGetPage(session_key);
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${session_key}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function DownloadTxtFile(session_key) {
  const data = await RHGetPage(session_key);
  let new_data;
  for (item of data.data) {
    new_data += `${item.title}\t${item.url}\n`;
  }
  const blob = new Blob([new_data], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${session_key}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}

/*
 *
 */
function ShowSessionPageList(data) {
  // Shows the total_pages from the session
  //TODO: create pagination and add it here
  const total_pages = Array.isArray(data?.data) ? data.data : [];
  return (
    <div>
      <b>Pages: </b>
      <ul>
        {total_pages.map((item, index2) => (
          <li key={index2}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShowSessionTags(data) {
  //shows the session tags
  const tags = Array.isArray(data?.tag_list) ? data.tag_list : [];
  return (
    <div className="viewSessionTagsRow sessionCardMetaLine">
      <span className="sessionCardFieldLabel">
        <img className="iconImg" src="assets/tag_icon.svg"></img>
        Tags:</span>
      {tags.map((tag, index) => (
        <span className="viewSessionTagText" key={index}>
          {tag}{index < tags.length - 1 ? ", " : ""}
        </span>
      ))}
    </div>
  );
}

function ShowSessionMetadata(data) {
  //shows the metadata for each session
  return (
    <>
      <p className="viewSessionMetaLine sessionCardMetaLine"><span className="sessionCardFieldLabel"><img className="iconImg" src="assets/topic_icon.svg"></img>Topic:</span> <span className="sessionCardFieldValue">{data.title}</span></p>
      <p className="viewSessionMetaLine sessionCardMetaLine"><span className="sessionCardFieldLabel"><img className="iconImg" src="assets/date_icon.svg"></img>Date:</span> <span className="sessionCardFieldValue">{data.start_time_datetime}</span></p>
      <p className="viewSessionMetaLine sessionCardMetaLine"><span className="sessionCardFieldLabel"><img className="iconImg" src="assets/duration_icon.svg"></img>Duration:</span> <span className="sessionCardFieldValue">{data.duration_string}</span></p>
    </>
  );
}

function ShowSessionDetailBtns({ session }) {
  const navigate = useNavigate();

  return (
    <div className="viewSessionActions">
      <IconButton className="viewSessionEditButton" iconSrc="assets/edit_icon.svg" label="Edit Session" onClick={() => { navigate(`/session/${session.session_key}/edit`); }} />
      <IconButton className="viewSessionDownloadButton" iconSrc="assets/save_icon.svg" label="JSON" onClick={async () => { DownloadJsonFile(session.session_key); }} />
      <IconButton className="viewSessionDownloadButton" iconSrc="assets/save_icon.svg" label="TXT" onClick={async () => { DownloadTxtFile(session.session_key); }} />
      {/*<IconButton iconSrc="assets/share_icon.svg" label="Share Session" onClick={() => { }} />*/}
      <IconButton iconSrc="assets/back_icon.svg" label="Back" onClick={() => { navigate(`/previous`); }} />
    </div>
  );
}

export function SessionDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [page_data, setPageData] = useState([]);

  async function DeleteSessionFromDetails(session_key) {
    if (!confirm("Are you sure you want to delete this rabbit hole?")) {
      return;
    }

    await chrome.storage.local.remove([session_key]);
    navigate('/previous');
  }

  useEffect(() => {
    RHGetPage(params.session_id).then((data) => setPageData(data));
  });

  return (
    <>
      <div className="sessionEditHeader" id="viewSessionHeader">
        <h2 className="sessionEditHeading" id="viewSessionHeading">Session!</h2>
        {SectionRibbon(`${page_data.title}`)}
      </div>
      <section className="rabbitHole sessionEditSection" id="viewSessionSection">
        <div className="sessionEditLayout" id="viewSessionLayout">
          <div className="rabbitHole sessionEditCard" id="viewSessionCard">
            <div className="previousSessionCard" id="viewSessionContentCard">
          <IconButton
            className="previousSessionDelete"
            iconSrc="assets/delete_icon.svg"
            label="Delete Session"
            onClick={() => { DeleteSessionFromDetails(page_data.session_key); }}
          />
          {ShowSessionMetadata(page_data)}
          <br />
          {ShowSessionTags(page_data)}
          <br />
          {ShowSessionPageList(page_data)}
          <br />
          <ShowSessionDetailBtns session={page_data} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function ShowLastSession() {
  const [last_session, setLastSession] = useState([]);

  useEffect(() => {
    RHGetSessionList().then((sessions) => {
      if (sessions.length > 0) {
        setLastSession(sessions[sessions.length - 1]);
      }
    })
  });

  return (
    <div id={last_session.session_key} className="rabbitHole previousSessionCard">
      <IconButton
        className="previousSessionDelete"
        iconSrc="assets/delete_icon.svg"
        label="Delete Session"
        onClick={() => { DeleteRecentSession(last_session.session_key, setLastSession); }}
      />
      <Link className={"div-links"} to={`/session/${last_session.session_key}`}>
        {ShowSessionMetadata(last_session)}
        {ShowSessionTags(last_session)}
      </Link>
    </div>
  );
}

export function ShowAllSessions() {
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

export function SessionsFilterAndShow() {
  const [default_sessions, setDefaultList] = useState([]);
  const [sessions, setSessionsList] = useState([]);
  const [sort_options, setSortedItems] = useState({ sort: "Old" });

  //Hooks and array data for paging the data
  const session_display_arr = [10, 20, 30, 'All'];
  const [page_options, setPagedItems] = useState({ num: "All", page_offset: 0, current_page: 1 });

  //Hooks and array data for filtering the data
  const [filter_options, setFilteredItems] = useState([]);

  function ApplyFilters() {
    const searched_tags = filter_options.tags;
    const start_date = Date.parse(filter_options.start_date);
    const end_date = Date.parse(filter_options.end_date) + ((1000 * 60 * 60 * 24) - 1);//24 hours - 1 second to be date@11:59:59

    if (!start_date && !end_date && !searched_tags) {
      //Nothing to sort
      ApplySorted([...default_sessions]);
      return;
    }

    const rtn_filter = default_sessions.filter(session => {
      if (start_date) {
        if (session.start_time_ms < start_date) {
          return false;
        }
      }
      if (end_date) {
        if (session.end_time_ms > end_date) {
          return false;
        }
      }
      if (searched_tags) {
        let match = false;
        for (tag of session.tag_list) {
          if (tag.includes(searched_tags)) {
            match = true;
            break;
          }
        }
        if (!match) {
          return false;
        }
      }
      return true;
    })
    ApplySorted(rtn_filter);
  }

  function ApplySorted(data) {
    const session_sort = sort_options.sort;
    const data_to_sort = [...data];

    if (session_sort === 'Old') {
      data_to_sort.sort((a, b) => (a.start_time_ms - b.start_time_ms));
    }
    if (session_sort === 'New') {
      data_to_sort.sort((a, b) => (b.start_time_ms - a.start_time_ms));
    }
    if (session_sort === 'Short') {
      data_to_sort.sort((a, b) => (a.end_time_ms - a.start_time_ms) - (b.end_time_ms - b.start_time_ms));
    }
    if (session_sort === 'Long') {
      data_to_sort.sort((a, b) => (b.end_time_ms - b.start_time_ms) - (a.end_time_ms - a.start_time_ms));
    }
    setSessionsList(data_to_sort);
  }

  function ClearFilters() {
    //delete the text in the inputs
    ApplySorted([...default_sessions]);
  }

  function FilterItemInputChanged(evt) {
    const name = evt.target.name;
    const val = evt.target.value;
    setFilteredItems(vals => ({ ...vals, [name]: val }));
  }

  function SortItemInputChanged(evt) {
    const name = evt.target.name;
    const val = evt.target.value;
    setSortedItems(vals => ({ ...vals, [name]: val }));
  }

  function PageItemInputChanged(evt) {
    const name = evt.target.name;
    const val = evt.target.value;
    if (name === "num") {
      setPagedItems(vals => ({ ...vals, [name]: val, page_offset: 0, current_page: 1 }));
      return;
    }
    const pages_to_display = Number(page_options.num);
    const no_of_sessions = sessions.length;
    let total_pages = Math.floor(no_of_sessions / pages_to_display) + 1;//minimum 1 page
    let last_page = (total_pages - 1) * pages_to_display;
    let new_current_page = Number(page_options.current_page);
    let new_page_offset = Number(page_options.page_offset);
    if (name === "First") {
      setPagedItems(vals => ({ ...vals, page_offset: 0, current_page: 1 }));
      return;
    }
    if (name === "Last") {
      setPagedItems(vals => ({ ...vals, page_offset: last_page, current_page: total_pages }));
      return;
    }

    if (name === "Prev") {
      new_current_page -= 1;
      if (new_current_page < 1) {
        new_current_page = 1;
      }
      new_page_offset -= pages_to_display;
      if (new_page_offset < 0) {
        new_page_offset = 0;
      }
    }
    else if (name === "Next") {
      new_current_page += 1;
      if (new_current_page > total_pages) {
        new_current_page = total_pages;
      }

      new_page_offset += pages_to_display;
      if (new_page_offset > no_of_sessions) {
        new_page_offset -= pages_to_display;
      }
    }
    setPagedItems(vals => ({ ...vals, page_offset: new_page_offset, current_page: new_current_page }));
  }

  async function DeleteSessionFromPrevious(session_key) {
    if (!confirm("Are you sure you want to delete this rabbit hole?")) {
      return;
    }
    await chrome.storage.local.remove([session_key]);
    const new_session = sessions.filter((new_session) => new_session.session_key !== session_key);
    setDefaultList(new_session);
    return;
  }

  useEffect(() => {
    RHGetSessionList().then((sessions) => {
      setSessionsList(sessions);
      setDefaultList(sessions);
    });
  }, []);

  useEffect(() => { ApplySorted(sessions) }, [sort_options]);
  useEffect(() => { ApplyFilters() }, [default_sessions]);
  useEffect(() => { }, [page_options]);

  return (
    <>
      <div id="previousControlsPanel">
      <span className="previousControlsRow" id="previousControlsPrimaryRow">
        <label for="num">Sessions per page: </label>
        <select className="previousControlSelect" defaultValue="All" name="num" onChange={PageItemInputChanged}>
          {session_display_arr.map((val, idx) => {
            return (
              <option key={idx} val={val}>{`${val}`}</option>
            );
          })}
        </select>
        <label for="sort">Sort by: </label>
        <select className="previousControlSelect" defaultValue="Old" name="sort" onChange={SortItemInputChanged}>
          <option value="Old">Date: Old - New</option>
          <option value="New">Date: New - Old</option>
          <option value="Short">Time: Shortest - Longest</option>
          <option value="Long">Time: Longest - Shortest</option>
        </select>
      </span>
      <span className="previousControlsRow" id="previousControlsFilterRow">
        <label for="tags">Search Tags: </label>
        <input
          className="previousControlInput"
          name="tags"
          type="search"
          onChange={FilterItemInputChanged}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              ApplyFilters()
            }
          }}
        />
        <label for="start_date">Start Date: </label>
        <input
          className="previousControlInput"
          name="start_date"
          type="date"
          onChange={FilterItemInputChanged}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              ApplyFilters()
            }
          }}
        />
        <label for="end_date">End Date: </label>
        <input
          className="previousControlInput"
          name="end_date"
          type="date"
          onChange={FilterItemInputChanged}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              ApplyFilters()
            }
          }}
        />
        <IconButton className="previousControlButton previousSearchButton" iconSrc="assets/search_icon.svg" label ="Search for Sessions" onClick={() => { ApplyFilters() }}>Search</IconButton>
        <IconButton className="previousControlButton previousClearButton" iconSrc="assets/clear_icon.svg" label="Clear Search" onClick={() => { ClearFilters() }}>Clear</IconButton>
      </span>

      {
        page_options.num !== "All" &&
        <span className="previousControlsRow" id="previousControlsPagerRow">
          <button className="previousControlButton previousPagerButton" name="First" onClick={PageItemInputChanged}>First</button>
          <button className="previousControlButton previousPagerButton" name="Prev" onClick={PageItemInputChanged}>Prev</button>
          <button className="previousControlButton previousPagerButton" name="Next" onClick={PageItemInputChanged}>Next</button>
          <button className="previousControlButton previousPagerButton" name="Last" onClick={PageItemInputChanged}>Last</button>
        </span>
      }
      </div>
      <section className="rabbitHole" id="previousSessionsGrid">
        {sessions.map((session, index) => {
          const pages_to_display = page_options.num;
          const current_page = page_options.current_page;
          const page_offset = page_options.page_offset;
          if (index < page_offset) {
            return (<></>);
          }
          if (pages_to_display === "All" || (index < current_page * pages_to_display)) {
            return (
              <div className="rabbitHole previousSessionCard" key={index}>
                <IconButton
                  className="previousSessionDelete"
                  iconSrc="assets/delete_icon.svg"
                  label="Delete Session"
                  onClick={async () => await DeleteSessionFromPrevious(session.session_key)}
                />
                <Link className={"div-links"} to={`/session/${session.session_key}`}>
                  {ShowSessionMetadata(session)}
                  {ShowSessionTags(session)}
                </Link>
              </div>
            );
          }
        })}
      </section>
    </>
  );
}

export function SectionRibbon(title_h3) {
  //returns the Section Ribbon
  return (
    <div className="sectionRibbon">
      <h3 id="white">{title_h3}</h3>
    </div>
  );
}
