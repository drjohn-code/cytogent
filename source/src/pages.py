# -*- coding: utf-8 -*-
"""Cytogent v3 — copy for the inner pages.

Rules kept from the brief: calm, plain English; no invented customers, logos or numbers;
access by request only; statuses are Done / In progress / Planned and nothing in between.
<kw>…</kw> marks the one accent keyword in a headline.

Each page has a `hero`: the part of the one Cytogent cell its hero shows, and what that part does.
"""

# ---------------------------------------------------------------------------
# Solutions — one page per workflow. `vis` (the main diagram) lives in content.SOLUTIONS.
# team = the agents on this workflow, drawn by the `team` diagram and listed as cards.
# ---------------------------------------------------------------------------
SOLUTION_PAGES = {
    "literature-and-evidence": {
        "title": "AI Literature Review for Life Science | Cytogent",
        "desc": "Search papers, patents, protocols and registries in one query. Agents read, compare and cite, "
                "so every claim in your review points to its source.",
        "h1": "Literature review where every claim is <kw>cited</kw>.",
        "hero": ("nucleus", "read", "The nucleus of the Cytogent cell, where glowing readers travel along the chromatin threads."),
        "intro": ("One query across the whole <kw>record</kw>.",
                  "Papers, patents, protocols and registries are searched together. Results come back as claims "
                  "with sources, not as a list of links.",
                  ["Search papers, patents and protocols at once.",
                   "Every sentence in a result links to the passage it came from.",
                   "Open questions and conflicting findings are marked, not hidden."]),
        "team": {
            "q": "What drives resistance?",
            "agents": [("Reader", "long-context LLM", "search", "Reads full texts and pulls out the claims that answer your question."),
                       ("Analyst", "code model", "compare", "Compares findings across studies and flags conflicts."),
                       ("Writer", "drafting LLM", "pen", "Drafts the review section by section, citing as it writes.")],
            "outs": ["Evidence table", "Review draft", "Source list"],
        },
        "outputs": [("table", "Evidence table", "Each claim with its source, the study type and the passage."),
                    ("doc", "Review draft", "A structured draft with numbered citations you can open."),
                    ("flag", "Open questions", "Gaps and conflicts listed for your team to judge."),
                    ("export", "Citation export", "Sources travel with the text into your report.")],
        "faq": [("Which sources can the agents search?",
                 "Published papers, patents, protocols and registries, plus the documents you bring into your "
                 "project. Each result shows where it came from, so you can open the original and read the passage "
                 "yourself before you rely on it."),
                ("How do I check a citation?",
                 "Every claim carries a numbered marker. Open it and you see the source and the passage the claim is "
                 "based on. Claims the agents could not link to a passage are marked as open questions, so they stand "
                 "out instead of blending in."),
                ("Can I add my own papers and notes?",
                 "Yes. Upload or connect them to your project. They are searched together with everything else, stay "
                 "inside the project and never train shared models. Only the people you add to the project can see them.")],
        "related": ["in-silico-studies", "regulatory-documentation", "patent-documentation"],
    },
    "in-silico-studies": {
        "title": "In Silico Drug Discovery Platform | Cytogent",
        "desc": "Docking, ADMET, pathway and PK models in one workspace. Agents run the screens, rank candidates "
                "and keep every parameter and source on record.",
        "h1": "Screen and simulate before the <kw>bench</kw>.",
        "hero": ("mito", "pulse", "A mitochondrion of the Cytogent cell: a wave of energy runs along its folds and sparks leave its tips."),
        "intro": ("Test more ideas before you pipette <kw>once</kw>.",
                  "Run virtual screens and simulations with the models the question needs. Every run is stored with "
                  "its inputs, so a result can be repeated and compared.",
                  ["Docking and virtual screening against your target.",
                   "ADMET and PK predictions for each candidate.",
                   "Each run keeps its inputs, parameters, model and version."]),
        "team": {
            "q": "Which candidates bind?",
            "agents": [("Reader", "long-context LLM", "search", "Collects known binders, targets and assay results from the literature."),
                       ("Analyst", "code + structure models", "cpu", "Prepares structures, runs docking and property models, ranks the results."),
                       ("Writer", "drafting LLM", "pen", "Writes the screening summary with methods and sources.")],
            "outs": ["Ranked candidates", "Run record", "Screen summary"],
        },
        "outputs": [("rank", "Ranked candidates", "Scored and sorted, with the model behind each score."),
                    ("gauge", "Property profiles", "ADMET and PK predictions side by side."),
                    ("layers", "Run record", "Inputs, parameters and versions for every run."),
                    ("doc", "Screen summary", "Methods, results and sources in one report.")],
        "faq": [("Which models can I run?",
                 "Docking, ADMET, pathway and PK models, together with trained research models for binding affinity "
                 "and variant effect. Each model shows its reported validation on its own card, so you know what it "
                 "was tested on before you use it."),
                ("Can I bring my own compounds and structures?",
                 "Yes. Add them to your project and the agents use them with the curated libraries. Your data stays "
                 "inside the project, is visible only to the roles you choose and never trains shared models."),
                ("Can a run be repeated later?",
                 "Yes. Each run is stored with its inputs, parameters and model version. You can run it again, change "
                 "one setting and compare the two results side by side.")],
        "related": ["protein-design", "literature-and-evidence", "crispr-genome-editing"],
    },
    "protein-design": {
        "title": "AI Protein Design and Structure Platform | Cytogent",
        "desc": "Predict structure, analyse binding and design sequences with agents. Every candidate carries its "
                "model, its inputs and a validation report.",
        "h1": "Protein structure, binding and design in one <kw>place</kw>.",
        "hero": ("ribo", "build", "Ribosomes on the rough ER of the Cytogent cell: building blocks gather and grow into a chain."),
        "intro": ("From sequence to <kw>candidate</kw>.",
                  "Predict a structure, study the binding site, then design and compare variants, with every step "
                  "on record.",
                  ["Structure prediction with confidence shown per region.",
                   "Binding-site analysis and interface comparison.",
                   "Sequence design with a validation report for each candidate."]),
        "team": {
            "q": "Stronger binding at site 2?",
            "agents": [("Reader", "long-context LLM", "search", "Collects known structures, mutations and binding data."),
                       ("Analyst", "structure models", "molecule", "Predicts structures, analyses binding and compares variants."),
                       ("Writer", "drafting LLM", "pen", "Writes the design report with methods and sources.")],
            "outs": ["Candidate variants", "Structure files", "Design report"],
        },
        "outputs": [("molecule", "Predicted structures", "With the model's confidence for each region."),
                    ("target", "Binding analysis", "The site, its contacts and how variants change them."),
                    ("rank", "Candidate list", "Variants ranked, each with its reasons."),
                    ("check", "Validation report", "What was predicted, with which model and version.")],
        "faq": [("Does Cytogent replace lab validation?",
                 "No. Predictions help you choose what to test. Validation happens in your lab, and the report says "
                 "clearly what was predicted, with which model and on which inputs, so your team can plan the right "
                 "experiments."),
                ("Can I start from my own structures?",
                 "Yes. Add experimental or predicted structures to your project. The agents use them together with "
                 "public structures and annotations, and your files stay inside the project."),
                ("How is confidence shown?",
                 "Each prediction shows the model's own confidence for each region, and each candidate lists the "
                 "model and version used. Low-confidence regions are marked, so nobody reads more into them than the "
                 "model supports.")],
        "related": ["in-silico-studies", "crispr-genome-editing", "patent-documentation"],
    },
    "crispr-genome-editing": {
        "title": "CRISPR Guide Design and Off-Target Review | Cytogent",
        "desc": "Design guide RNAs, review off-targets and analyse screens with agents. Every guide comes with its "
                "checks and a protocol draft for the lab.",
        "h1": "CRISPR guides designed, checked and <kw>documented</kw>.",
        "hero": ("chromatin", "cut", "Chromatin inside the Cytogent cell: a guide finds its site, the thread is cut, then repaired."),
        "intro": ("From target to <kw>guide</kw>.",
                  "Agents design guides for your target, check them for off-targets and prepare the documents your "
                  "lab needs.",
                  ["Guide design for your target and cell model.",
                   "Off-target review with every site listed.",
                   "Screen analysis with hits ranked and explained."]),
        "team": {
            "q": "Knock out this gene?",
            "agents": [("Reader", "long-context LLM", "search", "Collects known guides, editing results and target biology."),
                       ("Analyst", "code model", "dna", "Designs guides, scores off-targets and analyses screen data."),
                       ("Writer", "drafting LLM", "pen", "Drafts the validation protocol and the design notes.")],
            "outs": ["Guide set", "Off-target review", "Lab protocol"],
        },
        "outputs": [("dna", "Guide set", "Guides for your target, each with its scores."),
                    ("shield", "Off-target report", "Every close site, with its risk."),
                    ("chart", "Screen analysis", "Hits ranked, with the data behind each one."),
                    ("clipboard", "Protocol draft", "A validation protocol ready for review.")],
        "faq": [("How are off-targets reviewed?",
                 "Each guide is checked for close matches elsewhere in the genome. The report lists every site found "
                 "with its risk, so your team can decide which guides to take forward and which to drop."),
                ("Can I analyse my own screen data?",
                 "Yes. Bring your screen results into the project. The Analyst ranks the hits, notes the method it "
                 "used and links each finding to the data behind it, so the analysis can be checked and repeated."),
                ("Is the protocol ready for the bench?",
                 "It is a draft. A scientist reviews it, changes what is needed and signs it off before it is used in "
                 "the lab. The sign-off is part of the project record.")],
        "related": ["protein-design", "in-silico-studies", "literature-and-evidence"],
    },
    "clinical-trials": {
        "title": "AI Clinical Trial Support, Protocol to CSR | Cytogent",
        "desc": "Protocol drafts, site feasibility, cohort criteria, CRFs, statistical analysis plans, monitoring "
                "summaries and CSR drafts, built from your study data.",
        "h1": "Clinical trials, from protocol to <kw>report</kw>.",
        "hero": ("whole", "divide", "The whole Cytogent cell stretches, pinches and divides: one becomes many."),
        "intro": ("One workspace for the full <kw>cycle</kw>.",
                  "Plan, start, run and close a study with the same data and the same sources. Each document is "
                  "drafted for your team to review.",
                  ["Plan: protocol draft, endpoints, cohort criteria and statistical analysis plan.",
                   "Start and run: site feasibility, CRFs and monitoring summaries.",
                   "Close: a clinical study report drafted from the final data."]),
        "team": {
            "q": "Draft the phase II protocol",
            "agents": [("Reader", "long-context LLM", "search", "Collects prior trials, guidelines and endpoints."),
                       ("Analyst", "code model", "users", "Works on cohort criteria, sample size and data summaries."),
                       ("Writer", "drafting LLM", "pen", "Drafts the protocol, CRFs, SAP and CSR sections.")],
            "outs": ["Protocol draft", "SAP draft", "CSR sections"],
        },
        "outputs": [("clipboard", "Protocol and SAP", "Drafted from your study question and sources."),
                    ("table", "CRFs", "Built from the protocol, field by field."),
                    ("eye", "Monitoring summaries", "What changed at each site, in plain words."),
                    ("doc", "CSR draft", "Sections drafted from the final data.")],
        "faq": [("Does Cytogent run the trial?",
                 "No. Your team and your sites run the trial. Cytogent drafts and supports the documents around it. It "
                 "is a research tool, not a medical device, and it makes no clinical decisions."),
                ("Can it work with our study data?",
                 "Yes. Study data is added to a project that only your team can see, with owner, editor and viewer "
                 "roles. Agents work inside that project, and the data never trains shared models."),
                ("Who approves the documents?",
                 "Qualified people on your team. Every draft goes to review, and each sign-off is written into the "
                 "project record, so it is always clear who approved what and when.")],
        "related": ["regulatory-documentation", "literature-and-evidence", "in-silico-studies"],
    },
    "regulatory-documentation": {
        "title": "Regulatory Document Drafting: IND, CTA, IVDR | Cytogent",
        "desc": "Draft IND and CTA modules, IVDR technical files and SOPs from your cited results. Each section links "
                "to its sources, ready for reviewer questions.",
        "h1": "Regulatory documents, structured for <kw>review</kw>.",
        "hero": ("golgi", "pack", "The Golgi of the Cytogent cell: material flows along the stack and buds off, packed and ready to leave."),
        "intro": ("Built from the evidence you already <kw>have</kw>.",
                  "Agents place your results in the structure reviewers expect, with every statement linked to its "
                  "source.",
                  ["IND and CTA modules in the expected structure.",
                   "IVDR technical file sections for diagnostics.",
                   "SOPs drafted and kept under version control."]),
        "team": {
            "q": "Draft the quality module",
            "agents": [("Reader", "long-context LLM", "search", "Maps guidance and your data to each section."),
                       ("Analyst", "code model", "compare", "Checks consistency across modules and flags gaps."),
                       ("Writer", "drafting LLM", "pen", "Drafts sections and answers to reviewer questions.")],
            "outs": ["Module drafts", "Gap list", "Reviewer answers"],
        },
        "outputs": [("layers", "Module drafts", "In the structure reviewers expect."),
                    ("flag", "Gap report", "Missing data and inconsistencies, listed."),
                    ("message", "Reviewer answers", "Drafted from the sections that hold the answer."),
                    ("clipboard", "SOPs", "Drafted, versioned and ready for sign-off.")],
        "faq": [("Does Cytogent submit to regulators?",
                 "No. Cytogent drafts and structures the documents. Your regulatory team reviews them, decides what to "
                 "file and submits through its usual channels."),
                ("Which documents can it draft?",
                 "IND and CTA modules, IVDR technical file sections and standard operating procedures. Each section "
                 "is built from the cited results in your project, so every statement can be traced to its source."),
                ("How are reviewer questions handled?",
                 "Add the question to the project. The Writer finds the sections and sources that answer it and "
                 "drafts a response for your team to review, edit and sign off.")],
        "related": ["clinical-trials", "patent-documentation", "literature-and-evidence"],
    },
    "patent-documentation": {
        "title": "AI Patent Drafting for Life Science | Cytogent",
        "desc": "Prior-art search, invention disclosures and claim-drafting support from your own results. Every "
                "argument links to its source for your patent attorney.",
        "h1": "Prior art and claims from your own <kw>results</kw>.",
        "hero": ("receptor", "exit", "The membrane of the Cytogent cell: a vesicle reaches the edge and its content leaves the cell."),
        "intro": ("See the prior art <kw>early</kw>.",
                  "Search patents and papers before you file. Close documents are found, compared and listed with the "
                  "passages that matter.",
                  ["Prior-art search across patents and papers.",
                   "Invention disclosures drafted from your results.",
                   "Claim-drafting support for your patent attorney."]),
        "team": {
            "q": "Is our variant new?",
            "agents": [("Reader", "long-context LLM", "search", "Searches and reads patents and papers."),
                       ("Analyst", "code model", "compare", "Compares close documents with your claim elements."),
                       ("Writer", "drafting LLM", "pen", "Drafts the disclosure and claim options.")],
            "outs": ["Prior-art list", "Disclosure draft", "Claim options"],
        },
        "outputs": [("search", "Prior-art report", "Close documents, with the passages quoted."),
                    ("doc", "Invention disclosure", "Drafted from your own results."),
                    ("branch", "Claim options", "Independent and dependent claims to discuss."),
                    ("folder", "Evidence pack", "The sources behind each argument, in one place.")],
        "faq": [("Does Cytogent replace a patent attorney?",
                 "No. It prepares the search, the comparison and the drafts. Your patent attorney decides the "
                 "strategy, writes the final claims and files the application."),
                ("Is our invention kept confidential?",
                 "Yes. Your project is isolated from every other project, only the people you add can see it, and "
                 "nothing in it trains shared models."),
                ("Can it compare our claims with close documents?",
                 "Yes. The Analyst sets each claim element beside each close document and marks what is the same and "
                 "what is different, with the passages quoted, so your attorney can judge novelty quickly.")],
        "related": ["regulatory-documentation", "literature-and-evidence", "protein-design"],
    },
}

