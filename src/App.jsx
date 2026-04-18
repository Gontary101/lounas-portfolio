import { useEffect, useRef, useState, Fragment } from 'react';
import { SIMS } from './sims.js';
import {
  PROFILE,
  PROJECTS,
  EXPERIENCE,
  EDUCATION,
  SKILL_GROUPS,
} from './data.js';

// ============ NAV ============
function Nav() {
  return (
    <nav className="nav" style={{ borderRadius: '0px' }}>
      <a href="#work">Work</a>
      <a href="#sims">Sims</a>
      <a href="#experience">Experience</a>
      <a href="#skills">Skills</a>
      <a href="#contact">Contact</a>
    </nav>
  );
}

// ============ HERO ============
function Hero() {
  const ref = useRef(null);
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
      <div className="hero-badge">PORTFOLIO · BUILT IN WEBGL</div>

      <div className="hero-canvas-wrap" ref={ref}>
        <div className="canvas-loading">loading webgl…</div>
      </div>

      <div className="hero-content wrap">
        <div className="hero-id">
          <span className="bar" />
          <span>LG-2026 / RESEARCH|DEVELOPMENT-ORIENTED · ROBOTICS + AI</span>
        </div>
        <h1 className="hero-name">
          Lounas <em>Gana</em>
        </h1>
        <p className="hero-tag">{PROFILE.tagline}</p>
        <div className="hero-meta">
          <span>
            <b>{PROFILE.role}</b>
          </span>
          <span>{PROFILE.status}</span>
          <span>{PROFILE.location}</span>
          <span>
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          </span>
        </div>
      </div>
    </section>
  );
}

