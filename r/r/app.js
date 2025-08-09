const navToggle = document.querySelector(".nav-toggle")
const siteNav = document.querySelector(".site-nav")

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true"
    navToggle.setAttribute("aria-expanded", !expanded)
    siteNav.classList.toggle("nav-open")
  })
}


function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

class CostCalculator {
  constructor() {
    // ADD YOUR GEMINI API KEY HERE
    this.apiKey = "AIzaSyCq_ZShyk-xuGO_XMUrh-KaxxYUUMo1GDs"

    // ADD YOUR SOURCES HERE
    this.sources = `SOURCE 1 (Adrenal Cancer)
    Name: NCI PDQ & procedural charge data
    URL: https://www.cancer.gov/types/adrenocortical/hp/adrenocortical-treatment-pdq
    Description: Clinical and procedure-level cost data (no stage-by-stage cost table)
    Data:
    Surgery costs: $6,000–$15,000 typical adrenalectomy charges.
    Estimation method: Stage I–III similar surgical costs; Stage IV uses advanced Year-1 cost
    proxy.
    ● Stage I Cost: Estimate ~$8,000 (typical adrenalectomy cost)
    ● Stage II Cost: Estimate ~$10,000 (add imaging and follow-up)
    ● Stage III Cost: Estimate ~$50,000 (surgery + adjuvant therapy)
    ● Stage IV Cost: Estimate ~$124,000 (from advanced-stage Year-1 cost modeling)
    ([jacr.org], [pmc.ncbi.nlm.nih.gov])
    SOURCE 2 (Anal Cancer)
    Name: SEER-Medicare lifetime cost analysis
    URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC5592145/
    Description: U.S. Stage-specific lifetime cost data for elderly patients
    Data:
    ● Stage I Cost: $27,125 (Source)
    ● Stage II Cost: $66,393 (Source)
    ● Stage III Cost: $93,291 (Source)
    ● Stage IV Cost: $73,178 (Source)
    (Note: Stage IV lower due to shorter survival; per-year cost spikes exist)
    SOURCE 3 (Bile Duct Cancer – CCA)
    Name: CCA claims cost per month & median OS
    URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC8107622/
    Description: Monthly cost all stages aggregated; no stage table
    Estimation used: monthly cost × estimated survival by stage proxies
    Assumed median survival by stage (based on literature): Stage I–II: ~24 mo; Stage III: ~12 mo;
    Stage IV: ~5.3 mo.
    ● Stage I Cost: Estimate ~$7,743 × 24 mo = ~$186,000
    ● Stage II Cost: Estimate ~$7,743 × 24 mo = ~$186,000
    ● Stage III Cost: Estimate ~$7,743 × 12 mo = ~$93,000
    ● Stage IV Cost: Estimate ~$7,743 × 5.3 mo = ~$41,000 (Source data)
    SOURCE 4 (Bladder Cancer)
    Name: U.S. Bladder cancer stage cost review
    URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC11499469/
    Description: Stage-specific cost estimates from pooled U.S. cohorts
    Data (approximate ranges):
    ● Stage I Cost: $19,521 (Source)
    ● Stage II Cost: Estimate ~$50,000 (midpoint; pooled values rise with stage)
    ● Stage III Cost: Estimate ~$100,000 (multimodal higher stage)
    ● Stage IV Cost: $169,533 (Source; metastatic cohorts)
    SOURCE 5 (Blood Cancers)
    Name: Medicare year-1 per cancer type (phase-based)
    URL: https://www.tandfonline.com/doi/full/10.1080/03007995.2022.2047536
    Description: Year-1 cost by cancer type; not AJCC staging
    Adapted to phases approximating stages: Initial Year = Stage I; Continuing = Stage II & III;
    End-of-life = Stage IV
    ● Stage I (Initial Year) Cost: Estimate ~$70,000 (typical initial therapy for leukemia types)
    ● Stage II/III (Continuing) Cost: Estimate ~$30,000/year
    ● Stage IV (End-of-life phase) Cost: Estimate ~$100,000 (based on transplant and
    last-line care)
    (Note: Highly variable by subtype)
    SOURCE 6 (Bone Cancer)
    Name: Clinical cost summary (bone tumors)
    URL: https://www.bmus-ors.org/fourth-edition/via14/economic-cost-malignant-bone-tumors
    Description: Review of high cost per treated case; no stage breakdown
    Estimate method: multimodal treated patients often >$100,000; early surgery only lower.
    ● Stage I Cost: Estimate ~$50,000 (surgery only)
    ● Stage II Cost: Estimate ~$100,000 (surgery + chemo/radiation)
    ● Stage III Cost: Estimate ~$150,000 (add reconstructions/prostheses)
    ● Stage IV Cost: Estimate ~$200,000 (advanced + multimodal + palliative care)
    SOURCE 7 (Brain & Spinal Cord Tumors – Glioblastoma)
    Name: 6-month cost of glioblastoma care
    URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC4070631/
    Description: Mean costs in first 6 months post-diagnosis for glioblastoma (commonly grade IV)
    Data:
    ● Stage I–III: Not applicable (these tumors not staged like AJCC) → Use Grade
    breakdown; most are grade IV.
    Estimated by analogy:
    ● “Stage I/II” (low grade): Estimate ~$50,000 for first 6 months of treatment (less
    aggressive)
    ● “Stage III”: Estimate ~$80,000 (intermediate treatment intensity)
    ● “Stage IV” (GBM): $79,099–$138,767 (Source) — average ~$109,000
    SOURCE 8 (Breast Cancer)
    Name: Global systematic review with U.S. included
    URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC6258130/
    Description: Weighted mean cumulative treatment cost by stage (2015 USD)
    Data:
    ● Stage I Cost: $29,724 (Source)
    ● Stage II Cost: $39,322 (Source)
    ● Stage III Cost: $57,827 (Source)
    ● Stage IV Cost: $62,108 (Source)
    SOURCE 9 (Cancer of Unknown Primary – CUP)
    Name: NCI clinical guidance & cost discussion
    URL: https://www.cancer.gov/types/unknown-primary/hp/unknown-primary-treatment-pdq
    Description: Clinical guidance only; no cost data available
    Estimation by diagnostic and systemic therapy cost proxies: assume heavy imaging + empiric
    chemotherapy
    ● Stage I–III: Not applicable (CUP presents metastatically)
    ● Stage IV Cost: Estimate ~$200,000 (comprehensive diagnostic workup + systemic
    treatment)
    SOURCE 10 (Cervical Cancer)
    Name: Phase- and stage-based cost studies
    URLs:
    ● https://www.ajog.org/article/S0002-9378%2815%2902350-9/fulltext
    ● https://www.fredhutch.org/en/news/spotlight/2022/07/phs-ramsey-go.html
    Description: U.S. phase and stage cost estimates for cervical cancer care
    Data:
    ● Stage I Cost: $26,164 (median, no adjuvant therapy) (Source)
    ● Stage II Cost: Estimate ~$40,000 (add adjuvant/radiation)
    ● Stage III Cost: Estimate ~$60,000 (chemoradiation, extended-field RT)
    ● Stage IV Cost: Estimate ~$77,661 (2nd-line therapy, per-month cost in advanced lines)
    (Source)
    SOURCE 11:
    Name: Colorectal cancer — cancer-attributable medical costs by stage (US / SEER-Medicare
    and claims synthesis)
    URL: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7225669/
    Description: SEER/claims-based analysis of cancer-attributable medical costs by phase and
    stage in the U.S.; reports initial-phase costs by stage. PMC
    Data:
    Surgery costs: Included in initial-phase totals; colon/rectal resection typical hospital cost
    components present in study. PMC
    Chemotherapy: Included in treatment-phase totals (adjuvant and metastatic systemic therapy).
    PMC
    Geographic variation: Not the primary focus; costs reflect SEER regions. PMC
    Insurance typical coverage: SEER-Medicare perspective (Medicare payments/claims). PMC
    Stage I Cost: $37,200 (initial phase, Source). PMC
    Stage II Cost: Estimate ~$55,000 (initial + adjuvant chemo costs — extrapolated from study
    initial-phase increases vs Stage I). (Estimate method: initial-phase progression from study).
    PMC
    Stage III Cost: Estimate ~$85,000 (adjuvant chemo + higher surveillance and complication
    rates). (Estimate) PMC
    Stage IV Cost: $113,889 (initial phase mean for Stage IV, Source). PMC
    SOURCE 12:
    Name: Endometrial (uterine) cancer — phase- and line-of-therapy cost analyses in
    commercially insured U.S. cohorts (JHEOR / MarketScan)
    URL:
    https://jheor.org/article/88419-healthcare-resource-utilization-and-costs-among-commercially-ins
    ured-patients-with-advanced-or-recurrent-endometrial-cancer-initiating-first-line-ther
    Description: U.S. MarketScan / commercial claims study reporting per-patient-per-month
    (PPPM) and phase costs for advanced/recurrent endometrial cancer; other cohort studies report
    stage/phase differences. JHEORPMC
    Data:
    Surgery costs: Hysterectomy/radical surgery included in early-stage cost totals. PMC
    Chemotherapy: Major driver for advanced disease; 1L/2L therapy PPPM reported. JHEOR
    Geographic variation: Mixed payer data — not the main output. PMC
    Insurance typical coverage: Commercial claims perspective (insurer + patient share). JHEOR
    Stage I Cost: Estimate ~$22,000 (surgery only with short followup; derived from cohort
    medians for early-stage without adjuvant therapy). (Estimate method: institutional cohort
    medians). PMC
    Stage II Cost: Estimate ~$35,000 (surgery + adjuvant radiation/chemo as needed). (Estimate)
    PMC
    Stage III Cost: Estimate ~$70,000 (multimodal therapy, higher inpatient/RT). (Estimate derived
    from advanced cohort PPPM scaled to Year-1). JHEOR
    Stage IV Cost: Estimate ~$120,000 (advanced/recurrent 1L + higher PPPM and inpatient care;
    JHEOR reported high PPPM for metastatic patients). (Estimate) JHEOR
    SOURCE 13:
    Name: Esophageal cancer — treatment costs by phase and stage (U.S. claims / phase-of-care
    analysis)
    URL: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6718574/
    Description: Phase-of-care analysis with numeric initial/continuing/terminal phase costs
    stratified by stage (US claim-based methods). Provides detailed phase values (initial,
    continuing, terminal) with stage comparisons. PMC
    Data:
    Surgery costs: Included in initial-phase totals (esophagectomy is a major component). PMC
    Chemotherapy / radiation: Included — chemoradiation is a common cost driver for Stage II–III.
    PMC
    Geographic variation: Not primary output; study uses claims cohorts. PMC
    Insurance typical coverage: Claims-based (payer perspective). PMC
    Stage I Cost: Initial phase mean ≈ $2,338 (continuing phase per-month) — to convert to a
    simple Year-1 style number I estimate Stage I ≈ $28,000 (Estimate; converted from phase
    monthly numbers × typical phase lengths). PMC
    Stage II Cost: Initial phase mean ≈ $9,171 (per initial-phase period) → Estimate Stage II
    Year-1 ≈ $55,000 (Estimate method: study initial-phase value scaled to typical initial-phase
    duration). PMC
    Stage III Cost: Initial-phase mean ≈ $9,249 → Estimate Stage III Year-1 ≈ $60,000
    (Source/Estimate). PMC
    Stage IV Cost: Initial-phase mean reported highest for Stage IV ≈ $9,263 (study
    initial-phase number) → Estimate Stage IV Year-1 ≈ $40,000–$120,000 depending on
    survival and lines of therapy (I provide a single-year estimate ~$45,000 using median survival ×
    monthly costs). PMC
    SOURCE 14:
    Name: Retinoblastoma (eye cancer in children) — treatment cost case series and resource-use
    analyses (U.S./international cohorts)
    URL: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3468280/
    Description: Cost analyses of retinoblastoma showing per-patient totals by treatment pathway
    (enucleation vs chemo + focal therapy vs advanced therapy). Good U.S.-relevant cost item
    examples. PMC
    Data:
    Surgery costs: Enucleation / focal procedures included in totals (one-off surgical + anesthesia +
    hospitalization). PMC
    Chemotherapy: Systemic and intra-arterial chemo costs are major drivers; repeated EUA (exam
    under anesthesia) add cost. PMC
    Geographic variation: Not the main focus; cost examples are from US/Europe cohorts. PMC
    Insurance typical coverage: Pediatric oncology coverage varies by plan; many items billed to
    insurers + family OOP. PMC
    Stage/Group (intraocular vs extraocular) — converted to Stage I–IV mapping for your site:
    ● Stage I (small intraocular, focal therapy): Estimate ~$25,000 (focal laser/cryotherapy,
    EUA visits). (Estimate from cohort figures). PMC
    ● Stage II (larger intraocular, chemoreduction + focal): Estimate ~$100,000 (chemo cycles
    + multiple EUAs). (Estimate; derived from per-case totals). PMC
    ● Stage III (advanced intraocular needing enucleation + adjuvant therapy): Estimate
    ~$150,000 (enucleation + rehab + systemic therapy). (Estimate). PMC
    ● Stage IV (extraocular/metastatic): Estimate ~$250,000–$500,000 (systemic chemo,
    HSCT in some cases, long-term care). (Estimate; supported by high totals in severe
    cases from literature). PMC
    SOURCE 15:
    Name: Gallbladder cancer — (no single U.S. stage-by-stage cost paper found) — used biliary
    tract / BTC claims & SEER summaries to build estimates
    Primary URLs:
    ● Biliary tract cost & outcomes review:
    https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9568962/
    ● SEER/ACS gallbladder background:
    https://www.cancer.org/cancer/types/gallbladder-cancer/about/key-statistics.html
    Description: Gallbladder cancer stage-specific cost tables were not found for the U.S. —
    this entry gives estimates for all stages built from biliary-tract claims PPPM data and
    survival by stage. PMCAmerican Cancer Society
    Data:
    Surgery costs: Resection/major hepatectomy costs are large — typical hospital & OR
    charges are major initial-phase drivers. The Lancet
    Chemotherapy: Systemic chemo for advanced disease increases PPPM costs
    markedly; many cases present late. PMC
    Geographic variation: Not well characterized in the literature. PMC
    Insurance typical coverage: Mix of Medicare and commercial payers in studies. PMC
    Stage I Cost: Estimate ~$40,000 (simple cholecystectomy + pathology + follow-up).
    (Estimate method: extrapolated from other biliary tract initial-phase costs). PMC
    Stage II Cost: Estimate ~$75,000 (extended resection + longer hospitalization).
    (Estimate) The Lancet
    Stage III Cost: Estimate ~$150,000 (major resection, adjuvant therapy, longer
    recovery). (Estimate) The Lancet
    Stage IV Cost: Estimate ~$60,000–$250,000 depending on survival and systemic
    therapy; single-point estimate ~$100,000 (Estimate based on PPPM for BTC × median
    advanced survival). (Estimate) PMC
    SOURCE 16:
    Name: Gastrointestinal stromal tumor (GIST) — real-world treatment costs & 5-year cumulative
    costs (US cohorts)
    URL: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3068873/ (epidemiology & cost by tumor
    size) and https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11882225/ (trends & costs)
    Description: U.S. studies reporting first-year costs, 5-year cumulative costs, and cost
    differences by tumor size / recurrence status; some first-year totals are reported. PMC+1
    Data:
    Surgery costs: Resection costs (hospital + OR) are main initial drivers; adjuvant imatinib (and
    later-line TKIs) add drug costs. Journal of Gastrointestinal Oncology
    Chemotherapy (TKIs): Imatinib and later-line TKIs are major lifetime cost drivers. PMC
    Geographic variation: Not a primary output; datasets use US hospitalizations. Journal of
    Gastrointestinal Oncology
    Insurance typical coverage: Mix of commercial / Medicare depending on study cohort. PMC
    Stage I (localized, small tumor) Cost: Estimate / Source-based ≈ $2,650 – $35,478 first-year
    (depending on tumor size; example study reported $2,650 for <3 cm and $35,478 first-year
    costs in earlier Rubin et al. study). I’ll use a midpoint: ~$20,000 (Source/Estimate). PMCJournal
    of Gastrointestinal Oncology
    Stage II (larger localized or need adjuvant imatinib): Estimate ~$45,000 (surgery + adjuvant
    drug 1 year). (Estimate) PMC
    Stage III (recurrent / locally advanced requiring prolonged TKI): Estimate ~$100,000
    (multi-year drug costs + interventions). (Estimate) PMC
    Stage IV (metastatic): Estimate $150,000+ cumulative over years (depends on TKI sequence
    length) — 5-year cumulative costs for recurrence cohorts have been reported near $83,400 for
    non-recurrent and much higher with recurrence; I use ~$150,000 as a working estimate. PMC
    SOURCE 17:
    Name: Head & neck cancers (oral cavity, oropharynx, larynx, hypopharynx) — systematic
    review and SEER/claims analyses (US perspective)
    Primary URLs:
    ● Systematic review: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4153967/
    ● Survivorship cost study (JAMA Otolaryngology):
    https://jamanetwork.com/journals/jamaotolaryngology/fullarticle/2797523
    Description: US studies reporting per-patient costs (initial 6–12 months) and
    survivorship excess costs by tumor site (hypopharynx and larynx often high). PMCJAMA
    Network
    Data:
    Surgery costs: Major component when resection + reconstruction required
    (microvascular free flaps). BioMed Central
    Chemotherapy / radiation: Combined chemoradiation is a core cost driver for locally
    advanced disease. BioMed Central
    Geographic variation: Present but not primary output. PMC
    Insurance typical coverage: Mix of Medicare and commercial; studies often separate by
    payer. JAMA Network
    Stage I Cost: Estimate ~$25,000 (single-site resection ± RT; early disease). (Estimate
    based on 6-month and initial-phase studies). BioMed Central
    Stage II Cost: Estimate ~$40,000 (resection ± adjuvant RT). (Estimate) BioMed Central
    Stage III Cost: Estimate ~$80,000 (multimodal—surgery + chemoRT or definitive
    chemoradiation with higher hospitalization). (Estimate) BioMed Central
    Stage IV Cost: Estimate ~$120,000 (advanced disease, recurrent care, salvage
    surgery, prolonged rehab). (Estimate; JAMA survivorship excess costs show high PPPM
    for hypopharynx). JAMA Network
    SOURCE 18:
    Name: Kidney (renal cell carcinoma, RCC) — stage-specific cost & burden analyses
    (SEER-Medicare and claims reviews)
    Primary URLs:
    ● Rising economic burden of RCC (review):
    https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6885100/
    ● Economic burden (review & stage data):
    https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6886358/
    Description: US-focused analyses reporting stage-stratified net costs, PPPM, and
    multi-year cumulative costs for RCC; metastatic (Stage IV) costs much higher. PMC+1
    Data:
    Surgery costs: Nephrectomy (partial or radical) major initial-phase driver.
    Procedure-level cost comparisons exist (open vs PN vs ablation). Jvir
    Chemotherapy / targeted therapy / IO: TKIs and immunotherapy add large ongoing
    costs for metastatic disease. PMC
    Geographic variation: Not the central output; claims-based. PMC
    Insurance typical coverage: Medicare/population-mix in cited studies. PMC
    Stage I Cost: Estimate / Source-based ~$20,000–$40,000 (surgery + short follow-up);
    use $30,000 as working figure (Estimate derived from procedure-level cost studies). Jvir
    Stage II Cost: Estimate ~$50,000 (larger surgery, more complex care). (Estimate) PMC
    Stage III Cost: Estimate ~$120,000 (nodal disease, multimodal treatment and
    surveillance). (Estimate) PMC
    Stage IV Cost: Source-informed estimate: per-patient 5-year cumulative totals
    >$500,000 reported in some analyses for Stage-IV patients — Estimate Stage IV
    1-year cost ≈ $100,000–$250,000; 5-year cumulative >$500,000 (Source/Estimate).
    ScienceDirectPMC
    SOURCE 19:
    Name: Laryngeal & hypopharyngeal cancer (subset of head & neck) — survivorship &
    treatment cost analyses (US claims & survivorship studies)
    URL: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4153967/ (systematic review) and
    https://jamanetwork.com/journals/jamaotolaryngology/fullarticle/2797523 (site-specific
    survivorship costs)
    Description: Data on excess survivorship costs show hypopharynx/larynx among highest
    per-month survivorship costs; treatment costs for advanced laryngeal disease include surgery,
    radiation, and long-term rehab. PMCJAMA Network
    Data:
    Surgery costs: Laryngectomy + reconstruction and voice rehabilitation are expensive initial
    costs. BioMed Central
    Chemotherapy / radiation: Definitive chemoRT common for organ preservation (costly). BioMed
    Central
    Geographic variation: Present but not central. PMC
    Insurance typical coverage: Mixed; many studies use Medicare cohorts. JAMA Network
    Stage I Cost: Estimate ~$22,000 (early glottic/limited disease treated with RT or small
    surgery). (Estimate) BioMed Central
    Stage II Cost: Estimate ~$45,000 (bigger resections or RT with higher resource use).
    (Estimate) BioMed Central
    Stage III Cost: Estimate ~$90,000 (combined modality — surgery + adjuvant chemo/RT or
    definitive chemoRT). (Estimate) BioMed Central
    Stage IV Cost: Estimate ~$160,000 (recurrent/salvage surgery, prolonged inpatient care,
    rehab). (Estimate) JAMA Network
    SOURCE 20:
    Name: Leukemia (representative — AML, CLL, CML) — phase-based U.S. cost studies and
    specialty analyses
    Primary URLs:
    ● AML phase & cost (inpatient / HSCT costs):
    https://www.astctjournal.org/article/S1083-8791%2815%2901491-3/fulltext (AML costs;
    HSCT costs) ASTCT Journal
    ● CLL lifetime cost model: reporting lifetime costs up to ~$1,142,357 (model) / ASH
    abstract & payer reports. ASH PublicationsBlood Cancers Today
    Description: Hematologic malignancies are usually reported by phase of care
    (initial/continuing/terminal) rather than AJCC stages — I mapped these phases to Stage
    I–IV for your site (Stage I→Initial; Stage II–III→Continuing; Stage
    IV→Terminal/End-of-life) and provide source-based numbers where available. PMC
    Data:
    Surgery costs: Usually minimal (central line placement, diagnostic biopsies); HSCT is a
    major one-time cost in some subtypes. ASTCT Journal
    Chemotherapy / targeted therapy: Main cost driver — especially oral targeted agents,
    monoclonals, CAR-T, HSCT. Examples: HSCT mean cost ~ $352,333 (event-level mean)
    in some U.S. analyses; induction AML mean ~$145,189 (commercial cohort). ASTCT
    JournalPMC
    Geographic variation: Present; payer mix (Medicare vs commercial) strongly affects
    totals. Leukemia & Lymphoma Society
    Insurance typical coverage: Varies; many analyses use Medicare or commercial claims.
    Jmcp
    Stage I (Initial phase) Cost: AML example: $145,000 – $280,762 year-1 depending on
    induction + HSCT (Source). For a general leukemia initial-phase working number:
    $150,000 (Source/Estimate). PMCASTCT Journal
    Stage II (Continuing phase) Cost: Estimate $30,000–$80,000/year (oral-targeted
    agents or maintenance therapy; Source-based ranges from CLL/CLL studies). (Estimate)
    PMCScienceDirect
    Stage III (Continuing/relapsed) Cost: Estimate $100,000 (salvage therapies, bridging to
    transplant; Estimate from event-level HSCT costs & salvage therapy PPPM). ASTCT
    Journal
    Stage IV (Terminal / HSCT & end-of-life) Cost: Source-based — HSCT event mean
    cost **$352,333** (event-level) and terminal-phase costs often exceed $100,000; lifetime
    estimates for some subtypes (e.g., CLL) can exceed $1,100,000 (model). Use
    **$350,000** as a Stage-IV working figure (Source/Estimate). ASTCT JournalASH
    Publications
    SOURCE 21:
    Name: Liver cancer (Hepatocellular carcinoma, HCC)
    URL: https://www.cancer.org/cancer/liver-cancer.html (ACS) / https://www.cancer.gov/types/liver
    (NCI)
    Description: US clinical & epidemiology pages; cost literature often uses phase-based analyses
    (initial, continuing, terminal).
    Data:
    ● Stage I Cost: Estimate ~$40,000 (resection / ablation ± surveillance).
    ● Stage II Cost: Estimate ~$75,000 (liver resection, possible adjuvant care).
    ● Stage III Cost: Estimate ~$120,000 (major resection or loco-regional therapy + inpatient
    care).
    ● Stage IV Cost: Estimate (Year‑1) ~$150,000–$250,000 (systemic therapy, TACE, Y-90;
    terminal-phase costs high).
    Estimate method: blended from U.S. claims phase studies (initial & terminal phase
    costs) and major procedure charge data.
    SOURCE 22:
    Name: Lung cancer (NSCLC and SCLC)
    URL: https://www.cancer.org/cancer/lung-cancer.html / review cost studies (SEER-Medicare)
    Description: Numerous US claims/SEER analyses report stage-specific Year‑1 and lifetime
    costs.
    Data:
    ● Stage I Cost: $30,000–$60,000 (Estimate / Source-range) (surgery ± adjuvant; some
    SEER-Medicare numbers near $40k).
    ● Stage II Cost: Estimate ~$60,000 (lobectomy + adjuvant chemo when indicated).
    ● Stage III Cost: Estimate ~$100,000 (multimodal—chemoRT, surgery for selected).
    ● Stage IV Cost: Source/Estimate ~$120,000–$200,000 (systemic therapy incl
    targeted/IO greatly increases cost; several US papers report Stage‑IV Year‑1 ~$130k).
    Estimate method: synthesis of SEER-Medicare initial-phase numbers & payer studies.
    SOURCE 23:
    Name: Lymphoma (Hodgkin & Non-Hodgkin)
    URL: https://www.cancer.org/cancer/lymphoma.html / NCI lymphoma pages
    Description: Hematologic cancers — often costed by phase (initial, continuing, terminal) and by
    subtype (diffuse large B‑cell, follicular, Hodgkin).
    Data:
    ● Stage I Cost: Estimate ~$25,000–$70,000 (initial chemo ± RT; Hodgkin early care lower
    than DLBCL intensive regimens).
    ● Stage II Cost: Estimate ~$60,000 (multi‑drug chemo ± RT).
    ● Stage III Cost: Estimate ~$90,000 (more cycles, possible hospitalizations).
    ● Stage IV Cost: Estimate ~$150,000–$300,000 (salvage chemo, ASCT, CAR‑T in some
    cases; end-of-life care).
    Estimate method: phase-based US cost studies & transplant/CAR‑T event costs.
    SOURCE 24:
    Name: Mesothelioma
    URL: https://www.cancer.org/cancer/malignant-mesothelioma.html / select claims studies
    Description: Rare thoracic tumor; costs driven by surgery (extrapleural pneumonectomy),
    chemo, palliative care.
    Data:
    ● Stage I Cost: Estimate ~$60,000 (major surgery + hospitalization).
    ● Stage II Cost: Estimate ~$90,000 (surgery + adjuvant chemo/RT).
    ● Stage III Cost: Estimate ~$130,000 (multimodal therapy).
    ● Stage IV Cost: Estimate ~$180,000 (palliative systemic therapy, prolonged care).
    Estimate method: extrapolated from US hospital charge data and claims studies.
    SOURCE 25:
    Name: Multiple Myeloma
    URL: https://www.cancer.org/cancer/multiple-myeloma.html / NCI / payer reports
    Description: Chronic hematologic malignancy — costs driven by novel agents, repeated cycles,
    transplant, and long-term maintenance.
    Data:
    ● Stage I (initial diagnosis/induction) Cost: Estimate ~$80,000 (induction chemo ± ASCT if
    eligible).
    ● Stage II (continuing/maintenance) Cost: Estimate ~$40,000/year (oral maintenance
    agents included).
    ● Stage III (relapsed/refractory) Cost: Estimate ~$150,000 (salvage regimens,
    carfilzomib/pomalidomide, hospitalization).
    ● Stage IV (terminal/high-intensity care) Cost: Estimate ~$200,000+ (cumulative costs
    and palliative care).
    Estimate method: compiled from U.S. cost-of-care analyses and transplant event costs.
    SOURCE 26:
    Name: Myelodysplastic syndromes (MDS) / Myeloproliferative neoplasms (MPN)
    URL: https://www.cancer.org/cancer/myelodysplastic-syndrome.html / PMC review articles
    Description: Often phase-based; many patients have chronic care costs and transfusion
    dependence.
    Data:
    ● Stage I (initial, low-risk) Cost: Estimate ~$15,000/year (diagnostics, transfusions
    intermittently).
    ● Stage II (higher-risk) Cost: Estimate ~$50,000/year (more transfusions, growth factors,
    hospitalizations).
    ● Stage III (progression to AML or intensive therapy) Cost: Estimate ~$150,000 (AML-like
    induction/HSCT).
    ● Stage IV (terminal) Cost: Estimate ~$100,000–$200,000 (end-of-life care; HSCT if done
    raises costs).
    Estimate method: transfusion & hospitalization PPPM extrapolation from U.S. claims
    papers.
    SOURCE 27:
    Name: Neuroendocrine tumors (NETs) — e.g., pancreatic NETs, carcinoid
    URL: https://www.cancer.org/cancer/neuroendocrine-tumors.html / cost studies for NET drug
    therapy
    Description: Costs vary hugely — localized surgical cures vs long-term targeted/SSA drug costs
    for metastases.
    Data:
    ● Stage I Cost: Estimate ~$25,000 (surgery).
    ● Stage II Cost: Estimate ~$50,000 (surgery + follow-up).
    ● Stage III Cost: Estimate ~$100,000 (resection + longer drug therapy).
    ● Stage IV Cost: Estimate ~$200,000+ (long-term somatostatin analogs, targeted
    therapies, hepatic-directed therapies).
    Estimate method: drug-cost driven extrapolation + procedure charges.
    SOURCE 28:
    Name: Neuroblastoma (pediatric)
    URL: https://www.cancer.org/cancer/neuroblastoma.html / pediatric oncology cost studies
    Description: Pediatric tumor — costs by risk-group/INSS stage; high for high-risk (chemo,
    immunotherapy, HSCT).
    Data:
    ● Stage I Cost (low risk) : Estimate ~$30,000 (surgery, short inpatient).
    ● Stage II Cost: Estimate ~$70,000 (surgery + adjuvant chemo sometimes).
    ● Stage III Cost: Estimate ~$200,000 (intensive chemo, surgery, RT).
    ● Stage IV Cost: Estimate ~$600,000 (high‑risk multimodal therapy incl HSCT,
    immunotherapy, prolonged ICU/hospitalization).
    Estimate method: pediatric cost studies & HSCT/immunotherapy event costs in US
    cohorts.
    SOURCE 29:
    Name: Ovarian cancer (epithelial + germ cell)
    URL: https://www.cancer.org/cancer/ovarian-cancer.html / SEER-Medicare cost studies
    Description: Several US studies give stage-specific Year‑1 and lifetime costs. Advanced
    disease and maintenance therapies raise costs.
    Data:
    ● Stage I Cost: Estimate/Source-range ~$30,000 (surgery ± limited chemo).
    ● Stage II Cost: Estimate ~$60,000 (surgery + chemo).
    ● Stage III Cost: Source/Estimate ~$100,000 (cytoreduction surgery + chemo).
    ● Stage IV Cost: Source/Estimate ~$150,000–$300,000 (recurrent disease + multiple
    chemo lines; some studies report high lifetime costs).
    Estimate method: claims and cohort-based stage tables.
    SOURCE 30:
    Name: Pancreatic cancer (exocrine)
    URL: https://www.cancer.org/cancer/pancreatic-cancer.html / SEER-Medicare analyses
    Description: High-cost cancer with poor survival; US studies provide stage-stratified initial and
    lifetime costs.
    Data:
    ● Stage I Cost: Estimate ~$60,000 (Whipple resection + hospital stay).
    ● Stage II Cost: Estimate ~$80,000 (resection + adjuvant chemo).
    ● Stage III Cost: Estimate ~$120,000 (locally advanced multimodal care).
    ● Stage IV Cost: Source/Estimate ~$100,000 (shorter survival; high per-month chemo
    cost; treat as ~ $60k–$120k depending on duration).
    Estimate method: surgical charge data + claims per-month × median survival.
    SOURCE 31:
    Name: Penile cancer
    URL: https://www.cancer.org/cancer/penile-cancer.html / limited US cost papers
    Description: Rare; costs driven by surgery, reconstruction, and possible chemo/RT in advanced
    disease.
    Data:
    ● Stage I Cost: Estimate ~$20,000 (local excision).
    ● Stage II Cost: Estimate ~$40,000 (partial penectomy + lymph node eval).
    ● Stage III Cost: Estimate ~$80,000 (inguinal node dissection ± adjuvant therapy).
    ● Stage IV Cost: Estimate ~$150,000 (systemic therapy, palliative care).
    Estimate method: extrapolated from surgical charge data and node-dissection
    hospitalization costs.
    SOURCE 32:
    Name: Pituitary tumors (adenomas)
    URL: https://www.cancer.org/cancer/pituitary-tumors.html / neurosurgery cost reports
    Description: Most pituitary adenomas are benign; costs driven by transsphenoidal surgery and
    follow-up endocrine care. Staging not AJCC — mapped to minor/moderate/major disease.
    Data (mapped to Stage I–IV):
    ● Stage I (microadenoma, medical Rx): Estimate ~$5,000–$15,000 (medical management
    & imaging).
    ● Stage II (macroadenoma, surgery): Estimate ~$40,000 (transsphenoidal resection +
    hospital).
    ● Stage III (recurrent/complex): Estimate ~$80,000 (repeat surgery + RT).
    ● Stage IV (invasive/metastatic rare): Estimate ~$150,000 (multiple surgeries, RT,
    extended medical therapy).
    Estimate method: US procedure & neurosurgical cost averages.
    SOURCE 33:
    Name: Prostate cancer
    URL: https://www.cancer.org/cancer/prostate-cancer.html / SEER-Medicare analyses
    Description: Many US studies provide stage- and risk‑group-specific first-year and lifetime
    costs. Active surveillance, surgery, radiation, and ADT create broad ranges.
    Data:
    ● Stage I Cost: Estimate/Source-range ~$10,000–$30,000 (active surveillance or
    prostatectomy/radiation).
    ● Stage II Cost: Estimate ~$20,000–$50,000 (definitive therapy ± ADT).
    ● Stage III Cost: Estimate ~$50,000–$100,000 (multimodal therapy).
    ● Stage IV Cost: Estimate ~$80,000–$300,000 (androgen-deprivation, novel agents,
    chemo; lifetime costs of metastatic castrate-resistant models high).
    Estimate method: SEER-Medicare and payer cohort synthesis.
    SOURCE 34:
    Name: Skin cancers — Melanoma (and non‑melanoma skin cancer)
    URL: https://www.cancer.org/cancer/melanoma-skin-cancer.html / cost studies for melanoma
    Description: Melanoma stage-specific costs well-studied; advanced melanoma costs increase
    substantially with immunotherapy/targeted agents.
    Data:
    ● Stage I Cost: Estimate ~$5,000–$15,000 (wide local excision, sentinel node).
    ● Stage II Cost: Estimate ~$15,000–$40,000 (more extensive surgery + possible adjuvant
    therapy).
    ● Stage III Cost: Source/Estimate ~$75,000–$150,000 (node dissection + adjuvant
    targeted/IO).
    ● Stage IV Cost: Source/Estimate ~$150,000–$400,000+ (immunotherapy, targeted
    agents, hospitalization).
    Estimate method: US studies of melanoma costs by AJCC stage and drug-cost data.
    SOURCE 35:
    Name: Soft tissue sarcoma (STS) — includes many subtypes (e.g., liposarcoma,
    leiomyosarcoma)
    URL: https://www.cancer.org/cancer/soft-tissue-sarcoma.html / US cost/claims reviews
    Description: Variable costs — surgery with limb-sparing reconstructions, prostheses, RT, and
    chemo for selected subtypes.
    Data:
    ● Stage I Cost: Estimate ~$30,000 (surgery ± RT).
    ● Stage II Cost: Estimate ~$70,000 (surgery + RT + chemo for some).
    ● Stage III Cost: Estimate ~$150,000 (complex resections, reconstructions).
    ● Stage IV Cost: Estimate ~$200,000+ (systemic therapies, palliative care).
    Estimate method: combined surgery + rehab + systemic therapy cost extrapolation.
    SOURCE 36:
    Name: Stomach (gastric) cancer
    URL: https://www.cancer.org/cancer/stomach-cancer.html / SEER-Medicare-based cost
    analyses
    Description: Stage-stratified costs exist in some SEER-based U.S. papers; surgery
    (subtotal/total gastrectomy) and chemoradiation major drivers.
    Data:
    ● Stage I Cost: Estimate ~$40,000 (surgery + hospitalization).
    ● Stage II Cost: Estimate ~$75,000 (surgery + adjuvant chemo/RT).
    ● Stage III Cost: Estimate ~$120,000 (multimodal therapy).
    ● Stage IV Cost: Estimate ~$60,000–$200,000 (metastatic systemic therapy; depends on
    survival).
    Estimate method: initial-phase claims numbers scaled by typical survival.
    SOURCE 37:
    Name: Testicular cancer
    URL: https://www.cancer.org/cancer/testicular-cancer.html / SEER/claims cost papers
    Description: Testicular cancer costs vary by stage; early-stage surgery and surveillance vs
    advanced multi-line chemo. US analyses report stage-specific costs.
    Data:
    ● Stage I Cost: Estimate / Source-range ~$10,000–$25,000 (orchiectomy + surveillance).
    ● Stage II Cost: Estimate ~$40,000–$80,000 (retroperitoneal node dissection ± chemo).
    ● Stage III Cost: Estimate ~$120,000 (multiple chemo cycles, salvage therapy).
    ● Stage IV Cost: Estimate ~$200,000+ (salvage, high-dose chemo + stem cell rescue in
    some).
    Estimate method: payer cohorts and event-cost extrapolation.
    SOURCE 38:
    Name: Thymus cancer (Thymoma / Thymic carcinoma)
    URL: https://www.cancer.org/cancer/thymus-cancer.html / limited US cost papers
    Description: Rare mediastinal tumors — surgery and multimodal therapy for advanced disease.
    Stage tables rarely detailed in cost literature.
    Data:
    ● Stage I Cost: Estimate ~$30,000 (resection).
    ● Stage II Cost: Estimate ~$60,000 (resection + adjuvant RT).
    ● Stage III Cost: Estimate ~$120,000 (multimodal therapy).
    ● Stage IV Cost: Estimate ~$180,000 (systemic therapy, prolonged care).
    Estimate method: surgical & thoracic oncology charge extrapolation.
    SOURCE 39:
    Name: Thyroid cancer
    URL: https://www.cancer.org/cancer/thyroid-cancer.html / SEER-Medicare studies
    Description: Most thyroid cancers are low-cost early (surgery + follow-up); advanced anaplastic
    thyroid costs much higher. US studies provide stage stratifications.
    Data:
    ● Stage I Cost: Estimate/Source-range ~$10,000–$25,000 (thyroidectomy + follow-up).
    ● Stage II Cost: Estimate ~$30,000 (more extensive surgery or RAI).
    ● Stage III Cost: Estimate ~$70,000 (reoperations, RT).
    ● Stage IV Cost: Estimate ~$150,000–$300,000 (advanced systemic therapy, palliative
    care).
    Estimate method: procedure-cost + RAI + advanced therapy extrapolation.
    SOURCE 40:
    Name: Uterine sarcoma (distinct from endometrial carcinoma)
    URL: https://www.cancer.org/cancer/uterine-sarcoma.html / limited cost studies
    Description: Rare uterine sarcomas — aggressive surgical care and chemo/RT for advanced
    disease; limited stage-by-stage cost literature.
    Data:
    ● Stage I Cost: Estimate ~$40,000 (hysterectomy + staging).
    ● Stage II Cost: Estimate ~$75,000 (more complex surgery + adjuvant therapy).
    ● Stage III Cost: Estimate ~$120,000 (multimodal therapy).
    ● Stage IV Cost: Estimate ~$200,000 (systemic therapy, palliative care).
    Estimate method: extrapolated from uterine/soft-tissue sarcoma costs.
    Batch 5 (cancers 41–44)
    SOURCE 41:
    Name: Vaginal cancer
    URL: https://www.cancer.org/cancer/vaginal-cancer.html / scarce US cost papers
    Description: Rare gynecologic tumor — RT and chemoradiation frequent; limited detailed US
    stage cost tables.
    Data:
    ● Stage I Cost: Estimate ~$20,000 (local excision or RT).
    ● Stage II Cost: Estimate ~$50,000 (RT + chemo).
    ● Stage III Cost: Estimate ~$100,000 (extensive RT + chemo; possible surgery).
    ● Stage IV Cost: Estimate ~$150,000 (systemic and palliative care).
    Estimate method: gynecologic RT and hospitalization cost extrapolation.
    SOURCE 42:
    Name: Vulvar cancer
    URL: https://www.cancer.org/cancer/vulvar-cancer.html / SEER-based cohort reports
    Description: Costs driven by excision, node dissection, and adjuvant therapy; stage tables
    limited in US.
    Data:
    ● Stage I Cost: Estimate ~$15,000 (local excision + follow-up).
    ● Stage II Cost: Estimate ~$35,000 (partial vulvectomy ± node evaluation).
    ● Stage III Cost: Estimate ~$80,000 (node dissection + radiation).
    ● Stage IV Cost: Estimate ~$120,000 (recurrent/systemic therapy).
    Estimate method: surgical cost + RT + inpatient care extrapolation.
    SOURCE 43:
    Name: Wilms tumor (pediatric nephroblastoma)
    URL: https://www.cancer.org/cancer/wilms-tumor.html / pediatric oncology cost studies
    Description: Pediatric kidney tumor — costs vary by stage and risk; high for advanced
    multimodal regimens.
    Data:
    ● Stage I Cost: Estimate ~$30,000 (nephrectomy + short chemo).
    ● Stage II Cost: Estimate ~$70,000 (surgery + adjuvant chemo).
    ● Stage III Cost: Estimate ~$150,000 (multimodal therapy including RT).
    ● Stage IV Cost: Estimate ~$300,000 (metastatic therapy, HSCT rare; prolonged
    hospitalization).
    Estimate method: pediatric treatment protocol costings & HSCT/RT event costs
    extrapolated.
    SOURCE 44:
    Name: Waldenström macroglobulinemia (WM)
    URL: https://www.cancer.org/cancer/lymphoma-other-types.html (WM is a subtype) / review
    cost models for indolent lymphomas
    Description: Indolent B‑cell neoplasm — chronic therapy with rituximab, BTKi agents (ibrutinib)
    and occasional transfusions/hospitalizations. Costs are phase-based and cumulative over long
    durations.
    Data:
    ● Stage I (initial diagnosis, watchful waiting) Cost: Estimate ~$5,000–$15,000/year
    (surveillance).
    ● Stage II (requires therapy) Cost: Estimate ~$40,000 (chemo/infusion-based therapy).
    ● Stage III (relapsed/more intensive) Cost: Estimate ~$100,000 (BTK inhibitors long-term;
    infusion therapies).
    ● Stage IV (end-stage/complications) Cost: Estimate ~$150,000+ (hospitalizations, high
    drug burden).
    Estimate method: drug-cost and chronic-care modeling from indolent lymphoma
    economic studies.`

    this.initializeForm()
  }

