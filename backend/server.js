import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getKnownColorsForPart, getPartInfo, getPriceGuide } from "./bricklink.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/part/:partNo", async (req, res) => {
  try {
    const { partNo } = req.params;

    const part = await getPartInfo(partNo);
    const colorsToCheck = await getKnownColorsForPart(partNo);

    const results = [];

    for (const color of colorsToCheck) {
      try {
        const priceGuide = await getPriceGuide(partNo, color.colorId);

        if (priceGuide?.avg_price) {
          results.push({
            colorId: color.colorId,
            colorName: color.colorName,
            avgPriceEur: priceGuide.avg_price,
            qtyAvgPrice: priceGuide.qty_avg_price ?? null,
            unitsSold: priceGuide.unit_quantity ?? null,
            weightGrams: part.weight ?? null,
          });
        }
      } catch {
        // ignorujemy kolory bez danych cenowych
      }
    }

    res.json({
      success: true,
      partNo: part.no,
      name: part.name,
      categoryId: part.category_id,
      type: part.type,
      weightGrams: part.weight ?? null,
      colors: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Nie udało się pobrać danych",
    });
  }
});

app.listen(port, () => {
  console.log(`Backend działa na http://localhost:${port}`);
});