// ============ STATS ============
function StatsBar() {
  return (
    <section className="wrap" style={{ paddingTop: 0 }}>
      <div className="stats">
        {PROFILE.stats.map((s, i) => (
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
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
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
  return (
    <section id="sims" className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">§ 02</span>
          <h2 className="section-title">Interactive sims, live in the page.</h2>
          <span className="section-kicker">Three.js · WebGL</span>
        </div>

        <p
          className="small"
          style={{ maxWidth: 720, color: 'var(--ink-soft)', marginBottom: 24 }}
        >
          Three self-contained robotics demos. Click, drag, scroll. Each one
          mirrors a real component of the project work below — global planning,
          reactive 6DOF navigation, and manipulation with inverse kinematics.
        </p>

        <div className="demo-grid">
          <SimCard
            title="A* // grid planner"
            kicker="§ planning"
            sim="astar"
            subtitle={
              <span>
                click to toggle obstacles · drag <b>start</b> or <b>goal</b>
              </span>
            }
            caption="8-connected grid with Manhattan-diagonal heuristic, visited cells in moss, frontier in yellow, replan on any edit."
            controls={(simRef) => (
              <>
                <button className="btn" onClick={() => simRef.current?.randomize()}>
                  Randomize
                </button>
                <button className="btn ghost" onClick={() => simRef.current?.reset()}>
                  Clear
                </button>
              </>
            )}
          >
            <div className="legend">
              <div className="ll">
                <span className="sw" style={{ background: '#FFDE42' }} /> start
              </div>
              <div className="ll">
                <span
                  className="sw"
                  style={{ background: '#C94A2B', borderRadius: '50%' }}
                />{' '}
                goal
              </div>
              <div className="ll">
                <span className="sw" style={{ background: '#4C5C2D', opacity: 0.5 }} />{' '}
                visited
              </div>
              <div className="ll">
                <span className="sw" style={{ background: '#FFDE42', opacity: 0.8 }} />{' '}
                frontier
              </div>
              <div className="ll">
                <span className="sw" style={{ background: '#1B0C0C' }} /> obstacle
              </div>
            </div>
          </SimCard>

          <SimCard
            title="6DOF quad nav // potential field"
            kicker="§ navigation"
            sim="quad"
            subtitle={
              <span>
                drag the <b>red goal</b> · scroll to change altitude
              </span>
            }
            caption="Reactive goal-seeking with obstacle repulsion in XY, altitude hold in Z, bank from lateral accel."
            controls={(simRef) => (
              <button className="btn" onClick={() => simRef.current?.randomize()}>
                New world
              </button>
            )}
          >
            <div className="legend">
              <div className="ll">
                <span
                  className="sw"
                  style={{ background: '#C94A2B', borderRadius: '50%' }}
                />{' '}
                goal
              </div>
              <div className="ll">
                <span className="sw" style={{ background: '#313E17' }} /> obstacle
              </div>
              <div className="ll">
                <span className="sw" style={{ background: '#4C5C2D' }} /> trail
              </div>
            </div>
          </SimCard>

          <SimCard
            title="Isometric manipulator // pick-and-place"
            kicker="§ manipulation"
            sim="manip"
            subtitle={
              <span>
                autonomous cycle: approach · grasp · lift · transit · place
              </span>
            }
            caption="6-DOF arm. Reachable pick/place poses sampled via FK — no IK, no unreachable targets."
            controls={(simRef) => (
              <button className="btn" onClick={() => simRef.current?.randomize()}>
                New pick · place
              </button>
            )}
          >
            <div className="legend">
              <div className="ll">
                <span className="sw" style={{ background: '#FFDE42' }} /> payload
              </div>
              <div className="ll">
                <span className="sw" style={{ background: '#313E17', opacity: 0.6 }} /> drop zone
              </div>
              <div className="ll">
                <span className="sw" style={{ background: '#1B0C0C' }} /> gripper
              </div>
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
  return (
    <section id="work" className="section" data-screen-label="02 Work">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">§ 01</span>
          <h2 className="section-title">Selected work.</h2>
          <span className="section-kicker">2022 → 2026 · eight entries</span>
        </div>

        <div className="projects">
          {PROJECTS.map((p) => (
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
                    {p.tags.map((t, i) => (
                      <span className="tag" key={i}>
                        {t}
                      </span>
                    ))}
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
                    <h4>Role</h4>
                    <p style={{ margin: 0, color: '#bbb' }}>{p.role}</p>
                    <h4 style={{ marginTop: 20 }}>Stack</h4>
                    <p
                      style={{
                        margin: 0,
                        color: '#bbb',
                        fontFamily: 'var(--mono)',
                        fontSize: 13,
                        lineHeight: 1.7,
                      }}
                    >
                      {p.stack}
                    </p>
                    {(p.report || p.report2) && (
                      <>
                        <h4 style={{ marginTop: 20 }}>Reports</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {p.report && (
                            <a
                              className="dl-link"
                              href={p.report.src}
                              target="_blank"
                              rel="noopener"
                            >
                              ↓ {p.report.label}
                            </a>
                          )}
                          {p.report2 && (
                            <a
                              className="dl-link"
                              href={p.report2.src}
                              target="_blank"
                              rel="noopener"
                            >
                              ↓ {p.report2.label}
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <h4>Highlights</h4>
                    <ul>
                      {p.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                    {p.videos && p.videos.length > 0 && (
                      <>
                        <h4 style={{ marginTop: 20 }}>Demo videos</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(p.videos.length, 2)}, minmax(0, 1fr))`, gap: 12 }}>
                          {p.videos.map((v, i) => (
                            <div key={i}>
                              <video
                                src={v.src}
                                controls
                                playsInline
                                preload="metadata"
                                style={{
                                  width: '100%',
                                  border: '1px solid #444',
                                  background: '#000',
                                }}
                              />
                              <div
                                className="mono"
                                style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}
                              >
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
  return (
    <section id="experience" className="section" data-screen-label="03 Experience">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">§ 03</span>
          <h2 className="section-title">Research & industry.</h2>
          <span className="section-kicker">labs · production · field</span>
        </div>
        <div className="timeline">
          {EXPERIENCE.map((e, i) => (
            <div className="tl-row" key={i}>
              <div className="date">{e.date}</div>
              <div className="card">
                <h4>{e.title}</h4>
                <div className="org">{e.org}</div>
                <ul>
                  {e.points.map((pt, j) => (
                    <li key={j}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="section-head" style={{ marginTop: 80 }}>
          <span className="section-num mono">§ 04</span>
          <h2 className="section-title">Education.</h2>
        </div>
        <div className="timeline">
          {EDUCATION.map((e, i) => (
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
  return (
    <section id="skills" className="section" data-screen-label="04 Skills">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">§ 05</span>
          <h2 className="section-title">Technical inventory.</h2>
          <span className="section-kicker">five layers · one profile</span>
        </div>
        <div className="skill-grid">
          {SKILL_GROUPS.map((g, i) => (
            <div className="skill-cell" key={i}>
              <h5>{g.title}</h5>
              <ul>
                {g.items.map((x, j) => (
                  <li key={j}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ ABOUT ============
function About() {
  return (
    <section id="about" className="section" data-screen-label="05 About">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">§ 06</span>
          <h2 className="section-title">What drives the profile.</h2>
          <span className="section-kicker">one paragraph, honestly</span>
        </div>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}
          className="about-grid"
        >
          <p
            style={{
              fontSize: 22,
              lineHeight: 1.5,
              margin: 0,
              letterSpacing: '-0.01em',
              maxWidth: 640,
            }}
          >
            Build autonomous systems where{' '}
            <em style={{ color: 'var(--forest)' }}>
              perception, estimation, planning, control, and software integration
            </em>{' '}
            must work together under real constraints — not isolated modules, but
            coherent systems.
          </p>
          <div
            className="mono small"
            style={{ color: 'var(--ink-soft)', lineHeight: 1.8 }}
          >
            <div className="mark-row">
              <span>//</span>
              <span>mechatronics foundation</span>
            </div>
            <div className="mark-row">
              <span>//</span>
              <span>robotics & automation specialization</span>
            </div>
            <div className="mark-row">
              <span>//</span>
              <span>autonomous systems & control</span>
            </div>
            <div className="mark-row">
              <span>//</span>
              <span>perception & AI for robotics</span>
            </div>
            <div className="mark-row">
              <span>//</span>
              <span>complete pipelines, not fragments</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ CONTACT ============
function Contact() {
  return (
    <section id="contact" className="section" data-screen-label="06 Contact">
      <div className="wrap">
        <div className="section-head">
          <span className="section-num mono">§ 07</span>
          <h2 className="section-title">Let's talk robots.</h2>
          <span className="section-kicker">targeting France · open to relocation</span>
        </div>
        <div className="contact">
          <div>
            <h3 className="giant">
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </h3>
            <p
              className="mono small"
              style={{ color: 'var(--ink-soft)', marginTop: 24 }}
            >
              Best fits:{' '}
              <b style={{ color: 'var(--ink)' }}>robotics software engineer</b> ·{' '}
              <b style={{ color: 'var(--ink)' }}>perception / AI for robotics</b> ·{' '}
              <b style={{ color: 'var(--ink)' }}>control, planning, autonomy</b> ·{' '}
              <b style={{ color: 'var(--ink)' }}>drone / UAV engineer</b> ·{' '}
              <b style={{ color: 'var(--ink)' }}>research engineer</b>.
            </p>
          </div>
          <div className="links">
            <a href={`mailto:${PROFILE.email}`}>
              <span>Email</span>
              <span className="arr">{PROFILE.email} ↗</span>
            </a>
            <a
              href={`https://${PROFILE.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>LinkedIn</span>
              <span className="arr">{PROFILE.linkedin} ↗</span>
            </a>
            <a href={`tel:${PROFILE.phone.replace(/ /g, '')}`}>
              <span>Phone</span>
              <span className="arr">{PROFILE.phone} ↗</span>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.print();
              }}
            >
              <span>Print / PDF</span>
              <span className="arr">⌘ P ↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ APP ============
export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <StatsBar />
      <Projects />
      <SimsSection />
      <ExperienceSection />
      <SkillsSection />
      <About />
      <Contact />
      <footer>
        <div
          className="wrap"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span>Lounas Gana · 2026 · Built in HTML, Three.js & React.</span>
          <span>{PROFILE.location} · FR C2 / EN C2</span>
        </div>
      </footer>
    </>
  );
}
