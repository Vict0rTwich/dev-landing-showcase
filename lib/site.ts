export interface NavLink {
  label: string;
  href: string;
}

export interface FooterGroup {
  title: string;
  links: NavLink[];
}

/**
 * Every link and piece of brand copy that appears in more than one place.
 * Routes such as /docs or /signup are placeholders for pages you build next;
 * until they exist they render app/not-found.tsx.
 */
export const siteConfig = {
  name: "Volans",
  tagline: "Ship at terminal velocity.",
  description:
    "Volans turns every git push into a global production deploy in under 40 seconds, with preview URLs, instant rollbacks and request tracing built in.",
  status: "All systems operational",
  cliCommand: "volans deploy --prod",
  links: {
    home: "/",
    trial: "/#pricing",
    signIn: "/login",
    signUp: "/signup",
    contactSales: "/contact",
  },
  nav: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Docs", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
  ] satisfies NavLink[],
  footer: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/#pricing" },
        { label: "Changelog", href: "/changelog" },
        { label: "Integrations", href: "/integrations" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    {
      title: "Developers",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "CLI reference", href: "/docs/cli" },
        { label: "API reference", href: "/docs/api" },
        { label: "Templates", href: "/templates" },
        { label: "Community", href: "/community" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Customers", href: "/customers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/legal/privacy" },
        { label: "Terms", href: "/legal/terms" },
        { label: "Security", href: "/security" },
        { label: "DPA", href: "/legal/dpa" },
        { label: "Subprocessors", href: "/legal/subprocessors" },
      ],
    },
  ] satisfies FooterGroup[],
} as const;
