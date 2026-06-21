interface HelpScreenProps {
  onBack: () => void
}

export function HelpScreen({ onBack }: HelpScreenProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-md text-ink hover:bg-canvas-soft border border-transparent hover:border-mute transition-all transition-colors text-sm">←</button>
        <h2 className="text-base font-bold text-ink">Help & Guide</h2>
      </div>
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        <div className="bg-canvas border border-mute rounded-md p-4">
          <h3 className="text-sm font-bold text-ink mb-3">Quick Start Guide</h3>
          <ol className="space-y-2 text-sm text-body">
            {["Create a webhook trigger in your automation app", "Copy the webhook URL", "Paste URL in OmniHook", "Add your HookTrigger component to Framer", "Publish your site and test!"]
              .map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
          </ol>
        </div>

        <div className="bg-[#fff0f0] border border-error/20 rounded-md p-4">
          <h3 className="text-sm font-bold text-error mb-3">How to Insert the Component</h3>
          <p className="text-xs text-error/80 mb-3">For security reasons, Framer does not allow plugins to automatically create files. You must paste the component manually:</p>
          <ol className="space-y-2 text-sm text-error/90 list-decimal list-inside pl-1">
            <li>Click <strong>Copy</strong> on your Automation Card.</li>
            <li>In Framer, go to <strong>Assets panel</strong> (left side).</li>
            <li>Click the <strong>+</strong> next to <strong>Code</strong>.</li>
            <li>Select <strong>New Component</strong>, give it any name.</li>
            <li>Select everything (Cmd/Ctrl + A) and <strong>Paste</strong> (Cmd/Ctrl + V).</li>
            <li><strong>Save</strong> the file (Cmd/Ctrl + S).</li>
            <li>Drag your new component onto the canvas!</li>
          </ol>
        </div>

        <div className="bg-canvas border border-mute rounded-md p-4">
          <h3 className="text-sm font-bold text-ink mb-3">Supported Platforms</h3>
          <p className="text-xs text-body mb-3">You can paste a webhook URL from absolutely any platform, including:</p>
          <ul className="space-y-2 text-sm text-body">
            <li className="flex items-center gap-2"><span>⚡</span> <strong>Make.com</strong> (Free webhooks)</li>
            <li className="flex items-center gap-2"><span>🛠️</span> <strong>Zapier</strong> (Requires premium)</li>
            <li className="flex items-center gap-2"><span>☁️</span> <strong>Pipedream</strong></li>
            <li className="flex items-center gap-2"><span>🤖</span> <strong>n8n</strong></li>
            <li className="flex items-center gap-2"><span>🌐</span> <strong>Webhook.site</strong></li>
          </ul>
        </div>

        <div className="bg-canvas border border-mute rounded-md p-4">
          <h3 className="text-sm font-bold text-ink mb-3">Example Use Cases</h3>
          <div className="space-y-2">
            {[
              { icon: "📝", label: "Form submit → Create HubSpot contact" },
              { icon: "🖱️", label: "Button click → Send Slack notification" },
              { icon: "👁️", label: "Page view → Log to Google Sheets" },
              { icon: "🚪", label: "Exit intent → Trigger email sequence" },
              { icon: "📊", label: "Scroll 50% → Fire Facebook Pixel event" },
            ].map((ex, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-body">
                <span>{ex.icon}</span><span>{ex.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 pb-4">
          <a href="https://make.com" target="_blank" rel="noopener noreferrer"
            className="w-full h-10 bg-primary text-on-primary rounded-md text-sm font-medium flex items-center justify-center hover:bg-primary/90 transition-colors">Open Make.com →</a>
        </div>
      </div>
    </div>
  )
}
