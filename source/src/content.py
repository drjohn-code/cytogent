# -*- coding: utf-8 -*-
"""Cytogent v2 — all site copy and structure in one place."""

SITE = {
    "name": "Cytogent",
    "company": "WelloWork AB",
    "country": "Sweden",
    "origin": "https://cytogent.com",
    "locale": "en",
}

# The fixed definition. Word for word on Home, About and in llms.txt.
DEFINITION = (
    "Cytogent is an agentic workspace for life science research. Scientists and AI agents "
    "work together on literature and evidence, in-silico studies, protein studies and design, "
    "CRISPR and genome editing, clinical trials from planning to report, and regulatory and "
    "patent documentation — every result with cited, auditable evidence."
)

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
# Home: how it works
# --------------------------------------------------------------------------
HOW = [
    ("Ask", "Write the question in plain language. Attach your data or connect your sources."),
    ("Agents work", "Each step is routed to the model that does it best: reading, coding, prediction, drafting. Every action is recorded."),
    ("You decide", "Review results with their sources. Export to your notebook, LIMS or report."),
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
        "n": "02", "h": "Evidence is gathered",
        "p": "The Reader agent reviews 40 papers and two cohort datasets and cites the three that explain the mutation.",
        "label": "42 sources read · 3 cited",
        "img": ("confocal-fibroblast-actin-dapi.jpg",
                "Confocal · Human fibroblast · Actin (phalloidin), DNA (DAPI) · 20 µm",
                "Same frame. Citation cards slide in over the image edge."),
        "vis": ('st_evidence', 'The Reader agent reads 40 papers · three become citations', 'The Reader agent scans a grid of forty papers; three light up and become numbered citations.'),


    },
    {
        "n": "03", "h": "Models test the idea",
        "p": "In-silico docking and a variant-effect model rank the mutation and suggest a binding-site change.",
        "label": "docking · variant effect",
        "img": ("protein-pocket-mutation.png",
                "Drawn diagram · Binding pocket · Mutation highlighted",
                "Protein pocket render with the mutation called out."),
        "vis": ('st_models', 'The Analyst docks the ligand · candidates ranked · G12C flagged', 'The Analyst agent docks a molecule into the pocket and ranks candidates; the variant effect is flagged.'),


    },
    {
        "n": "04", "h": "An edit is designed",
        "p": "Guide RNAs are designed and checked for off-targets. A validation protocol is drafted for the bench.",
        "label": "4 guides · 0 high-risk off-targets",
        "img": ("timelapse-division-01..04.jpg",
                "Time-lapse · HeLa · H2B-GFP · 20 µm · 4 frames",
                "CRISPR cut animation running into a dividing-cells time-lapse."),
        "vis": ('st_edit', 'Guides designed · cut and repair · off-targets checked', 'A guide RNA finds its site, the strand is cut and repaired; guides are checked for off-targets.'),


    },
    {
        "n": "05", "h": "A study is planned",
        "p": "A cohort definition, protocol draft and statistical plan are prepared for the clinical team to review.",
        "label": "protocol v0.3 · SAP draft",
        "img": ("immune-cells-tissue.jpg",
                "Confocal · Tissue section · CD3 / CD68 / DAPI · 50 µm",
                "Trial document skeleton assembling over the cohort image."),
        "vis": ('st_plan', 'The Writer assembles the protocol · cohort defined · SAP drafted', 'The Writer agent fills a protocol section by section while a cohort of 24 people is defined.'),


    },
    {
        "n": "06", "h": "The record is written",
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
COMPARE = [
    ("Cites every claim to a source you can open", "Rarely", "Sometimes", "Always"),
    ("Routes each step to the best model", "No", "No", "Yes, logged"),
    ("Curated life-science datasets and trained models", "No", "Per tool", "Built in"),
    ("Works across literature, in-silico, protein, CRISPR, trials, documents", "No", "One area each", "One workspace"),
    ("Your data never trains shared models", "Varies", "Varies", "Never"),
    ("Role-based access per project and dataset", "No", "Varies", "Yes"),
    ("Human sign-off at every checkpoint", "No", "No", "Yes"),
]

# --------------------------------------------------------------------------
# Home: security rows
# --------------------------------------------------------------------------
SECURITY = [
    ("Project isolation", "Each project has its own storage scope. Agents see only its data.", "done"),
    ("No training on your data", "Your data never trains shared models.", "done"),
    ("Encryption in transit and at rest", "TLS 1.2 or higher. Managed keys, rotated on a schedule.", "done"),
    ("Role-based access", "Owner, editor and viewer roles per project and dataset.", "done"),
    ("EU data residency", "Storage and processing inside the EU.", "progress"),
    ("SOC 2 Type II", "Independent audit of controls.", "planned"),
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
     "Cytogent is an agentic workspace for life science research. Scientists and AI agents work together on "
     "literature and evidence, in-silico studies, protein studies and design, CRISPR and genome editing, clinical "
     "trials from planning to report, and regulatory and patent documentation — every result with cited, "
     "auditable evidence. Cytogent is operated by WelloWork AB in Sweden."),
    ("Who is Cytogent for?",
     "Four groups. Pharma and biotech R&amp;D teams who need evidence behind every decision. CROs and clinical teams "
     "who draft protocols, CRFs and reports. Hospitals and academic labs doing cohort work under strict ethics and "
     "data rules. Regulatory and IP teams who build submissions and patent filings from scattered results."),
    ("What can the agents do?",
     "Seven workflows. Search literature, patents and protocols with citations. Run in-silico screens and "
     "simulations. Predict protein structure and design sequences. Design CRISPR guides and analyse screens. "
     "Support clinical trials from protocol to clinical study report. Draft regulatory documents. Support patent "
     "prior-art search and claim drafting."),
    ("Is my data used to train models?",
     "No. Data you bring to Cytogent stays inside your project and never trains shared models. Projects are "
     "isolated from each other, access is granted per role, and every agent action against your data is recorded "
     "in an audit trail you can read. WelloWork AB acts as processor under a data processing agreement."),
    ("Where is data hosted?",
     "Cytogent is built and operated from Sweden by WelloWork AB. EU data residency — storage and processing "
     "inside the EU — is in progress rather than finished, and the security page shows the current status of "
     "every control with a plain label: Done, In progress or Planned. Sub-processors are listed publicly."),
    ("How is Cytogent different from a general AI assistant?",
     "A general assistant gives you an answer. Cytogent gives you evidence. Every claim links to a source you can "
     "open, each step is routed to the model that does it best and logged, curated datasets and trained models are "
     "built in, access follows your data rules, and a scientist signs off at every checkpoint."),
    ("How do I get access?",
     "By request. There is no self sign-up, no password and no free trial. Choose one of three request types — "
     "Individual, Institute or Hospital — and tell us your field and what you want to do. We read every request, "
     "arrange a short call if needed, then set up a workspace with your permissions."),
    ("Is Cytogent a medical device?",
     "No. Cytogent is a research tool. It makes no clinical decisions, gives no diagnosis and is not certified as a "
     "medical device under the MDR or IVDR. Agents draft, search, predict and support. A qualified scientist or "
     "clinician reviews and decides, and that review is part of the record."),
]

# --------------------------------------------------------------------------
# Footer
# --------------------------------------------------------------------------
FOOTER = [
    ("Product", [("Platform", "/platform/"), ("Data &amp; models", "/data-and-models/"),
                 ("Security", "/security/"), ("Request access", "/request-access/")]),
    ("Solutions", [(s["nav"], "/solutions/%s/" % s["slug"]) for s in SOLUTIONS]),
    ("Industries", [(i["nav"], "/industries/%s/" % i["slug"]) for i in INDUSTRIES]),
    ("Company", [("About", "/about/"), ("Resources", "/resources/"), ("FAQ", "/resources/faq/"),
                 ("Glossary", "/resources/glossary/"), ("Terms", "/terms/"), ("Privacy", "/privacy/")]),
]
