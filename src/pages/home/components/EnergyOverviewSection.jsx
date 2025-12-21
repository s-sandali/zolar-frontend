import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const highlightStats = [
  {
    label: "Peak Output",
    value: "52.3 kW",
    detail: "Recorded at 13:20",
  },
  {
    label: "CO₂ Offset",
    value: "312 kg",
    detail: "This week",
  },
  {
    label: "Grid Contribution",
    value: "68%",
    detail: "Sent back to grid",
  },
  {
    label: "System Health",
    value: "98%",
    detail: "All systems optimal",
  },
];

export default function EnergyOverviewSection() {
  return (
    <section className="px-6 py-6 font-[Inter] md:px-12 lg:px-16">   

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
            <img
              src="/assets/images/solar1.jpg"
              alt="Offshore wind turbines generating electricity"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="rounded-[28px] border border-slate-100 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 text-blue-700">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                Field maintenance team verifying solar arrays
              </p>
            </div>
            <img
              src="/assets/images/solar-construction.webp"
              alt="Engineers inspecting solar panels"
              className="mt-4 h-48 w-full rounded-2xl object-cover"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div>
           
            <h2 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
              Smarter solar, powered by real-time insight
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              We help homes and businesses get more from their solar systems through intelligent
               monitoring, predictive analytics, and actionable insights. From real-time performance 
               tracking to early fault detection, our platform ensures your solar investment operates 
               at peak efficiency every day.
            </p>
          </div>

          <div className="grid gap-4 text-sm text-slate-700">
            {[
              "Live diagnostics monitor anomalies across each panel",
              "Weather-aware performance insights optimize energy use",
              "Early warnings before faults affect output",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-lime-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlightStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-[0_10px_25px_rgba(15,23,42,0.05)]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
