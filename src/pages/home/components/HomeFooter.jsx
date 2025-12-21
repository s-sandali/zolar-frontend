const footerLinks = [
  {
    title: "Platform",
    items: ["Dashboard", "Anomalies", "Reports", "Integrations"],
  },
  {
    title: "Company",
    items: ["About", "Careers", "Partners", "Press"],
  },
  {
    title: "Resources",
    items: ["Docs", "Support", "Webinars", "API Status"],
  },
];

const footerMeta = [
  "© " + new Date().getFullYear() + " Zolar Energy Intelligence",
  "Privacy",
  "Security",
  "Terms",
];

export default function HomeFooter() {
  return (
    <footer className="px-6 pb-10 pt-16 font-[Inter] md:px-12 lg:px-16">
      <div className="rounded-[36px] border border-slate-100 bg-slate-900 px-8 py-12 text-white shadow-[0_32px_80px_rgba(15,23,42,0.45)]">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">Zolar</p>
            <h2 className="text-3xl font-semibold leading-snug">
              Predictable solar performance for every customer, every day.
            </h2>
            <p className="text-slate-300">
              Stay connected with anomaly alerts, asset health briefings, and best-practice guides dropped into your inbox weekly.
            </p>
            <form className="mt-6 flex flex-col gap-3 text-slate-900 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your work email"
                className="flex-1 rounded-full border border-slate-600/60 px-5 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-300 focus:outline-none"
              />
              <button
                type="button"
                className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{section.title}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {section.items.map((item) => (
                    <li key={item} className="cursor-pointer transition hover:text-white">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800/60 pt-6 text-xs text-slate-400">
          <ul className="flex flex-wrap items-center gap-4">
            {footerMeta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