# ---------------------------------------------------------------------------
# Industries
# ---------------------------------------------------------------------------
INDUSTRY_PAGES = {
    "pharma-and-biotech": {
        "title": "AI for Pharma and Biotech R&D | Cytogent",
        "desc": "Target triage, candidate ranking and design loops with cited sources. One workspace for literature, "
                "in-silico, protein and CRISPR work.",
        "h1": "Pharma and biotech R&amp;D with evidence behind every <kw>decision</kw>.",
        "hero": ("receptor", "bind", "Receptors on the membrane of the Cytogent cell: molecules arrive and lock into place."),
        "before": ["Too many tools, too little evidence per decision.",
                   "Results live in slides, notebooks and inboxes.",
                   "Reviews are hard to repeat when people move on."],
        "after": ["Target triage with the sources behind each call.",
                  "Candidates ranked by models you can inspect.",
                  "Design loops where every run is on record."],
        "chips": ["slides", "notebook", "PDF", "email", "sheet", "script"],
        "flows": ["literature-and-evidence", "in-silico-studies", "protein-design", "crispr-genome-editing"],
        "example": [("Target", "Reader", "A target is proposed", "The team asks whether a target is worth a program."),
                    ("Evidence", "Reader", "Evidence is gathered", "Papers, patents and datasets are read, graded and cited."),
                    ("Screen", "Analyst", "Candidates are screened", "Docking and property models rank the first candidates."),
                    ("Decide", "You", "The team decides", "The decision is made with the record in front of everyone.")],
        "rules": [("lock", "Project isolation", "Each program is its own project. Agents see only its data.", "done"),
                  ("shield", "No training on your data", "Your data never trains shared models.", "done"),
                  ("users", "Role-based access", "Owner, editor and viewer roles per project.", "done")],
        "door": "institute",
    },
    "cro-and-clinical-teams": {
        "title": "AI for CROs and Clinical Teams | Cytogent",
        "desc": "Protocols, CRFs, statistical analysis plans and CSR drafts, built from your study data and ready for "
                "review. For CROs and clinical teams.",
        "h1": "Trial documents drafted from your study <kw>data</kw>.",
        "hero": ("whole", "divide", "The Cytogent cell divides: one becomes two, the way one study becomes a cohort."),
        "before": ["Protocols, CRFs and reports take months to draft.",
                   "The same facts are typed into many documents.",
                   "A change in one document is missed in the next."],
        "after": ["Drafts built from the study data and its sources.",
                  "One record behind protocol, SAP and CSR.",
                  "Every change is versioned and signed off."],
        "chips": ["protocol", "CRF", "SAP", "email", "tracker", "notes"],
        "flows": ["clinical-trials", "regulatory-documentation", "literature-and-evidence"],
        "example": [("Brief", "You", "The study question arrives", "The sponsor shares the question and the data plan."),
                    ("Protocol", "Writer", "Protocol and SAP are drafted", "Endpoints, criteria and sample size, with sources."),
                    ("Run", "Analyst", "CRFs and monitoring follow", "Forms and summaries stay in step with the data."),
                    ("Report", "Writer", "The CSR is drafted", "Sections are built from the final data for review.")],
        "rules": [("users", "Role-based access", "Owner, editor and viewer roles per project and dataset.", "done"),
                  ("lock", "Project isolation", "Each study is its own project, with its own storage scope.", "done"),
                  ("globe", "EU data residency", "Storage and processing inside the EU.", "progress")],
        "door": "institute",
    },
    "hospitals-and-academic-labs": {
        "title": "AI for Hospital and Academic Research | Cytogent",
        "desc": "Cohort analysis and scientific writing with a full record of every step, inside your permissions. "
                "For hospital research units and academic labs.",
        "h1": "Cohort research inside your data <kw>rules</kw>.",
        "hero": ("vesicles", "breathe", "Vesicles inside the Cytogent cell, each one carrying its own cargo."),
        "before": ["Cohort analysis under strict ethics and data rules.",
                   "Analysis code and notes are hard to trace later.",
                   "Writing takes time away from the lab and the clinic."],
        "after": ["Work stays inside the project and its permissions.",
                  "Each step is logged with its inputs and sources.",
                  "Papers and reports drafted from cited results."],
        "chips": ["cohort.csv", "R script", "ethics", "notes", "email", "draft"],
        "flows": ["literature-and-evidence", "clinical-trials", "crispr-genome-editing", "protein-design"],
        "example": [("Question", "You", "A cohort question is approved", "The study has its question and its ethics approval."),
                    ("Data", "You", "Data is attached", "The cohort data goes into a project only the team can see."),
                    ("Analysis", "Analyst", "The analysis runs", "Step by step, each one logged with its inputs."),
                    ("Paper", "Writer", "The paper is drafted", "Results and methods, with every claim cited.")],
        "rules": [("key", "Access by request only", "No self sign-up. Every account is reviewed.", "done"),
                  ("users", "Role-based access", "Owner, editor and viewer roles per project.", "done"),
                  ("info", "A research tool", "Not a medical device. It makes no clinical decisions.", "statement")],
        "door": "hospital",
    },
    "regulatory-and-ip-teams": {
        "title": "AI for Regulatory Affairs and IP Teams | Cytogent",
        "desc": "Structured drafts for IND/CTA modules, IVDR technical files and patent applications, built from the "
                "same cited results your scientists produced.",
        "h1": "Submissions and filings from one cited <kw>record</kw>.",
        "hero": ("golgi", "pack", "The Golgi of the Cytogent cell packs material and sends it on its way.", 2.4),
        "before": ["Submissions and filings built by hand from scattered results.",
                   "Sources are hard to find when a reviewer asks.",
                   "Regulatory and patent teams repeat the same work."],
        "after": ["Drafts that link every statement to its source.",
                  "Reviewer questions answered from the record.",
                  "One evidence base for submissions and filings."],
        "chips": ["IND", "claims", "study report", "SOP", "email", "sheet"],
        "flows": ["regulatory-documentation", "patent-documentation", "clinical-trials", "literature-and-evidence"],
        "example": [("Results", "You", "Results arrive", "The science team shares its cited results."),
                    ("Structure", "Writer", "Documents take shape", "Modules and disclosures are structured and drafted."),
                    ("Check", "Analyst", "Gaps are flagged", "Conflicts and missing data are listed, with sources."),
                    ("Sign-off", "You", "Review and sign-off", "Your team edits, approves and files.")],
        "rules": [("shield", "No training on your data", "Your data never trains shared models.", "done"),
                  ("lock", "Project isolation", "Filings and submissions stay in their own projects.", "done"),
                  ("scale", "GDPR", "WelloWork AB acts as processor. Data processing agreement on request.", "done")],
        "door": "institute",
    },
}

