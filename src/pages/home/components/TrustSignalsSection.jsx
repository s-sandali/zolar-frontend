import { useMemo, useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { BadgeCheck, Award, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Trusted households",
    value: 12000,
    suffix: "+",
    caption: "Active solar families",
    decimals: 0,
  },
  {
    label: "Clean kWh tracked",
    value: 485000,
    suffix: "+",
    caption: "Recorded in the past 30 days",
    decimals: 0,
  },
  {
    label: "Uptime across fleets",
    value: 99.3,
    suffix: "%",
    caption: "Average monitored availability",
    decimals: 1,
  },
];




const NumberTicker = ({ value, duration = 1.8, decimals = 0, prefix = "", suffix = "", className }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
    });

    return () => controls.stop();
  }, [value, duration]);

  const formatted = useMemo(() => {
    return `${prefix}${Number(displayValue).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  }, [displayValue, decimals, prefix, suffix]);

  return (
    <span className={cn("font-semibold tabular-nums tracking-tight", className)}>
      {formatted}
    </span>
  );
};

const TrustSignalsSection = () => {
  return (
    <section id="trust" className="px-6 py-16 font-[Inter] md:px-12 lg:px-16">
      <div className="rounded-[36px] border border-slate-100 bg-white px-6 py-10 shadow-[0_28px_65px_rgba(15,23,42,0.08)] sm:p-10">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-600">Trusted by 10,000+ users</p>
            <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Proof that neighborhoods rely on Zolar for always-on solar intelligence.
            </h2>
            <p className="text-sm text-slate-700 sm:text-base">
              From independent households to municipal pilots, energy teams choose Zolar to surface anomalies, maximize payback, and keep sustainability promises visible.
            </p>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <NumberTicker
                  value={item.value}
                  suffix={item.suffix}
                  decimals={item.decimals}
                  className="text-3xl sm:text-4xl text-slate-900"
                />
                <p className="mt-2 text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-600">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignalsSection;
