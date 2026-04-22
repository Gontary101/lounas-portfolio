import { useEffect, useRef, useState, Fragment } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SIMS } from './sims.js';
import { LangProvider, useLang } from './LangContext.jsx';

// ============ NAV ============
function Nav() {
  const { ui, lang, toggle } = useLang();
  const n = ui.nav;
  return (
    <nav className="nav" style={{ borderRadius: '0px' }}>
      <a href="#work">{n.work}</a>
      <a href="#sims">{n.sims}</a>
      <a href="#experience">{n.experience}</a>
      <a href="#skills">{n.skills}</a>
      <a href="#contact">{n.contact}</a>
      <button className="lang-toggle" onClick={toggle} title="Switch language">
        <span className={lang === 'en' ? 'lt-active' : ''}>EN</span>
        <span className="lt-sep">|</span>
        <span className={lang === 'fr' ? 'lt-active' : ''}>FR</span>
      </button>
    </nav>
  );
}

// ============ MOBILE NAV ============
function MobileNav() {
  const { ui, lang, toggle } = useLang();
  const n = ui.nav;
  return (
    <nav className="nav-mobile">
      <a href="#work">{n.work}</a>
      <a href="#sims">{n.sims}</a>
      <a href="#experience">{n.experience}</a>
      <a href="#skills">{n.skills}</a>
      <a href="#contact">{n.contact}</a>
      <button className="lang-toggle-sm" onClick={toggle}>{lang.toUpperCase()}</button>
    </nav>
  );
}

// ============ HERO ============
function Hero() {
  const ref = useRef(null);
  const { ui, data } = useLang();
  const h = ui.hero;
  const p = data.PROFILE;
  useEffect(() => {
    if (!ref.current) return;
    const sim = SIMS.hero(ref.current);
    return () => sim.destroy();
  }, []);
  return (
    <section className="hero" data-screen-label="01 Hero">
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      <div className="hero-badge">{h.badge}</div>

      <div className="hero-canvas-wrap" ref={ref}>
        <div className="canvas-loading">{h.loading}</div>
      </div>

      <div className="hero-content wrap">
        <div className="hero-id">
          <span className="bar" />
          <span>{h.id}</span>
        </div>
        <h1 className="hero-name">
          Lounas <em>Gana</em>
        </h1>
        <p className="hero-tag">{p.tagline}</p>
        <div className="hero-meta">
          <span><b>{p.role}</b></span>
          <span>{p.status}</span>
          <span>{p.location}</span>
          <span><a href={`mailto:${p.email}`}>{p.email}</a></span>
        </div>
      </div>
    </section>
  );
}

