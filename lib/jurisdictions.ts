export type JurisdictionLaw = { title: string; url: string; kind: "AI law enacted" | "Targeted AI rules" | "EU AI Act"; note: string };
export type Jurisdiction = { name: string; code: string; group: "Countries & territories" | "EU member states" | "US states & local" | "Regional regimes"; parent?: string; law?: JurisdictionLaw };

const euLaw: JurisdictionLaw = {
  title: "EU AI Act · Regulation (EU) 2024/1689",
  url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
  kind: "EU AI Act",
  note: "Confirm the system category, operator role, territorial scope, and applicable implementation dates.",
};

export const jurisdictionLaws: Record<string, JurisdictionLaw> = {
  "European Union": euLaw,
  "China": { title: "Generative AI Service Management Measures", url: "https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm", kind: "Targeted AI rules", note: "Review service availability, public-facing scope, algorithm filings, synthetic-content labeling, and data rules." },
  "South Korea": { title: "AI Basic Act", url: "https://law.go.kr/lsInfoP.do?lsId=014820&urlMode=engLsInfoR", kind: "AI law enacted", note: "Confirm AI business-operator role, high-impact classification, transparency duties, and implementing rules." },
  "Japan": { title: "AI Promotion Act · Act No. 53 of 2025", url: "https://www8.cao.go.jp/cstp/ai/ai_act/ai_act.html", kind: "AI law enacted", note: "Review the promotion framework and relevant business guidelines; do not assume EU-style high-risk duties." },
  "Taiwan": { title: "Artificial Intelligence Basic Act", url: "https://law.nstc.gov.tw/EngLawContent.aspx?id=10099&lan=E", kind: "AI law enacted", note: "Review the framework act, implementing measures, competent-authority guidance, and sector rules." },
  "Vietnam": { title: "Law on Artificial Intelligence · 134/2025/QH15", url: "https://en.baochinhphu.vn/viet-nams-law-on-artificial-intelligence-111260715113551787.htm", kind: "AI law enacted", note: "Confirm provider and deployer roles, system risk category, transparency requirements, and implementation scope." },
  "Kazakhstan": { title: "Law on Artificial Intelligence · No. 230-VIII", url: "https://old.adilet.zan.kz/eng/docs/Z2500000230", kind: "AI law enacted", note: "Review system risk level, prohibited uses, transparency, data protection, and security requirements." },
  "Peru": { title: "Law 31814 and Supreme Decree 115-2025-PCM", url: "https://busquedas.elperuano.pe/dispositivo/NL/2436426-1", kind: "AI law enacted", note: "Confirm risk category, developer or implementer role, safeguards, transparency, and applicable implementation provisions." },
  "El Salvador": { title: "Law for the Promotion of AI and Technologies", url: "https://asamblea.gob.sv/node/13492", kind: "AI law enacted", note: "Review the promotion framework, agency jurisdiction, safeguards, and any applicable special regimes." },
  "Italy": { title: "Law No. 132 of 23 September 2025", url: "https://www.gazzettaufficiale.it/eli/id/2025/09/25/25G00143/sg", kind: "AI law enacted", note: "Review national AI provisions and implementing measures in addition to the EU AI Act." },
  "Singapore": { title: "Elections (Integrity of Online Advertising) (Amendment) Act 2024", url: "https://sso.agc.gov.sg/Acts-Supp/34-2024/Published/20241121?DocDate=20241121&ViewType=Within", kind: "Targeted AI rules", note: "The cited law targets digitally manipulated election advertising; it is not a general AI licensing law." },
  "Texas": { title: "Texas Responsible AI Governance Act · HB 149", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00149F.htm", kind: "AI law enacted", note: "Review Texas nexus, prohibited uses, required disclosures, enforcement provisions, and exemptions." },
  "California": { title: "Transparency in Frontier AI Act · SB 53", url: "https://oag.ca.gov/sb53", kind: "AI law enacted", note: "Confirm covered frontier-developer thresholds and duties. Also review other California AI and sector-specific laws." },
  "Colorado": { title: "Consumer Protections for AI · SB 24-205, as amended", url: "https://leg.colorado.gov/bills/sb24-205", kind: "AI law enacted", note: "Confirm high-risk consequential-decision scope, exemptions, amendments, and current operative dates." },
  "Utah": { title: "Artificial Intelligence Policy Act · Utah Code 13-72", url: "https://le.utah.gov/xcode/Title13/Chapter72/13-72.html", kind: "AI law enacted", note: "Review disclosure requirements, regulated activities, the policy office framework, and later amendments." },
  "Illinois": { title: "Artificial Intelligence Video Interview Act · 820 ILCS 42", url: "https://www.ilga.gov/Legislation/ILCS/Articles?ActID=4015&ChapterID=68&Print=", kind: "Targeted AI rules", note: "Confirm use of AI to analyze applicant video interviews, notice, consent, retention, and reporting requirements." },
  "New York City": { title: "Automated Employment Decision Tools · Local Law 144", url: "https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page", kind: "Targeted AI rules", note: "Confirm the tool definition and NYC nexus before assessing bias-audit, notice, and disclosure duties." },
};

export const euCountryCodes = "AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE".split(" ");
const countryCodes = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" ");
const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
const overrides: Record<string, string> = { KR: "South Korea", KP: "North Korea", US: "United States", GB: "United Kingdom", CZ: "Czechia", TR: "Türkiye", VN: "Vietnam", TW: "Taiwan", HK: "Hong Kong", MO: "Macao" };
const countries: Jurisdiction[] = countryCodes.map((code) => {
  const name = overrides[code] ?? displayNames.of(code) ?? code;
  const eu = euCountryCodes.includes(code);
  return { name, code, group: eu ? "EU member states" : "Countries & territories", parent: eu ? "European Union" : undefined, law: jurisdictionLaws[name] ?? (eu ? euLaw : undefined) };
});

