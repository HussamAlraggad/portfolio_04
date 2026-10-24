import { channels, site } from "@/lib/site";

export default function Channels() {
  return (
    <section
      id="channels"
      aria-label="Contact channels"
      className="relative z-10 border-t border-rule px-6 py-16 md:px-10"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium tracking-[-0.03em]">
          Channels
        </h2>
        <p className="tnum font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          {channels.length} open
        </p>
      </div>

      <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed text-dim">
        Any of these reaches me. Email is the one I answer first.
      </p>

      <ul className="mt-10 border-t border-rule">
        {channels.map((channel) => (
          <li key={channel.label} className="border-b border-rule">
            <a
              href={channel.href}
              {...(channel.external
                ? { target: "_blank", rel: "me noreferrer noopener" }
                : {})}
              data-probe={`channel ${channel.label.toLowerCase()}`}
              data-component="<Channels>"
              data-source="src/lib/site.ts"
              className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-1 py-5 transition-colors hover:bg-[#0c0e11] md:grid-cols-12 md:px-2"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint md:col-span-2">
                {channel.label}
              </span>
              <span className="truncate text-[17px] tracking-[-0.01em] text-ink transition-colors group-hover:text-signal md:col-span-8">
                {channel.handle}
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-[13px] text-faint transition-all group-hover:translate-x-1 group-hover:text-signal md:col-span-2 md:text-right"
              >
                {channel.external ? "↗" : "→"}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <footer className="mt-16 flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          {site.handle} · 2026
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          Master&apos;s candidate · open to internships
        </p>
      </footer>
    </section>
  );
}
