// src/utils/aggregator.js

import { parseStoryPoints } from "./storyPointParser.js";
import { mapLists } from "./statusMapper.js";

// Current snapshot report: totals + per member
export function aggregate(cards, lists) {
  const listMap = mapLists(lists);

  const totals = {
    "TO DO": 0,
    "DOING": 0,
    "DONE": 0,
    "NOT DONE": 0,
  };

  const members = {};

  for (const card of cards) {
    const status = listMap[card.idList];
    if (!status) continue;

    const points = parseStoryPoints(card.name);

    totals[status] += points;

    if (card.members && card.members.length > 0) {
      for (const member of card.members) {
        const mid = member.id;
        if (!members[mid]) {
          members[mid] = {
            id: mid,
            name: member.fullName || "Unknown",
            "TO DO": 0,
            "DOING": 0,
            "DONE": 0,
            "NOT DONE": 0,
          };
        }
        members[mid][status] += points;
      }
    }
  }

  return {
    totals,
    members: Object.values(members),
  };
}

// Daily burndown chart: remaining points over time
export function computeBurndown(cards, actions, lists) {
  const listMap = mapLists(lists);

  const cardPoints = {};
  for (const card of cards) {
    cardPoints[card.id] = parseStoryPoints(card.name);
  }

  const cardHistory = {};

  for (const action of actions) {
    const cardId = action.data.card?.id;
    if (!cardId || cardPoints[cardId] === undefined) continue;

    if (!cardHistory[cardId]) cardHistory[cardId] = [];

    if (action.type === "createCard" || action.type === "convertToCardFromCheckItem") {
      cardHistory[cardId].push({ date: action.date, listId: action.data.list?.id || action.data.listAfter?.id });
    } else if (action.type === "updateCard" && action.data.listAfter) {
      cardHistory[cardId].push({ date: action.date, listId: action.data.listAfter.id });
    }
  }

  // Sort history by date
  for (const id in cardHistory) {
    cardHistory[id].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Date range: last 90 days or from oldest event
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  let startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 90);

  let oldest = today;
  for (const id in cardHistory) {
    if (cardHistory[id].length > 0) {
      const first = new Date(cardHistory[id][0].date);
      if (first < oldest) oldest = first;
    }
  }
  if (oldest > startDate) startDate = oldest;
  startDate.setHours(0, 0, 0, 0);

  const burndown = [];
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);

    let remaining = 0;
    for (const id in cardHistory) {
      const history = cardHistory[id];
      if (history.length === 0) continue;

      let lastListId = null;
      for (const event of history) {
        if (new Date(event.date) > dayEnd) break;
        lastListId = event.listId;
      }
      if (!lastListId) continue;

      const status = listMap[lastListId];
      if (status && status !== "DONE") {
        remaining += cardPoints[id];
      }
    }

    burndown.push({
      date: d.toISOString().slice(0, 10),
      remaining,
    });
  }

  return burndown;
}