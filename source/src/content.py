# -*- coding: utf-8 -*-
"""Cytogent v2 — all site copy and structure in one place."""

SITE = {
    "name": "Cytogent",
    "company": "WelloWork AB",
    "country": "Sweden",
    "origin": "https://cytogent.com",
    "locale": "en",
    # the Cytogent company page (the product's only social profile); used in the footer and the JSON-LD
    "linkedin": "https://www.linkedin.com/company/cytogent/",
    # Google Search Console: paste the token from the HTML-tag method here to add the meta tag to the home page.
    # Leave it empty when the Domain property is verified with a DNS TXT record.
    "google_site_verification": "",
}

# The fixed definition. Word for word on Home (FAQ), About, in llms.txt and in the JSON-LD description.
DEFINITION = (
    "Cytogent is an agentic workspace for life science research. Scientists write what they want to find out; "
    "Cytogent turns it into a research brief, and AI agents and people plan and do the work together across "
    "literature, in-silico studies, protein design, CRISPR, clinical trials, and regulatory and patent documents. "
    "Every result is cited and signed off."
)

# Footer tagline.
TAGLINE = ("An agentic workspace for life science research. Scientists and AI agents work together, "
           "from research brief to cited, signed result.")

# The day the facts about other products were last checked against their public pages (compare tables and pages).
# Change it only after re-checking them: it is printed as "checked on" and "Last checked".
FACTS_CHECKED = "2 October 2026"

# Open items from the brief stay in the build; each one is marked in the HTML as <!-- CONFIRM: ... -->
# and listed in docs/HANDOFF.md.
CONFIRM = {
    "planner": "Planner is the name of the agent that asks questions and plans",
    "models": "life-science models (structure, docking, protein design, CRISPR checks) are live; if not, say In progress",
    "trained": "status of the trained models (variant effect, binding affinity, assay QC)",
    "at_rest": "encryption at rest: the site said Done, the deck says in transit only",
    "outbound": "anything that leaves the project waits for an approval",
    "mcp": "MCP connectors and browser access are available to customers",
    "reply": "reply within five working days, with a first draft of the research brief",
    "pilots": "written permission from Cervixel and Eipha Biosciences to be named, and the wording",
    "legal": "lawyer review of the privacy text and the compare pages",
    "facts": "re-check the facts about other products before launch",
    "standards": "which of openEHR, FHIR, OMOP and SNOMED CT are live for customers (SNOMED CT needs a licence)",
    "sciencedirect": "Elsevier licence for ScienceDirect: API access, AI reading and citing, and naming it on the site",
    "eu": "EU data residency status",
    "nvidia": "which NVIDIA BioNeMo NIM models (OpenFold, DiffDock, ESM, RFdiffusion, ProteinMPNN) and Parabricks are live for customers",
}

