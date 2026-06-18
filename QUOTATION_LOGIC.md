# Kalpana Solar — Quotation Logic (Verification Guide)

This document describes **exactly how the quotation wizard calculates price and selects equipment**. Use it to verify behaviour against client rules and rate sheets.

**Source files (implementation):**

| Area | File |
|------|------|
| Wizard UI | `src/components/QuotationGenerator.jsx` |
| Full price breakdown | `src/calculations/calculateQuote.js` |
| Panel / inverter / battery matching | `src/calculations/matching.js` |
| Panel rates & watt options | `src/data/prices/panels.js` |
| Inverter brand rules | `src/data/prices/inverterRules.js` |
| Microtek inverter prices | `src/data/prices/microtek.js` |
| Invergy inverter prices | `src/data/prices/invergy.js` |
| Battery prices | `src/data/prices/batteries.js` |
| Services & margin | `src/data/prices/services.js` |
| GST rules | `src/data/prices/taxes.js` |
| Tata kits | `src/data/prices/tata.js` |
| PDF / BOM content | `src/data/quotationDocument.js` |

---

## 1. Wizard flow (3 steps)

```
Step 1 — Customer details
  Name (required), Phone (required), Address, City

Step 2 — System configuration
  Plant load, Installation type, System type, conditional fields, panels, inverter

Step 3 — Preview + PDF
  4-page quotation document → Print / Save PDF
```

**Layout:** Navbar and footer are hidden on `/quote` so the wizard is full-screen.

---

## 2. Form inputs & validation

### 2.1 Always required

| Field | Options / rule |
|-------|----------------|
| **Plant load** | **1, 2, 3 … 10 kW** (integer steps only — no 0.5 kW) |
| **Installation type** | Residential, Commercial |
| **System type** | On-Grid, Hybrid, Off-Grid |
| **Panel company** | Adani, Waaree, Vikram, Premier, Tata |

### 2.2 Conditional fields

| Condition | Extra field |
|-----------|-------------|
| System type = **On-Grid** or **Hybrid** | **Building floors** (1–5) — used for wiring cost |
| System type = **Hybrid** or **Off-Grid** | **Battery backup** — Yes / No |
| Panel company ≠ **Tata** | **Module wattage** (see §3) |
| Panel company ≠ **Tata** | **Inverter brand** — Invergy or Microtek (both always shown) |

### 2.3 Tata kit shortcut

If **Panel company = Tata**:

- Valid **only** when: **On-Grid** + **3 kW** or **4 kW**
- No watt option, inverter, floors, or battery steps needed
- Fixed all-inclusive price (see §8)

### 2.4 When the quote fails (returns no price)

The **Generate Quotation** button stays disabled and price shows `—` when:

- Required fields are missing
- Tata selected but not On-Grid 3/4 kW
- No compatible inverter in the price list for `requiredKw`
- Battery requested but no lithium model matches inverter DC bus voltage
- Example: Microtek off-grid **6 kW+ with battery** on a **96 V MPPT** inverter (no 96 V battery in catalog)

---

## 3. Solar panels

### 3.1 Panel companies & rate groups

| Company | Rate group | Same ₹/W as |
|---------|------------|-------------|
| Adani | `adani_waaree` | — |
| Waaree | `adani_waaree` | Adani |
| Vikram | `vikram` | — |
| Premier | `vikram` | Vikram |
| Tata | *(kit — not per-watt)* | §8 |

**Topcon / Bifacial is NOT shown to the customer.** The backend derives category from the selected **wattage option**.

### 3.2 ₹/W rates (ex-GST) + 5% GST on panels

| Tier | Category | Adani / Waaree | Vikram / Premier |
|------|----------|----------------|------------------|
| **DCR** | Topcon | ₹29/W | ₹27/W |
| **DCR** | Bifacial | ₹27/W | ₹25/W |
| **Non-DCR** | Topcon only | ₹17/W | ₹16/W |

- **On-Grid & Hybrid** → **DCR** panels  
- **Off-Grid** → **Non-DCR** panels (Topcon only)

GST: `panel_cost = round(ex_gst × 1.05)`

### 3.3 Wattage options (customer selects one)

Pricing and panel count use the **maximum watt** of each range:

| Option ID | Range shown | Priced & sized @ | Hidden category |
|-----------|-------------|------------------|-----------------|
| 555 | 540–555 Wp | **555 W** | Bifacial |
| 590 | 580–590 Wp | **590 W** | Topcon |
| 630 | 600–630 Wp | **630 W** | Topcon |

