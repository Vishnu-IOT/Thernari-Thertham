/* "Sree Rama Navami" -> "sree-rama-navami": stable anchors that do not change with the language */
export const slug = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
