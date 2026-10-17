import { NewsletterForm } from "@/components/layout/newsletter-form";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-background-deep">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-px mx-auto h-px max-w-3xl bg-linear-to-r from-transparent via-indigo-soft/50 to-transparent"
      />

      <Container className="pt-16 pb-10 sm:pt-20">
        <div className="grid gap-8 border-b border-border pb-14 lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="lg:col-span-6">
            <h2 className="text-[1.75rem] type-heading sm:text-[2rem]">Get the changelog once a month.</h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Release notes, engineering write-ups and benchmark results from the {siteConfig.name} team.
            </p>
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <NewsletterForm />
          </div>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <a
              href={siteConfig.links.home}
              aria-label={`${siteConfig.name} home`}
              className="-m-1.5 inline-flex rounded-md p-1.5"
            >
              <Logo />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The deployment platform for teams that ship every day.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8">
            {siteConfig.footer.map((group) => (
              <div key={group.title}>
                <h3 className="text-[13px] font-medium text-foreground">{group.title}</h3>
                <ul className="mt-4 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="inline-flex py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-8 text-[13px] text-subtle-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {process.env.NEXT_PUBLIC_COPYRIGHT_YEAR} {siteConfig.name}. All rights reserved.
          </p>
          <StatusIndicator className="text-muted-foreground" />
        </div>
      </Container>
    </footer>
  );
}