# --------------------------------------------------------------------------
# Solutions
# --------------------------------------------------------------------------
SOLUTIONS = [
    {
        "slug": "literature-and-evidence",
        "nav": "Literature &amp; evidence",
        "title": "Literature &amp; evidence",
        "blurb": "Papers, patents, protocols and registries in one query. Every claim points to its source.",
        "menu": "Search everything and cite it",
        "tags": ["PubMed", "patents", "protocols"],
        "img": ("tem-cell-overview.jpg",
                "TEM · Whole cell · Osmium / uranyl · 2 µm",
                "Transmission electron micrograph, whole cell with nucleus and organelles. Gold duotone grade."),
        "vis": ('literature', 'One query over papers, patents and protocols · three become citations', 'One search over papers, patents and protocols; three of them light up and become the citations under a claim.'),


    },
    {
        "slug": "in-silico-studies",
        "nav": "In-silico studies",
        "title": "In-silico studies",
        "blurb": "Screen, simulate and compare before the bench: docking, ADMET, pathway and PK models.",
        "menu": "Screen and simulate before the bench",
        "tags": ["docking", "ADMET", "simulation"],
        "img": ("confocal-mitochondria-network.jpg",
                "Confocal · U2OS · TOM20 (AF488) · 10 µm",
                "Confocal image of a mitochondrial network."),
        "vis": ('insilico', 'A ligand docks into the pocket · candidates ranked', 'A small molecule docks into a binding pocket; six candidates are ranked by score.'),


    },
    {
        "slug": "protein-design",
        "nav": "Protein studies &amp; design",
        "title": "Protein studies &amp; design",
        "blurb": "Structure prediction, binding analysis and sequence design, with validation reports.",
        "menu": "Predict structure, analyse binding, design sequence",
        "tags": ["structure", "binding", "design"],
        "img": ("protein-ribbon-render.png",
                "Drawn diagram · Ribbon model · Binding pocket highlighted",
                "Protein ribbon render, drawn by us. Not a microscopy image."),
        "vis": ('protein', 'Sequence → predicted fold → candidate with validation', 'A sequence strip, the predicted fold of helices and strands, and a candidate card with binding, stability and validation.'),


    },
    {
        "slug": "crispr-genome-editing",
        "nav": "CRISPR &amp; genome editing",
        "title": "CRISPR &amp; genome editing",
        "blurb": "Guide design, off-target review and screen analysis, documented for the lab.",
        "menu": "Design guides, review off-targets, read screens",
        "tags": ["guide RNA", "off-target", "screens"],
        "img": ("timelapse-division-03.jpg",
                "Time-lapse · HeLa · H2B-GFP · 20 µm · frame 3 of 4",
                "One frame from a cell-division time-lapse."),
        "vis": ('crispr', 'Guide finds the site · cut · repaired · off-targets reviewed', 'A guide RNA finds its site on the double helix, the strand is cut and repaired; four guides are checked for off-targets.'),


    },
    {
        "slug": "clinical-trials",
        "nav": "Clinical trials, full cycle",
        "title": "Clinical trials, full cycle",
        "blurb": "Protocol drafts, site feasibility, cohort criteria, CRFs, statistical analysis plans, monitoring summaries and CSR drafts.",
        "menu": "Plan, start, run and close a study",
        "tags": ["protocol", "CRF", "SAP", "CSR"],
        "img": ("immune-cells-tissue.jpg",
                "Confocal · Tissue section · CD3 / CD68 / DAPI · 50 µm",
                "Immune cells in a tissue section, cohort-style imagery."),
        "vis": ('trials', 'Plan → Start → Run → Close · the cohort fills in', 'A trial timeline with its documents at each phase, and a cohort of people enrolling.'),


        "wide": True,
    },
    {
        "slug": "regulatory-documentation",
        "nav": "Regulatory documentation",
        "title": "Regulatory documentation",
        "blurb": "IND/CTA modules, IVDR technical files and SOPs, structured for reviewer questions.",
        "menu": "Draft IND, CTA, IVDR and SOP documents",
        "tags": ["IND", "CTA", "IVDR", "SOP"],
        "img": ("confocal-epithelium-layer.jpg",
                "Confocal · Epithelial sheet · E-cadherin / DAPI · 20 µm",
                "An ordered epithelial layer — structure and order."),
        "vis": ('regulatory', 'IND modules checked one by one · a reviewer question answered', 'The five modules of a submission, checked in turn; a reviewer question is linked to the section that answers it.'),


    },
    {
        "slug": "patent-documentation",
        "nav": "Patent &amp; IP documentation",
        "title": "Patent &amp; IP documentation",
        "blurb": "Prior-art search, invention disclosures and claim-drafting support from your own results.",
        "menu": "Search prior art and draft claims",
        "tags": ["prior art", "claims", "disclosure"],
        "img": ("tem-crystalline-detail.jpg",
                "TEM · Crystalline detail · Unstained · 200 nm",
                "Structured, crystalline TEM detail."),
        "vis": ('patent', 'Claim tree · prior art on a timeline · novelty argued', 'A claim tree on the left; a sweep over prior art on the right finds two close documents.'),


    },
]

# --------------------------------------------------------------------------
# Industries
# --------------------------------------------------------------------------
INDUSTRIES = [
    {
        "slug": "pharma-and-biotech",
        "nav": "Pharma &amp; biotech",
        "title": "Pharma &amp; biotech R&amp;D",
        "menu": "Target triage and design loops",
        "pain": "Too many tools, too little evidence per decision.",
        "get": "Target triage, candidate ranking and design loops with cited sources.",
        "icon": "molecule",
    },
    {
        "slug": "cro-and-clinical-teams",
        "nav": "CROs &amp; clinical teams",
        "title": "CROs &amp; clinical teams",
        "menu": "Trial documents, drafted from your data",
        "pain": "Protocols, CRFs and reports take months to draft.",
        "get": "Trial documents drafted from your study data, ready for review.",
        "icon": "sheets",
    },
    {
        "slug": "hospitals-and-academic-labs",
        "nav": "Hospitals &amp; academic labs",
        "title": "Hospitals &amp; academic labs",
        "menu": "Cohort work with a full audit trail",
        "pain": "Cohort analysis under strict ethics and data rules.",
        "get": "Analysis and writing with a full audit trail inside your permissions.",
        "icon": "dish",
    },
    {
        "slug": "regulatory-and-ip-teams",
        "nav": "Regulatory &amp; IP teams",
        "title": "Regulatory &amp; IP teams",
        "menu": "Submissions and filings, structured",
        "pain": "Submissions and filings built by hand from scattered results.",
        "get": "Structured drafts for IND/CTA, IVDR files and patent applications.",
        "icon": "seal",
    },
]

