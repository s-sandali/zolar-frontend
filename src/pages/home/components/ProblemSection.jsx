import { AlertTriangle } from "lucide-react";

const riskItems = [
  "Panel shading or dirt",
  "Unexpected drop in output",
  "Inverter errors",
  "Missed maintenance reminders",
];

export default function ProblemSection() {
  return (
    <section className="px-6 py-16 font-[Inter] md:px-12 lg:px-16">
      <div className="grid gap-10 rounded-[36px] bg-white px-6 py-10 shadow-[0_28px_65px_rgba(15,23,42,0.12)] lg:grid-cols-2 lg:px-10 lg:py-16">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span>Problem</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Home solar systems can face reduced efficiency and missed savings due to panel shading, dirt, unexpected drops in
            output, or inverter issues. Stay ahead with instant anomaly alerts.
          </h2>
          <ul className="space-y-4 text-lg text-slate-700">
            {riskItems.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-red-500">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-[32px] border border-amber-100 bg-amber-50">
          <img
            src="/assets/images/wind-turbine-3.png"
            alt="Wind turbines representing renewable energy challenges"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
