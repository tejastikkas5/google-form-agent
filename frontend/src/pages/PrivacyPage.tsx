import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import { Badge, Card, CardContent } from "@components/ui";
import { Container } from "@components/common";

/**
 * Privacy Policy Page — route "/privacy"
 * Google OAuth 2.0 Verification Compliant Privacy Policy.
 */
export default function PrivacyPage() {
  const lastUpdated = "September 30, 2026";

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <Container size="lg">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="purple" size="md" className="mb-4">
            Legal & Trust
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-500/15 border border-violet-500/20 mb-3">
              <Shield className="h-5 w-5 text-violet-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Zero Data Selling
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never sell, rent, or monetize your personal data or Google account information to third parties.
            </p>
          </Card>

          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 mb-3">
              <Lock className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Google API Limited Use
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our use of information received from Google APIs adheres strictly to the Google API Services User Data Policy.
            </p>
          </Card>

          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-500/15 border border-blue-500/20 mb-3">
              <Eye className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Complete Control
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You can revoke Prompt2Form's access to your Google account at any time through Google Account permissions.
            </p>
          </Card>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 max-w-4xl mx-auto text-slate-300">
          <Card variant="glass" padding="lg">
            <CardContent className="mt-0 space-y-6">
              {/* Section 1 */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-violet-400" />
                  1. Overview & Information We Collect
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  Prompt2Form ("we", "our", or "us") operates the service hosted at{" "}
                  <strong className="text-white">https://prompt2form.tejastikkas.site</strong>. This Privacy Policy explains how we handle your information when you authenticate with Google OAuth 2.0 and use our AI form generation services.
                </p>
                <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside pl-2">
                  <li>
                    <strong className="text-slate-200">Google Account Information:</strong> When you sign in with Google, we request access to your basic profile information (name, email address, profile picture).
                  </li>
                  <li>
                    <strong className="text-slate-200">Form Content & Prompts:</strong> The text prompts you submit to create or edit forms are processed to generate Google Forms structures.
                  </li>
                </ul>
              </div>

              <hr className="border-white/10" />

              {/* Section 2 */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  2. Use of Google OAuth Scopes & Google Forms API
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  Prompt2Form requests the <code className="text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded">https://www.googleapis.com/auth/forms.body</code> scope to perform actions explicitly requested by you:
                </p>
                <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside pl-2 mb-3">
                  <li>Creating new Google Forms inside your Google account.</li>
                  <li>Updating titles, descriptions, question items, and validation rules of your Google Forms in real-time.</li>
                </ul>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We do <strong className="text-white">NOT</strong> read, alter, or access any other documents or files in your Google Drive or Google account outside of the forms created through Prompt2Form.
                </p>
              </div>

              <hr className="border-white/10" />

              {/* Section 3 */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  3. Google API User Data Limited Use Disclosure
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Prompt2Form's use and transfer to any other app of information received from Google APIs will adhere to{" "}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 underline hover:text-violet-300"
                  >
                    Google API Services User Data Policy
                  </a>
                  , including the Limited Use requirements.
                </p>
              </div>

              <hr className="border-white/10" />

              {/* Section 4 */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-amber-400" />
                  4. Data Storage & Security
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Authentication tokens are transmitted securely via TLS/HTTPS and stored using secure HTTP-only session cookies. We implement industry-standard encryption practices to protect user data from unauthorized access, disclosure, or alteration.
                </p>
              </div>

              <hr className="border-white/10" />

              {/* Section 5 */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3">
                  5. Contact Us
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  If you have any questions or concerns regarding this Privacy Policy or your data, please contact us at:
                </p>
                <div className="mt-2 text-sm text-violet-400 font-semibold">
                  tejastikkas2545@gmail.com
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