# --------------------------------------------------------------------------
# The film: how Cytogent works, played like a short video (home, right under the hero; Platform).
# One made-up project in four chapters. Every name, time, file and number is made up: the player carries the
# label "Illustrative example". Each chapter: (key, label in the timeline, caption, sub-caption).
# --------------------------------------------------------------------------
# agent: (icon, tile colour, model). CONFIRM: "Planner" as the name of the agent that asks and plans.
DEMO_AGENTS = {
    "Planner": ("list", 4, "long-context LLM"),
    "Reader": ("search", 0, "long-context LLM"),
    "Analyst": ("compare", 1, "code model"),
    "Writer": ("pen", 2, "drafting LLM"),
}

FILM = {
    "chapters": [
        ("write", "Write", "Write your goal in plain words.", "Attach data if you have it. No perfect prompt needed."),
        ("brief", "Sign", "Cytogent asks, and you sign the brief.", "Only the questions that change the plan."),
        ("work", "Work", "Agents and people share the work.", "Agents read and analyse. People run the lab and approve."),
        ("file", "Result", "You get a cited file to sign off.", "Every claim links to its source."),
    ],
    "who": ("Dr. Berg", "AB"),
    "goal": "Our lung cancer cell line stopped responding to a KRAS inhibitor after six weeks. "
            "Why, and what should we test next?",
    "files": ["rna-seq_wk0_wk6.csv", "variants.vcf"],
    "qa": [("What counts as a good answer?", "Top 3 causes, each with one test"),
           ("What can the lab do in four weeks?", "Two CRISPR knockouts, no animal work"),
           ("What do we compare with?", "The parental line")],
    "brief_id": "RB-014",
    "brief": [("Question", "Why does line LC-7R resist the KRAS inhibitor?"),
              ("Hypothesis", "A second KRAS mutation, or a bypass pathway"),
              ("Control", "Parental line LC-7"),
              ("Success", "Top 3 causes, each with evidence and one test"),
              ("Limits", "Two CRISPR knockouts. No animal work.")],
    # (owner, agent or person, task); a person is (name, initials)
    "agents": [("Reader", "Read 40 papers on KRAS inhibitor resistance"),
               ("Analyst", "Compare variants with known resistance sites"),
               ("Writer", "Draft the resistance report")],
    "people": [(("Dr. Berg", "AB"), "Approve the knockout plan"),
               (("Jonas, lab", "J"), "Order guides for the top 2 targets")],
    "finding": ("Analyst", "Week 6 has a mutation at a known resistance site. Flagged for Dr. Berg."),
    "file": {
        "title": "Resistance report v0.2",
        "meta": "3 causes · 3 tests · 18 citations",
        "sections": ["Summary", "Evidence table", "Docking results", "Proposed tests", "Bench protocol"],
        "claim": "A secondary KRAS mutation at the drug-binding pocket is the most likely cause",
        "exports": ["ELN", "Word", "PDF"],
    },
}

# --------------------------------------------------------------------------
# How it works (llms.txt; the film tells the same four steps)
# --------------------------------------------------------------------------
HOW = [
    ("Write", "Your goal in plain language. Attach data or connect your sources."),
    ("Brief", "Cytogent asks a few questions. You confirm and sign the research brief."),
    ("Work", "Agents and people do the tasks. Each step goes to the best model and is logged."),
    ("Decide", "Review cited results, sign off, and export to your notebook, LIMS or report."),
]

# --------------------------------------------------------------------------
# Pilots. CONFIRM: written permission from both companies to be named.
# PILOTS_PUBLIC decides whether /customers/ is listed: False keeps the page out of the nav, the footer,
# the sitemap and llms.txt, and marks it noindex. Set it to True once both permissions are in writing.
# --------------------------------------------------------------------------
PILOTS_PUBLIC = False
PILOTS = [
    {"id": "cervixel", "name": "Cervixel", "line": "CRISPR research for cervical cancer diagnosis.",
     "tags": ["CRISPR &amp; genome editing", "Literature &amp; evidence"], "vis": "crispr-genome-editing"},
    {"id": "eipha", "name": "Eipha Biosciences", "line": "Clinical trial for a vitiligo skin patch.",
     "tags": ["Clinical trials, full cycle", "Regulatory documentation"], "vis": "clinical-trials"},
]