# ---------------------------------------------------------------------------
# Platform
# ---------------------------------------------------------------------------
PLATFORM = {
    "title": "Agentic Research Platform for Life Science | Cytogent",
    "desc": "Agents, data, models and protocols share one evidence trail. See how the workspace routes each step, "
            "logs it and keeps scientists in charge.",
    "h1": "One <kw>workspace</kw>, many tools.",
    "hero": ("half", "signal", "The Cytogent cell: a signal lands on a receptor, runs along the membrane and reaches the nucleus."),
    "bench": ("A shared bench for people and <kw>agents</kw>.",
              "Ask, delegate, review. Each agent works inside a project you control, with the same data and the same rules."),
    "routing": ("The right model for each <kw>step</kw>.",
                "Reading, coding, structure prediction and drafting go to different models. Routing is explicit and logged.",
                [("book", "Read papers", "Long-context language model"),
                 ("code", "Write analysis code", "Code model"),
                 ("molecule", "Predict structure", "Structure model"),
                 ("pen", "Draft the report", "Drafting language model")]),
    "cascade": ("How a request becomes a <kw>result</kw>.",
                "Four steps. Each one is checked and logged.",
                [("A request arrives", "You ask a question, or a new dataset lands in the project."),
                 ("Access is checked", "The workspace checks who asked and what they may see."),
                 ("Agents run", "Agents work in sequence, each step logged with its model and inputs."),
                 ("The result is written back", "A cited result lands in the project for you to review.")]),
    "stack": ("Data, models and protocols, <kw>built in</kw>.",
              "Everything an agent uses has a source, a version and a place in the record.",
              [("database", "Datasets", "Public and licensed collections, cleaned, versioned and documented."),
               ("cpu", "Trained models", "Domain models for prediction and screening, with reported validation."),
               ("clipboard", "Protocols", "Protocols you can search, adapt and cite, with each step attributed.")]),
    "integrations": ("Connects to the tools you already <kw>use</kw>.",
                     "Bring data in, send results out.",
                     ["Electronic lab notebook", "LIMS", "Object storage", "Git", "Team chat", "Single sign-on",
                      "Reference manager"]),
}

