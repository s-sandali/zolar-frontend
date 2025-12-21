import { Activity, BellRing, Layers, ShieldCheck, Sparkles } from "lucide-react";

const featureHighlights = [
  {
    title: "Unified monitoring",
    description: "One console streams inverter health, weather deltas, and grid prices for quick triage.",
    icon: Layers,
  },
  {
    title: "AI anomaly guard",
    description: "Window-aware detection isolates shading, hardware drift, or sudden curtailment in seconds.",
    icon: Activity,
  },
  {
    title: "Actionable alerts",
    description: "Context-rich push notifications route to mobile, email, and Slack simultaneously.",
    icon: BellRing,
  },
  {
    title: "Zero-touch workflows",
    description: "Auto-create maintenance tickets, assign crews, and sync proof-of-work to reports.",
    icon: Sparkles,
  },
];

const capabilityMetrics = [
  { label: "Fleet online", value: "148", detail: "Sites streaming live" },
  { label: "Anomalies resolved", value: "37", detail: "Past 7 days" },
  { label: "Customer CSAT", value: "4.9/5", detail: "Post-resolution" },
];

export default function FeaturesSection() {
  return (
    <section className="px-6 py-16 font-[Inter] md:px-12 lg:px-16">
      <div className="rounded-[36px] border border-slate-100 bg-gradient-to-br from-white via-white to-blue-50 px-6 py-12 shadow-[0_28px_65px_rgba(15,23,42,0.08)] lg:px-14">
        <div className="flex flex-col gap-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            <ShieldCheck className="h-4 w-4" />
            <span>Features</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Everything you need to keep generation predictable.
          </h2>
          <p className="text-lg text-slate-600 md:w-3/4 md:self-center">
            Zolar pairs real-time intelligence with guided actions so operations, finance, and customer teams share the same,
            trusted picture of performance.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {featureHighlights.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-[28px] border border-slate-100 bg-white/80 p-6 text-left shadow-[0_20px_45px_rgba(15,23,42,0.07)]"
            >
              <div className="flex items-center gap-3 text-blue-600">
                <Icon className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</p>
              </div>
              <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 rounded-[28px] bg-slate-900 px-6 py-8 text-white shadow-[0_32px_70px_rgba(15,23,42,0.25)] sm:grid-cols-3">
          {capabilityMetrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{metric.label}</p>
              <p className="mt-3 text-3xl font-bold">{metric.value}</p>
              <p className="text-sm text-slate-200">{metric.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
