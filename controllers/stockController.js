const csv = require("csv-parser");
const fs = require("fs");
const StockData = require("../models/StockData");

const processCSV = async (req, res) => {
  const filePath = req.file.path;
  let totalRecords = 0,
    successfulRecords = 0,
    failedRecords = 0;
  const errors = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", async (row) => {
      totalRecords++;

      // Validation
      const {
        Date,
        Symbol,
        Series,
        PrevClose,
        Open,
        High,
        Low,
        Last,
        Close,
        VWAP,
        Volume,
        Turnover,
        Trades,
        Deliverable,
      } = row;

      // Use dynamic property access for "%Deliverable"
      const percentDeliverable = parseFloat(row["%Deliverable"]);

      if (
        !Date ||
        isNaN(PrevClose) ||
        isNaN(Open) ||
        isNaN(High) ||
        isNaN(Low) ||
        isNaN(Last) ||
        isNaN(Close) ||
        isNaN(VWAP) ||
        isNaN(Volume) ||
        isNaN(Turnover) ||
        isNaN(Trades) ||
        isNaN(Deliverable) ||
        isNaN(parseFloat("%Deliverable"))
      ) {
        failedRecords++;
        errors.push({ row, reason: "Invalid data format" });
        return;
      }

      // Save valid data
      try {
        await StockData.create({
          date: Date,
          symbol: Symbol,
          series: Series,
          prev_close: parseFloat(PrevClose),
          open: parseFloat(Open),
          high: parseFloat(High),
          low: parseFloat(Low),
          last: parseFloat(Last),
          close: parseFloat(Close),
          vwap: parseFloat(VWAP),
          volume: parseInt(Volume),
          turnover: parseFloat(Turnover),
          trades: parseInt(Trades),
          deliverable: parseInt(Deliverable),
          percent_deliverable: percentDeliverable,
        });

        successfulRecords++;
      } catch (err) {
        failedRecords++;
        errors.push({ row, reason: err.message });
      }
    })
    .on("end", () => {
      fs.unlinkSync(filePath);
      res.json({
        total_records: totalRecords,
        successful_records: successfulRecords,
        failed_records: failedRecords,
        errors,
      });
    });
};
// Validation Logic
const validateStockData = (data) => {
  return (
    data.date &&
    !isNaN(data.prev_close) &&
    !isNaN(data.open) &&
    !isNaN(data.high) &&
    !isNaN(data.low) &&
    !isNaN(data.last) &&
    !isNaN(data.close) &&
    !isNaN(data.vwap) &&
    !isNaN(data.volume) &&
    !isNaN(data.turnover) &&
    !isNaN(data.trades) &&
    !isNaN(data.deliverable) &&
    !isNaN(data.percent_deliverable)
  );
};

// Average Calculation Logic
const calculateAverage = (data) => {
  if (data.length === 0) return 0;
  const total = data.reduce((sum, record) => sum + record.close, 0);
  return total / data.length;
};

module.exports = { processCSV,validateStockData, calculateAverage };