# ---------------------------------------------------------------------------
# Data and models
# ---------------------------------------------------------------------------
DATA = {
    "title": "Curated Life Science Datasets and Models | Cytogent",
    "desc": "Every dataset has a source, a version and a licence. Every model reports its validation. See what "
            "agents can query inside the Cytogent workspace.",
    "h1": "Datasets and models, curated for <kw>discovery</kw>.",
    "hero": ("vesicles", "labels", "Vesicles inside the Cytogent cell, each labelled with a dataset, its version and its licence.", 2.1),
    "datasets": ("Collections you can <kw>query</kw>.",
                 "Each collection lists its source, version and licence inside the workspace.",
                 [("dna", "Genomic variant collections", "Population and clinical variant sets with harmonized annotations."),
                  ("molecule", "Protein structures and annotations", "Experimental and predicted structures with domain and site annotations."),
                  ("flask", "Compound and assay libraries", "Screening results linked to compounds, targets and conditions."),
                  ("users", "Clinical and epidemiological registries", "Aggregated registries with documented consent and access terms."),
                  ("book", "Literature and protocol corpus", "Open-access papers, patents and protocols, indexed for citation."),
                  ("folder", "Your own data", "Upload or connect. It stays in your project and never trains shared models.")]),
    "models": ("Models trained for research, not for <kw>demos</kw>.",
               "Validation is reported with each model, on its own card in the workspace.",
               [("dna", "Variant effect model", "Predicts the functional impact of coding variants."),
                ("target", "Binding affinity model", "Ranks candidate compounds against a target."),
                ("grid", "Assay QC model", "Flags plates and wells that need a second look.")]),
    "curation": ("How a dataset enters the <kw>workspace</kw>.",
                 "Five steps. Nothing is served without a source and a version.",
                 [("Collect", "From a documented source under a clear licence."),
                  ("Clean", "Deduplicate, harmonize units and identifiers."),
                  ("Version", "Every change gets an immutable version."),
                  ("Document", "Provenance, schema and known limits."),
                  ("Serve", "Queryable by people and agents, with citations.")]),
    "yours": ("Your data stays in your <kw>project</kw>.",
              "Use it next to the curated collections, on your terms.",
              [("upload", "Upload or connect", "Files, folders or your own storage."),
               ("lock", "Project only", "Visible only to the roles you choose."),
               ("shield", "Never trains shared models", "Used for your work and nothing else.")]),
}

