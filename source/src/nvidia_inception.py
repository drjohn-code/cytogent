# -*- coding: utf-8 -*-
"""NVIDIA Inception Program membership: one place for the badge file and the words around it.

Every NVIDIA component in build.py reads from here. To swap the badge, drop the new file into
source/static/brand/ and change BADGE_SRC, BADGE_WIDTH and BADGE_HEIGHT. Set BADGE_SRC to None and the
site shows a text pill with MEMBER_LINE instead of the image.

Two badge files live in source/static/brand/:
  nvidia-inception-program-badge.svg          NVIDIA's own file, unaltered: nvidia-inception-program-badge-rgb-for-screen.svg
                                              from the "Inception Badges" kit (8 Aug 2023), linked from the member badge
                                              guidelines at design.nvidia.com/partners/inception/nvidia-inception-program/member-badge.
                                              It draws its own white box; this is NVIDIA's treatment for dark backgrounds too.
  nvidia-inception-program-badge-on-dark.svg  Derived from that file for the site's dark ground: white box removed, black made
                                              white, NVIDIA green untouched, same layout and clear space. Not a file from NVIDIA's
                                              kit. Chosen by the founder; switch BADGE_SRC back to the boxed file if NVIDIA asks.
Both share the same viewBox, so BADGE_WIDTH and BADGE_HEIGHT hold for either.
"""

PROGRAM_NAME = "NVIDIA Inception Program"
MEMBER_LINE = "Member of the NVIDIA Inception Program"
COMPANY_LINE = "WelloWork AB, the company behind Cytogent"

# the badge as served (copied from source/static/brand/ by the build); its size is the file's viewBox
BADGE_SRC_BOXED = "/brand/nvidia-inception-program-badge.svg"       # NVIDIA's file, white box
BADGE_SRC = "/brand/nvidia-inception-program-badge-on-dark.svg"     # the transparent version the site shows
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
