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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
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
    ● "Stage I/II" (low grade): Estimate ~$50,000 for first 6 months of treatment (less
    aggressive)
    ● "Stage III": Estimate ~$80,000 (intermediate treatment intensity)
    ● "Stage IV" (GBM): $79,099–$138,767 (Source) — average ~$109,000
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
    (Source)`

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
- 
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
      let data
      try {
        if (typeof apiResponse === "object") {
          data = apiResponse
        } else {
          let cleaned = String(apiResponse).trim()

          // Strip markdown code fences (\`\`\`json or \`\`\`)
          const fenceMatch = cleaned.match(/```(?:json)?\n?([\s\S]*?)```/i)
          if (fenceMatch && fenceMatch[1]) {
            cleaned = fenceMatch[1].trim()
          }

          // Try direct JSON parse first
          try {
            data = JSON.parse(cleaned)
          } catch (e) {
            // Try to extract JSON object or array from a larger text blob
            const firstObj = cleaned.indexOf("{")
            const lastObj = cleaned.lastIndexOf("}")
            if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
              const jsonSub = cleaned.substring(firstObj, lastObj + 1)
              try {
                data = JSON.parse(jsonSub)
              } catch (e2) {
                // fallback to trying array bracket extraction
                const firstArr = cleaned.indexOf("[")
                const lastArr = cleaned.lastIndexOf("]")
                if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
                  const arrSub = cleaned.substring(firstArr, lastArr + 1)
                  try {
                    data = JSON.parse(arrSub)
                  } catch (e3) {
                    // give up, data stays undefined
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Error while parsing API response:", err)
      }

      if (!data) {
        // If parsing failed, show raw response to help debugging and throw a friendly error
        const resultsDiv = document.getElementById("results")
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
          `
        }
        throw new Error("Failed to parse cost estimate response. Please try again.")
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
    if (!document.getElementById("financialAidList")) return

    this.displayResources()
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

