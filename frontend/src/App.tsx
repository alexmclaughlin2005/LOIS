import { Button } from './components/ui/Button';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-background-secondary p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-xxl font-display font-bold text-brand-coral mb-2">
            LO\S
          </h1>
          <p className="text-text-secondary">
            Localized Organizational Intelligence System
          </p>
        </div>

        {/* Design System Demo */}
        <div className="space-y-12">
          {/* Buttons */}
          <section className="bg-white rounded-lg p-6 shadow-level-2">
            <h2 className="text-lg font-semibold mb-6">Button Components</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Primary Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm">Ask LOIS (Small)</Button>
                  <Button size="md">Ask LOIS (Medium)</Button>
                  <Button size="lg">Ask LOIS (Large)</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Secondary Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" size="sm">Cancel</Button>
                  <Button variant="secondary" size="md">Cancel</Button>
                  <Button variant="secondary" size="lg">Cancel</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Ghost & Link</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="link">Link Button</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Disabled State</h3>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled Primary</Button>
                  <Button variant="secondary" disabled>Disabled Secondary</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section className="bg-white rounded-lg p-6 shadow-level-2">
            <h2 className="text-lg font-semibold mb-6">Typography</h2>

            <div className="space-y-4">
              <div>
                <p className="text-xxl font-display font-bold">Heading XXL - 21px Bold (Helvetica Now Display)</p>
              </div>
              <div>
                <p className="text-xl font-semibold">Heading XL - 18px Semibold</p>
              </div>
              <div>
                <p className="text-lg font-medium">Heading LG - 16px Medium</p>
              </div>
              <div>
                <p className="text-base">Body Text - 14px Regular</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Small Text - 12px Secondary</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Caption - 11px Tertiary</p>
              </div>
            </div>
          </section>

          {/* Colors */}
          <section className="bg-white rounded-lg p-6 shadow-level-2">
            <h2 className="text-lg font-semibold mb-6">Color Palette</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Brand Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="h-20 rounded bg-brand-coral mb-2"></div>
                    <p className="text-sm">Brand Coral</p>
                    <p className="text-xs text-text-tertiary">#FF6B6B</p>
                  </div>
                  <div>
                    <div className="h-20 rounded bg-brand-black mb-2"></div>
                    <p className="text-sm">Brand Black</p>
                    <p className="text-xs text-text-tertiary">#000000</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Background Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="h-20 rounded bg-background-primary border mb-2"></div>
                    <p className="text-sm">Primary</p>
                    <p className="text-xs text-text-tertiary">#FFFFFF</p>
                  </div>
                  <div>
                    <div className="h-20 rounded bg-background-secondary mb-2"></div>
                    <p className="text-sm">Secondary</p>
                    <p className="text-xs text-text-tertiary">#F7F7F6</p>
                  </div>
                  <div>
                    <div className="h-20 rounded bg-background-tertiary mb-2"></div>
                    <p className="text-sm">Tertiary</p>
                    <p className="text-xs text-text-tertiary">#F5F5F5</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-secondary mb-3">Status Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="h-20 rounded bg-status-success mb-2"></div>
                    <p className="text-sm">Success</p>
                    <p className="text-xs text-text-tertiary">#4CAF50</p>
                  </div>
                  <div>
                    <div className="h-20 rounded bg-status-warning mb-2"></div>
                    <p className="text-sm">Warning</p>
                    <p className="text-xs text-text-tertiary">#FF6B6B</p>
                  </div>
                  <div>
                    <div className="h-20 rounded bg-status-info mb-2"></div>
                    <p className="text-sm">Info</p>
                    <p className="text-xs text-text-tertiary">#2196F3</p>
                  </div>
                  <div>
                    <div className="h-20 rounded bg-status-portal mb-2"></div>
                    <p className="text-sm">Portal ON</p>
                    <p className="text-xs text-text-tertiary">#00C853</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Shadows & Elevation */}
          <section className="bg-white rounded-lg p-6 shadow-level-2">
            <h2 className="text-lg font-semibold mb-6">Shadows & Elevation</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-level-1">
                <p className="text-sm font-medium">Level 1</p>
                <p className="text-xs text-text-tertiary">Subtle</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-level-2">
                <p className="text-sm font-medium">Level 2</p>
                <p className="text-xs text-text-tertiary">Cards</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-level-3">
                <p className="text-sm font-medium">Level 3</p>
                <p className="text-xs text-text-tertiary">Modals</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-level-4">
                <p className="text-sm font-medium">Level 4</p>
                <p className="text-xs text-text-tertiary">Drawers</p>
              </div>
            </div>
          </section>

          {/* Spacing Scale */}
          <section className="bg-white rounded-lg p-6 shadow-level-2">
            <h2 className="text-lg font-semibold mb-6">Spacing Scale (8px Grid)</h2>

            <div className="space-y-4">
              {[
                { size: '4px', class: 'w-1' },
                { size: '8px', class: 'w-2' },
                { size: '16px', class: 'w-4' },
                { size: '24px', class: 'w-6' },
                { size: '32px', class: 'w-8' },
                { size: '48px', class: 'w-12' },
              ].map(({ size, class: className }) => (
                <div key={size} className="flex items-center gap-4">
                  <div className={`${className} h-8 bg-brand-coral rounded`}></div>
                  <span className="text-sm">{size}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Status */}
          <section className="bg-white rounded-lg p-6 shadow-level-2">
            <h2 className="text-lg font-semibold mb-4">Setup Status</h2>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-status-success"></div>
                <span className="text-sm">React + Vite + TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-status-success"></div>
                <span className="text-sm">Tailwind CSS with Design Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-status-success"></div>
                <span className="text-sm">Button Component</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                <span className="text-sm">Backend API</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                <span className="text-sm">Database</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-text-secondary">
          <p>LOIS Design System - Phase 0 Complete ✅</p>
        </div>
      </div>
    </div>
  );
}

export default App;
