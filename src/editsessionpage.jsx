import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RHGetPage } from "./history.js";
import { IconButton } from "./iconbutton.jsx";
import { SectionRibbon } from "./viewsessiondetails";

// Delete a session
export async function RHDeleteSession(session_key) {
  console.log(session_key);
  if (confirm("Are you sure you want to delete this rabbit hole?")) {
    console.log("deleting...");
    await chrome.storage.local.remove([session_key]);
    window.location.href = "/index.html#/overview";
  }
}

async function RHSaveSession(page_data, metadata_vals) {
  const session_key = page_data.session_key;
  const new_session = {};
  const metadata_keys = Object.keys(metadata_vals);
  metadata_keys.forEach((key) => {
    page_data[key] = metadata_vals[key];
  });

  new_session[session_key] = page_data;
  await chrome.storage.local.set(new_session);
  alert('Session Saved');
}


export function SessionEditPage() {
  const params = useParams();

  const [session_data, SetSessionData] = useState({});//Sets all the session data
  const [page_data, SetPageData] = useState([]);

  const [metadata_vals, setMetaDataVal] = useState({});
  const [session_tag, setSessionTagName] = useState({ isAdding: false });

  //========== Update Session metadata Values ==========
  function UpdateMetadata(evt) {
    const id = evt.target.name;
    const val = evt.target.value;
    setMetaDataVal(vals => ({ ...vals, [id]: val }));
  }
  //========== Update Session metadata Values ==========

  useEffect(() => {
    RHGetPage(params.session_id).then((data) => {
      SetSessionData(data);
      SetPageData(Array.isArray(data?.data) ? data.data : []);
    });
  }, []);

  useEffect(() => {}, [session_data, page_data, session_tag]);

  return (
    <>
    <h2 id="white">Session!</h2>
    {SectionRibbon(`${session_data.title}`)}
    <section className="rabbitHole" id="previous">
      <div className="rabbitHole">
        {EditSessionMetadata(session_data, UpdateMetadata)}
        <br />
        {EditSessionTags(session_data, session_tag, SetSessionData, setSessionTagName)}
        <br />
        {EditSessionPageList(page_data, SetPageData)}
        <br />
        {EditSessionActions(session_data, metadata_vals)}
        <br />
        <button type="button" onClick={() => window.history.back()}>Back</button>
      </div>
    </section>
    </>
  );
}

function EditSessionActions(session_data, metadata_vals) {
  return (
    <>
      <IconButton iconSrc="assets/save_icon.svg" label="Save Session" onClick={() => { RHSaveSession(session_data, metadata_vals) }} />
      <IconButton iconSrc="assets/delete_icon.svg" label="Delete Session" onClick={() => { RHDeleteSession(session_data.session_key); }} />
    </>
  );
}

function EditSessionPageList(page_data, SetPageData) {

  function PageTitleOnChange(evt) {
    const idx = evt.target.name;
    const val = evt.target.value;
    const new_title_val = page_data.map((item, i) => {
      if (i == idx) {
        return {...item, title: val};
      } else {
        return item;
      }
    });
    SetPageData(new_title_val);
  }

  function AddPage(page_data) {
    const new_data = [...page_data];
    const new_page_obj = {};
    new_page_obj['category'] = "general";
    new_page_obj['concepts'] = [];
    new_page_obj['id'] = "000";
    new_page_obj['lastVisitTime'] = Date.now();
    new_page_obj['manualTags'] = [];
    new_page_obj['structuralTags'] = [];
    new_page_obj['title'] = 'newTitle';
    new_page_obj['typedCount'] = 0;
    new_page_obj['url'] = "newUrl";
    new_page_obj['visitCount'] = 1;

    new_data.unshift(new_page_obj);
    SetPageData(new_data);
  }

  function DeletePage(index) {
    const new_data = {...session_data};
    new_data.data.splice(index, 1);
    SetPageData(new_data);
  }

  return (
    <div>
    <b>Pages: </b><IconButton id="add_page" iconSrc="assets/add_icon.svg" label="Add Page" onClick={() => AddPage(page_data)} />
    <ul>
    {page_data.map((item, idx) => (
      <li key={idx}>
      <input
      id={`${idx}_input`}
      name={`${idx}`}
      onChange={PageTitleOnChange}
      value={item.title}
      disabled={false}
      />
      <IconButton
      iconSrc="assets/delete_icon.svg"
      label="Delete"
      showLabel={false}
      ariaLabel="Delete page"
      onClick={() => { DeletePage(idx) }}
      />
      <br />
      <div id={`${idx}_tagdiv`}>
        <p>Category: <span>{item.category}</span></p>
        <p>structTag: <span>{item.structuralTags}</span></p>
        <p>ManualTags: <span>{item.manualTags}</span></p>
      </div>
      </li>
    ))}
    </ul>
    </div>
  );
}

function EditSessionTags(session_data, session_tag, SetSessionData, setSessionTagName) {
  const tags = Array.isArray(session_data?.tag_list) ? session_data.tag_list : [];

  function AddSessionTag(evt) {
    const new_data = {...session_data};
    new_data.tag_list.push(evt.target.value);
    SetSessionData(vals => (new_data));
  }

  function RemoveSessionTag(index) {
    const new_data = {...session_data};
    new_data.tag_list.splice(index, 1);
    SetSessionData(vals => (new_data));
  }

  function SessionTagName(evt) {
    const val = evt.target.value;
    setSessionTagName(vals => ({ ...vals, newTag: val }));
  };

  function ResetNewTags() {
    setSessionTagName(vals => ({ ...vals, isAdding: false, newTag: "" }));
  }

  return (
    <div>
    <b>Tags: </b>
    {!session_tag.isAdding ? (
      <IconButton
      id="add_tags"
      iconSrc="assets/tag_icon.svg"
      label="Add Tags"
      onClick={() => {setSessionTagName(vals => ({ ...vals, isAdding: true, newTag: "" }));}}
      />
    ) : (
      <>
      <input
      autoFocus
      id={"New_Session_Tag_Input"}
      defaultValue={""}
      onChange={SessionTagName}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          ResetNewTags();
          AddSessionTag(e);
        }
      }}
      />
      <button onClick={ResetNewTags}>
      Cancel
      </button>
      </>
    )}

    {tags.map((tag, index) => (
      <span key={index}>{tag}
      <IconButton
      id={`remove_tag_${index}`}
      iconSrc="assets/delete_icon.svg"
      label="Delete Tag"
      showLabel={false}
      ariaLabel={`Delete ${tag}`}
      onClick={() => { RemoveSessionTag(index) }}
      />
      {" "}
      </span>
    ))}
    </div>
  );
}

function EditSessionMetadata(data, UpdateMetadata) {
  //shows the metadata for each session
  return (
    <>
    <p>
    <b>Topic:</b>
    <input
    name={`title`}
    onChange={UpdateMetadata}
    defaultValue={data.title}
    />
    </p>
    <p><b>Date: {data.start_time_datetime}</b></p>
    <p><b>Duration: {data.duration_string}</b></p>
    </>
  );
}