# --------------------------------------------------------------------------
# Home: why Cytogent
# --------------------------------------------------------------------------
# Columns: (name, examples, short name for the phone layout). The last column is Cytogent.
COMPARE_COLS = [
    ("AI assistants", "e.g. ChatGPT, Claude, Copilot", "Assistants"),
    ("Agent workspaces", "e.g. ChatGPT dots, Grok Bots, Dust", "Workspaces"),
]
# Rows: (icon, feature, AI assistants, agent workspaces, Cytogent, open item or None).
# Fair and checkable: never "No" about a named product; every fact about another product comes from its public pages.
COMPARE = [
    ("agent", "Agents that work in the background", "Some", "Yes", "Yes", None),
    ("users", "One workspace for people and agents", "Some", "Yes", "Yes", None),
    ("export", "Connects to your apps and the web", "Yes", "Yes", "Yes", None),
    ("clipboard", "Starts from a signed research brief", "General plan step", "General plan step", "Built for research", None),
    ("flask", "Agents create lab tasks for people", "Not built in", "Approval requests", "With protocol and owner", None),
    ("molecule", "Life-science models built in", "Via plugins", "Via plugins", "Built in", "models"),
    ("quote", "One cited trail to the final file", "Per answer", "Per task", "Across 7 workflows", None),
    ("doc", "Trial, regulatory and patent documents", "General writing", "General writing", "Templates and checks", None),
    ("check", "Scientist sign-off in the audit log", "Varies", "Approval rules", "Every checkpoint", None),
    ("cpu", "Models from many providers", "Varies", "Varies", "Yes, logged", None),
]
# Four more rows on the compare hub.
COMPARE_MORE = [
    ("lock", "Each project isolated from others", "Varies", "Varies", "Yes", None),
    ("shield", "Your data never trains shared models", "Depends on plan", "Depends on plan", "Never", None),
    ("globe", "EU data residency", "Varies", "Varies", "In progress", "eu"),
    ("database", "Health data standards (openEHR, FHIR, OMOP, SNOMED CT)", "Varies", "Varies", "Built in", "standards"),
]
COMPARE_NOTE = ("Examples are for orientation, based on public product information checked on %s. "
                "Product names are trademarks of their owners." % FACTS_CHECKED)

# --------------------------------------------------------------------------
# Home: security rows
# --------------------------------------------------------------------------
# (control, text, status, open item or None)

# --------------------------------------------------------------------------
# Home: doors
# --------------------------------------------------------------------------

