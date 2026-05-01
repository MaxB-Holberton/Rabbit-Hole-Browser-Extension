function getHistory() {
  return new Promise((resolve) => {
    chrome.history.search(
      {text: "", maxResults: 10 },
      (results) => resolve(results)
    );
  });
}

chrome.history.onVisited.addListener(async () => {
  const results = await getHistory();
  console.log("Visited:", results);
});

async function run() {
  const results = await getHistory();
  const json = JSON.stringify(results);
  console.log(json);
}

run();
