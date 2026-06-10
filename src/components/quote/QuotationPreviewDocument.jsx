import { BRAND_LOGO_SRC, BRAND_LOGO_WIDTH, BRAND_LOGO_HEIGHT } from "../../assets/brandLogo.js";
import { formatINR } from "../../data/formatCurrency.js";
import { formatPlantLoad } from "../../data/quotationOptions.js";
import { PANEL_CATEGORIES } from "../../data/quotationOptions.js";
import {
  KALPANA_COMPANY,
  KALPANA_BANK,
  COVER_LETTER,
  PAYMENT_TERMS,
  PRODUCT_WARRANTY,
  STANDARD_TERMS,
  buildBillOfMaterials,
  offerSubject,
  commercialLineDescription,
  formatQuoteDate,
  customerLocation,
  salutationName,
  systemOfferLabel,
} from "../../data/quotationDocument.js";
import {
  QUOTE_TAGLINE,
  QUOTE_WEBSITE,
  QUOTE_CRM_LABEL,
  groupBomByCategory,
  estimateProjectKpis,
  panelKpiLabel,
  inverterKpiLabel,
  paymentTimelineSteps,
  TOTAL_PAGES,
} from "../../data/quotationDesign.js";

function panelCategoryLabel(category) {
  return PANEL_CATEGORIES.find((c) => c.id === category)?.label ?? category;
}

