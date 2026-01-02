// src/routes/report.routes.js
import express from "express";
import { getBoardData } from "../services/trello.service.js";
import { aggregate, computeBurndown } from "../utils/aggregator.js";

const router = express.Router();

router.get("/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    const { TRELLO_KEY, TRELLO_TOKEN } = process.env;

    if (!TRELLO_KEY || !TRELLO_TOKEN) {
      return res.status(400).json({ error: "TRELLO_KEY or TRELLO_TOKEN missing in .env" });
    }

    const { lists, cards, actions } = await getBoardData(boardId, TRELLO_KEY, TRELLO_TOKEN);

    const report = aggregate(cards, lists);
    const burndown = computeBurndown(cards, actions, lists);

    res.json({
      success: true,
      totals: report.totals,
      members: report.members,
      burndown,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to generate report",
    });
  }
});

export default router;