# ---------------------------------------------------------------------------
# Security (statuses exactly as in v1 — check them before launch)
# ---------------------------------------------------------------------------
SECURITY_PAGE = {
    "title": "Security and Data Protection | Cytogent",
    "desc": "Project isolation, encryption, role-based access and no training on your data. Every control carries a "
            "plain status: Done, In progress or Planned.",
    "h1": "Security you can <kw>inspect</kw>.",
    "hero": ("whole", "gate", "The membrane of the Cytogent cell turns outside particles back; only the keyed one passes at the receptor."),
    "handling": ("Where your data lives and how it <kw>moves</kw>.",
                 "Encrypted on the way in, encrypted where it rests, and kept inside its project.",
                 [("Encryption in transit", "TLS 1.2 or higher on every connection.", "done"),
                  ("Encryption at rest", "Managed keys, rotated on a schedule.", "done"),
                  ("Project isolation", "Each project has its own storage scope and agents see only its data.", "done"),
                  ("No training on your data", "Your data never trains shared models.", "done"),
                  ("EU data residency", "Storage and processing inside the EU.", "progress"),
                  ("Deletion on request", "Project data removed within a defined window.", "progress")]),
    "access": ("Who can do what, and a <kw>record</kw> of it.",
               "Every account is reviewed. Every role is set per project.",
               [("Access by request only", "No self sign-up. Every account is reviewed.", "done"),
                ("Role-based access", "Owner, editor and viewer roles per project.", "done"),
                ("Multi-factor authentication", "Required for every account.", "progress"),
                ("Single sign-on (SAML)", "For institutes and hospitals with an identity provider.", "progress"),
                ("Audit log", "Every agent action and data access is recorded.", "progress")]),
    "compliance": ("Where we <kw>stand</kw>.",
                   "The same three words everywhere: Done, In progress, Planned.",
                   [("scale", "GDPR", "WelloWork AB acts as processor for project data. Data processing agreement on request.", "done"),
                    ("badge", "ISO 27001", "Information security management system.", "progress"),
                    ("check", "SOC 2 Type II", "Independent audit of controls.", "planned"),
                    ("list", "Sub-processors", "A public list of cloud and model providers.", "progress")]),
    "faq": [("Is my data used to train models?",
             "No. Data you bring to Cytogent stays inside your project and never trains shared models. Projects are "
             "isolated from each other and access is granted per role."),
            ("Where is data hosted?",
             "Cytogent is built and operated from Sweden by WelloWork AB. EU data residency, meaning storage and "
             "processing inside the EU, is in progress rather than finished. This page shows its current status."),
            ("Can I get a data processing agreement?",
             "Yes. WelloWork AB acts as processor for project data under the GDPR, and a data processing agreement "
             "is available on request. Ask for it in your access request or on the first call.")],
}

