import { SignUp } from "@clerk/nextjs";
import { Sparkles, Users, FileText } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export default function SignUpPage() {
  return (
    <div className="flex h-screen bg-[var(--bg-base)]">
      {/* Left panel — brand + features, hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 bg-[var(--bg-surface)] border-r border-[var(--border-default)]">
        <div className="max-w-md">
          <p className="text-sm font-medium tracking-tight text-[var(--accent-primary)]">
            Doremon AI
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--text-primary)]">
            Design systems at the speed of thought.
          </h1>
          <p className="mt-4 text-[var(--text-secondary)] text-base leading-relaxed">
            Describe your architecture in plain English. Doremon AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>

          <ul className="mt-10 space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-primary-dim)]">
                  <Icon className="h-5 w-5 text-[var(--accent-primary)]" />
                </span>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel — full width on small screens */}
      <div className="flex flex-1 items-center justify-center px-4">
        <SignUp />
      </div>
    </div>
  );
}
