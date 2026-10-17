import { siteConfig } from "@/lib/site";

export type BillingPeriod = "monthly" | "yearly";

export interface Plan {
  id: "starter" | "pro" | "enterprise";
  name: string;
  tagline: string;
  /** Price per month in USD. `yearly` is the monthly equivalent when billed annually. */
  price: Record<BillingPeriod, number> | null;
  unit: string;
  billingNote: Record<BillingPeriod, string>;
  cta: { label: string; href: string };
  featuresTitle: string;
  features: string[];
  highlighted?: boolean;
}

export const YEARLY_DISCOUNT_LABEL = "Save 20%";

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For solo developers and side projects that need a real production setup.",
    price: { monthly: 15, yearly: 12 },
    unit: "per month",
    billingNote: { monthly: "Billed monthly", yearly: "$144 billed yearly" },
    cta: { label: "Choose Starter", href: `${siteConfig.links.signUp}?plan=starter` },
    featuresTitle: "What's included",
    features: [
      "3 projects with preview deployments",
      "100 GB bandwidth per month",
      "Global edge network",
      "Automatic HTTPS and DDoS protection",
      "1-day log retention",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For product teams that ship to production every day.",
    price: { monthly: 45, yearly: 36 },
    unit: "per member / month",
    billingNote: { monthly: "Billed monthly", yearly: "$432 per member, billed yearly" },
    cta: { label: "Start 14-day trial", href: `${siteConfig.links.signUp}?plan=pro` },
    featuresTitle: "Everything in Starter, plus",
    features: [
      "Unlimited projects",
      "1 TB bandwidth per month",
      "Instant rollbacks",
      "Request tracing with 30-day retention",
      "Password-protected previews",
      "Email support with a 24-hour response",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For organizations with scale, security and compliance requirements.",
    price: null,
    unit: "",
    billingNote: {
      monthly: "Annual contract with volume pricing",
      yearly: "Annual contract with volume pricing",
    },
    cta: { label: "Talk to sales", href: siteConfig.links.contactSales },
    featuresTitle: "Everything in Pro, plus",
    features: [
      "99.99% uptime SLA",
      "SAML SSO and SCIM provisioning",
      "Dedicated regions and private networking",
      "Audit logs with 1-year retention",
      "24/7 support from a named engineer",
      "Custom contracts and invoicing",
    ],
  },
];