# ---------------------------------------------------------------------------
# About
# ---------------------------------------------------------------------------
ABOUT = {
    "title": "About Cytogent and WelloWork AB",
    "desc": "Cytogent is an agentic workspace for life science research, built and operated by WelloWork AB in "
            "Sweden. Why we build it and how we work.",
    "h1": "We build the workspace where science and <kw>agents</kw> meet.",
    "hero": ("whole", "breathe", "The whole Cytogent cell at rest, breathing slowly."),
    "mission": ("Discovery is a team effort. Agents join the <kw>team</kw>.",
                "Agents read, compute and draft. Scientists ask, judge and decide. The workspace keeps every step visible."),
    "principles": ("How we <kw>work</kw>.",
                   "Four rules we hold ourselves to.",
                   [("quote", "Evidence first", "Every result carries its sources. If something cannot be cited, we say so."),
                    ("check", "People decide", "Agents support. A qualified person reviews and signs off."),
                    ("shield", "Your data stays yours", "Projects are isolated and data never trains shared models."),
                    ("list", "Plain status", "Done, in progress or planned. Nothing in between.")]),
    "partner": ("Partnered with <kw>Kilogent</kw>.",
                "Our platform infrastructure and engineering architecture are built in partnership with Kilogent.",
                "https://kilogent.com/"),
    "contact": ("Contact <kw>us</kw>.", "info@cytogent.com"),
}