**By system type:**

| System type | Watt options offered |
|-------------|----------------------|
| On-Grid | 555, 590, 630 |
| Hybrid | 555, 590, 630 |
| Off-Grid | **630 only** (auto-applied) |

### 3.4 Panel count & kWp

```
target_watts     = plant_load_kw × 1000
panel_count      = ceil(target_watts / watt_per_panel)
total_watts      = panel_count × watt_per_panel
panel_kwp        = total_watts / 1000   (rounded to 2 decimals)
ex_gst_panel     = total_watts × rate_per_watt_ex_gst
panel_cost       = ex_gst_panel × 1.05
```

**Example:** 3 kW load, 590 W panels  
→ `ceil(3000/590) = 6` panels → 3540 W → **3.54 kWp**

**Quotation display:** Shows **wattage range + panel count** (not “Topcon/Bifacial”).

---

## 4. Inverters

### 4.1 Brand selection (UI)

- **Both Invergy and Microtek** are always selectable for On-Grid, Hybrid, and Off-Grid.
- UI marks one as **“Preferred — lower price”** (default recommendation).
- Customer can switch brand; price recalculates.

**Preferred brand rules:**

| System type | Preferred brand |
|-------------|-----------------|
| On-Grid | **Invergy** |
| Hybrid | **Microtek** if plant load ≤ 3 kW, else **Invergy** |
| Off-Grid | **Microtek** if plant load ≤ 4 kW, else **Invergy** |

### 4.2 Inverter sizing rule

Inverter is sized to the **declared plant load (kW)**, not panel kWp:

```
required_kw = plant_load_kw
```

Panels are sized separately (`ceil(plant_kw × 1000 / watt_per_panel)`). Oversizing the inverter to panel kWp (e.g. picking 5 kW for a 3 kW job because panels total 3.54 kWp) was incorrect and is **not** used.

A model qualifies if:

```
rated_kw (or kVA) >= required_kw - 0.05    // small tolerance for rounding
```

Smallest qualifying (lowest cost) model is chosen from the selected brand’s catalog.

### 4.3 Which price list is used

Inverter and battery pricing come **only** from:

1. **Microtek** — Jaganlite price list (`microtek.js`)
2. **Invergy** — MSP price list (`invergy.js`) + Kalpana hybrid quote overrides (`INVERGY_HYBRID_QUOTE_PRICES`, checked first)

#### On-Grid (no battery)

| Brand | Catalog | GST |
|-------|---------|-----|
| Microtek | `MICROTEK_ONGRID_GTI` (1-ph then 3-ph) | ex-GST + 5% |
| Invergy | `INVERGY_ONGRID` (1P then 3P) | MSP GST-inclusive |

#### Hybrid (with battery)

| Brand | Catalog | Notes |
|-------|---------|-------|
| Microtek | `MICROTEK_HYBRID` | DC bus from voltage field (e.g. 48–51.2 V → 48 V bucket) |
| Invergy | 1) `INVERGY_HYBRID_QUOTE_PRICES` (INV-OGH-3.0K / 5.0K) → 2) `INVERGY_OFFGRID_OGH` MSP → 3) `INVERGY_HYBRID_LV` MSP | DC bus parsed from OGH model name (e.g. 24 V) |

#### Hybrid (without battery)

Same as **On-Grid** (grid-tied inverter, no DC bus).

#### Off-Grid

| Brand | Catalog | Notes |
|-------|---------|-------|
| Microtek | `MICROTEK_OFFGRID_PWM` + `MICROTEK_OFFGRID_MPPT` merged | Cheapest model ≥ required kVA |
| Invergy | `INVERGY_OFFGRID_OG` | Smallest MSP ≥ required kW |

### 4.4 DC bus voltage (for battery matching)

Parsed from model name / voltage hint:

| Detected | DC bus |
|----------|--------|
| 12 V, 12.8 V | 12 |
| 24 V, 25.6 V | 24 |
| 48 V, 51.2 V, “48–51.2 V” | 48 |
| 96 V, 120 V | 96 / 120 *(no battery in catalog)* |

On-Grid inverters without battery: `dcBusVoltage = null` (no battery step).

---

## 5. Batteries

### 5.1 Rules

- **Lithium only**
- Customer does **not** pick battery brand
- **Battery brand = inverter brand** automatically
- Only shown when Hybrid/Off-Grid + **“Yes, include battery”**

### 5.2 Catalog (official lists only)

**Microtek** (ex-GST + 18% GST):

