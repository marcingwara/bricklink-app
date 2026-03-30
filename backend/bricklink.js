import fetch from "node-fetch";
import OAuth from "oauth-1.0a";
import CryptoJS from "crypto-js";

const BASE_URL = "https://api.bricklink.com/api/store/v1";

function createOAuth() {
  return new OAuth({
    consumer: {
      key: process.env.BRICKLINK_CONSUMER_KEY,
      secret: process.env.BRICKLINK_CONSUMER_SECRET,
    },
    signature_method: "HMAC-SHA1",
    hash_function(baseString, key) {
      return CryptoJS.HmacSHA1(baseString, key).toString(CryptoJS.enc.Base64);
    },
  });
}

function getToken() {
  return {
    key: process.env.BRICKLINK_TOKEN_VALUE,
    secret: process.env.BRICKLINK_TOKEN_SECRET,
  };
}

async function bricklinkRequest(path, method = "GET") {
  const url = `${BASE_URL}${path}`;
  const oauth = createOAuth();
  const token = getToken();

  const requestData = { url, method };
  const headers = oauth.toHeader(oauth.authorize(requestData, token));

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: headers.Authorization,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.meta?.description || "Błąd BrickLink API");
  }

  return data;
}

export async function getKnownColorsForPart(partNo) {
  // BrickLink nie daje prostego "wszystkie kolory tej części" jednym lekkim endpointem,
  // więc na start ustawiamy listę najczęstszych kolorów do sprawdzenia.
  // Później możesz to rozbudować o własną tabelę kolorów.
  return [
    { colorId: 1, colorName: "White" },
    { colorId: 5, colorName: "Red" },
    { colorId: 7, colorName: "Blue" },
    { colorId: 11, colorName: "Black" },
    { colorId: 86, colorName: "Light Bluish Gray" },
    { colorId: 85, colorName: "Dark Bluish Gray" },
  ];
}

export async function getPartInfo(partNo) {
  const result = await bricklinkRequest(`/items/PART/${encodeURIComponent(partNo)}`);
  return result.data;
}

export async function getPriceGuide(partNo, colorId) {
  const params = new URLSearchParams({
    item_type: "P",
    color_id: String(colorId),
    guide_type: "sold",
    new_or_used: "N",
    currency_code: "EUR",
  });

  const result = await bricklinkRequest(`/items/PART/${encodeURIComponent(partNo)}/price?${params.toString()}`);
  return result.data;
}