# ---------------------------------------------------------------------------
# Resources, FAQ, glossary
# ---------------------------------------------------------------------------
RESOURCES = {
    "title": "Resources: FAQ, Glossary and Guides | Cytogent",
    "desc": "Answers to common questions, a glossary of the terms we use, and our security and data pages, in one place.",
    "h1": "Everything you need to know, in plain <kw>words</kw>.",
    "hero": ("half", "read", "Inside the nucleus of the Cytogent cell, readers travel along the threads of the archive."),
}

FAQ_PAGE = {
    "title": "Cytogent FAQ: Agents, Data, Security and Access",
    "desc": "Short, complete answers about Cytogent: what the agents do, how sources are cited, how your data is "
            "protected and how to get access.",
    "h1": "Questions scientists ask <kw>first</kw>.",
    "hero": ("chromatin", "read", "Chromatin threads inside the Cytogent nucleus, with readers moving along them."),
}

# groups: (group title, [(q, a)]). The home FAQ answers are added to these by the builder.
FAQ_MORE = {
    "general": [
        ("What is an agentic workspace?",
         "A shared place where people and AI agents work on the same project. Agents take on steps such as reading, "
         "computing and drafting, and hand results back with their sources. People set the question, check the work "
         "and decide. The workspace records who did what, and when."),
    ],
    "using": [
        ("How are sources cited?",
         "Agents cite as they work. Each claim in a result carries a numbered marker that opens its source: the paper, "
         "patent, protocol or dataset version it came from, and the passage or query behind it. You can check any "
         "claim in one step."),
        ("Which AI models do the agents use?",
         "Each step goes to a model suited to it: long-context language models for reading, code models for "
         "analysis, structure models for proteins and drafting models for documents, plus trained research models for "
         "prediction. The model used for each step is shown and logged."),
        ("Can I export results?",
         "Yes. Results, drafts and citation lists can be exported to your notebook, LIMS or report. Each export keeps "
         "its citations, so the sources travel with the text and your readers can check them too."),
        ("Who checks the agents' work?",
         "You do. Agents draft, search, predict and support. A qualified scientist or clinician reviews each result "
         "before it is used. The sign-off is part of the record, so it is always clear who approved what."),
    ],
    "data": [
        ("Can I bring my own data?",
         "Yes. Upload files or connect your sources to a project. Your data is used only inside that project, is "
         "visible only to the roles you choose and never trains shared models. You can combine it with the curated "
         "datasets and trained models in the workspace."),
        ("Who can see my project?",
         "Only the people you add, with the role you give them: owner, editor or viewer. Agents work inside the "
         "project and see only its data. Projects are isolated from each other, so work in one never appears in "
         "another."),
    ],
    "access": [
        ("What happens after I send a request?",
         "We read every request ourselves and reply within 5 working days. If we need to know more, we arrange a "
         "short call. Then we set up a workspace with the permissions your team needs and let you know by email."),
        ("Can my whole team use Cytogent?",
         "Yes. Choose the Institute or Hospital request type and tell us your team size. Each person gets a role per "
         "project: owner, editor or viewer. Single sign-on for institutes and hospitals is in progress."),
    ],
}

GLOSSARY_PAGE = {
    "title": "Glossary of Life Science and AI Terms | Cytogent",
    "desc": "Plain definitions of the terms used across Cytogent: agents, evidence trails, ADMET, CRF, CSR, IND, "
            "IVDR, off-target effects, prior art and more.",
    "h1": "The words we use, in plain <kw>English</kw>.",
    "hero": ("mito", "breathe", "A mitochondrion inside the Cytogent cell, at rest."),
}

GLOSSARY = [
    ("ADMET", "Absorption, distribution, metabolism, excretion and toxicity: how a compound behaves in the body. Predicted early to drop weak candidates."),
    ("Agent", "An AI worker that takes one step of a task, such as reading, computing or drafting, and hands the result back with its sources."),
    ("Agentic workspace", "A shared place where people and AI agents work on the same project, with the same data, rules and record."),
    ("Audit log", "A record of every agent action and data access in a project: who or what did it, and when."),
    ("Binding affinity", "How strongly a molecule binds to its target. Higher affinity usually means a lower dose is needed."),
    ("CRF", "Case report form. The form used to collect data about each participant in a clinical study."),
    ("CSR", "Clinical study report. The full report of a clinical study's methods and results, written after the study closes."),
    ("CTA", "Clinical trial application. The request to a European regulator for permission to run a clinical trial."),
    ("Docking", "A simulation that predicts how a small molecule fits into the binding site of a protein."),
    ("ELN", "Electronic lab notebook. The digital notebook where a lab records experiments and results."),
    ("Evidence trail", "The chain from a claim back to its sources, versions and the steps in between."),
    ("GDPR", "The EU General Data Protection Regulation. It sets the rules for processing personal data."),
    ("Guide RNA", "The short RNA that leads a CRISPR enzyme to the exact place in the genome where it should cut."),
    ("IND", "Investigational New Drug application. The request to the US FDA to start testing a new drug in people."),
    ("In silico", "Done by computer simulation rather than in a living system or a test tube."),
    ("Invention disclosure", "A document that describes an invention so a patent attorney can judge whether and how to file."),
    ("IVDR", "The EU In Vitro Diagnostic Medical Devices Regulation. It sets the rules for diagnostic tests sold in the EU."),
    ("LIMS", "Laboratory information management system. Software that tracks samples, tests and results in a lab."),
    ("Model routing", "Sending each step of a task to the model that does it best, and recording which model was used."),
    ("Off-target effect", "An edit made at a place in the genome that was not the intended target."),
    ("PK", "Pharmacokinetics. How the level of a drug in the body changes over time."),
    ("Prior art", "Everything already public before a patent is filed. It decides whether an invention is new."),
    ("Project isolation", "Each project has its own storage scope, and agents in one project cannot see another project's data."),
    ("SAP", "Statistical analysis plan. It sets out, before the data is seen, how a study's data will be analysed."),
    ("Sign-off", "The recorded approval of a result or document by a qualified person."),
    ("SOP", "Standard operating procedure. Step-by-step instructions for doing a task the same way every time."),
    ("Variant effect", "The predicted functional impact of a change in a gene's sequence."),
    ("Virtual screening", "Testing large libraries of compounds by computer to find the few worth testing in the lab."),
]

