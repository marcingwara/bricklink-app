import React, { useMemo, useState } from "react";
import "./styles.css";

const DATA = {
  "44728": {
    partNo: "44728",
    name: "Bracket 1x2 - 2x2",
    colors: [
      { color: "Black", priceNet: 0.058824, priceGross: 0.07, weightKg: 0.001 },
      { color: "White", priceNet: 0.058824, priceGross: 0.07, weightKg: 0.001 },
      { color: "Red", priceNet: 0.058824, priceGross: 0.07, weightKg: 0.001 },
    ],
    type: "Bracket",
    size: "1x2 - 2x2",
    condition: "New",
  },
  "3004": {
    partNo: "3004",
    name: "Brick 1 x 2",
    colors: [
      { color: "Red", priceNet: 0.05, priceGross: 0.0595, weightKg: 0.00079 },
      { color: "Black", priceNet: 0.05, priceGross: 0.0595, weightKg: 0.00079 },
      { color: "White", priceNet: 0.05, priceGross: 0.0595, weightKg: 0.00079 },
    ],
    type: "Brick",
    size: "1x2",
    condition: "New",
  },
};

const tabs = [
  "Beschreibung",
  "Details",
  "Stocks",
  "Versand",
  "Preise",
  "SEO",
  "Optionen",
  "Module",
];

function createSku(partNo, color) {
  return `${partNo}-${color}`;
}

function formatEur(value) {
  return Number(value || 0).toFixed(2).replace(".", ",") + " €";
}

