"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CircleCheck, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { subscribe } from "@/lib/subscribe";
import { cn } from "@/lib/utils";
import { EMAIL_ERROR, isValidEmail } from "@/lib/validation";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!isValidEmail(value)) {
      setStatus("error");
      setMessage(EMAIL_ERROR);
      return;
    }

    setStatus("submitting");
    setMessage("");
    const result = await subscribe(value);

    if (result.ok) {
      setStatus("success");
      setMessage(`Subscribed ${value}. The next issue arrives on the first Tuesday of the month.`);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.error);
    }
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <label htmlFor="newsletter-email" className="sr-only">
        Work email
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") setStatus("idle");
          }}
          aria-invalid={status === "error"}
          aria-describedby="newsletter-status"
          className={cn(
            "h-12 min-w-0 flex-1 rounded-lg border bg-white/[0.03] px-4 text-base text-foreground transition-[border-color,background-color] duration-200 placeholder:text-subtle-foreground",
            "focus:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            status === "error"
              ? "border-danger/60"
              : "border-border hover:border-border-strong focus:border-indigo-soft/60",
          )}
        />
        <Button type="submit" size="lg" disabled={submitting} className="sm:w-36">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={submitting ? "submitting" : status === "success" ? "success" : "idle"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="inline-flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <LoaderCircle aria-hidden="true" className="motion-safe:animate-spin" />
                  Subscribing
                </>
              ) : status === "success" ? (
                <>
                  <CircleCheck aria-hidden="true" />
                  Subscribed
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight aria-hidden="true" />
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
      </div>
      <p
        id="newsletter-status"
        aria-live="polite"
        className={cn(
          "mt-3 min-h-5 text-sm",
          status === "error" && "text-danger",
          status === "success" && "text-live",
          (status === "idle" || status === "submitting") && "text-subtle-foreground",
        )}
      >
        {message || "One email a month. Unsubscribe with one click."}
      </p>
    </form>
  );
}
