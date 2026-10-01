# -*- coding: utf-8 -*-
"""Cytogent v2 — all site copy and structure in one place."""

SITE = {
    "name": "Cytogent",
    "company": "WelloWork AB",
    "country": "Sweden",
    "origin": "https://cytogent.com",
    "locale": "en",
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
    "team": "founders' full names, photos and LinkedIn URLs",
    "legal": "lawyer review of the privacy text and the compare pages",
    "facts": "re-check the facts about other products before launch",
    "standards": "which of openEHR, FHIR, OMOP and SNOMED CT are live for customers (SNOMED CT needs a licence)",
    "sciencedirect": "Elsevier licence for ScienceDirect: API access, AI reading and citing, and naming it on the site",
    "eu": "EU data residency status",
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
# The live brief demo (home, right under the hero; one example on Platform).
# Every name, time, file and number here is made up: the panel carries the label "Illustrative example".
# Steps: 1 Write, 2 Ask, 3 Brief, 4 Work, 5 File. "at" = the step a feed message appears at;
# the third value of a brief field = the step it is filled in at.
# --------------------------------------------------------------------------
DEMO_STEPS = ["Write", "Ask", "Brief", "Work", "File"]

# agent: (icon, tile colour, model). CONFIRM: "Planner" as the name of the agent that asks and plans.
DEMO_AGENTS = {
    "Planner": ("list", 4, "long-context LLM"),
    "Reader": ("search", 0, "long-context LLM"),
    "Analyst": ("compare", 1, "code model"),
    "Writer": ("pen", 2, "drafting LLM"),
}

DEMO = [
    {
        "id": "resistance", "tab": "Drug resistance",
        "feed": [
            {"who": "Dr. Berg", "ini": "AB", "time": "09:00", "at": 1,
             "text": "Our lung cancer cell line stopped responding to a KRAS inhibitor after six weeks. Why, and what "
                     "should we test next?",
             "files": ["rna-seq_wk0_wk6.csv", "variants.vcf"]},
            {"who": "Planner", "time": "09:01", "at": 2, "text": "Three questions before I plan.",
             "qa": [("What counts as a good answer?", "Top 3 causes, each with one test"),
                    ("What can the lab do in the next four weeks?", "Two CRISPR knockouts, no animal work"),
                    ("What do we compare with?", "The parental line")]},
            {"event": "Brief signed by Dr. Berg", "time": "09:04", "at": 3},
            {"who": "Planner", "time": "09:05", "at": 4,
             "text": "I split the brief into 6 tasks: 4 for agents, 2 for people."},
            {"who": "Analyst", "time": "11:40", "at": 4,
             "text": "The week-6 sample has a mutation at a known resistance site. Flagged for review."},
            {"who": "Writer", "time": "14:12", "at": 5,
             "text": "Report v0.2 is ready: 3 causes, 3 tests, 18 citations."},
        ],
        "brief": {
            "id": "RB-014",
            "fields": [
                ("Question", "What causes acquired resistance to the KRAS inhibitor in line LC-7R?", 1),
                ("Hypothesis", "A second mutation in KRAS, or a bypass pathway.", 2),
                ("Data", "RNA-seq at week 0 and week 6, variant list, dose–response curves.", 1),
                ("Control", "Parental line LC-7.", 2),
                ("Success", "Top 3 causes, each with evidence and one test.", 2),
                ("Limits", "Two CRISPR knockouts. No animal work.", 2),
                ("Owner", "Dr. A. Berg · signed 09:04", 3),
            ],
        },
        "board": [
            ("To do", [
                {"id": "CG-105", "t": "Order guides for the top 2 targets", "owner": "Jonas, lab manager", "ini": "J",
                 "pills": [("Person", "")]},
            ]),
            ("In progress", [
                {"id": "CG-101", "t": "Read 40 papers on KRAS inhibitor resistance", "agent": "Reader", "model": "long-context LLM"},
                {"id": "CG-102", "t": "Compare variants with known resistance sites", "agent": "Analyst", "model": "code model"},
                {"id": "CG-104", "t": "Approve the knockout plan", "owner": "Dr. Berg", "ini": "AB",
                 "pills": [("Needs Dr. Berg", "progress")]},
            ]),
            ("Done", [
                {"id": "CG-100", "t": "Brief signed", "owner": "Dr. Berg", "ini": "AB"},
                {"id": "CG-103", "t": "Dock the inhibitor into the mutant pocket", "agent": "Analyst", "model": "structure model"},
            ]),
        ],
        "file": {
            "title": "Resistance report v0.2",
            "meta": "3 causes · 3 tests · 18 citations",
            "sections": ["Summary", "Evidence table", "Docking results", "Proposed tests", "Bench protocol: CRISPR knockout"],
            "exports": ["ELN", "Word", "PDF"],
        },
    },
    {
        "id": "trial", "tab": "Clinical trial",
        "feed": [
            {"who": "Dr. Lind", "ini": "ML", "time": "09:00", "at": 1,
             "text": "We have a skin patch for vitiligo. Help us plan the first study in people.",
             "files": ["preclinical_safety.pdf", "IB_draft_v2.docx"]},
            {"who": "Planner", "time": "09:01", "at": 2, "text": "Three questions before I plan.",
             "qa": [("Which phase, and where?", "Phase I/IIa, two sites in Sweden"),
                    ("What matters most?", "Safety first, then repigmentation at week 24"),
                    ("Who can join?", "Adults with stable non-segmental vitiligo")]},
            {"event": "Brief signed by Dr. Lind", "time": "09:06", "at": 3},
            {"who": "Planner", "time": "09:07", "at": 4,
             "text": "I split the brief into 7 tasks: 4 for agents, 3 for people."},
            {"who": "Analyst", "time": "13:20", "at": 4,
             "text": "Sample size draft: 24 participants. Assumptions are listed for the statistician."},
            {"who": "Writer", "time": "16:05", "at": 5,
             "text": "Protocol v0.3 is drafted against the SPIRIT checklist, with 31 citations."},
        ],
        "brief": {
            "id": "RB-022",
            "fields": [
                ("Question", "Is the patch safe, and does it show early repigmentation in adults with non-segmental vitiligo?", 1),
                ("Design", "Phase I/IIa, randomised, double-blind, vehicle-controlled.", 2),
                ("Population", "Adults aged 18 to 65 with stable non-segmental vitiligo.", 2),
                ("Primary endpoint", "Adverse events up to week 24.", 2),
                ("Secondary endpoint", "Change in F-VASI at week 24.", 2),
                ("Sites and rules", "Two sites in Sweden · EU CTR · ICH GCP.", 2),
                ("Owner", "Dr. M. Lind · signed 09:06", 3),
            ],
        },
        "board": [
            ("To do", [
                {"id": "CG-207", "t": "Book the ethics review meeting", "owner": "Elin, study coordinator", "ini": "E",
                 "pills": [("Person", "")]},
            ]),
            ("In progress", [
                {"id": "CG-202", "t": "Draft the protocol", "agent": "Writer", "model": "drafting LLM"},
                {"id": "CG-203", "t": "Sample size and SAP draft", "agent": "Analyst", "model": "code model"},
                {"id": "CG-205", "t": "Confirm site feasibility", "owner": "Site lead", "ini": "SL",
                 "pills": [("Person", "")]},
                {"id": "CG-206", "t": "Approve protocol v0.3", "owner": "Dr. Lind", "ini": "ML",
                 "pills": [("Needs Dr. Lind", "progress")]},
            ]),
            ("Done", [
                {"id": "CG-200", "t": "Brief signed", "owner": "Dr. Lind", "ini": "ML"},
                {"id": "CG-201", "t": "Review 25 trials of topical vitiligo treatments", "agent": "Reader", "model": "long-context LLM"},
            ]),
        ],
        "file": {
            "title": "Clinical trial application draft",
            "meta": "Protocol v0.3 · SAP draft · CRF set · 31 citations",
            "sections": ["Protocol", "Statistical analysis plan", "Case report forms",
                         "Gaps in the investigator's brochure", "Cover letter draft"],
            "exports": ["Word", "PDF"],
        },
    },
    {
        "id": "crispr", "tab": "CRISPR diagnostic",
        "feed": [
            {"who": "Dr. Nyberg", "ini": "SN", "time": "09:00", "at": 1,
             "text": "We want a CRISPR test that finds high-risk HPV in cervical samples. Where do we start?",
             "files": ["sample_overview.xlsx"]},
            {"who": "Planner", "time": "09:01", "at": 2, "text": "Three questions before I plan.",
             "qa": [("Which HPV types first?", "HPV16 and HPV18"),
                    ("Where will the test run?", "In the clinic, from a self-collected swab"),
                    ("Which market first?", "The EU, under IVDR")]},
            {"event": "Brief signed by Dr. Nyberg", "time": "09:05", "at": 3},
            {"who": "Planner", "time": "09:06", "at": 4,
             "text": "I split the brief into 6 tasks: 4 for agents, 2 for people."},
            {"who": "Analyst", "time": "12:30", "at": 4,
             "text": "12 candidate guides designed. 4 pass the cross-reactivity check against 14 other HPV types."},
            {"who": "Writer", "time": "15:45", "at": 5,
             "text": "The assay design report and an IVDR technical file outline are ready."},
        ],
        "brief": {
            "id": "RB-031",
            "fields": [
                ("Question", "Can a Cas12-based test detect HPV16 and HPV18 in self-collected swabs?", 1),
                ("Targets", "E6 and E7 regions of HPV16 and HPV18.", 2),
                ("Compare with", "A validated PCR test on the same samples.", 2),
                ("Success", "Sensitivity and specificity against PCR on banked samples.", 2),
                ("Rules", "Ethics approval for banked samples · IVDR.", 2),
                ("Owner", "Dr. S. Nyberg · signed 09:05", 3),
            ],
        },
        "board": [
            ("To do", [
                {"id": "CG-306", "t": "Run a limit-of-detection test on synthetic targets", "owner": "Lab technician", "ini": "LT",
                 "pills": [("Person", ""), ("Protocol attached", "note")]},
            ]),
            ("In progress", [
                {"id": "CG-302", "t": "Design guides for HPV16 and HPV18 E6/E7", "agent": "Analyst", "model": "design model"},
                {"id": "CG-304", "t": "Outline the IVDR technical file", "agent": "Writer", "model": "drafting LLM"},
                {"id": "CG-305", "t": "Approve the guide shortlist", "owner": "Dr. Nyberg", "ini": "SN",
                 "pills": [("Needs Dr. Nyberg", "progress")]},
            ]),
            ("Done", [
                {"id": "CG-300", "t": "Brief signed", "owner": "Dr. Nyberg", "ini": "SN"},
                {"id": "CG-301", "t": "Review 60 papers on CRISPR detection of HPV", "agent": "Reader", "model": "long-context LLM"},
            ]),
        ],
        "file": {
            "title": "Assay design report v0.1",
            "meta": "4 guides · 1 lab protocol · IVDR outline · 26 citations",
            "sections": ["Summary", "Guide shortlist and checks", "Lab protocol: limit of detection",
                         "IVDR technical file outline", "Open questions"],
            "exports": ["ELN", "Word", "PDF"],
        },
    },
]

# --------------------------------------------------------------------------
# Home: how it works
# --------------------------------------------------------------------------
HOW = [
    ("Write", "Your goal in plain language. Attach data or connect your sources."),
    ("Brief", "Cytogent asks a few questions. You confirm and sign the research brief."),
    ("Work", "Agents and people do the tasks. Each step goes to the best model and is logged."),
    ("Decide", "Review cited results, sign off, and export to your notebook, LIMS or report."),
]

# --------------------------------------------------------------------------
# Home: the research brief, and people and agents
# --------------------------------------------------------------------------
BRIEF_CARDS = [
    ("pen", "Write it your way", "Type the goal the way you would tell a colleague. Attach data if you have it."),
    ("message", "Answer a few questions",
     "Cytogent asks only what changes the plan: data, what counts as an answer, limits and rules."),
    ("check", "Sign the brief",
     "One page with the question, hypothesis, data, controls, endpoints, rules and owner. Agents plan from it, "
     "and every result links back to it."),
]

# (text, open item or None)
PEOPLE_TICKS = [
    ("Agents take the reading, analysis and drafting.", None),
    ("People get lab work, reviews and sign-offs, with the protocol attached.", None),
    ("New tasks appear as results come in.", None),
    ("Anything that leaves the project waits for a yes.", "outbound"),
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
# Home: one project, end to end
# --------------------------------------------------------------------------
STORY = [
    {
        "n": "01", "h": "A question arrives",
        "p": "The team asks why a cell line resists an inhibitor. They attach assay results and a variant list.",
        "label": "2 datasets · 1 question",
        "img": ("confocal-fibroblast-actin-dapi.jpg",
                "Confocal · Human fibroblast · Actin (phalloidin), DNA (DAPI) · 20 µm",
                "Stressed cells. A gold ring marks the nucleus."),
        "vis": ('st_question', 'You ask · two datasets attach to the question', 'A person asks a question in a card; an assay result set and a variant list attach to it.'),


    },
    {
        "n": "02", "h": "The brief is signed",
        "p": "Cytogent asks which data to use, what counts as an answer and what the limits are. The PI signs a one-page brief.",
        "label": "1 brief · signed",
        "vis": ('st_brief', 'The Planner asks · the brief fills in · the PI signs',
                'A person, the PI, and the Planner agent; the Planner asks three questions, a research brief card fills in '
                'line by line, and the PI signs it with a check mark.'),
    },
    {
        "n": "03", "h": "Evidence is gathered",
        "p": "The Reader agent reviews 40 papers and two cohort datasets and cites the three that explain the mutation.",
        "label": "42 sources read · 3 cited",
        "img": ("confocal-fibroblast-actin-dapi.jpg",
                "Confocal · Human fibroblast · Actin (phalloidin), DNA (DAPI) · 20 µm",
                "Same frame. Citation cards slide in over the image edge."),
        "vis": ('st_evidence', 'The Reader agent reads 40 papers · three become citations', 'The Reader agent scans a grid of forty papers; three light up and become numbered citations.'),


    },
    {
        "n": "04", "h": "Models test the idea",
        "p": "In-silico docking and a variant-effect model rank the mutation and suggest a binding-site change.",
        "label": "docking · variant effect",
        "img": ("protein-pocket-mutation.png",
                "Drawn diagram · Binding pocket · Mutation highlighted",
                "Protein pocket render with the mutation called out."),
        "vis": ('st_models', 'The Analyst docks the ligand · candidates ranked · G12C flagged', 'The Analyst agent docks a molecule into the pocket and ranks candidates; the variant effect is flagged.'),


    },
    {
        "n": "05", "h": "An edit is designed",
        "p": "Guide RNAs are designed and checked for off-targets. An agent creates a lab task for the bench team, with the protocol attached.",
        "label": "4 guides · 1 lab task",
        "img": ("timelapse-division-01..04.jpg",
                "Time-lapse · HeLa · H2B-GFP · 20 µm · 4 frames",
                "CRISPR cut animation running into a dividing-cells time-lapse."),
        "vis": ('st_edit', 'Guides designed · off-targets checked · a lab task goes to the bench',
                'A guide RNA finds its site, the strand is cut and repaired; guides are checked for off-targets; a lab task '
                'with the protocol attached goes to a person on the bench team.'),


    },
    {
        "n": "06", "h": "A study is planned",
        "p": "A cohort definition, protocol draft and statistical plan are prepared for the clinical team to review.",
        "label": "protocol v0.3 · SAP draft",
        "img": ("immune-cells-tissue.jpg",
                "Confocal · Tissue section · CD3 / CD68 / DAPI · 50 µm",
                "Trial document skeleton assembling over the cohort image."),
        "vis": ('st_plan', 'The Writer assembles the protocol · cohort defined · SAP drafted', 'The Writer agent fills a protocol section by section while a cohort of 24 people is defined.'),


    },
    {
        "n": "07", "h": "The record is written",
        "p": "Regulatory and patent drafts are built from the same cited results. A scientist signs off at each checkpoint.",
        "label": "IND module · claim draft",
        "img": ("confocal-cell-cycle-checkpoint.jpg",
                "Confocal · Mitotic checkpoint · Mad2 / tubulin / DAPI · 10 µm",
                "A gold gate opens only after the check mark."),
        "vis": ('st_record', 'IND modules and claim draft from the same sources · a scientist signs off', 'Regulatory modules and a patent claim tree built from the same three citations; a scientist signs off.'),


    },
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
SECURITY = [
    ("Project isolation", "Each project has its own storage scope. Agents see only its data.", "done", None),
    ("No training on your data", "Your data never trains shared models.", "done", None),
    ("Encryption in transit", "TLS 1.2 or higher on every connection.", "done", None),
    ("Encryption at rest", "Managed keys, rotated on a schedule.", "progress", "at_rest"),
    ("Role-based access", "Owner, editor and viewer roles per project and dataset.", "done", None),
    ("EU data residency", "Storage and processing inside the EU.", "progress", None),
    ("SOC 2 Type II", "Independent audit of controls.", "planned", None),
    ("Analytics only with consent", "Google Analytics runs only if you accept it in the cookie banner.", "done", None),
]

# --------------------------------------------------------------------------
# Home: doors
# --------------------------------------------------------------------------
DOORS = [
    ("Door one", "Individual", "Scientists and students with an institutional email.", "individual"),
    ("Door two", "Institute", "Companies, academic institutes and CROs.", "institute"),
    ("Door three", "Hospital", "Clinical teams and hospital units working with patient data.", "hospital"),
]

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
}

# --------------------------------------------------------------------------
# Footer
# --------------------------------------------------------------------------
FOOTER = [
    ("Product", [("Platform", "/platform/"), ("Data &amp; models", "/data-and-models/"),
                 ("Security", "/security/"), ("Compare", "/compare/"), ("Request access", "/request-access/")]),
    ("Solutions", [(s["nav"], "/solutions/%s/" % s["slug"]) for s in SOLUTIONS]),
    ("Industries", [(i["nav"], "/industries/%s/" % i["slug"]) for i in INDUSTRIES]),
    ("Company", [("About", "/about/"), ("Resources", "/resources/"), ("FAQ", "/resources/faq/"),
                 ("Glossary", "/resources/glossary/"), ("Terms", "/terms/"), ("Privacy", "/privacy/"),
                 ("Cookie settings", "/privacy/#cookies")]),
]
