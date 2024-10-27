const express = require("express");
const StockData = require("../models/StockData");
const router = express.Router();

// API 1: Get record(s) with the highest volume
router.get("/highest_volume", async (req, res) => {
  const { start_date, end_date, symbol } = req.query;

  // Build the query object
  const query = {};
  if (symbol) {
    query.symbol = symbol;
  }
  if (start_date && end_date) {
    query.date = { $gte: new Date(start_date), $lte: new Date(end_date) };
  }

  try {
    const highestVolumeRecord = await StockData.find(query)
      .sort({ volume: -1 }) // Sort by volume descending
      .limit(1); // Get the record with the highest volume

    if (highestVolumeRecord.length > 0) {
      res.json({
        highest_volume: {
          date: highestVolumeRecord[0].date,
          symbol: highestVolumeRecord[0].symbol,
          volume: highestVolumeRecord[0].volume,
        },
      });
    } else {
      res.status(404).json({ message: "No records found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API 2: Get average closing price
router.get("/average_close", async (req, res) => {
  const { start_date, end_date, symbol } = req.query;

  // Build the query object
  const query = { symbol };
  if (start_date && end_date) {
    query.date = { $gte: new Date(start_date), $lte: new Date(end_date) };
  }

  try {
    const records = await StockData.find(query);
    const totalClose = records.reduce((sum, record) => sum + record.close, 0);
    const averageClose = records.length ? totalClose / records.length : 0;

    res.json({ average_close: averageClose });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API 3: Get average VWAP
router.get("/average_vwap", async (req, res) => {
  const { start_date, end_date, symbol } = req.query;

  // Build the query object
  const query = {};
  if (symbol) {
    query.symbol = symbol;
  }
  if (start_date && end_date) {
    query.date = { $gte: new Date(start_date), $lte: new Date(end_date) };
  }

  try {
    const records = await StockData.find(query);
    const totalVWAP = records.reduce((sum, record) => sum + record.vwap, 0);
    const averageVWAP = records.length ? totalVWAP / records.length : 0;

    res.json({ average_vwap: averageVWAP });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