  initializeForm() {
    const form = document.getElementById("costForm")
    if (!form) return

    form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.calculateCosts()
    })
  }

  async calculateCosts() {
    const resultsDiv = document.getElementById("results")
    const loadingDiv = document.getElementById("loading")

    const formData = new FormData(document.getElementById("costForm"))
    const userInfo = {
      cancerType: formData.get("cancerType"),
      stage: formData.get("stage"),
      age: formData.get("age"),
      insurance: formData.get("insurance"),
    }

    if (!userInfo.cancerType || !userInfo.stage || !userInfo.age) {
      this.showError("Please fill in all required fields.")
      return
    }

    if (loadingDiv) loadingDiv.style.display = "block"
    if (resultsDiv) resultsDiv.style.display = "none"

    try {
      console.log("Calling Gemini API...")
      const response = await this.callGeminiAPI(userInfo, this.sources)
      this.displayResults(response, userInfo)
    } catch (error) {
      console.error("Error:", error)
      this.showError(`Failed to get cost estimates: ${error.message}`)
    } finally {
      if (loadingDiv) loadingDiv.style.display = "none"
    }
  }

  async callGeminiAPI(userInfo, sources) {
    const prompt = this.buildPrompt(userInfo, sources)

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Invalid response from Gemini API")
    }

    return data.candidates[0].content.parts[0].text
  }

  buildPrompt(userInfo, sources) {
    return `You are a medical cost estimation assistant. Based on the provided information and sources, provide detailed cost estimates for cancer treatment.

SOURCES AND REFERENCE DATA:
${sources || "No additional sources provided. Use your general knowledge of cancer treatment costs."}

PATIENT INFORMATION:
- Cancer Type: ${userInfo.cancerType}
- Stage: ${userInfo.stage}
- Age: ${userInfo.age}
- Insurance: ${userInfo.insurance}

REQUIRED OUTPUT FORMAT:
Please provide your response in the following JSON format (ensure it's valid JSON):

{
  "totalEstimate": {
    "low": [number],
    "high": [number],
    "currency": "USD"
  },
  "breakdown": [
    {
      "category": "Surgery",
      "low": [number],
      "high": [number],
      "description": "Brief description"
    },
    {
      "category": "Chemotherapy",
      "low": [number],
      "high": [number],
      "description": "Brief description"
    },
    {
      "category": "Radiation Therapy",
      "low": [number],
      "high": [number],
      "description": "Brief description"
    },
    {
      "category": "Medications",
      "low": [number],
      "high": [number],
      "description": "Brief description"
    },
    {
      "category": "Follow-up Care",
      "low": [number],
      "high": [number],
      "description": "Brief description"
    }
  ],
  "factors": [
    "List of factors affecting cost estimates"
  ],
  "disclaimer": "Important disclaimer about cost estimates",
  "sources_used": [
    {
      "name": "Source Name",
      "url": "https://example.com",
      "description": "Description of what information this source provided"
    }
  ]
}

INSTRUCTIONS:
1. Provide realistic cost estimates based on current medical costs
2. Consider the patient's insurance status when providing estimates
3. Include all relevant treatment categories that apply to this cancer type and stage
4. Provide cost ranges (low to high) to account for variability
5. Include important factors that could affect costs
6. Add appropriate medical disclaimers
7. Reference the sources provided when applicable
8. Ensure all numbers are realistic and based on current healthcare costs

Respond ONLY with the JSON format specified above. Do not include any additional text or formatting.`
  }

  displayResults(apiResponse, userInfo) {
    const resultsDiv = document.getElementById("results")
    if (!resultsDiv) return

    try {
      
      let data;
      try {
        if (typeof apiResponse === 'object') {
          data = apiResponse;
        } else {
          let cleaned = String(apiResponse).trim();

          // Strip markdown code fences (```json or ```)
          const fenceMatch = cleaned.match(/```(?:json)?\n?([\s\S]*?)```/i);
          if (fenceMatch && fenceMatch[1]) {
            cleaned = fenceMatch[1].trim();
          }

          // Try direct JSON parse first
          try {
            data = JSON.parse(cleaned);
          } catch (e) {
            // Try to extract JSON object or array from a larger text blob
            const firstObj = cleaned.indexOf('{');
            const lastObj = cleaned.lastIndexOf('}');
            if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
              const jsonSub = cleaned.substring(firstObj, lastObj + 1);
              try {
                data = JSON.parse(jsonSub);
              } catch (e2) {
                // fallback to trying array bracket extraction
                const firstArr = cleaned.indexOf('[');
                const lastArr = cleaned.lastIndexOf(']');
                if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
                  const arrSub = cleaned.substring(firstArr, lastArr + 1);
                  try {
                    data = JSON.parse(arrSub);
                  } catch (e3) {
                    // give up, data stays undefined
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Error while parsing API response:', err);
      }

      if (!data) {
        // If parsing failed, show raw response to help debugging and throw a friendly error
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
          resultsDiv.innerHTML = `
            <div class="card">
              <div class="card-header">
                <h3>Failed to parse cost estimate response</h3>
              </div>
              <div class="card-body">
                <p>We couldn't parse the API response as JSON. Below is the raw response for troubleshooting:</p>
                <pre style="white-space: pre-wrap; background: #f8f9fa; padding: 1rem; border-radius: 4px; border: 1px solid #e9ecef;">${escapeHtml(String(apiResponse))}</pre>
                <p class="muted">Try again or check the server logs for more details.</p>
              </div>
            </div>
          `;
        }
        throw new Error('Failed to parse cost estimate response. Please try again.');
      }


      let html = `
        <div class="card">
          <div class="card-header">
            <h3>Cost Estimate Results</h3>
            <p class="muted">Based on: ${userInfo.cancerType}, Stage ${userInfo.stage}</p>
          </div>
          <div class="card-body">
            <div class="cost-summary">
              <h4>Total Estimated Cost Range</h4>
              <div class="cost-range">
                <span class="cost-low">$${data.totalEstimate.low.toLocaleString()}</span>
                <span class="cost-separator">-</span>
                <span class="cost-high">$${data.totalEstimate.high.toLocaleString()}</span>
              </div>
            </div>
            
            <div class="cost-breakdown mt-lg">
              <h4>Cost Breakdown</h4>
              <div class="breakdown-grid">
      `

      data.breakdown.forEach((item) => {
        html += `
          <div class="breakdown-item">
            <div class="breakdown-header">
              <h5>${item.category}</h5>
              <span class="breakdown-cost">$${item.low.toLocaleString()} - $${item.high.toLocaleString()}</span>
            </div>
            <p class="breakdown-desc">${item.description}</p>
          </div>
        `
      })

      html += `
              </div>
            </div>
            
            <div class="cost-factors mt-lg">
              <h4>Factors Affecting Cost</h4>
              <ul>
      `

      data.factors.forEach((factor) => {
        html += `<li>${factor}</li>`
      })

      html += `
              </ul>
            </div>
            
            ${
              data.sources_used && data.sources_used.length > 0
                ? `
<div class="sources-section mt-lg">
  <h4>Sources Referenced</h4>
  <div class="sources-list">
`
                : ""
            }
`

      if (data.sources_used && data.sources_used.length > 0) {
        data.sources_used.forEach((source) => {
          html += `
      <div class="source-item">
        <h6>${source.name}</h6>
        <p class="source-url"><a href="${source.url}" target="_blank" rel="noopener">${source.url}</a></p>
        <p class="source-desc">${source.description}</p>
      </div>
    `
        })

        html += `
  </div>
</div>
  `
      }

      html += `
  <style>
    .sources-list {
      display: grid;
      gap: 1rem;
    }
    
    .source-item {
      padding: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      background: #f8f9fa;
    }
    
    .source-item h6 {
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 600;
    }
    
    .source-url {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    .source-url a {
      color: #0066cc;
      text-decoration: none;
    }
    
    .source-url a:hover {
      text-decoration: underline;
    }
    
    .source-desc {
      margin-bottom: 0;
      font-size: 0.9rem;
      color: #6c757d;
    }
  </style>
`

      html += `
          </div>
        </div>
      `

      resultsDiv.innerHTML = html
      resultsDiv.style.display = "block"

      resultsDiv.scrollIntoView({ behavior: "smooth" })
    } catch (error) {
      console.error("Error parsing API response:", error)
      this.showError("Failed to parse cost estimate response. Please try again.")
    }
  }

  showError(message) {
    const resultsDiv = document.getElementById("results")
    if (!resultsDiv) return

    resultsDiv.innerHTML = `
      <div class="card danger">
        <div class="card-body">
          <h3>Error</h3>
          <p>${message}</p>
        </div>
      </div>
    `
    resultsDiv.style.display = "block"
  }
}

class ResourcesManager {
  constructor() {
    this.allResources = {
      financialAid: [
        {
          name: "American Cancer Society",
          description: "Financial assistance for treatment, transportation, and lodging.",
          phone: "1-800-227-2345",
          website: "https://www.cancer.org",
          eligibility: "Varies by program",
          states: "national",
        },
        {
          name: "CancerCare",
          description: "Free professional support services and financial assistance.",
          phone: "1-800-813-4673",
          website: "https://www.cancercare.org",
          eligibility: "Income-based",
          states: "national",
        },
        {
          name: "Leukemia & Lymphoma Society",
          description: "Financial aid for blood cancer patients.",
          phone: "1-800-955-4572",
          website: "https://www.lls.org",
          eligibility: "Blood cancer patients",
          states: "national",
        },
        {
          name: "Patient Advocate Foundation",
          description: "Co-pay relief and case management services.",
          phone: "1-800-532-5274",
          website: "https://www.patientadvocate.org",
          eligibility: "Income requirements apply",
          states: "national",
        },
      ],
      counseling: [
        {
          name: "Cancer Support Community",
          description: "Free counseling, support groups, and educational workshops.",
          phone: "1-888-793-9355",
          website: "https://www.cancersupportcommunity.org",
          services: "Individual counseling, support groups",
          states: "national",
        },
        {
          name: "American Psychosocial Oncology Society",
          description: "Directory of mental health professionals specializing in cancer care.",
          phone: "1-866-276-7443",
          website: "https://www.apos-society.org",
          services: "Professional referrals",
          states: "national",
        },
        {
          name: "Gilda's Club",
          description: "Community-based support for cancer patients and families.",
          phone: "Varies by location",
          website: "https://www.gildasclubnyc.org",
          services: "Support groups, social activities",
          states: "multiple",
        },
      ],
      other: [
        {
          name: "National Cancer Institute",
          description: "Comprehensive cancer information and clinical trial database.",
          phone: "1-800-422-6237",
          website: "https://www.cancer.gov",
          type: "Information",
        },
        {
          name: "ClinicalTrials.gov",
          description: "Database of clinical studies conducted around the world.",
          website: "https://clinicaltrials.gov",
          type: "Clinical Trials",
        },
        {
          name: "National Comprehensive Cancer Network",
          description: "Treatment guidelines and patient resources.",
          website: "https://www.nccn.org",
          type: "Guidelines",
        },
      ],
    }

    this.initializeResourcesPage()
  }

  initializeResourcesPage() {
    if (!document.getElementById("stateSelect")) return

    this.populateStateDropdown()
    this.displayResources()
    this.setupEventListeners()
  }

  populateStateDropdown() {
    const stateSelect = document.getElementById("stateSelect")
    const states = [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ]

    states.forEach((state) => {
      const option = document.createElement("option")
      option.value = state.toLowerCase().replace(" ", "-")
      option.textContent = state
      stateSelect.appendChild(option)
    })
  }

  setupEventListeners() {
    const stateSelect = document.getElementById("stateSelect")
    const resetButton = document.getElementById("resetState")

    if (stateSelect) {
      stateSelect.addEventListener("change", () => this.displayResources())
    }

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        stateSelect.value = ""
        this.displayResources()
      })
    }
  }

  displayResources() {
    this.displayFinancialAid()
    this.displayCounseling()
    this.displayOtherResources()
  }

  displayFinancialAid() {
    const container = document.getElementById("financialAidList")
    if (!container) return

    container.innerHTML = this.allResources.financialAid
      .map(
        (resource) => `
      <article class="card">
        <header class="card-header">
          <h3 class="h5">${resource.name}</h3>
        </header>
        <div class="card-body">
          <p>${resource.description}</p>
          <div class="resource-details">
            <p><strong>Phone:</strong> ${resource.phone}</p>
            <p><strong>Website:</strong> <a href="${resource.website}" target="_blank" rel="noopener">${resource.website}</a></p>
            <p><strong>Eligibility:</strong> ${resource.eligibility}</p>
          </div>
        </div>
      </article>
    `,
      )
      .join("")
  }

  displayCounseling() {
    const container = document.getElementById("counselingList")
    if (!container) return

    container.innerHTML = this.allResources.counseling
      .map(
        (resource) => `
      <article class="card">
        <header class="card-header">
          <h3 class="h5">${resource.name}</h3>
        </header>
        <div class="card-body">
          <p>${resource.description}</p>
          <div class="resource-details">
            <p><strong>Phone:</strong> ${resource.phone}</p>
            <p><strong>Website:</strong> <a href="${resource.website}" target="_blank" rel="noopener">${resource.website}</a></p>
            <p><strong>Services:</strong> ${resource.services}</p>
          </div>
        </div>
      </article>
    `,
      )
      .join("")
  }

  displayOtherResources() {
    const container = document.getElementById("otherResources")
    if (!container) return

    container.innerHTML = this.allResources.other
      .map(
        (resource) => `
      <article class="card">
        <header class="card-header">
          <h3 class="h6">${resource.name}</h3>
        </header>
        <div class="card-body">
          <p>${resource.description}</p>
          <div class="resource-details">
            ${resource.phone ? `<p><strong>Phone:</strong> ${resource.phone}</p>` : ""}
            <p><strong>Website:</strong> <a href="${resource.website}" target="_blank" rel="noopener">${resource.website}</a></p>
            <p><strong>Type:</strong> ${resource.type}</p>
          </div>
        </div>
      </article>
    `,
      )
      .join("")
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CostCalculator()
  new ResourcesManager()
})