const states = "Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia (US)|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|District of Columbia|New York City".split("|");
export const jurisdictions: Jurisdiction[] = [
  { name: "European Union", code: "EU", group: "Regional regimes", law: euLaw },
  ...countries,
  ...states.map((name): Jurisdiction => ({ name, code: `US-${name}`, group: "US states & local", parent: "United States", law: jurisdictionLaws[name] })),
].sort((a, b) => a.name.localeCompare(b.name, "en"));

export function getJurisdiction(name: string) { return jurisdictions.find((item) => item.name === name); }
export function hasEUFootprint(names: string[]) { return names.some((name) => name === "European Union" || getJurisdiction(name)?.parent === "European Union"); }
export function hasUSFootprint(names: string[]) { return names.some((name) => name === "United States" || getJurisdiction(name)?.parent === "United States"); }

const aliases: Record<string, string[]> = {
  "United States": ["USA", "U.S.", "United States of America"],
  "United Kingdom": ["UK", "U.K.", "Britain"],
  "European Union": ["EU"],
  "South Korea": ["Republic of Korea", "Korea"],
  "Vietnam": ["Viet Nam"],
  "Türkiye": ["Turkey"],
  "United Arab Emirates": ["UAE"],
  "New York City": ["NYC"],
};

export function inferJurisdictions(text: string): string[] {
  const scope = text.match(/^(?:deployment(?: footprint)?|regions?|jurisdictions?|markets?|locations?|countries)\s*:\s*(.+)$/gim)?.join("\n") || text;
  const matches = jurisdictions.filter((jurisdiction) => [jurisdiction.name, ...(aliases[jurisdiction.name] ?? [])].some((name) => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|[^\\p{L}])${escaped}(?=$|[^\\p{L}])`, "iu").test(scope);
  })).map((item) => item.name);
  if (hasEUFootprint(matches) && !matches.includes("European Union")) matches.unshift("European Union");
  if (hasUSFootprint(matches) && !matches.includes("United States")) matches.unshift("United States");
  return [...new Set(matches)];
}
