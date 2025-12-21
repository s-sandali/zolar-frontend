import { ShieldCheck, Sparkles, Zap, Timer } from "lucide-react";

const solutionHighlights = [
  {
    title: "Automated diagnostics",
    description: "Machine intelligence scans inverter streams every 5 minutes and flags root-cause insights instantly.",
    icon: ShieldCheck,
  },
  {
    title: "Guided playbooks",
    description: "Technicians receive step-by-step instructions, parts lists, and safety notes inside the app.",
    icon: Sparkles,
  },
  {
    title: "Smart escalations",
    description: "Severe anomalies open a maintenance ticket, notify the field team, and sync with your CMMS.",
    icon: Zap,
  },
  {
    title: "Proof of resolution",
    description: "Annotated photos, meter readings, and closure notes are stored for compliance in one timeline.",
    icon: Timer,
  },
];

const resolutionStats = [
  { label: "Avg. response", value: "12 min", detail: "Triaged within" },
  { label: "On-site fixes", value: "92%", detail: "Resolved first visit" },
  { label: "Downtime saved", value: "18 hrs", detail: "Per month" },
];

const responsePlaybook = [
  "Realtime anomaly alert arrives in the mobile app",
  "System auto-verifies sensors & weather context",
  "Playbook assigns task to the closest available engineer",
  "Resolution proof syncs to dashboard and customer report",
];

export default function SolutionSection() {
  return (
    <section className="px-6 py-16 font-[Inter] md:px-12 lg:px-16">
      <div className="grid gap-10 rounded-[36px] border border-slate-100 bg-white px-6 py-10 shadow-[0_28px_65px_rgba(15,23,42,0.08)] lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
            <span>Solution</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Automated remediation keeps every kilowatt on track.
          </h2>
          <p className="text-lg text-slate-600">
            When anomalies surface, Zolar orchestrates fixes automatically. Real-time diagnostics, prioritized workflows, and
            traceable field actions protect production while delighting customers.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            {solutionHighlights.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-100 bg-slate-50/60 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-center gap-3 text-emerald-600">
                  <Icon className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] bg-slate-900 px-6 py-8 text-white shadow-[0_32px_70px_rgba(15,23,42,0.35)]">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Service Impact</p>
            <h3 className="mt-3 text-3xl font-semibold">Rapid recovery, measurable gains.</h3>
            <p className="mt-2 text-sm text-slate-200">
              Cross-team visibility keeps maintenance, support, and asset managers aligned on the same facts.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {resolutionStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-slate-200">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-300">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-blue-100 bg-blue-50/70 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-500">Response Playbook</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {responsePlaybook.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
