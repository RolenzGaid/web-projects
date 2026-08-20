import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        background: "var(--ink-sunken)",
        paddingBlock: "var(--gap-lg)",
        marginTop: "auto",
      }}
    >
      <div className="shell">
        <div
          className="row"
          style={{ alignItems: "center", rowGap: "var(--gap-md)" }}
        >
          <div className="col-12 col-md-6">
            <p
              className="display"
              style={{ fontSize: "var(--step-1)", margin: "0 0 0.2em" }}
            >
              {site.name}
            </p>
            <p className="muted" style={{ margin: 0, fontSize: "var(--step--1)" }}>
              {site.role} · {site.secondRole}
            </p>
          </div>

          <div className="col-12 col-md-6">
            <ul
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--gap-md)",
                listStyle: "none",
                margin: 0,
                padding: 0,
                justifyContent: "flex-start",
              }}
              className="justify-content-md-end"
            >
              {site.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="link muted"
                    style={{ fontSize: "var(--step--1)" }}
                    {...(item.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer noopener" }
                      : {})}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="hairline" style={{ marginBlock: "var(--gap-md)" }} />

        <p
          className="muted"
          style={{ margin: 0, fontSize: "var(--step--1)" }}
        >
          © {year} {site.name}. Built with Next.js — no page builder, no
          template.
        </p>
      </div>
    </footer>
  );
}
