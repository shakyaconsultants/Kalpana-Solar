/** Shared currency formatter for quote UI */

function formatIndianGrouped(amount) {
  const n = Math.round(amount).toString();
  if (n.length <= 3) return n;
  const lastThree = n.slice(-3);
  let rest = n.slice(0, -3);
  const parts = [];
  while (rest.length > 2) {
    parts.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) parts.unshift(rest);
  return `${parts.join(",")},${lastThree}`;
}

export function formatINR(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** ASCII-safe INR for jsPDF (Helvetica cannot render ₹ or locale spacing) */
export function formatINRForPdf(amount) {
  if (amount == null) return "—";
  return `Rs. ${formatIndianGrouped(amount)}`;
}
