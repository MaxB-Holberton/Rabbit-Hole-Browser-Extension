import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RHGetPage } from "./history.js";
import { IconButton } from "./iconbutton.jsx";
import { SectionRibbon } from "./viewsessiondetails";

async function RHSaveSession(evt, session_data, page_data) {
  evt.preventDefault();
  session_data.data = page_data;
  session_key = session_data.session_key

  await chrome.storage.local.set({ [session_key]: session_data });
  alert('Session Saved');
  window.location.href = `/index.html#/session/${session_data.session_key}`;
}

// Delete a session
async function RHDeleteSession(session_key) {
  if (confirm("Are you sure you want to delete this rabbit hole?")) {
    console.log("deleting...");
    await chrome.storage.local.remove([session_key]);
    window.location.href = "/index.html#/overview";
  }
}

export function SessionEditPage() {
  const params = useParams();

  const [session_data, SetSessionData] = useState({});//Sets the initial session data
  const [page_data, SetPageData] = useState([]);

  useEffect(() => {
    RHGetPage(params.session_id).then((data) => {
      SetSessionData(data);
      SetPageData(Array.isArray(data?.data) ? data.data : []);
    });
  }, []);

  useEffect(() => {}, [session_data, page_data]);

  return (
    <>
    <h2 id="white">Session!</h2>
    {SectionRibbon(`${session_data.title}`)}
    <section className="rabbitHole" id="previous">
      <div className="rabbitHole">
        <form action='' onSubmit={(evt) => { RHSaveSession(evt, session_data, page_data) }}>
          {EditSessionMetadata(session_data, SetSessionData)}
          <br />
          {EditSessionTags(session_data, SetSessionData)}
          <br />
          {EditSessionPageList(page_data, SetPageData)}
          <br />
          <IconButton type={`submit`} iconSrc="assets/save_icon.svg" label="Save Session"/>
          <IconButton iconSrc="assets/delete_icon.svg" label="Delete Session" onClick={() => { RHDeleteSession(session_data.session_key); }} />
          <button type="button" onClick={() => window.location.href = `/index.html#/session/${session_data.session_key}`}>Back</button>
        </form>

      </div>
    </section>
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
  function PageUrlOnChange(evt) {
    const idx = evt.target.name;
    const val = evt.target.value;
    const new_title_val = page_data.map((item, i) => {
      if (i == idx) {
        return {...item, url: val};
      } else {
        return item;
      }
    });
    SetPageData(new_title_val);
  }

  function AddPage() {
    const new_data = [...page_data];
    const new_page_obj = {};
    new_page_obj['category'] = "general";
    new_page_obj['concepts'] = [];
    new_page_obj['id'] = "000";
    new_page_obj['lastVisitTime'] = Date.now();
    new_page_obj['manualTags'] = [];
    new_page_obj['structuralTags'] = [];
    new_page_obj['title'] = '';
    new_page_obj['typedCount'] = 0;
    new_page_obj['url'] = '';
    new_page_obj['visitCount'] = 1;

    new_data.unshift(new_page_obj);
    SetPageData(new_data);
  }

  function DeletePage(index) {
    const new_data = [...page_data];
    new_data.splice(index, 1);
    SetPageData(new_data);
  }

  return (
    <div>
    <b>Pages: </b><IconButton id="add_page" iconSrc="assets/add_icon.svg" label="Add Page" onClick={AddPage} />
    <ul>
    {page_data.map((item, idx) => (
      <li key={idx}>
        <input
          name={`${idx}`}
          onChange={PageTitleOnChange}
          value={item.title}
          placeholder={`Title of page`}
          required={true}
        />
        <input
          name={`${idx}`}
          onChange={PageUrlOnChange}
          value={item.url}
          type={`url`}
          onInvalid={() => alert(`${item.title}: Invalid URL`)}
          placeholder={`url of page`}
          required={true}
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

function EditSessionTags(session_data, SetSessionData) {
  const [session_tag, setSessionTagName] = useState({ isAdding: false });
  useEffect(() => {}, [session_tag]);
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

function EditSessionMetadata(data, SetSessionData) {
  function UpdateTitle(evt) {
    const val = evt.target.value;
    SetSessionData(vals => ({ ...vals, title: val }));
  }
  return (
    <>
    <p>
      <b>Topic:</b>
      <input
      name={`title`}
      onChange={UpdateTitle}
      defaultValue={data.title}
      />
    </p>
    <p><b>Date: {data.start_time_datetime}</b></p>
    <p><b>Duration: {data.duration_string}</b></p>
    </>
  );
}
