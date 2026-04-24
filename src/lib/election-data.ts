import type {
  ConstituencyRoadmap,
  FactCardOutput,
  ChecklistOutput,
  EVMSimulatorOutput,
  Form6WizardOutput,
} from "./schemas";

// ── Indian States ─────────────────────────────────────────────────────
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi (NCT)", "Jammu & Kashmir", "Ladakh", "Puducherry",
  "Chandigarh", "Andaman & Nicobar", "Dadra & Nagar Haveli", "Lakshadweep",
] as const;

// ── EVM/VVPAT Voting Process ──────────────────────────────────────────
export const EVM_VOTING_STEPS: EVMSimulatorOutput = {
  title: "How to Vote Using EVM & VVPAT",
  description: "Step-by-step guide to casting your vote on an Electronic Voting Machine with VVPAT verification.",
  steps: [
    {
      id: "arrive",
      title: "Arrive at Polling Booth",
      description: "Go to your assigned polling station on election day. Carry your voter ID (EPIC card) or any valid photo ID proof.",
      instruction: "Polling hours are typically 7:00 AM to 6:00 PM. Arrive early to avoid queues.",
      icon: "map-pin",
    },
    {
      id: "verify",
      title: "Identity Verification",
      description: "Show your EPIC card or valid photo ID to the polling officer. Your name will be checked against the voter list.",
      instruction: "The officer will verify your details and mark your name in the register.",
      icon: "id-card",
    },
    {
      id: "ink",
      title: "Indelible Ink Mark",
      description: "The polling officer will apply indelible ink to the index finger of your left hand.",
      instruction: "This ink mark prevents double voting and stays for several days.",
      icon: "fingerprint",
    },
    {
      id: "booth",
      title: "Enter Voting Compartment",
      description: "Proceed to the voting compartment. You will see the Balloting Unit of the EVM with candidate names, party symbols, and blue buttons.",
      instruction: "Voting is done in complete privacy — no one can see your vote.",
      icon: "shield",
    },
    {
      id: "press",
      title: "Press the Blue Button",
      description: "Press the blue button next to your chosen candidate's name and symbol on the Balloting Unit. A beep will sound and the light next to the candidate will glow.",
      instruction: "⚠️ You can only press one button. Choose carefully!",
      icon: "check-circle",
    },
    {
      id: "vvpat",
      title: "Verify on VVPAT",
      description: "The VVPAT machine will display a printed slip showing the candidate's name and symbol for 7 seconds. This confirms your vote was recorded correctly.",
      instruction: "The slip will automatically drop into a sealed box. You cannot touch it.",
      icon: "eye",
    },
    {
      id: "exit",
      title: "Exit the Booth",
      description: "Leave the voting compartment and exit the polling station. Congratulations — you have exercised your democratic right!",
      instruction: "🗳️ Your vote is secret, safe, and counted. Every vote matters!",
      icon: "log-out",
    },
  ],
};

// ── Election Phase Roadmap (Sample: Maharashtra 2024-style) ───────────
export const CONSTITUENCY_ROADMAP: ConstituencyRoadmap = {
  title: "Election Phase Schedule",
  description: "General election phases — dates are illustrative. Check ECI website for actual dates.",
  state: "Maharashtra",
  steps: [
    { id: "notify", title: "Election Notification", description: "ECI issues notification gazette for the constituency.", status: "completed", date: "Notification date", icon: "bell" },
    { id: "nomination", title: "Filing of Nominations", description: "Candidates file nomination papers with the Returning Officer.", status: "completed", date: "Last date: per schedule", icon: "file-text" },
    { id: "scrutiny", title: "Scrutiny of Nominations", description: "Returning Officer examines all nomination papers.", status: "completed", date: "Per schedule", icon: "search" },
    { id: "withdrawal", title: "Last Date for Withdrawal", description: "Candidates can withdraw their nominations before this date.", status: "current", date: "Per schedule", icon: "x-circle" },
    { id: "campaign", title: "Election Campaign", description: "Parties and candidates campaign. Campaign must stop 48 hours before polling.", status: "upcoming", date: "Ongoing", icon: "megaphone" },
    { id: "polling", title: "Polling Day", description: "Voters cast their votes at designated polling stations using EVM.", status: "upcoming", date: "Per schedule", icon: "vote" },
    { id: "counting", title: "Counting Day", description: "Votes are counted under strict supervision. Results declared by ECI.", status: "upcoming", date: "Per schedule", icon: "bar-chart" },
  ],
};