# ---------------------------------------------------------------------------
# Request access
# ---------------------------------------------------------------------------
REQUEST = {
    "title": "Request Access to Cytogent",
    "desc": "No self sign-up. Tell us who you are and what you want to do. We review every request by hand "
            "and reply within 5 working days.",
    "h1": "Access is by <kw>request</kw>.",
    "hero": ("receptor", "gate", "A receptor on the Cytogent cell membrane: most particles are turned back, the keyed one passes."),
    "sub": ("Tell us who you are and what you plan to do.",
            "We process every request within 5 working days and send you feedback."),
    "fields": ["Pharma", "Biotech", "Diagnostics", "IVD", "Molecular diagnostics", "Genomics", "Proteomics",
               "Genetics", "Epigenetics", "CRISPR", "Epidemiology", "Clinical studies", "Lab studies",
               "In-silico studies"],
}

LEGAL = {
    "terms": {
        "title": "Terms of Service | Cytogent",
        "desc": "Draft terms of service for Cytogent, operated by WelloWork AB, Sweden. Under legal review before publication.",
        "h1": "Terms of <kw>service</kw>.",
        "hero": ("golgi", "breathe", "The Golgi of the Cytogent cell, at rest."),
        "body": [
            ("1. Who we are", "<p>Cytogent is a service operated by WelloWork AB (“WelloWork”, “we”), a limited company registered in Sweden.</p>"),
            ("2. Access", "<p>Access is granted by request and review only. We may decline or withdraw access at our discretion. You are responsible for keeping your access credentials confidential.</p>"),
            ("3. Acceptable use", "<p>You may use the service for lawful research purposes. You may not use it to make clinical decisions about individual patients, to process data you have no right to process, or to attempt to extract models or datasets beyond the granted scope.</p>"),
            ("4. Your data", "<p>You keep ownership of data you bring to the service. You grant WelloWork the rights needed to operate the service for you. We do not use your project data to train shared models.</p>"),
            ("5. Outputs", "<p>Agent outputs are research aids. They may be wrong. You are responsible for verifying any output before relying on it.</p>"),
            ("6. Availability and changes", "<p>The service is provided as is during early access. We may change or discontinue features with reasonable notice.</p>"),
            ("7. Liability", "<p>To the extent permitted by Swedish law, WelloWork's liability is limited to the fees paid for the service in the twelve months before the claim.</p>"),
            ("8. Governing law", "<p>These terms are governed by the laws of Sweden. Disputes are resolved by the courts of Sweden.</p>"),
        ],
    },
    "privacy": {
        "title": "Privacy Policy | Cytogent",
        "desc": "Draft privacy policy for Cytogent, written with the GDPR in mind. WelloWork AB, Sweden, is the controller. Under legal review.",
        "h1": "Privacy <kw>policy</kw>.",
        "hero": ("membrane", "breathe", "The membrane of the Cytogent cell, at rest."),
        "body": [
            ("1. Controller", "<p>WelloWork AB, Sweden, is the controller for personal data collected through this website and the access request form.</p>"),
            ("2. What we collect", "<ul><li>Access requests: name, work email, institution, organization or hospital, role, fields, ORCID if given, intended use, compliance needs, how you heard about us.</li><li>Website use: technical logs needed to run and secure the site. No advertising trackers.</li><li>Project data you bring to the workspace, where WelloWork acts as processor under a data processing agreement.</li></ul>"),
            ("3. Why and on what legal basis", "<ul><li>Reviewing access requests and contacting you about them: our legitimate interest and steps before a contract (Art. 6(1)(b) and (f) GDPR).</li><li>Running and securing the service: legitimate interest (Art. 6(1)(f)).</li><li>Legal obligations, such as accounting: Art. 6(1)(c).</li></ul>"),
            ("4. Retention", "<p>Access requests are kept until a decision is made and for a limited period after it. Account data is kept while the account exists and for a limited period after it closes.</p>"),
            ("5. Recipients and transfers", "<p>We use cloud and model providers as sub-processors. A list will be published on the security page. Where data leaves the EU or EEA, we rely on adequacy decisions or standard contractual clauses.</p>"),
            ("6. Your rights", "<p>You can ask for access, rectification, erasure, restriction and portability, and you can object to processing based on legitimate interest. You can complain to the Swedish Authority for Privacy Protection (IMY).</p>"),
            ("7. Cookies", "<p>The site uses only technically necessary storage. No advertising cookies and no third-party trackers.</p>"),
            ("8. Changes", "<p>We will post changes here with a new date.</p>"),
        ],
    },
}