| Size | Voltage | Ah | Price (ex-GST) |
|------|---------|-----|----------------|
| 1.28 kW | 12.8 V | 100 | ₹16,000 |
| 2.56 kW | 25.6 V | 100 | ₹32,000 |
| 5.12 kW | 51.2 V | 100 | ₹64,000 |

**Invergy** (ex-GST + 18% GST):

| Size | Voltage | Ah | Price (ex-GST) |
|------|---------|-----|----------------|
| 1.2 kW | 12 V | 100 | ₹15,349 |
| 2.4 kW | 24 V | 100 | ₹29,463 |
| 5.12 kW Wall Mount | 51.2 V | 100 | ₹70,000 |

### 5.3 Voltage matching

Batteries and inverters are matched via **voltage bucket**:

```
≤ 13 V  → 12 V bucket
≤ 26 V  → 24 V bucket
≤ 55 V  → 48 V bucket
> 55 V  → no match (no battery in catalog)
```

Battery nominal voltage must fall in the **same bucket** as the inverter DC bus.

### 5.4 Size selection — one standard tier per voltage bus

Client rule: pair **one standard lithium battery** to the inverter DC voltage bucket:

| Inverter DC bus | Battery tier |
|-----------------|--------------|
| 12 V | 1.2 kW (12 V / 100 Ah) |
| 24 V | 2.4 kW (24 V / 100 Ah) |
| 48 V | 5 kW (51.2 V / 100 Ah) |

Among voltage-compatible models, pick the **smallest standard tier** in that bucket (not a % of plant load).

**Example — 3 kW hybrid + Invergy + battery:**  
- Inverter 24 V bus → **2.4 kW (24 V)** battery  

**Example — 3 kW hybrid + Microtek + battery:**  
- Microtek hybrid 3 kW is **48 V only** → **5 kW (51.2 V)** battery (catalog limitation)

---

## 6. Services, subtotal & final price

### 6.1 Component costs (non-Tata)

| Component | Formula |
|-----------|---------|
| **Panels** | §3.4 |
| **Inverter** | From brand catalog + GST rules |
| **Battery** | From brand catalog + 18% GST (0 if no battery) |
| **Wiring** | On-Grid: ₹3,000 × floors · Hybrid: ₹5,000 × floors · Off-Grid: ₹0 |
| **Installation labour** | ₹2 × **total panel watts** |
| **Installation material** | ₹3.5 × **total panel watts** |
| **Civil work** | ₹0.4 × **total panel watts** |
| **Devices misc** | Fixed ₹5,000 |
| **Paperwork misc** | Fixed ₹5,000 |

### 6.2 Margin & final price

```
subtotal   = sum of all components above
margin     = round(subtotal × profit_rate)
final_price = subtotal + margin

profit_rate:
  plant load ≤ 5 kW  → 25%
  plant load > 5 kW  → 15%
```

Equipment GST (5% inverter, 18% battery) is **included inside each component cost** before margin. Profit is applied to the **full subtotal** (equipment + services).

### 6.3 Inverter phase (≥ 5 kW)

For **on-grid** and **hybrid** systems with plant load **≥ 5 kW**, the wizard offers **Single Phase** or **Three Phase**. The matching engine picks from the corresponding 1P or 3P catalog for Microtek / Invergy.

### 6.4 Calculation order (standard path)

```
1. Validate selections
2. If Tata → flat kit price (§8) — STOP
3. Select panel → panel_kwp
4. Resolve inverter brand (user choice or preferred)
5. Select inverter(required_kw, brand, system_type, with_battery)
6. If battery needed → select battery(inverter_brand, dc_bus, plant_kw)
7. If inverter or battery missing → quote fails
8. Sum components + 25% margin → final_price
```

---

## 7. Tata on-grid kits

| Plant load | System | Base kit (rate list) | With services + 25% margin (example, 1 floor) |
|------------|--------|----------------------|-----------------------------------------------|
| 3 kW | On-Grid only | **₹2,00,000** | ≈ **₹2,88,375** |
| 4 kW | On-Grid only | **₹2,50,000** | ≈ **₹3,58,250** |

- Kit price is **equipment only** (bundled panels + inverter)
- Same per-watt service lines as standard quotes (install ₹2/W, material ₹3.5/W, civil ₹0.4/W, wiring, misc)
- **25% profit margin** applied to full subtotal (3 kW & 4 kW are ≤ 5 kW)
- Building floors required for wiring cost

---

## 8. Quotation PDF / BOM