// ── ECI Facts ─────────────────────────────────────────────────────────
export const ECI_FACTS: FactCardOutput = {
  title: "Election Commission of India — Key Facts",
  summary: "Essential facts about Indian elections and the Election Commission.",
  facts: [
    { label: "Established", value: "25th January 1950 (National Voters' Day)", icon: "calendar" },
    { label: "Total Voters (2024)", value: "96.88 crore registered electors", icon: "users" },
    { label: "Voting Age", value: "18 years (as on 1st January of qualifying year)", icon: "user" },
    { label: "Voter ID", value: "EPIC (Electors Photo Identity Card) — apply via Form 6", icon: "id-card" },
    { label: "EVM in Use Since", value: "1999 (nationwide since 2004)", icon: "cpu" },
    { label: "NOTA Option", value: "Available since 2013 (None of the Above)", icon: "slash" },
  ],
  sources: [
    { title: "Election Commission of India", url: "https://eci.gov.in" },
    { title: "National Voters' Service Portal", url: "https://voters.eci.gov.in" },
  ],
};

// ── Voter Registration Checklist ──────────────────────────────────────
export const VOTER_REGISTRATION_CHECKLIST: ChecklistOutput = {
  title: "Voter Registration Checklist (Form 6)",
  description: "Complete these steps to register as a new voter with the Election Commission of India.",
  items: [
    { id: "age-check", text: "Confirm you are 18+ years old", description: "You must be at least 18 years old on 1st January of the qualifying year.", completed: false, priority: "high" },
    { id: "form6-online", text: "Fill Form 6 online on NVSP", description: "Visit voters.eci.gov.in and fill Form 6 for new voter registration.", completed: false, url: "https://voters.eci.gov.in", priority: "high" },
    { id: "id-proof", text: "Upload ID proof document", description: "Aadhaar card, Passport, Driving License, or PAN card (any one).", completed: false, priority: "high" },
    { id: "address-proof", text: "Upload address proof", description: "Aadhaar, Passport, Utility Bill, Bank Statement, or Ration Card.", completed: false, priority: "high" },
    { id: "passport-photo", text: "Upload passport-size photograph", description: "Recent colour photograph with white background.", completed: false, priority: "medium" },
    { id: "blo-visit", text: "Wait for BLO verification visit", description: "A Booth Level Officer (BLO) may visit your residence to verify details.", completed: false, priority: "medium" },
    { id: "check-status", text: "Check application status", description: "Track your Form 6 application on the NVSP portal.", completed: false, url: "https://voters.eci.gov.in", priority: "low" },
    { id: "collect-epic", text: "Collect your EPIC card", description: "Once approved, collect your Voter ID card from the ERO office or receive it by post.", completed: false, priority: "low" },
  ],
};

// ── Default Form 6 Wizard Output ──────────────────────────────────────
export const DEFAULT_FORM6_OUTPUT: Form6WizardOutput = {
  state: "General (All States)",
  eligible: true,
  summary: "Here are the requirements for registering as a new voter in India through Form 6.",
  requirements: [
    { id: "citizenship", label: "Indian Citizenship", description: "You must be a citizen of India.", met: false, category: "citizenship" },
    { id: "age", label: "Age: 18 Years or Above", description: "You must be at least 18 years old as of 1st January of the qualifying year.", met: false, category: "age" },
    { id: "residency", label: "Ordinary Resident", description: "You must be an ordinary resident in the constituency where you wish to register.", met: false, category: "residency" },
    { id: "not-registered", label: "Not Already Registered", description: "You should not already be registered as a voter in any other constituency.", met: false, category: "registration" },
    { id: "id-proof", label: "Valid ID Proof", description: "You need one valid ID proof: Aadhaar, Passport, Driving License, or PAN Card.", met: false, category: "id" },
  ],
  registrationUrl: "https://voters.eci.gov.in",
};

// ── ID Proof Types (for Form 6 wizard) ────────────────────────────────
export const ID_PROOF_TYPES = [
  { value: "aadhaar", label: "Aadhaar Card", icon: "fingerprint" },
  { value: "passport", label: "Passport", icon: "globe" },
  { value: "driving_license", label: "Driving License", icon: "car" },
  { value: "pan_card", label: "PAN Card", icon: "credit-card" },
  { value: "ration_card", label: "Ration Card", icon: "file-text" },
] as const;