// ============ STATS ============
function StatsBar() {
  const { data } = useLang();
  return (
    <section className="wrap" style={{ paddingTop: 0 }}>
      <div className="stats">
        {data.PROFILE.stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="v">{s.v}</div>
            <div className="l">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============ SIMS ============
function SimCard({ title, subtitle, kicker, sim, caption, controls, children }) {
  const ref = useRef(null);
  const hudRef = useRef(null);
  const simRef = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.__hud = hudRef.current;
    const instance = SIMS[sim](ref.current);
    simRef.current = instance;
    return () => instance.destroy();
  }, [sim]);

  return (
    <div className={`demo ${children ? 'wide' : ''}`}>
      <div className="demo-head">
        <span className="dots"><i /><i /><i /></span>
        <span>{title}</span>
        <span>{kicker}</span>
      </div>
      <div className="demo-body" ref={ref}>
        <div className="canvas-loading">initializing scene…</div>
        <div className="hud" ref={hudRef}>—</div>
        {children}
      </div>
      <div className="demo-foot">
        {controls?.(simRef)}
        <div className="readout">{subtitle}</div>
      </div>
      <div className="demo-caption">
        <span className="k">NOTES</span>
        <span>{caption}</span>
      </div>
    </div>
  );
}

function SimsSection() {
  const { ui } = useLang();
  const s = ui.sims;
  return (
    <section id="sims" className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">{s.num}</span>
          <h2 className="section-title">{s.title}</h2>
          <span className="section-kicker">{s.kicker}</span>
        </div>

        <p className="small" style={{ maxWidth: 720, color: 'var(--ink-soft)', marginBottom: 24 }}>
          {s.desc}
        </p>

        <div className="demo-grid">
          {/* A* */}
          <SimCard
            title={s.astar.title}
            kicker={s.astar.kicker}
            sim="astar"
            subtitle={s.astar.subtitle}
            caption={s.astar.caption}
            controls={(simRef) => (
              <>
                <button className="btn" onClick={() => simRef.current?.randomize()}>
                  {s.astar.btnRandom}
                </button>
                <button className="btn ghost" onClick={() => simRef.current?.reset()}>
                  {s.astar.btnClear}
                </button>
              </>
            )}
          >
            <div className="legend">
              <div className="ll"><span className="sw" style={{ background: '#FFDE42' }} /> {s.astar.legend.start}</div>
              <div className="ll"><span className="sw" style={{ background: '#C94A2B', borderRadius: '50%' }} /> {s.astar.legend.goal}</div>
              <div className="ll"><span className="sw" style={{ background: '#4C5C2D', opacity: 0.5 }} /> {s.astar.legend.visited}</div>
              <div className="ll"><span className="sw" style={{ background: '#FFDE42', opacity: 0.8 }} /> {s.astar.legend.frontier}</div>
              <div className="ll"><span className="sw" style={{ background: '#1B0C0C' }} /> {s.astar.legend.obstacle}</div>
            </div>
          </SimCard>

          {/* Quad */}
          <SimCard
            title={s.quad.title}
            kicker={s.quad.kicker}
            sim="quad"
            subtitle={s.quad.subtitle}
            caption={s.quad.caption}
            controls={(simRef) => (
              <button className="btn" onClick={() => simRef.current?.randomize()}>
                {s.quad.btnNew}
              </button>
            )}
          >
            <div className="legend">
              <div className="ll"><span className="sw" style={{ background: '#C94A2B', borderRadius: '50%' }} /> {s.quad.legend.goal}</div>
              <div className="ll"><span className="sw" style={{ background: '#313E17' }} /> {s.quad.legend.obstacle}</div>
              <div className="ll"><span className="sw" style={{ background: '#4C5C2D' }} /> {s.quad.legend.trail}</div>
            </div>
          </SimCard>

          {/* Manip */}
          <SimCard
            title={s.manip.title}
            kicker={s.manip.kicker}
            sim="manip"
            subtitle={s.manip.subtitle}
            caption={s.manip.caption}
            controls={(simRef) => (
              <button className="btn" onClick={() => simRef.current?.randomize()}>
                {s.manip.btnNew}
              </button>
            )}
          >
            <div className="legend">
              <div className="ll"><span className="sw" style={{ background: '#FFDE42' }} /> {s.manip.legend.payload}</div>
              <div className="ll"><span className="sw" style={{ background: '#313E17', opacity: 0.6 }} /> {s.manip.legend.dropzone}</div>
              <div className="ll"><span className="sw" style={{ background: '#1B0C0C' }} /> {s.manip.legend.gripper}</div>
            </div>
          </SimCard>

          {/* SLAM */}
          <SimCard
            title={s.slam.title}
            kicker={s.slam.kicker}
            sim="slam"
            subtitle={s.slam.subtitle}
            caption={s.slam.caption}
            controls={(simRef) => (
              <>
                <button className="btn" onClick={() => simRef.current?.randomize()}>
                  {s.slam.btnNew}
                </button>
                <button className="btn ghost" onClick={() => simRef.current?.reset()}>
                  {s.slam.btnReset}
                </button>
              </>
            )}
          >
            <div className="legend">
              <div className="ll"><span className="sw" style={{ background: '#FFDE42' }} /> {s.slam.legend.robot}</div>
              <div className="ll"><span className="sw" style={{ background: '#C94A2B' }} /> {s.slam.legend.lidar}</div>
              <div className="ll"><span className="sw" style={{ background: '#313E17' }} /> {s.slam.legend.particles}</div>
              <div className="ll"><span className="sw" style={{ background: '#1B0C0C' }} /> {s.slam.legend.occupied}</div>
              <div className="ll"><span className="sw" style={{ background: '#4C5C2D', opacity: 0.4 }} /> {s.slam.legend.free}</div>
              <div className="ll"><span className="sw" style={{ border: '1px solid #C94A2B', background: 'transparent' }} /> {s.slam.legend.ekf2s}</div>
              <div className="ll"><span className="sw" style={{ background: '#C94A2B', height: 2, marginTop: 4 }} /> {s.slam.legend.ekfest}</div>
            </div>
            <div className="slam-math">
              <div className="mh">{s.slam.ekf.predict}</div>
              <div>x̂ₖ = f(x̂ₖ₋₁, uₖ)</div>
              <div>Pₖ = F Pₖ₋₁ Fᵀ + Q</div>
              <div className="mh">{s.slam.ekf.update}</div>
              <div>K = P Hᵀ (H P Hᵀ + R)⁻¹</div>
              <div>x̂ ← x̂ + K(z − h(x̂))</div>
              <div>P ← (I − K H) P</div>
              <div className="sep" />
              <div data-p>σx — σy — σθ —</div>
              <div data-k>‖K‖ — Nₑff —</div>
            </div>
          </SimCard>
        </div>
      </div>
    </section>
  );
}

// ============ PROJECTS ============
function Projects() {
  const [open, setOpen] = useState(null);
  const { ui, data } = useLang();
  const s = ui.projects;
  return (
    <section id="work" className="section" data-screen-label="02 Work">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">{s.num}</span>
          <h2 className="section-title">{s.title}</h2>
          <span className="section-kicker">{s.kicker}</span>
        </div>

        <div className="projects">
          {data.PROJECTS.map((p) => (
            <Fragment key={p.id}>
              <div
                className="proj"
                onClick={() => setOpen(open === p.id ? null : p.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpen(open === p.id ? null : p.id);
                  }
                }}
                aria-expanded={open === p.id}
              >
                <div className="num">{p.num}</div>
                <div className="body">
                  <h3>{p.title}</h3>
                  <p>{p.blurb}</p>
                  <div className="tags">
                    {p.tags.map((t, i) => <span className="tag" key={i}>{t}</span>)}
                  </div>
                </div>
                <div className="side">
                  <span className="year mono">{p.year}</span>
                  <span className="mono small">{p.role}</span>
                  <span className="arrow">{open === p.id ? '×' : '→'}</span>
                </div>
              </div>
              {open === p.id && (
                <div className="proj-open">
                  <div>
                    <h4>{s.role}</h4>
                    <p style={{ margin: 0, color: '#bbb' }}>{p.role}</p>
                    <h4 style={{ marginTop: 20 }}>{s.stack}</h4>
                    <p style={{ margin: 0, color: '#bbb', fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 1.7 }}>
                      {p.stack}
                    </p>
                    {(p.report || p.report2) && (
                      <>
                        <h4 style={{ marginTop: 20 }}>{s.reports}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {p.report && (
                            <a className="dl-link" href={p.report.src} target="_blank" rel="noopener">
                              ↓ {p.report.label}
                            </a>
                          )}
                          {p.report2 && (
                            <a className="dl-link" href={p.report2.src} target="_blank" rel="noopener">
                              ↓ {p.report2.label}
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <h4>{s.highlights}</h4>
                    <ul>
                      {p.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                    {p.videos && p.videos.length > 0 && (
                      <>
                        <h4 style={{ marginTop: 20 }}>{s.demoVideos}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(p.videos.length, 2)}, minmax(0, 1fr))`, gap: 12 }}>
                          {p.videos.map((v, i) => (
                            <div key={i}>
                              <video
                                src={v.src}
                                controls
                                playsInline
                                preload="metadata"
                                style={{ width: '100%', border: '1px solid #444', background: '#000' }}
                              />
                              <div className="mono" style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>
                                {v.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ EXPERIENCE ============
function ExperienceSection() {
  const { ui, data } = useLang();
  const s = ui.experience;
  return (
    <section id="experience" className="section" data-screen-label="03 Experience">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">{s.num}</span>
          <h2 className="section-title">{s.title}</h2>
          <span className="section-kicker">{s.kicker}</span>
        </div>
        <div className="timeline">
          {data.EXPERIENCE.map((e, i) => (
            <div className="tl-row" key={i}>
              <div className="date">{e.date}</div>
              <div className="card">
                <h4>{e.title}</h4>
                <div className="org">{e.org}</div>
                <ul>{e.points.map((pt, j) => <li key={j}>{pt}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>

        <div className="section-head" style={{ marginTop: 80 }}>
          <span className="section-num mono">{s.eduNum}</span>
          <h2 className="section-title">{s.eduTitle}</h2>
        </div>
        <div className="timeline">
          {data.EDUCATION.map((e, i) => (
            <div className="tl-row" key={i}>
              <div className="date">{e.date}</div>
              <div className="card">
                <h4>{e.title}</h4>
                <div className="org">
                  {e.org} · <span style={{ color: 'var(--forest)' }}>{e.note}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ SKILLS ============
function SkillsSection() {
  const { ui, data } = useLang();
  const s = ui.skills;
  return (
    <section id="skills" className="section" data-screen-label="04 Skills">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">{s.num}</span>
          <h2 className="section-title">{s.title}</h2>
          <span className="section-kicker">{s.kicker}</span>
        </div>
        <div className="skill-grid">
          {data.SKILL_GROUPS.map((g, i) => (
            <div className="skill-cell" key={i}>
              <h5>{g.title}</h5>
              <ul>{g.items.map((x, j) => <li key={j}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ ABOUT ============
function About() {
  const { ui } = useLang();
  const s = ui.about;
  return (
    <section id="about" className="section" data-screen-label="05 About">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">{s.num}</span>
          <h2 className="section-title">{s.title}</h2>
          <span className="section-kicker">{s.kicker}</span>
        </div>
        <div className="about-grid">
          <p style={{ fontSize: 22, lineHeight: 1.5, margin: 0, letterSpacing: '-0.01em', maxWidth: 640 }}>
            {s.para}
          </p>
          <div className="mono small" style={{ color: 'var(--ink-soft)', lineHeight: 1.8 }}>
            {s.marks.map((m, i) => (
              <div className="mark-row" key={i}>
                <span>//</span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ CONTACT ============
function Contact() {
  const { ui, data } = useLang();
  const s = ui.contact;
  const p = data.PROFILE;
  return (
    <section id="contact" className="section" data-screen-label="06 Contact">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">{s.num}</span>
          <h2 className="section-title">{s.title}</h2>
          <span className="section-kicker">{s.kicker}</span>
        </div>
        <div className="contact">
          <div>
            <h3 className="giant">
              <a href={`mailto:${p.email}`}>{p.email}</a>
            </h3>
            <p className="mono small" style={{ color: 'var(--ink-soft)', marginTop: 24 }}>
              {s.bestFits}
            </p>
          </div>
          <div className="links">
            <a href={`mailto:${p.email}`}>
              <span>{s.email}</span>
              <span className="arr">{p.email} ↗</span>
            </a>
            <a href={`https://${p.linkedin}`} target="_blank" rel="noopener noreferrer">
              <span>{s.linkedin}</span>
              <span className="arr">{p.linkedin} ↗</span>
            </a>
            <a href={`tel:${p.phone.replace(/ /g, '')}`}>
              <span>{s.phone}</span>
              <span className="arr">{p.phone} ↗</span>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); window.print(); }}>
              <span>{s.print}</span>
              <span className="arr">⌘ P ↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ APP ============
function AppInner() {
  const { ui, data } = useLang();
  return (
    <>
      <Nav />
      <MobileNav />
      <Hero />
      <StatsBar />
      <Projects />
      <SimsSection />
      <ExperienceSection />
      <SkillsSection />
      <About />
      <Contact />
      <footer>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 12 }}>
          <span>{ui.footer}</span>
          <span>{data.PROFILE.location} · FR C2 / EN C2</span>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
      <Analytics />
    </LangProvider>
  );
}
