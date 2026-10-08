"use client";

import { useEffect, useMemo, useState } from "react";

type Answers = Record<string, string | string[]>;

type Question =
  | { id: string; type: "single"; title: string; options: string[] }
  | { id: string; type: "multi"; title: string; options: string[]; max?: number }
  | { id: string; type: "text"; title: string; placeholder: string };

const questions: Question[] = [
  { id: "business", type: "single", title: "What kind of business do you run?", options: ["Hotel", "Restaurant", "Café", "QSR / takeaway", "Other"] },
  { id: "outlets", type: "single", title: "How many locations or properties do you operate?", options: ["1", "2–3", "4–10", "11+"] },
  { id: "role", type: "single", title: "What best describes your role?", options: ["Owner / founder", "General manager", "Operations", "Front office / service", "Other"] },
  { id: "pain", type: "multi", max: 3, title: "Which day-to-day problems take the most energy?", options: ["Handling customer enquiries", "Staff coordination", "Reservations / bookings", "Orders & follow-ups", "Complaints", "Keeping information updated", "Reporting / admin", "Getting new customers"] },
  { id: "channels", type: "multi", max: 4, title: "Where do customers usually contact you?", options: ["WhatsApp", "Phone calls", "Instagram / Facebook", "Google", "Website", "Walk-ins", "Other"] },
  { id: "repetitive", type: "single", title: "How much staff time goes into answering the same customer questions repeatedly?", options: ["Very little", "A little", "A lot", "A significant amount"] },
  { id: "missed", type: "multi", max: 3, title: "Which customer requests are most likely to be delayed or missed?", options: ["Availability / reservations", "Prices / menu", "Room / service information", "Directions / location", "Order status", "Special requests", "Complaints", "None of these"] },
  { id: "lost", type: "single", title: "Do you think enquiries are ever lost because nobody responds quickly enough?", options: ["Never", "Sometimes", "Often", "Not sure"] },
  { id: "automate", type: "multi", max: 3, title: "If you could remove three repetitive tasks tomorrow, what would they be?", options: ["Answering common questions", "Taking reservations / enquiries", "Following up with customers", "Sending prices / menus", "Order or booking updates", "Collecting customer details", "Internal reporting", "Other"] },
  { id: "systems", type: "multi", max: 5, title: "What tools do you currently rely on?", options: ["WhatsApp Business", "POS", "PMS / booking system", "CRM", "Spreadsheets", "Instagram / Facebook", "Nothing specific", "Other"] },
  { id: "value", type: "single", title: "If a tool reliably saved staff time and reduced missed enquiries, how would you react?", options: ["I would not pay for it", "Maybe, depending on the result", "I would consider paying", "I would actively look for something like this"] },
  { id: "price", type: "single", title: "What monthly price would feel reasonable for something genuinely useful?", options: ["₹0–499", "₹500–1,499", "₹1,500–2,999", "₹3,000+", "It would depend on the value"] },
  { id: "biggest", type: "text", title: "One last thing: what is the single biggest operational problem you wish someone would solve?", placeholder: "Be blunt. A sentence or two is enough." },
  { id: "contact", type: "text", title: "Want us to share what we learn?", placeholder: "Optional — name, phone or email" }
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const source = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("source") || "";
  }, []);

  const question = questions[step];
  const value = answers[question.id];
  const progress = ((step + 1) / questions.length) * 100;

  useEffect(() => {
    if (!started) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, started]);

  function choose(option: string) {
    if (question.type === "single") {
      setAnswers(a => ({ ...a, [question.id]: option }));
      return;
    }
    if (question.type === "multi") {
      const current = Array.isArray(value) ? value : [];
      const exists = current.includes(option);
      if (exists) {
        setAnswers(a => ({ ...a, [question.id]: current.filter(x => x !== option) }));
      } else if (!question.max || current.length < question.max) {
        setAnswers(a => ({ ...a, [question.id]: [...current, option] }));
      }
    }
  }

  const hasAnswer = typeof value === "string" ? value.trim().length > 0 : Array.isArray(value) ? value.length > 0 : false;

  async function submit() {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, source, userAgent: navigator.userAgent })
      });
      if (!response.ok) throw new Error("Unable to save");
      setSubmitted(true);
    } catch {
      setError("We couldn't save your response. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!started) {
    return (
      <div className="shell">
        <header className="header"><div className="wordmark">Hospitality / Operations</div><div className="private-note">2 minutes · no sales pitch</div></header>
        <main className="main">
          <div className="eyebrow">A short industry study</div>
          <h1>What is making hospitality harder than it should be?</h1>
          <p className="intro">We&apos;re speaking with owners and operators to understand the everyday problems that actually cost time, attention and revenue. No product pitch. Just honest answers.</p>
          <button className="start" onClick={() => setStarted(true)}>Take the 2-minute survey →</button>
          <div className="meta-row"><span>13 quick questions</span><span>Mostly one-tap answers</span><span>Anonymous by default</span></div>
        </main>
        <footer className="footer">Your answers will be used only for this research.</footer>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="shell">
        <main className="main success">
          <div className="success-mark">✓</div>
          <div className="eyebrow">Thank you</div>
          <h1>Your perspective matters.</h1>
          <p className="intro" style={{ margin: "0 auto" }}>That&apos;s it. We&apos;ll use the responses to understand where hospitality businesses genuinely need better tools.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="shell">
      <header className="header"><div className="wordmark">Hospitality / Operations</div><div className="private-note">Private research</div></header>
      <main className="main">
        <div className="progress-wrap">
          <div className="progress-top"><span>Question {step + 1} of {questions.length}</span><span>{Math.round(progress)}%</span></div>
          <div className="progress"><span style={{ width: progress + "%" }} /></div>
        </div>
        <div className="question-kicker">{question.type === "multi" ? "Choose up to " + question.max : "Quick question"}</div>
        <div className="question">{question.title}</div>

        {question.type === "text" ? (
          <textarea className="field" value={typeof value === "string" ? value : ""} placeholder={question.placeholder} onChange={e => setAnswers(a => ({ ...a, [question.id]: e.target.value }))} />
        ) : (
          <>
            {question.type === "multi" && <div className="multi-note">You can choose fewer. Pick only what genuinely applies.</div>}
            <div className="options">
              {question.options.map(option => {
                const selected = Array.isArray(value) ? value.includes(option) : value === option;
                return <button key={option} className={"option" + (selected ? " selected" : "")} onClick={() => choose(option)}><span>{option}</span><span className="check" /></button>;
              })}
            </div>
          </>
        )}

        {error && <p style={{ color: "#9b2c2c", fontSize: 13 }}>{error}</p>}

        <div className="actions">
          {step > 0 && <button className="back" onClick={() => setStep(s => s - 1)}>Back</button>}
          {step < questions.length - 1 ? (
            <button className="next" disabled={!hasAnswer} onClick={() => setStep(s => s + 1)}>Continue →</button>
          ) : (
            <button className="next" disabled={saving || !hasAnswer} onClick={submit}>{saving ? "Saving…" : "Finish survey →"}</button>
          )}
        </div>
      </main>
    </div>
  );
}