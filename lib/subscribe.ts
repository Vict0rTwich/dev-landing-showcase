export type SubscribeResult = { ok: true } | { ok: false; error: string };

const GENERIC_ERROR = "We couldn't subscribe you right now. Try again in a minute.";

export async function subscribe(email: string): Promise<SubscribeResult> {
  try {
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) return { ok: true };

    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: data?.error ?? GENERIC_ERROR };
  } catch {
    return { ok: false, error: "Check your connection and try again." };
  }
}