export default function App() {
  const [input, setInput] = useState("");
  const [searched, setSearched] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Beschreibung");

  const [product, setProduct] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [message, setMessage] = useState("");

  const result = useMemo(() => {
    const key = searched.trim().toLowerCase();
    return DATA[key] || null;
  }, [searched]);

  const selectedColor =
    result && result.colors[selectedColorIndex]
      ? result.colors[selectedColorIndex]
      : null;

  const handleSearch = () => {
    setSearched(input);
    setSelectedColorIndex(0);
    setProduct(null);
    setMessage("");
  };

  const handleCreateProduct = () => {
    if (!result || !selectedColor) return;

    const sku = createSku(result.partNo, selectedColor.color);

    setProduct({
      articleName: `${result.partNo} ${result.name} - ${selectedColor.color}`,
      sku,
      mpn: result.partNo,
      upc: "",
      ean: "",
      isbn: "",
      language: "DE",

      partNo: result.partNo,
      partName: result.name,
      type: result.type,
      size: result.size,
      color: selectedColor.color,
      condition: result.condition,

      descriptionShort: "",
      descriptionLong: "",

      stock: 1,
      active: false,

      weightKg: selectedColor.weightKg,
      widthCm: 0,
      heightCm: 0,
      depthCm: 0,

      deliveryInStock: "Geliefert innerhalb 3 bis 4 Tagen",
      deliveryOutOfStock: "Geliefert innerhalb 5 bis 7 Tagen",

      priceNet: selectedColor.priceNet,
      taxRate: 19,
      priceGross: selectedColor.priceGross,
      purchasePrice: 0,

      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",

      images: [],
    });

    setMainImageIndex(0);
    setActiveTab("Beschreibung");
    setMessage("");
  };

  const handleProductChange = (field, value) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              id: `${file.name}-${Date.now()}-${Math.random()}`,
              name: file.name,
              src: reader.result,
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setProduct((prev) => {
      const next = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: next,
      };
    });
    setMainImageIndex(0);
  };

  const handleSave = () => {
    if (!product) return;
    setMessage("Produktstruktur gotowa. Kolejny krok to zapis do backendu.");
  };

  const marginValue =
    product ? Number(product.priceNet || 0) - Number(product.purchasePrice || 0) : 0;

  const marginPercent =
    product && Number(product.priceNet) > 0
      ? (marginValue / Number(product.priceNet || 1)) * 100
      : 0;

  return (
    <div className="page-shell">
      {!product && (
        <div className="search-card">
          <h1>Wyszukiwarka LEGO</h1>
          <p>Wyszukaj element i utwórz strukturę produktu podobną do panelu sklepu.</p>

          <div className="search-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Np. 44728 albo 3004"
            />
            <button onClick={handleSearch}>Szukaj</button>
          </div>

          <div className="quick-row">
            {["44728", "3004"].map((partNo) => (
              <button
                key={partNo}
                className="quick-chip"
                onClick={() => {
                  setInput(partNo);
                  setSearched(partNo);
                }}
              >
                {partNo}
              </button>
            ))}
          </div>

          {result && (
            <div className="result-box">
              <div className="result-title">
                {result.partNo} {result.name}
              </div>

              <label className="field-label">Wybierz kolor</label>
              <select
                value={selectedColorIndex}
                onChange={(e) => setSelectedColorIndex(Number(e.target.value))}
                className="select-field"
              >
                {result.colors.map((entry, index) => (
                  <option key={index} value={index}>
                    {entry.color} — {formatEur(entry.priceGross)}
                  </option>
                ))}
              </select>

              <div className="meta-grid">
                <div className="meta-box">
                  <strong>Type:</strong> {result.type}
                </div>
                <div className="meta-box">
                  <strong>Size:</strong> {result.size}
                </div>
                <div className="meta-box">
                  <strong>Condition:</strong> {result.condition}
                </div>
              </div>

              <button className="primary-btn" onClick={handleCreateProduct}>
                Utwórz strukturę produktu
              </button>
            </div>
          )}
        </div>
      )}

      {product && (
        <div className="admin-layout">
          <div className="admin-topbar">
            <div className="top-left">
              <div className="main-thumb">
                {product.images[mainImageIndex] ? (
                  <img src={product.images[mainImageIndex].src} alt="main" />
                ) : (
                  <div className="thumb-placeholder">IMG</div>
                )}
              </div>

              <div className="top-main-fields">
                <label className="field-label">Artikelname</label>
                <div className="title-row">
                  <input
                    className="text-field"
                    value={product.articleName}
                    onChange={(e) => handleProductChange("articleName", e.target.value)}
                  />
                  <select
                    className="lang-select"
                    value={product.language}
                    onChange={(e) => handleProductChange("language", e.target.value)}
                  >
                    <option value="DE">DE</option>
                    <option value="EN">EN</option>
                  </select>
                </div>

                <div className="toggle-row">
                  <span>Standard-Artikel</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={product.active}
                      onChange={(e) => handleProductChange("active", e.target.checked)}
                    />
                    <span className="slider" />
                  </label>
                  <span>{product.active ? "Aktiv" : "Deaktiviert"}</span>
                </div>
              </div>
            </div>

            <div className="top-right">
              <div className="price-pill">{formatEur(product.priceNet)} zzgl. MwSt.</div>
              <div className="price-pill">{formatEur(product.priceGross)} Inkl. Steuer</div>
              <div className="stock-pill">{product.stock} auf Lager</div>
              <div className="article-no">Artikel-Nr.: {product.sku}</div>
            </div>
          </div>

          <div className="tabs-row">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="panel-card">
            {activeTab === "Beschreibung" && (
              <>
                <section className="section-block">
                  <div className="section-title">Zdjęcia produktu</div>

                  <div className="image-gallery">
                    <label className="upload-box">
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                      <span>Dodaj zdjęcia</span>
                    </label>

                    {product.images.map((image, index) => (
                      <div
                        key={image.id}
                        className={`image-tile ${mainImageIndex === index ? "main" : ""}`}
                      >
                        <img
                          src={image.src}
                          alt={image.name}
                          onClick={() => setMainImageIndex(index)}
                        />
                        <div className="image-actions">
                          <button type="button" onClick={() => setMainImageIndex(index)}>
                            Tytułbild
                          </button>
                          <button type="button" onClick={() => removeImage(index)}>
                            Usuń
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="section-block">
                  <div className="section-title">Übersicht</div>
                  <label className="field-label">Opis krótki</label>
                  <textarea
                    className="textarea-field"
                    rows={4}
                    value={product.descriptionShort}
                    onChange={(e) => handleProductChange("descriptionShort", e.target.value)}
                  />
                </section>

                <section className="section-block">
                  <div className="section-title">Beschreibung</div>
                  <label className="field-label">Opis główny</label>
                  <textarea
                    className="textarea-field"
                    rows={7}
                    value={product.descriptionLong}
                    onChange={(e) => handleProductChange("descriptionLong", e.target.value)}
                  />
                </section>
              </>
            )}

            {activeTab === "Details" && (
              <>
                <section className="section-block">
                  <div className="section-title">Verweise</div>
                  <div className="form-grid three">
                    <div>
                      <label className="field-label">Artikel-Nr.</label>
                      <input
                        className="text-field"
                        value={product.sku}
                        onChange={(e) => handleProductChange("sku", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">Hersteller-Teilenummer (MPN)</label>
                      <input
                        className="text-field"
                        value={product.mpn}
                        onChange={(e) => handleProductChange("mpn", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">UPC Barcode</label>
                      <input
                        className="text-field"
                        value={product.upc}
                        onChange={(e) => handleProductChange("upc", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">EAN-13 oder JAN Barcode</label>
                      <input
                        className="text-field"
                        value={product.ean}
                        onChange={(e) => handleProductChange("ean", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">ISBN</label>
                      <input
                        className="text-field"
                        value={product.isbn}
                        onChange={(e) => handleProductChange("isbn", e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <section className="section-block">
                  <div className="section-title">Eigenschaften</div>

                  <div className="property-row">
                    <div className="property-name">Type</div>
                    <div className="property-value">{product.type}</div>
                  </div>
                  <div className="property-row">
                    <div className="property-name">Size</div>
                    <div className="property-value">{product.size}</div>
                  </div>
                  <div className="property-row">
                    <div className="property-name">Color</div>
                    <div className="property-value">{product.color}</div>
                  </div>
                  <div className="property-row">
                    <div className="property-name">Condition</div>
                    <div className="property-value">{product.condition}</div>
                  </div>
                  <div className="property-row">
                    <div className="property-name">Part Number</div>
                    <div className="property-value">{product.partNo}</div>
                  </div>
                </section>
              </>
            )}

            {activeTab === "Stocks" && (
              <section className="section-block">
                <div className="section-title">Stocks</div>
                <div className="form-grid two">
                  <div>
                    <label className="field-label">Stock quantity</label>
                    <input
                      type="number"
                      className="text-field"
                      value={product.stock}
                      onChange={(e) => handleProductChange("stock", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Status</label>
                    <select
                      className="select-field"
                      value={product.active ? "active" : "inactive"}
                      onChange={(e) => handleProductChange("active", e.target.value === "active")}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "Versand" && (
              <>
                <section className="section-block">
                  <div className="section-title">Paketgröße</div>
                  <div className="form-grid four">
                    <div>
                      <label className="field-label">Breite</label>
                      <input
                        className="text-field"
                        value={product.widthCm}
                        onChange={(e) => handleProductChange("widthCm", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">Höhe</label>
                      <input
                        className="text-field"
                        value={product.heightCm}
                        onChange={(e) => handleProductChange("heightCm", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">Tiefe</label>
                      <input
                        className="text-field"
                        value={product.depthCm}
                        onChange={(e) => handleProductChange("depthCm", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">Gewicht</label>
                      <input
                        className="text-field"
                        value={product.weightKg}
                        onChange={(e) => handleProductChange("weightKg", e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <section className="section-block">
                  <div className="section-title">Delivery time</div>
                  <div className="form-grid two">
                    <div>
                      <label className="field-label">Lieferzeit für vorrätige Artikel</label>
                      <input
                        className="text-field"
                        value={product.deliveryInStock}
                        onChange={(e) => handleProductChange("deliveryInStock", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">
                        Lieferzeit von bestellbaren Artikeln, die nicht vorrätig sind
                      </label>
                      <input
                        className="text-field"
                        value={product.deliveryOutOfStock}
                        onChange={(e) => handleProductChange("deliveryOutOfStock", e.target.value)}
                      />
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === "Preise" && (
              <>
                <section className="section-block">
                  <div className="section-title">Einzelhandelspreis</div>
                  <div className="form-grid three">
                    <div>
                      <label className="field-label">Verkaufspreis (exkl. MwSt.)</label>
                      <input
                        className="text-field"
                        value={product.priceNet}
                        onChange={(e) => handleProductChange("priceNet", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">Steuerregel</label>
                      <select
                        className="select-field"
                        value={product.taxRate}
                        onChange={(e) => handleProductChange("taxRate", e.target.value)}
                      >
                        <option value="19">DE Standard Rate (19%)</option>
                        <option value="7">DE Reduced Rate (7%)</option>
                        <option value="0">No Tax</option>
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Verkaufspreis (inkl. MwSt.)</label>
                      <input
                        className="text-field"
                        value={product.priceGross}
                        onChange={(e) => handleProductChange("priceGross", e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <section className="section-block">
                  <div className="form-grid three">
                    <div>
                      <label className="field-label">Einkaufspreis (ohne MwSt.)</label>
                      <input
                        className="text-field"
                        value={product.purchasePrice}
                        onChange={(e) => handleProductChange("purchasePrice", e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <section className="section-block overview-row">
                  <div className="overview-box">
                    <div>{formatEur(product.priceNet)} zzgl. MwSt.</div>
                    <div>{formatEur(product.priceGross)} inkl. MwSt.</div>
                  </div>
                  <div className="overview-box">
                    <div>{formatEur(marginValue)} Marge</div>
                    <div>{marginPercent.toFixed(2)}% margin rate</div>
                    <div>{formatEur(product.purchasePrice)} Selbstkostenpreis</div>
                  </div>
                </section>
              </>
            )}

            {activeTab === "SEO" && (
              <section className="section-block">
                <div className="section-title">SEO</div>
                <div className="form-grid one">
                  <div>
                    <label className="field-label">SEO Title</label>
                    <input
                      className="text-field"
                      value={product.seoTitle}
                      onChange={(e) => handleProductChange("seoTitle", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">SEO Description</label>
                    <textarea
                      className="textarea-field"
                      rows={4}
                      value={product.seoDescription}
                      onChange={(e) => handleProductChange("seoDescription", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">SEO Keywords</label>
                    <input
                      className="text-field"
                      value={product.seoKeywords}
                      onChange={(e) => handleProductChange("seoKeywords", e.target.value)}
                    />
                  </div>
                </div>
              </section>
            )}

            {activeTab === "Optionen" && (
              <section className="section-block">
                <div className="section-title">Optionen</div>
                <p className="muted-text">Tutaj później dodamy warianty, opcje i konfigurację produktu.</p>
              </section>
            )}

            {activeTab === "Module" && (
              <section className="section-block">
                <div className="section-title">Module</div>
                <p className="muted-text">Tutaj później można podłączyć moduły sklepu i automatyzacje.</p>
              </section>
            )}
          </div>

          <div className="bottom-actions">
            <button className="ghost-btn" onClick={() => setProduct(null)}>
              Zum Katalog wechseln
            </button>
            <div className="action-right">
              {message && <div className="info-msg">{message}</div>}
              <button className="primary-btn" onClick={handleSave}>
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}