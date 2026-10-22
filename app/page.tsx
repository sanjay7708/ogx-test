import ContactForm from "@/components/ContactForm";
import Loader from "@/components/Loader";
import Piano from "@/components/Piano";
import RippleGrid from "@/components/RippleGrid";
import ShuffleText from "@/components/ShuffleText";
import Waves from "@/components/Waves";
import { content as c } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Loader name={c.name} />

      <header className="nav">
        <a href="#top" className="brand">{c.name}</a>
        <nav>
          <a href="#about">Know me</a>
          <a href="#work">Works</a>
          <a href="#memory">Memory tunnel</a>
          <a href="#piano">Play me out</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <div className="panel">
          <RippleGrid />
          <section className="hero">
            <h1>
              <ShuffleText as="span" text="Creative" className="line" />
              <ShuffleText as="span" text="Developer" className="line" />
            </h1>
            <p>{c.tagline}</p>
            <a href={c.cta.href}>{c.cta.label}</a>
          </section>
        </div>

        <section id="about">
          <ShuffleText as="h2" text="About" />
          {c.about.map((p) => <p key={p}>{p}</p>)}
          {c.sections.map((s) => (
            <div key={s.title}>
              <ShuffleText as="h3" text={s.title} />
              <p>{s.body}</p>
            </div>
          ))}
        </section>

        <section id="work">
          <ShuffleText as="h2" text="Works" />
          {c.projects.length === 0 ? (
            <p>No projects yet. Add them in lib/content.ts.</p>
          ) : (
            <ul className="projects">
              {c.projects.map((p) => (
                <li key={p.title}><a href={p.href}><strong>{p.title}</strong><span>{p.blurb}</span></a></li>
              ))}
            </ul>
          )}
        </section>

        <section id="memory">
          <ShuffleText as="h2" text="Memory tunnel" />
          <div className="tunnel">
            {c.memories.map((m, i) => (
              <div key={m} className="card" style={{ animationDelay: `${i * 1.2}s` }}>{m}</div>
            ))}
          </div>
        </section>

        <div className="panel">
          <Waves />
          <section id="piano">
            <ShuffleText as="h2" text="Play me out" />
            <Piano />
          </section>
        </div>

        <section id="contact">
          <ShuffleText as="h2" text="Contact" />
          <ContactForm />
        </section>
      </main>

      <footer>
        <a href="/terms">Terms</a>
        <a href="/privacy">Privacy</a>
        <a href={`mailto:${c.email}`}>{c.email}</a>
        {c.social.map((s) => <a key={s.label} href={s.href}>{s.label}</a>)}
      </footer>
    </>
  );
}