function IconSun({ className = "quote-icon-md" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconBolt({ className = "quote-icon-md" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function IconLeaf({ className = "quote-icon-md" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 20c5-8 9-12 19-14-2 10-6 14-14 19-1-2-3-4-5-5z" />
    </svg>
  );
}

function DocFooter({ page, quoteRef }) {
  return (
    <footer className="quote-doc-footer">
      <img src={BRAND_LOGO_SRC} alt="" className="quote-doc-footer-logo" width={BRAND_LOGO_WIDTH} height={BRAND_LOGO_HEIGHT} />
      <div className="quote-doc-footer-meta">
        <span>{KALPANA_COMPANY.mobile}</span>
        <span className="quote-footer-sep">·</span>
        <span>{KALPANA_COMPANY.email}</span>
        <span className="quote-footer-sep">·</span>
        <span>{QUOTE_WEBSITE}</span>
      </div>
      <div className="quote-doc-footer-right">
        <div>
          Page {page} of {TOTAL_PAGES} · {quoteRef}
        </div>
        <div className="quote-footer-dim">{QUOTE_CRM_LABEL}</div>
      </div>
    </footer>
  );
}

function PageShell({ page, quoteRef, children, cover = false }) {
  return (
    <article className={`quote-preview-page quote-doc ${cover ? "quote-cover" : ""}`}>
      <div className={`quote-preview-page-body ${cover ? "quote-cover-inner" : ""}`}>{children}</div>
      <DocFooter page={page} quoteRef={quoteRef} />
    </article>
  );
}

function KpiCard({ icon, label, value }) {
  return (
    <div className="quote-kpi-card">
      <div className="quote-kpi-card-icon">{icon}</div>
      <p className="quote-kpi-card-label">{label}</p>
      <p className="quote-kpi-card-value">{value}</p>
    </div>
  );
}

function WarrantyCard({ period, label }) {
  return (
    <div className="quote-warranty-card">
      <div className="quote-warranty-card-icon">
        <IconSun className="quote-icon-sm" />
      </div>
      <p className="quote-warranty-card-period">{period}</p>
      <p className="quote-warranty-card-label">{label}</p>
    </div>
  );
}

export default function QuotationPreviewDocument({ customer, selections, breakdown, quoteRef }) {
  const { matched, finalPrice } = breakdown;
  const kwp = matched?.panel?.totalKwp ?? selections.plantLoadKw;
  const bom = buildBillOfMaterials(matched, selections, panelCategoryLabel);
  const bomGroups = groupBomByCategory(bom);
  const kpis = estimateProjectKpis(kwp);
  const timeline = paymentTimelineSteps();
  const systemTypeLabel = `${systemOfferLabel(selections.systemType)} ${selections.installationType ?? ""}`.trim();

  return (
    <div id="quote-preview-document" className="quote-preview-stack">
      {/* ── PAGE 1: Premium Cover ── */}
      <PageShell page={1} quoteRef={quoteRef} cover>
        <div className="quote-cover-deco" />
        <div className="quote-cover-panels" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="quote-cover-panel-cell" />
          ))}
        </div>

        <div className="quote-cover-top">
          <div className="quote-cover-logo-wrap">
            <img src={BRAND_LOGO_SRC} alt={KALPANA_COMPANY.name} width={BRAND_LOGO_WIDTH} height={BRAND_LOGO_HEIGHT} />
          </div>
          <p className="quote-cover-company">{KALPANA_COMPANY.name}</p>
          <p className="quote-cover-tagline">{QUOTE_TAGLINE}</p>
          <div className="quote-cover-contact">
            <p>{KALPANA_COMPANY.addressLine1}</p>
            <p>{KALPANA_COMPANY.addressLine2}</p>
            <p>{KALPANA_COMPANY.contacts}</p>
            <p>
              GSTIN: {KALPANA_COMPANY.gstin} · MSME: {KALPANA_COMPANY.msme}
            </p>
          </div>
        </div>

        <div className="quote-cover-hero">
          <p className="quote-cover-hero-label">Solar Proposal</p>
          <p className="quote-cover-hero-kwp">{kwp} kWp</p>
          <p className="quote-cover-hero-sub">{systemTypeLabel.toUpperCase()}</p>
          <div className="quote-cover-hero-icons">
            <IconSun />
            <IconBolt />
            <IconLeaf />
          </div>
        </div>

        <div className="quote-cover-customer">
          <p className="quote-cover-customer-label">Prepared For</p>
          <p className="quote-cover-customer-name">{salutationName(customer?.name)}</p>
          {customer?.city && (
            <p className="quote-cover-customer-detail">{customerLocation(customer.city)}</p>
          )}
          {customer?.address && <p className="quote-cover-customer-detail">{customer.address}</p>}
          {customer?.phone && <p className="quote-cover-customer-detail">{customer.phone}</p>}
        </div>

        <div className="quote-cover-bottom">
          <div>
            <p className="quote-cover-bottom-label">Date</p>
            <p className="quote-cover-bottom-value">{formatQuoteDate()}</p>
          </div>
          <div>
            <p className="quote-cover-bottom-label">Quotation No.</p>
            <p className="quote-cover-bottom-value quote-cover-bottom-value--accent">{quoteRef}</p>
          </div>
          <div>
            <p className="quote-cover-bottom-label">Prepared By</p>
            <p className="quote-cover-bottom-value">{KALPANA_COMPANY.name}</p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 2: Project Overview + Commercial ── */}
      <PageShell page={2} quoteRef={quoteRef}>
        <div className="quote-page-balanced">
          <div className="quote-page-header">
            <div>
              <h2 className="quote-page-header-title">Project Overview</h2>
              <p className="quote-page-header-sub">
                {offerSubject(selections.plantLoadKw, selections.systemType)}
              </p>
            </div>
            <div className="quote-page-header-logo">
              <img src={BRAND_LOGO_SRC} alt="" width={BRAND_LOGO_WIDTH} height={BRAND_LOGO_HEIGHT} />
            </div>
          </div>

          <div className="quote-kpi-grid quote-section">
            <KpiCard icon={<IconSun className="quote-icon-sm" />} label="Plant Capacity" value={`${kwp} kWp`} />
            <KpiCard icon={<IconSun className="quote-icon-sm" />} label="Solar Panels" value={panelKpiLabel(matched)} />
            <KpiCard icon={<IconBolt className="quote-icon-sm" />} label="Inverter" value={inverterKpiLabel(matched)} />
            <KpiCard
              icon={<IconBolt className="quote-icon-sm" />}
              label="System Type"
              value={systemOfferLabel(selections.systemType)}
            />
          </div>

          <div className="quote-page2-split quote-section">
            <div className="quote-pricing-card">
              <p className="quote-pricing-label">Project Cost</p>
              <p className="quote-pricing-amount">{formatINR(finalPrice)}</p>
              <div className="quote-pricing-gst">
                <p>70% of project value — Supply component @ 5% GST</p>
                <p>30% of project value — Service component @ 18% GST</p>
              </div>
            </div>
            <div className="quote-benefits-grid quote-benefits-grid--page2">
              <div className="quote-benefit-card">
                <p className="quote-benefit-card-value">₹{kpis.monthlySavings.toLocaleString("en-IN")}</p>
                <p className="quote-benefit-card-label">Est. Monthly Savings</p>
              </div>
              <div className="quote-benefit-card">
                <p className="quote-benefit-card-value">{kpis.annualGeneration}</p>
                <p className="quote-benefit-card-label">Est. Annual Generation</p>
              </div>
              <div className="quote-benefit-card">
                <p className="quote-benefit-card-value">₹{kpis.savings25Year.toLocaleString("en-IN")}</p>
                <p className="quote-benefit-card-label">25 Year Savings</p>
              </div>
              <div className="quote-benefit-card">
                <p className="quote-benefit-card-value">{kpis.co2Reduction}</p>
                <p className="quote-benefit-card-label">CO₂ Reduction / Year</p>
              </div>
              <div className="quote-benefit-card quote-benefit-card--span2">
                <p className="quote-benefit-card-value">{kpis.roiPeriod}</p>
                <p className="quote-benefit-card-label">Estimated ROI Period</p>
              </div>
            </div>
          </div>

          <div className="quote-section">
            <h3 className="quote-section-title">
              <span className="quote-section-title-bar" />
              Executive Summary
            </h3>
            <div className="quote-exec-card">{COVER_LETTER}</div>
            <p className="quote-muted-sm quote-spaced-top">Sincerely,</p>
            <p className="quote-doc-heading quote-thanks-line">{KALPANA_COMPANY.name}</p>
          </div>

          <div className="quote-section">
            <h3 className="quote-section-title">
              <span className="quote-section-title-bar" />
              Commercial Offer
            </h3>
            <p className="quote-commercial-total-label">TO, {salutationName(customer?.name)}</p>
            <p className="quote-muted-sm quote-spaced-bottom">
              {customerLocation(customer?.city)} · DATE: {formatQuoteDate()}
            </p>
            <p className="quote-commercial-subject">
              {offerSubject(selections.plantLoadKw, selections.systemType)}
            </p>
            <div className="quote-commercial-table">
              <div className="quote-commercial-table-head">
                <span>Sr.</span>
                <span>Product Description</span>
                <span>Rating</span>
                <span>Qty</span>
                <span>Rate</span>
                <span className="quote-text-right">Amount</span>
              </div>
              <div className="quote-commercial-table-row">
                <span>1</span>
                <span>{commercialLineDescription(selections.systemType)}</span>
                <span>{formatPlantLoad(selections.plantLoadKw)}</span>
                <span>1</span>
                <span>INCL</span>
                <span className="amount">{formatINR(finalPrice)}</span>
              </div>
            </div>
            <div className="quote-commercial-total">
              <span className="quote-commercial-total-label">Total (GST Inclusive)</span>
              <span className="quote-commercial-total-value">{formatINR(finalPrice)}</span>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 3: Equipment Included (BOM) ── */}
      <PageShell page={3} quoteRef={quoteRef}>
        <div className="quote-page-header">
          <div>
            <h2 className="quote-page-header-title">Equipment Included</h2>
            <p className="quote-page-header-sub">Complete bill of materials for your solar system</p>
          </div>
          <div className="quote-page-header-logo">
            <img src={BRAND_LOGO_SRC} alt="" width={BRAND_LOGO_WIDTH} height={BRAND_LOGO_HEIGHT} />
          </div>
        </div>

        <div className="quote-bom-wrap">
          <div className="quote-bom-head">
            <span>S.No</span>
            <span>Product Description</span>
            <span className="quote-text-right">Rating</span>
            <span className="quote-text-right">Qty</span>
          </div>
          <div className="quote-bom-body">
          {bomGroups.map((group) => (
            <div key={group.category}>
              <div className="quote-bom-category">
                <p className="quote-bom-category-label">{group.category}</p>
              </div>
              {group.items.map((item) => (
                <div key={item.sno} className="quote-bom-row">
                  <span className="sno">{item.sno}</span>
                  <span className="desc">{item.description}</span>
                  <span className="rating">{item.rating}</span>
                  <span className="qty">{item.qty}</span>
                </div>
              ))}
            </div>
          ))}
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: Warranty + Payment + Terms ── */}
      <PageShell page={4} quoteRef={quoteRef}>
        <div className="quote-page4-compact">
        <div className="quote-page-header">
          <div>
            <h2 className="quote-page-header-title">Warranty, Payment & Terms</h2>
            <p className="quote-page-header-sub">Your investment protection & project terms</p>
          </div>
          <div className="quote-page-header-logo">
            <img src={BRAND_LOGO_SRC} alt="" width={BRAND_LOGO_WIDTH} height={BRAND_LOGO_HEIGHT} />
          </div>
        </div>

        <div className="quote-section">
          <h3 className="quote-section-title">
            <span className="quote-section-title-bar" />
            Product Warranty
          </h3>
          <div className="quote-warranty-grid">
            {PRODUCT_WARRANTY.map((w) => (
              <WarrantyCard
                key={w.product}
                period={w.period}
                label={`${w.product} Warranty`}
              />
            ))}
          </div>
        </div>

        <div className="quote-section">
          <h3 className="quote-section-title">
            <span className="quote-section-title-bar" />
            Payment Schedule
          </h3>
          <div className="quote-payment-timeline">
            {timeline.map((step, i) => (
              <div key={step.label} className="quote-payment-step-wrap">
                {i > 0 && <span className="quote-payment-arrow">→</span>}
                <div className="quote-payment-step">
                  <p className="quote-payment-step-pct">{step.pct}</p>
                  <p className="quote-payment-step-label">{step.label}</p>
                  <p className="quote-payment-step-detail">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="quote-muted-sm quote-spaced-top quote-italic">{PAYMENT_TERMS[3]}</p>
        </div>

        <div className="quote-page4-grid quote-section">
          <div className="quote-bank-card">
            <p className="quote-bank-card-title">Bank Details</p>
            <div className="quote-bank-row">
              <span>Beneficiary</span>
              <span>{KALPANA_BANK.beneficiary}</span>
            </div>
            <div className="quote-bank-row">
              <span>Bank Name</span>
              <span>{KALPANA_BANK.bankName}</span>
            </div>
            <div className="quote-bank-row">
              <span>Account Number</span>
              <span>{KALPANA_BANK.accountNo}</span>
            </div>
            <div className="quote-bank-row">
              <span>IFSC Code</span>
              <span>{KALPANA_BANK.ifsc}</span>
            </div>
          </div>

          <div>
            <h3 className="quote-section-title">
              <span className="quote-section-title-bar" />
              Standard Terms
            </h3>
            <div className="quote-terms-panel">
              <div className="quote-terms-grid">
                {STANDARD_TERMS.map((term) => (
                  <div key={term} className="quote-term-item">
                    <span className="quote-term-check">✓</span>
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="quote-signature-block">
          <div className="quote-signature-area">
            <p className="quote-signature-label">Authorized Signatory</p>
            <div className="quote-seal-placeholder">Company Seal</div>
            <p className="quote-signature-name">{KALPANA_COMPANY.name}</p>
          </div>
          <div className="quote-signature-area">
            <p className="quote-signature-label">Customer Acceptance</p>
            <p className="quote-signature-name quote-signature-name--spaced">{salutationName(customer?.name)}</p>
            <p className="quote-muted-sm quote-spaced-top">Signature & Date</p>
          </div>
        </div>

        <p className="quote-thanks-line">Thanks & Regards — {KALPANA_COMPANY.name}</p>
        </div>
      </PageShell>
    </div>
  );
}
