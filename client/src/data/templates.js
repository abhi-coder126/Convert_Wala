const basicNames = [
  "Clean ATS",
  "Simple Professional",
  "Classic One Page",
  "Minimal Recruiter",
  "Plain Executive",
  "Fresh Graduate",
  "Compact Skill Based",
  "Modern Basic",
  "No Border ATS",
  "Simple Corporate",
  "Entry Level Clean",
  "Text First Resume",
  "Balanced Minimal",
  "Role Focused",
  "Traditional ATS",
];

const standardNames = [
  "Modern Blue",
  "Corporate Edge",
  "Tech Professional",
  "Marketing Standard",
  "Elegant Column",
  "Bold Header",
  "Product Manager",
  "Sales Profile",
  "Creative Standard",
  "Consulting Format",
  "Data Analyst",
  "Healthcare Admin",
  "Engineer Profile",
  "Finance Standard",
  "Operations Resume",
];

const premiumTemplates = [
  {
    name: "Dark Gold Creative",
    premiumStyle: "premium-dark-gold",
    accent: "#d97706",
  },
  {
    name: "Green Corporate Split",
    premiumStyle: "premium-green-split",
    accent: "#84cc16",
  },
  {
    name: "Black Photographer",
    premiumStyle: "premium-photo-dark",
    accent: "#ca8a04",
  },
  {
    name: "Orange Executive",
    premiumStyle: "premium-orange-pro",
    accent: "#f97316",
  },
  {
    name: "Blue Sidebar Pro",
    premiumStyle: "premium-blue-sidebar",
    accent: "#0284c7",
  },
  {
    name: "Navy Timeline",
    premiumStyle: "premium-navy-timeline",
    accent: "#0f4c81",
  },
  {
    name: "Clean Product Manager",
    premiumStyle: "premium-clean-manager",
    accent: "#1e3a8a",
  },
  {
    name: "Graphic Designer Blue",
    premiumStyle: "premium-graphic-blue",
    accent: "#0ea5e9",
  },
  {
    name: "Modern Left Profile",
    premiumStyle: "premium-left-profile",
    accent: "#0f766e",
  },
  {
    name: "Luxury Minimal",
    premiumStyle: "premium-luxury-minimal",
    accent: "#111827",
  },
  {
    name: "Dark Orange Designer",
    premiumStyle: "premium-orange-pro",
    accent: "#ea580c",
  },
  {
    name: "Professional Timeline",
    premiumStyle: "premium-navy-timeline",
    accent: "#075985",
  },
  {
    name: "Premium Analyst",
    premiumStyle: "premium-blue-sidebar",
    accent: "#1d4ed8",
  },
  {
    name: "Premium Developer",
    premiumStyle: "premium-green-split",
    accent: "#22c55e",
  },
  {
    name: "Premium Consultant",
    premiumStyle: "premium-clean-manager",
    accent: "#3730a3",
  },
  {
    name: "Executive Dark",
    premiumStyle: "premium-dark-gold",
    accent: "#f59e0b",
  },
  {
    name: "International CV",
    premiumStyle: "premium-left-profile",
    accent: "#0891b2",
  },
  {
    name: "Premium Finance",
    premiumStyle: "premium-blue-sidebar",
    accent: "#164e63",
  },
  {
    name: "Premium Academic",
    premiumStyle: "premium-graphic-blue",
    accent: "#0369a1",
  },
  {
    name: "Premium Director",
    premiumStyle: "premium-photo-dark",
    accent: "#eab308",
  },
];

const makeBasicStandardTemplates = (names, category, startIndex) => {
  return names.map((name, index) => ({
    id: `${category}-${String(index + 1).padStart(2, "0")}`,
    number: startIndex + index,
    name,
    category,
    accent: category === "basic" ? "#111827" : "#2563eb",
    layout: category === "basic" ? "single" : "balanced",
    badge: category === "basic" ? "ATS Friendly" : "Professional",
  }));
};

const makePremiumTemplates = () => {
  return premiumTemplates.map((item, index) => ({
    id: `premium-${String(index + 1).padStart(2, "0")}`,
    number: 31 + index,
    name: item.name,
    category: "premium",
    accent: item.accent,
    layout: "premium",
    premiumStyle: item.premiumStyle,
    badge: "Premium Design",
  }));
};

export const templates = [
  ...makeBasicStandardTemplates(basicNames, "basic", 1),
  ...makeBasicStandardTemplates(standardNames, "standard", 16),
  ...makePremiumTemplates(),
];