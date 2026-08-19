export interface EmergencyServiceItem {
  id: string
  name: string
  category: "police" | "hospital" | "ambulance" | "women_safety" | "tourist_police" | "railway" | "fire" | "atms" | "pharmacy"
  phone: string
  tollFree?: boolean
  description: string
  stateOrCity?: string
  priority: "critical" | "important" | "useful"
}

export const NATIONWIDE_EMERGENCY_NUMBERS: EmergencyServiceItem[] = [
  {
    id: "em-national-112",
    name: "National Emergency Number (All-in-One)",
    category: "police",
    phone: "112",
    tollFree: true,
    description: "Unified pan-India emergency response for Police, Fire, and Ambulance.",
    priority: "critical",
  },
  {
    id: "em-police-100",
    name: "Police Helpline",
    category: "police",
    phone: "100",
    tollFree: true,
    description: "Direct Police control room pan-India.",
    priority: "critical",
  },
  {
    id: "em-ambulance-108",
    name: "National Ambulance & Medical Emergency",
    category: "ambulance",
    phone: "108",
    tollFree: true,
    description: "Free emergency ambulance and medical assistance across most Indian states.",
    priority: "critical",
  },
  {
    id: "em-women-1091",
    name: "Women in Distress Helpline",
    category: "women_safety",
    phone: "1091",
    tollFree: true,
    description: "24x7 dedicated emergency assistance and counseling for women.",
    priority: "critical",
  },
  {
    id: "em-tourist-1363",
    name: "Incredible India 24x7 Tourist Helpline",
    category: "tourist_police",
    phone: "1363",
    tollFree: true,
    description: "Ministry of Tourism multi-lingual emergency helpline (12 languages including English, Hindi, German, French, Spanish).",
    priority: "important",
  },
  {
    id: "em-railway-139",
    name: "Indian Railways Integrated Helpline (RailMadad)",
    category: "railway",
    phone: "139",
    tollFree: true,
    description: "Security, medical emergencies on trains/stations, and general railway grievances.",
    priority: "important",
  },
  {
    id: "em-fire-101",
    name: "Fire Brigade & Disaster Rescue",
    category: "fire",
    phone: "101",
    tollFree: true,
    description: "Fire rescue and immediate disaster evacuation.",
    priority: "critical",
  },
  {
    id: "em-cyber-1930",
    name: "National Cyber Crime Reporting",
    category: "police",
    phone: "1930",
    tollFree: true,
    description: "Financial fraud, fake hotel booking scams, and digital identity theft.",
    priority: "important",
  },
]

export const REGIONAL_EMERGENCY_HUBS: Record<string, EmergencyServiceItem[]> = {
  jaipur: [
    {
      id: "em-jp-sms-hosp",
      name: "Sawai Man Singh (SMS) Govt Hospital & Trauma Centre",
      category: "hospital",
      phone: "+91-141-2560291",
      description: "Rajasthan's premier tertiary emergency trauma hospital with 24x7 blood bank and ICU.",
      stateOrCity: "Jaipur, JLN Marg",
      priority: "critical",
    },
    {
      id: "em-jp-tourist-police",
      name: "Jaipur Tourist Police Station",
      category: "tourist_police",
      phone: "+91-141-2601728",
      description: "Dedicated tourist security police stationed near Hawa Mahal & Amer Fort for scam and tout complaints.",
      stateOrCity: "Jaipur, Pink City",
      priority: "important",
    },
  ],
  goa: [
    {
      id: "em-goa-gmc",
      name: "Goa Medical College & Hospital (GMC)",
      category: "hospital",
      phone: "+91-832-2458700",
      description: "Leading multi-specialty trauma and emergency hospital in Goa.",
      stateOrCity: "Bambolim, North Goa",
      priority: "critical",
    },
    {
      id: "em-goa-coastal-police",
      name: "Goa Coastal Police & Lifeguard Control",
      category: "tourist_police",
      phone: "+91-832-2419444",
      description: "Marine rescue, beach patrol, and Drishti Lifesaving coordination.",
      stateOrCity: "Panaji / Coastal Beaches",
      priority: "critical",
    },
  ],
  varanasi: [
    {
      id: "em-vns-bhu-hospital",
      name: "Sir Sunderlal Hospital (BHU Trauma Centre)",
      category: "hospital",
      phone: "+91-542-2367568",
      description: "24x7 comprehensive emergency care and super-specialty hospital.",
      stateOrCity: "Banaras Hindu University, Varanasi",
      priority: "critical",
    },
    {
      id: "em-vns-ghat-police",
      name: "Dashashwamedh Ghat Tourist Police Booth",
      category: "tourist_police",
      phone: "+91-542-2400100",
      description: "On-site riverfront security and crowd management assistance.",
      stateOrCity: "Varanasi Ghats",
      priority: "important",
    },
  ],
  "leh-ladakh": [
    {
      id: "em-leh-snm-hosp",
      name: "Sonam Norboo Memorial (SNM) Hospital",
      category: "hospital",
      phone: "+91-1982-252014",
      description: "Equipped with hyperbaric oxygen chambers for High Altitude Pulmonary/Cerebral Edema (HAPE/HACE).",
      stateOrCity: "Leh City",
      priority: "critical",
    },
    {
      id: "em-leh-police",
      name: "Leh District Police Control Room",
      category: "police",
      phone: "+91-1982-252018",
      description: "Highway road blockades, high-pass weather rescue, and inner line permits.",
      stateOrCity: "Leh Ladakh",
      priority: "critical",
    },
  ],
}