class ChatBot {
  constructor() {
    // Use the same API key and sources as CostCalculator
    this.apiKey = "AIzaSyCq_ZShyk-xuGO_XMUrh-KaxxYUUMo1GDs"
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
    ● "Stage I/II" (low grade): Estimate ~$50,000 for first 6 months of treatment (less
    aggressive)
    ● "Stage III": Estimate ~$80,000 (intermediate treatment intensity)
    ● "Stage IV" (GBM): $79,099–$138,767 (Source) — average ~$109,000
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
    (Source)`

    this.conversationHistory = []
    this.initializeChatPage()
  }

  initializeChatPage() {
    const chatForm = document.getElementById("chatForm")
    if (!chatForm) return

    chatForm.addEventListener("submit", (e) => {
      e.preventDefault()
      this.sendMessage()
    })

    // Allow Enter to send message (Shift+Enter for new line)
    const chatInput = document.getElementById("chatInput")
    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          this.sendMessage()
        }
      })

      // Auto-resize textarea
      chatInput.addEventListener("input", () => {
        chatInput.style.height = "auto"
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px"
      })
    }

    // Setup quick question buttons
    const quickQuestionBtns = document.querySelectorAll(".quick-question-btn")
    quickQuestionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const question = btn.getAttribute("data-question")
        if (question && chatInput) {
          chatInput.value = question
          chatInput.style.height = "auto"
          chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px"
          chatInput.focus()
        }
      })
    })
  }

  async sendMessage() {
    const chatInput = document.getElementById("chatInput")
    const sendButton = document.getElementById("sendButton")
    const message = chatInput.value.trim()

    if (!message) return

    // Add user message to chat
    this.addMessageToChat(message, "user")

    // Clear input and show loading
    chatInput.value = ""
    chatInput.style.height = "auto"
    this.setLoadingState(true)

    try {
      const response = await this.callGeminiAPI(message)
      this.addMessageToChat(response, "assistant")

      // Add to conversation history
      this.conversationHistory.push({ role: "user", content: message }, { role: "assistant", content: response })
    } catch (error) {
      console.error("Error:", error)
      this.addMessageToChat(
        "I'm sorry, I encountered an error while processing your question. Please try again or rephrase your question.",
        "assistant",
        true,
      )
    } finally {
      this.setLoadingState(false)
      chatInput.focus()
    }
  }

  addMessageToChat(message, sender, isError = false) {
    const chatMessages = document.getElementById("chatMessages")
    const messageWrapper = document.createElement("div")
    messageWrapper.className = `message-wrapper ${sender}-wrapper`

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.innerHTML = `<div class="avatar ${sender}-avatar">${sender === "user" ? "👤" : "🏥"}</div>`

    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${sender}-message ${isError ? "error-message" : ""}`

    const messageContent = document.createElement("div")
    messageContent.className = "message-content"

    // Convert markdown-style formatting to HTML
    const formattedMessage = this.formatMessage(message)
    messageContent.innerHTML = formattedMessage

    const messageTime = document.createElement("div")
    messageTime.className = "message-time"
    messageTime.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    messageDiv.appendChild(messageContent)
    messageDiv.appendChild(messageTime)

    if (sender === "user") {
      messageWrapper.appendChild(messageDiv)
      messageWrapper.appendChild(avatar)
    } else {
      messageWrapper.appendChild(avatar)
      messageWrapper.appendChild(messageDiv)
    }

    chatMessages.appendChild(messageWrapper)

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  formatMessage(message) {
    // Basic markdown-style formatting
    return message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
      .replace(/^/, "<p>")
      .replace(/$/, "</p>")
      .replace(/<p><\/p>/g, "")
  }

  setLoadingState(isLoading) {
    const sendButton = document.getElementById("sendButton")
    const sendIcon = sendButton.querySelector(".send-icon")
    const loadingDots = sendButton.querySelector(".loading-dots")
    const chatInput = document.getElementById("chatInput")

    if (isLoading) {
      sendButton.disabled = true
      chatInput.disabled = true
      sendIcon.style.display = "none"
      loadingDots.style.display = "flex"
    } else {
      sendButton.disabled = false
      chatInput.disabled = false
      sendIcon.style.display = "inline"
      loadingDots.style.display = "none"
    }
  }

  async callGeminiAPI(userMessage) {
    const prompt = this.buildChatPrompt(userMessage)

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
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
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

  buildChatPrompt(userMessage) {
    const conversationContext = this.conversationHistory
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n\n")

    return `You are a helpful Cancer Care Assistant with access to comprehensive information about cancer treatment costs, financial resources, and general cancer care information. You provide conversational, helpful responses to user questions.

COMPREHENSIVE CANCER COST DATA AND SOURCES:
${this.sources}

CONVERSATION HISTORY:
${conversationContext}

CURRENT USER QUESTION:
${userMessage}

INSTRUCTIONS:
1. Keep responses to ONE PARAGRAPH maximum unless the user specifically asks for more detailed information
2. Provide helpful, conversational responses about cancer treatment costs, resources, and related topics
3. Use the provided source data when relevant to give specific cost estimates
4. Be empathetic and understanding - users may be dealing with difficult situations
5. If asked about specific costs, provide ranges and explain factors that affect pricing
6. Recommend appropriate resources when helpful
7. Always include appropriate disclaimers about cost estimates being approximate
8. If the question is outside your knowledge area, politely redirect to appropriate resources
9. Keep responses informative but concise and not overwhelming
10. Use a warm, professional tone
11. Only provide longer, multi-paragraph responses if the user explicitly requests detailed information, comprehensive explanations, or asks you to "explain in detail"

Respond naturally and conversationally in ONE PARAGRAPH. Do not use JSON format - just provide a helpful text response.`
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CostCalculator()
  new ResourcesManager()
  new ChatBot()
})