# --------------------------------------------------------------------------
# Home: FAQ (answers 40-60 words, complete on their own)
# --------------------------------------------------------------------------
FAQ = [
    ("What is Cytogent?",
     "Cytogent is an agentic workspace for life science research. Scientists write what they want to find out, "
     "Cytogent turns it into a signed research brief, and AI agents and people do the work together, from literature "
     "and in-silico studies to trials, regulatory files and patents. Every result is cited. Cytogent is operated by "
     "WelloWork AB in Sweden."),
    ("How is Cytogent different from ChatGPT, Claude or Copilot?",
     "Keep them for everyday work. Cytogent uses the same kind of frontier models, but it is built for research. It "
     "starts from a signed research brief, gives lab tasks to people, runs life-science models, and keeps one cited "
     "trail from the first question to the final protocol, regulatory or patent file."),
    ("How is Cytogent different from agent workspaces like ChatGPT dots, Grok Bots or Dust?",
     "Those tools run always-on agents for any kind of work, and Cytogent does too. The difference is focus. Cytogent "
     "plans from a research brief, knows trial, regulatory and patent formats, records scientist sign-off at each "
     "checkpoint, and keeps every claim linked to a source you can open."),
    ("Which science models does Cytogent use?",
     "Cytogent runs life-science models through NVIDIA BioNeMo NIM microservices: OpenFold for structure prediction, "
     "DiffDock for docking, ESM for protein embeddings, and RFdiffusion with ProteinMPNN for protein design. NVIDIA "
     "Parabricks handles genomics. WelloWork AB, the company behind Cytogent, is a member of the NVIDIA Inception "
     "Program. Membership does not imply NVIDIA endorsement."),
    ("What is a research brief?",
     "A one-page plan you sign before agents start. It holds the question, hypothesis, data, controls, endpoints, "
     "limits, rules and owner. You write the goal in your own words, and Cytogent asks only the questions that change "
     "the plan. Agents plan from the brief, and every result links back to it."),
    ("Can agents give tasks to people?",
     "Yes. When a step needs hands or judgment, an agent creates a task for a person: a lab run with the protocol "
     "attached, a review, or an approval. Each task has an owner and a due date. When the person adds the result, it "
     "goes back into the same record for everyone to see."),
    ("Who is Cytogent for?",
     "Four groups. Pharma and biotech R&amp;D teams who need evidence behind every decision. CROs and clinical teams "
     "who draft protocols, CRFs and reports. Hospitals and academic labs doing cohort work under strict ethics and "
     "data rules. Regulatory and IP teams who build submissions and patent filings from scattered results."),
    ("Is my data used to train models?",
     "No. Data you bring to Cytogent stays inside your project and never trains shared models. Projects are "
     "isolated from each other, access is granted per role, and every agent action against your data is recorded "
     "in an audit trail you can read. WelloWork AB acts as processor under a data processing agreement."),
    ("How do I get access?",
     "By request. There is no self sign-up and no free trial. Choose Individual, Institute or Hospital, and tell us "
     "what you want to find out. We read every request, reply within five working days, and set up a workspace with "
     "your permissions, starting from a first draft of your research brief."),
    ("Is Cytogent a medical device?",
     "No. Cytogent is a research tool. It makes no clinical decisions, gives no diagnosis and is not certified as a "
     "medical device under the MDR or IVDR. Agents draft, search, predict and support. A qualified scientist or "
     "clinician reviews and decides, and that review is part of the record."),
]

# The six the home page shows (and lists in its FAQPage JSON-LD); the FAQ page has them all.
HOME_FAQ = [qa for qa in FAQ if qa[0] in (
    "What is Cytogent?",
    "How is Cytogent different from ChatGPT, Claude or Copilot?",
    "What is a research brief?",
    "Is my data used to train models?",
    "Is Cytogent a medical device?",
    "How do I get access?",
)]

# Two answers that moved from the home page to the FAQ page only.
FAQ_AGENTS = (
    "What can the agents do?",
    "Seven workflows. Search literature, patents and protocols with citations. Run in-silico screens and "
    "simulations. Predict protein structure and design sequences. Design CRISPR guides and analyse screens. "
    "Support clinical trials from protocol to clinical study report. Draft regulatory documents. Support patent "
    "prior-art search and claim drafting.")
FAQ_HOSTING = (
    "Where is data hosted?",
    "Cytogent is built and operated from Sweden by WelloWork AB. EU data residency — storage and processing "
    "inside the EU — is in progress rather than finished, and the security page shows the current status of "
    "every control with a plain label: Done, In progress or Planned. Sub-processors are listed publicly.")

# Open items attached to an answer (question -> key in CONFIRM); printed as an HTML comment beside it.
FAQ_CONFIRM = {
    "How do I get access?": "reply",
    "How is Cytogent different from ChatGPT, Claude or Copilot?": "models",
    "Can I connect my own tools and agents?": "mcp",
    "Which health data standards does Cytogent use?": "standards",
    "Can Cytogent and Dust work together?": "mcp",
    "Which science models does Cytogent use?": "nvidia",
}

# --------------------------------------------------------------------------
# Footer
# --------------------------------------------------------------------------
FOOTER = [
    ("Product", [("Platform", "/platform/"), ("Data &amp; models", "/data-and-models/"),
                 ("Security", "/security/"), ("Compare", "/compare/"), ("Request access", "/request-access/")]),
    ("Solutions", [(s["nav"], "/solutions/%s/" % s["slug"]) for s in SOLUTIONS]),
    ("Industries", [(i["nav"], "/industries/%s/" % i["slug"]) for i in INDUSTRIES]),
    # Customers is shown only when PILOTS_PUBLIC is True
    ("Company", [("About", "/about/"), ("Customers", "/customers/"), ("Resources", "/resources/"), ("FAQ", "/resources/faq/"),
                 ("Glossary", "/resources/glossary/"), ("Terms", "/terms/"), ("Privacy", "/privacy/"),
                 ("Cookie settings", "/privacy/#cookies")]),
]
