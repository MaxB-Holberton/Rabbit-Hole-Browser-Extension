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
    window.location.href = "/index.html#/previous";
  }
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
    <p className="editP"><b>Pages: </b></p><IconButton id="add_page" iconSrc="assets/add_icon.svg" label="Add Page" onClick={AddPage} />
    <ul>
    {page_data.map((item, idx) => (
      <li
      key={idx}
      className="editSessionPageCard"
      id={`editSessionPageCard_${idx}`}
      >
      <div className="editSessionPageTagBlock" id={`editSessionPageTagBlock_${idx}`}>
      <div className="editSessionPageLinkRow" id={`editSessionPageLinkRow_${idx}`}>
      <input
      className="editSessionPageInput editSessionPageTitleInput"
      id={`editSessionPageTitleInput_${idx}`}
      name={`${idx}`}
      onChange={PageTitleOnChange}
      value={item.title}
      placeholder={`Title of page`}
      required={true}
      />
      <input
      className="editSessionPageInput editSessionPageUrlInput"
      id={`editSessionPageUrlInput_${idx}`}
      name={`${idx}`}
      onChange={PageUrlOnChange}
      value={item.url}
      type={`url`}
      onInvalid={() => alert(`${item.title}: Invalid URL`)}
      placeholder={`url of page`}
      required={true}
      />
      <IconButton
      className="editSessionDeletePageButton editSessionPageDeleteButton"
      id={`editSessionPageDeleteButton_${idx}`}
      iconSrc="assets/delete_icon.svg"
      label="Delete"
      showLabel={false}
      ariaLabel="Delete page"
      onClick={() => { DeletePage(idx) }}
      />
      </div>
      <br />
      <div id={`${idx}_tagdiv`} className="editSessionPageTags" >
      <p className="editSessionPageTagLine editSessionPageCategoryLine"><span className="editSessionPageTagLabel editSessionPageCategoryLabel">Category:</span> <span className="editSessionPageTagValue editSessionPageCategoryValue">{item.category}</span></p>
      <p className="editSessionPageTagLine editSessionPageStructTagLine"><span className="editSessionPageTagLabel editSessionPageStructTagLabel">structTag:</span> <span className="editSessionPageTagValue editSessionPageStructTagValue">{item.structuralTags}</span></p>
      <p className="editSessionPageTagLine editSessionPageManualTagsLine"><span className="editSessionPageTagLabel editSessionPageManualTagsLabel">ManualTags:</span> <span className="editSessionPageTagValue editSessionPageManualTagsValue">{item.manualTags}</span></p>
      </div>
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

  function AddSessionTag(tagValue) {
    const nextTag = (tagValue ?? "").trim();
    if (nextTag === "") {
      return;
    }

    const new_data = {...session_data};
    const currentTags = Array.isArray(new_data.tag_list) ? [...new_data.tag_list] : [];
    currentTags.push(nextTag);
    new_data.tag_list = currentTags;
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
    <div className="sessionEditTagsBlock">
    <p className="editP"><b>Tags: </b></p>
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
      className="editTagInput"
      defaultValue={""}
      onChange={SessionTagName}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          AddSessionTag(session_tag.newTag);
          ResetNewTags();
        }
      }}
      />
      <IconButton
      className="sessionEditAddTagButton"
      iconSrc="assets/add_icon.svg"
      label="Add Tag"
      onClick={() => { AddSessionTag(session_tag.newTag); ResetNewTags(); }}
      />
      <IconButton
      className="sessionEditCancelTagButton"
      iconSrc="assets/delete_icon.svg"
      label="Cancel"
      onClick={ResetNewTags}
      />
      </>
    )}

    {tags.map((tag, index) => (
      <span key={index}
      className="editTagText"
      id={`editTagText_${index}`}
      >{tag}
      <IconButton
      className="editTagDeleteButton editSessionDeleteTagButton"
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
    <div className="sessionMetadata">
      <p className="editP">
        <b>Topic:</b>
        <input
          name={`title`}
          onChange={UpdateTitle}
          defaultValue={data.title}
          className="editInputTitle"
        />
      </p>
      <p className="editP"><b>Date:</b> {data.start_time_datetime}</p>
      <p className="editP"><b>Duration:</b> {data.duration_string}</p>
    </div>
  );
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

  function ScrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function ScrollToBottom() {
    document.getElementById("sessionEditPageEnd")?.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  return (
    <>
    <div className="sessionEditHeader">
      <h2 className="sessionEditHeading">Session!</h2>
      {SectionRibbon(`${session_data.title}`)}
    </div>
    <section className="rabbitHole sessionEditSection" id="previous">
      <div className="sessionEditLayout">
      <div className="rabbitHole sessionEditCard">
        <IconButton
        className="sessionEditSaveButton"
        id="sessionEditSaveButtonTopRight"
        iconSrc="assets/save_icon.svg"
        label="Save Session"
        showLabel={false}
        ariaLabel="Save session"
        onClick={(evt) => { RHSaveSession(evt, session_data, page_data); }}
        />
        <IconButton
        className="sessionEditDeleteButton"
        id="sessionEditDeleteButtonTopRight"
        iconSrc="assets/delete_icon.svg"
        label="Delete Session"
        showLabel={false}
        ariaLabel="Delete session"
        onClick={() => { RHDeleteSession(session_data.session_key); }}
        />
        <form action='' onSubmit={(evt) => { RHSaveSession(evt, session_data, page_data) }}>
          {EditSessionMetadata(session_data, SetSessionData)}
          <br />
          {EditSessionTags(session_data, SetSessionData)}
          <br />
          {EditSessionPageList(page_data, SetPageData)}
          <br />
          <IconButton type={`submit`} iconSrc="assets/save_icon.svg" label="Save Session"/>
          <IconButton className="sessionEditDeleteActionButton" iconSrc="assets/delete_icon.svg" label="Delete Session" onClick={() => { RHDeleteSession(session_data.session_key); }} />
          <IconButton className="sessionEditBackButton" iconSrc="assets/back_icon.svg" label="Back" onClick={() => window.location.href = `/index.html#/session/${session_data.session_key}`} />
        </form>

      </div>
      <div className="sessionEditScrollRail" aria-label="Edit session page navigation">
        <button className="sessionEditScrollButton sessionEditScrollButtonDown" type="button" onClick={ScrollToBottom}>Down to Bottom</button>
        <button className="sessionEditScrollButton sessionEditScrollButtonTop" type="button" onClick={ScrollToTop}>Back to Top</button>
      </div>
      </div>
    </section>
    <div id="sessionEditPageEnd" />
    </>
  );
}