### 8.1 Equipment lines

1. **Solar modules** — `{count} × {watt}W {company} ({DCR/Non-DCR})` or Tata kit line  
2. **Inverter** — brand, kW, model  
3. **Battery** — if included; lithium, voltage/Ah  

Topcon/Bifacial is **not** printed — only watt range and quantity.

### 8.2 Standard components (always listed)

Key client-specified items (among others):

| Item | Rating | Qty |
|------|--------|-----|
| Havells / Polycab DC Wire | 4 mm | As per need |
| Armoured AC Cable | 10 mm | As per need |
| Earthing Alu-Green Wire | 16 mm | **3** |
| Earthing Rod | 1 mtr | **3** |

Full list: `STANDARD_BOM_ITEMS` in `src/data/quotationDocument.js`.

### 8.3 PDF generation

- Preview renders 4 A4 pages in the browser  
- **Print / Save PDF** captures each page via html2canvas → jsPDF  
- Each preview page = one PDF page (fixed A4 size)

---

## 9. Worked examples (verification)

### Example A — On-Grid 3 kW, Adani 590 W, Invergy, 1 floor

```
Plant load:     3 kW
Panels:         ceil(3000/590) = 6 × 590 W = 3.54 kWp
Panel cost:     3540 W × ₹29/W × 1.05 ≈ ₹107,793
Inverter:       3 kW on-grid (INV (EU)-E-3 GT-01) ≈ ₹14,983
Equipment:      ≈ ₹122,776
Services:       wiring ₹3,000 + install ₹7,080 + civil ₹1,200 + fixed ₹24,000 ≈ ₹35,280
Subtotal:       ≈ ₹158,056
Final:          subtotal + 25% margin ≈ ₹197,570
```

### Example B — Hybrid 3 kW + battery, Adani 590 W, Invergy

```
Plant load:     3 kW → Invergy INV-OGH-3.0K (AVMIIP)-24V @ ₹35,200 quote MSP
Battery:        Invergy 2.4 kW (24 V) — voltage matched to 24 V bus
Equipment:      panels + inverter + battery ≈ ₹172,456
Final (with services + 25% margin): run wizard — lower than using LV-only hybrid catalog
```

### Example C — Hybrid 3 kW + battery, Microtek

```
Inverter:       Microtek 3 kW hybrid, 48 V bus
Battery:        Only 5.12 kW (51.2 V) in Microtek catalog for 48 V bucket
Note:           Larger battery than Example B — catalog constraint
```

### Example D — Off-Grid 5 kW + battery, Premier 630 W, Microtek

```
Panels:         ceil(5000/630) = 8 × 630 W = 5.04 kWp
Required kVA:   5.04 → Microtek 6 kVA/48 V (PWM) or 5 kVA MPPT
Battery:        5.12 kW if 48 V bus
Both brands:    Microtek and Invergy selectable in UI
```

### Example E — Tata 3 kW On-Grid

```
Final price:    ₹2,00,000 exactly (no breakdown math)
```

---

## 10. Known limitations

| Scenario | Behaviour |
|----------|-----------|
| Microtek hybrid 3 kW + battery | 48 V inverter → only 5 kW battery available |
| Microtek off-grid 6 kW+ MPPT at 96 V + battery | No 96 V lithium in catalog → **quote may fail** |
| Off-grid wiring | Not priced (rate not set on sheet) |
| Installation type Residential vs Commercial | Currently **does not change** equipment pricing (UI only) |

---

## 11. Quick verification checklist

Use this when testing in the live wizard:

- [ ] Plant load dropdown shows **1–10 kW integers only**
- [ ] **Premier** appears in panel companies; prices match **Vikram**
- [ ] Off-grid shows **630 W only**; on-grid/hybrid show **555 / 590 / 630**
- [ ] **Both** inverter brands appear for off-grid **above 5 kW**
- [ ] 3 kW hybrid + Invergy + battery → **~2.4 kW battery**, not 5 kW
- [ ] Inverter kW ≥ panel kWp (e.g. 3.54 kWp → at least 3.6 kW inverter)
- [ ] Tata works only On-Grid 3/4 kW at **₹2L / ₹2.5L**
- [ ] PDF BOM lists **DC wire 4 mm, AC cable 10 mm, earthing 16 mm × 3, rod 1 m × 3**
- [ ] Final price = component subtotal **+ 25%** (except Tata)

---

*Document reflects codebase as of the latest quotation logic update. For exact rupee amounts, generate a quote in the app — rounding is applied at each GST step.*
