"use client";

import { useEffect, useId, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Glow } from "@/components/ui/glow";
import { Logo } from "@/components/ui/logo";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 48rem)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  // On the home page the logo scrolls to the top instead of reloading.
  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname !== siteConfig.links.home) return;
    event.preventDefault();
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const elevated = scrolled || menuOpen;

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-50">
      <div
        className={cn(
          "border-b transition-[background-color,border-color] duration-300",
          elevated
            ? "border-border bg-background/75 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent",
        )}
      >
        <Container className="flex h-[var(--header-height)] items-center gap-4">
          <div className="flex flex-1 items-center gap-5">
            <a
              href={siteConfig.links.home}
              onClick={handleLogoClick}
              aria-label={`${siteConfig.name} home`}
              className="-m-1.5 rounded-md p-1.5"
            >
              <Logo />
            </a>
            <StatusIndicator className="hidden rounded-full border border-border bg-white/[0.03] py-1 pr-3 pl-2.5 text-xs text-muted-foreground lg:inline-flex" />
          </div>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2">
            <a
              href={siteConfig.links.signIn}
              className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              Sign in
            </a>
            <Glow className="hidden sm:inline-flex">
              <a href={siteConfig.links.trial} className={buttonVariants({ size: "sm" })}>
                Start free trial
              </a>
            </Glow>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white/[0.06] md:hidden"
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <Menu aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="scrim"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-x-0 top-[calc(var(--header-height)+env(safe-area-inset-top,0px))] bottom-0 bg-background-deep/60 md:hidden"
            />
            <motion.div
              key="menu"
              id={menuId}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-full border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
            >
              <Container className="pt-2 pb-6">
                <nav aria-label="Mobile">
                  <ul className="divide-y divide-border">
                    {siteConfig.nav.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex h-14 items-center justify-between text-base text-foreground"
                        >
                          {item.label}
                          <ArrowRight aria-hidden="true" className="size-4 text-subtle-foreground" />
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href={siteConfig.links.signIn}
                        className="flex h-14 items-center text-base text-muted-foreground"
                      >
                        Sign in
                      </a>
                    </li>
                  </ul>
                </nav>
                <a
                  href={siteConfig.links.trial}
                  onClick={() => setMenuOpen(false)}
                  className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full")}
                >
                  Start free trial
                </a>
                <StatusIndicator className="mt-5 text-xs text-muted-foreground" />
              </Container>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
