/** Contact topics. `id` matches the `?intent=` links from other pages and the anchors on /contact. */
export const contactTopics = [
  { id: "pilot", title: "Discuss a pilot programme", subject: "Pilot programme" },
  { id: "lab", title: "Become a lab partner", subject: "Laboratory partnership" },
  { id: "collaboration", title: "Explore a collaboration", subject: "Collaboration" },
  { id: "investor", title: "Request the investor brief", subject: "Investor brief" },
  { id: "general", title: "Something else", subject: "Question" },
] as const;

export type ContactTopic = (typeof contactTopics)[number]["id"];
