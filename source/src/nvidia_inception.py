# -*- coding: utf-8 -*-
"""NVIDIA Inception Program membership: one place for the badge file and the words around it.

Every NVIDIA component in build.py reads from here. To swap the badge, drop the new file into
source/static/brand/ and change BADGE_SRC, BADGE_WIDTH and BADGE_HEIGHT. Set BADGE_SRC to None and the
site shows a text pill with MEMBER_LINE instead of the image.

The badge is NVIDIA's own artwork, unaltered: nvidia-inception-program-badge-rgb-for-screen.svg from the
"Inception Badges" kit (8 Aug 2023), linked from the member badge guidelines at
https://design.nvidia.com/partners/inception/nvidia-inception-program/member-badge
The file draws its white box and keeps its own clear space (a transparent margin about the height of the
"n" in the NVIDIA logo), so it works on the dark ground as it is: no recolour, no box, no effects.
"""

PROGRAM_NAME = "NVIDIA Inception Program"
MEMBER_LINE = "Member of the NVIDIA Inception Program"
COMPANY_LINE = "WelloWork AB, the company behind Cytogent"

# the badge as served (copied from source/static/brand/ by the build); its size is the file's viewBox
BADGE_SRC = "/brand/nvidia-inception-program-badge.svg"
BADGE_WIDTH = 500
BADGE_HEIGHT = 216
BADGE_ALT = "NVIDIA Inception Program member badge"

LEGAL_LINE = ("NVIDIA, BioNeMo, NIM and Parabricks are trademarks of NVIDIA Corporation. "
              "Inception Program membership does not imply NVIDIA endorsement.")

# where "read more" points from other pages
ANCHOR = "nvidia"
MORE_HREF = "/data-and-models/#nvidia"

# the science models, as named on the cards, the tags and in the illustration
MODELS = ["OpenFold", "DiffDock", "ESM", "RFdiffusion + ProteinMPNN", "Parabricks"]

# the Organization JSON-LD on the home page
MEMBER_OF = {
    "@type": "ProgramMembership",
    "programName": PROGRAM_NAME,
    "hostingOrganization": {"@type": "Organization", "name": "NVIDIA"},
}
