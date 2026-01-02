import axios from "axios";

const TRELLO_BASE = "https://api.trello.com/1";

export async function getBoardData(boardId, apiKey, token) {
  const auth = { key: apiKey, token };

  // Get lists
  const listsRes = await axios.get(`${TRELLO_BASE}/boards/${boardId}/lists`, { params: auth });
  const allLists = listsRes.data;

  const validNames = ["TODO", "TO DO", "DOING", "DONE", "NOT DONE"];
  const filteredLists = allLists.filter((list) =>
    validNames.includes(list.name.trim().toUpperCase())
  );

  if (filteredLists.length === 0) {
    throw new Error("No matching lists found (TODO/TO DO, DOING, DONE, NOT DONE)");
  }

  // Get cards
  const cardsPromises = filteredLists.map((list) =>
    axios.get(`${TRELLO_BASE}/lists/${list.id}/cards`, {
      params: { ...auth, members: "true", member_fields: "fullName" },
    })
  );
  const cardsResponses = await Promise.all(cardsPromises);
  const cards = cardsResponses.flatMap((res) => res.data);

  // Get relevant actions (createCard + moves) with pagination
  const actions = await fetchBoardActions(boardId, apiKey, token);

  return { lists: filteredLists, cards, actions };
}

async function fetchBoardActions(boardId, apiKey, token) {
  // Only fetch actions from the last 90 days to avoid long waits
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const since = ninetyDaysAgo.toISOString();

  const params = {
    key: apiKey,
    token,
    filter: "createCard,updateCard:idList,convertToCardFromCheckItem",
    limit: 1000,
    fields: "date,type,data",
    since, // ← This limits to last 90 days
  };

  let actions = [];
  let before = null;

  do {
    if (before) params.before = before;
    const res = await axios.get(`${TRELLO_BASE}/boards/${boardId}/actions`, { params });
    const batch = res.data;
    if (batch.length === 0) break;

    actions = actions.concat(batch);
    before = batch[batch.length - 1].date;
  } while (true);

  return actions;
}