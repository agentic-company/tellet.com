"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES, DEFAULT_HOMEPAGE_CONFIG, type HomepageConfig } from "./templates";

type Step = "template" | "content" | "sections" | "contact" | "preview";

const STEPS: { id: Step; label: string }[] = [
  { id: "template", label: "Template" },
  { id: "content", label: "Content" },
  { id: "sections", label: "Sections" },
  { id: "contact", label: "Contact" },
  { id: "preview", label: "Preview" },
];

const AVAILABLE_SECTIONS = [
  { id: "about", label: "About", description: "Company introduction" },
  { id: "team", label: "AI Team", description: "Show your AI agents" },
  { id: "chat", label: "Chat", description: "Chat widget prompt" },
  { id: "contact", label: "Contact", description: "Contact information" },
];

export function HomepageBuilder({
  companyId,
  companyName,
  companyDescription,
  slug,
  initialConfig,
}: {
  companyId: string;
  companyName: string;
  companyDescription: string | null;
  slug: string;
  initialConfig: HomepageConfig | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("template");
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<HomepageConfig>(
    initialConfig || {
      ...DEFAULT_HOMEPAGE_CONFIG,
      tagline: companyDescription || "",
      about: companyDescription || "",
    }
  );

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  const goNext = () => {
    const next = STEPS[currentStepIndex + 1];
    if (next) setStep(next.id);
  };

  const goBack = () => {
    const prev = STEPS[currentStepIndex - 1];
    if (prev) setStep(prev.id);
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/company/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          homepage: { ...config, enabled: true },
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save");
        return;
      }
      router.refresh();
      router.push(`/${slug}/settings?homepage=published`);
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (id: string) => {
    setConfig((c) => ({
      ...c,
      sections: c.sections.includes(id)
        ? c.sections.filter((s) => s !== id)
        : [...c.sections, id],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className={`flex-1 text-center py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              i === currentStepIndex
                ? "bg-accent text-white"
                : i < currentStepIndex
                  ? "bg-accent/20 text-accent"
                  : "bg-bg-secondary text-text-tertiary"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Step: Template */}
      {step === "template" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Choose a template</h3>
          <div className="grid gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setConfig((c) => ({ ...c, template: t.id }))}
                className={`text-left rounded-xl border p-4 transition-colors cursor-pointer ${
                  config.template === t.id
                    ? "border-accent bg-accent/5"
                    : "border-border bg-bg-secondary/50 hover:border-border-hover"
                }`}
              >
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-text-secondary mt-1">{t.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Content */}
      {step === "content" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Content</h3>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => setConfig((c) => ({ ...c, tagline: e.target.value }))}
              placeholder="A short catchy line about your business"
              className="w-full rounded-lg bg-bg-secondary border border-border px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">
              About
            </label>
            <textarea
              value={config.about}
              onChange={(e) => setConfig((c) => ({ ...c, about: e.target.value }))}
              placeholder="Tell visitors about your business..."
              rows={5}
              className="w-full rounded-lg bg-bg-secondary border border-border px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent resize-none text-sm"
            />
          </div>
        </div>
      )}

      {/* Step: Sections */}
      {step === "sections" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sections</h3>
          <p className="text-sm text-text-secondary">Choose which sections to show on your homepage.</p>
          <div className="grid gap-2">
            {AVAILABLE_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleSection(s.id)}
                className={`text-left rounded-lg border px-4 py-3 transition-colors cursor-pointer ${
                  config.sections.includes(s.id)
                    ? "border-accent bg-accent/5"
                    : "border-border bg-bg-secondary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs text-text-tertiary">{s.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      config.sections.includes(s.id)
                        ? "bg-accent border-accent"
                        : "border-border"
                    }`}
                  >
                    {config.sections.includes(s.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Contact */}
      {step === "contact" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact info</h3>
          <p className="text-sm text-text-secondary">Optional. Leave blank to skip.</p>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              value={config.contact.email || ""}
              onChange={(e) =>
                setConfig((c) => ({ ...c, contact: { ...c.contact, email: e.target.value } }))
              }
              placeholder="hello@example.com"
              className="w-full rounded-lg bg-bg-secondary border border-border px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Phone</label>
            <input
              type="tel"
              value={config.contact.phone || ""}
              onChange={(e) =>
                setConfig((c) => ({ ...c, contact: { ...c.contact, phone: e.target.value } }))
              }
              placeholder="+82 10-1234-5678"
              className="w-full rounded-lg bg-bg-secondary border border-border px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Address</label>
            <input
              type="text"
              value={config.contact.address || ""}
              onChange={(e) =>
                setConfig((c) => ({ ...c, contact: { ...c.contact, address: e.target.value } }))
              }
              placeholder="123 Main St, Seoul"
              className="w-full rounded-lg bg-bg-secondary border border-border px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent text-sm"
            />
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === "preview" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-bg-secondary/50 px-4 py-2 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
              </div>
              <span className="text-xs text-text-tertiary ml-2">
                tellet.com/{slug}
              </span>
            </div>
            <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
              <div className="text-center">
                <h4 className="text-xl font-bold">{companyName}</h4>
                {config.tagline && (
                  <p className="text-sm text-text-secondary mt-1">{config.tagline}</p>
                )}
              </div>
              {config.sections.includes("about") && config.about && (
                <p className="text-sm text-text-secondary">{config.about}</p>
              )}
              {config.sections.includes("team") && (
                <div className="text-xs text-text-tertiary italic">AI Team section will show your agents</div>
              )}
              {config.sections.includes("contact") &&
                (config.contact.email || config.contact.phone || config.contact.address) && (
                  <div className="text-xs text-text-tertiary space-y-1">
                    {config.contact.email && <p>Email: {config.contact.email}</p>}
                    {config.contact.phone && <p>Phone: {config.contact.phone}</p>}
                    {config.contact.address && <p>Address: {config.contact.address}</p>}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        {currentStepIndex > 0 ? (
          <button
            onClick={goBack}
            className="text-sm text-text-secondary hover:text-text-primary cursor-pointer"
          >
            &larr; Back
          </button>
        ) : (
          <div />
        )}
        {step === "preview" ? (
          <button
            onClick={handlePublish}
            disabled={saving}
            className="rounded-lg bg-accent hover:bg-accent-hover px-6 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Publishing..." : "Publish Homepage"}
          </button>
        ) : (
          <button
            onClick={goNext}
            className="rounded-lg bg-accent hover:bg-accent-hover px-6 py-2.5 text-sm font-medium text-white transition-colors cursor-pointer"
          >
            Next &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
