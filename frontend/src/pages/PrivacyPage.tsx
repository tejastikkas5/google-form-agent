import {
  Shield,
  Lock,
  Eye,
  FileText,
  CheckCircle2,
  Server,
  Cpu,
  Database,
  Trash2,
  ExternalLink,
  KeyRound,
} from "lucide-react";
import { Badge, Card, CardContent } from "@components/ui";
import { Container } from "@components/common";

/**
 * Privacy Policy Page — route "/privacy"
 * Fully compliant with Google OAuth 2.0 Verification and
 * Google Workspace API User Data & Developer Policy (Limited Use).
 */
export default function PrivacyPage() {
  const lastUpdated = "October 3, 2026";

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
              Zero Data Selling & Sharing
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never sell, rent, trade, or monetize your Google user data or personal information to third parties, data brokers, or advertisers.
            </p>
          </Card>

          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 mb-3">
              <Lock className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Robust Data Protection
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              End-to-end TLS encryption in transit, cryptographically secured HTTP-only session tokens, and zero persistent database storage of Google data.
            </p>
          </Card>

          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-500/15 border border-blue-500/20 mb-3">
              <Cpu className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              No AI Model Training
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Workspace user data is strictly never used to train, retrain, or improve foundational or generalized AI/ML models.
            </p>
          </Card>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 max-w-4xl mx-auto text-slate-300">
          <Card variant="glass" padding="lg">
            <CardContent className="mt-0 space-y-8">
              {/* Section 1 */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-violet-400" />
                  1. Overview & Information We Collect
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  Prompt2Form ("we", "our", or "us"), hosted at{" "}
                  <strong className="text-white">https://prompt2form.tejastikkas.site</strong>, provides an AI-powered assistant that generates structured Google Forms based on user prompts. We value your trust and are committed to protecting your privacy.
                </p>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  When you authenticate via Google OAuth 2.0 and interact with Prompt2Form, we collect only the minimal data required to provide our service:
                </p>
                <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside pl-2">
                  <li>
                    <strong className="text-slate-200">Google Account Profile Information:</strong> Basic identity details returned by Google OAuth (your Google User ID, full name, email address, and profile picture) to establish your authenticated user session.
                  </li>
                  <li>
                    <strong className="text-slate-200">User Input Prompts & Form Design Instructions:</strong> Natural language prompts and modification requests submitted by you (e.g., "Create a 5-question customer satisfaction survey") to generate form schemas.
                  </li>
                  <li>
                    <strong className="text-slate-200">Google Forms Metadata:</strong> Generated form IDs, edit URLs, and shareable URLs created on your behalf in your Google account so that you can open and edit your forms directly.
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
                  Prompt2Form requests the minimum necessary Google OAuth scopes required to fulfill user-initiated actions:
                </p>
                <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-3 mb-4">
                  <div className="text-xs font-mono text-violet-300">
                    https://www.googleapis.com/auth/forms.body
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Used strictly to create new Google Forms in your Google account and populate them with titles, descriptions, questions, choices, and validation settings that you requested.
                  </p>
                  <div className="text-xs font-mono text-violet-300">
                    openid, userinfo.email, userinfo.profile
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Used strictly to verify your Google identity, display your avatar/email in the UI header, and maintain your secure session.
                  </p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We do <strong className="text-white">NOT</strong> request access to, read, modify, or delete any other files, spreadsheets, emails, photos, or documents in your Google Drive or Google account outside of the forms explicitly created or edited through Prompt2Form.
                </p>
              </div>

              <hr className="border-white/10" />

              {/* Section 3 - DATA SHARING DISCLOSURE */}
              <div id="data-sharing">
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-violet-400" />
                  3. With Whom We Share, Transfer, or Disclose Google User Data
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  <strong className="text-white">Prompt2Form does not sell, rent, trade, or monetize Google user data under any circumstances.</strong> Furthermore, we do not share, transfer, or disclose Google user data to third-party advertisers, data brokers, or marketing networks.
                </p>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  Google user data is transferred or disclosed only to the specific, limited service providers necessary to operate the application, as detailed below:
                </p>
                <div className="space-y-3 mb-4">
                  <div className="bg-slate-900/40 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white font-medium text-sm mb-1">
                      <Server className="h-4 w-4 text-violet-400" />
                      Google Forms API & Google Identity Services (Google LLC)
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Your OAuth access token is sent directly to Google APIs over encrypted connections to authenticate your account and execute form creation/updates in your Google account upon your explicit instruction.
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white font-medium text-sm mb-1">
                      <Cpu className="h-4 w-4 text-blue-400" />
                      Google Generative AI (Gemini API / Google Cloud)
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Only the user-written prompt (e.g. "Create a feedback form for an event") is transmitted to the Gemini API to produce the JSON schema defining form questions. <strong className="text-slate-200">No Google Workspace user data, user profile IDs, or form respondent submissions are ever transferred to or processed by AI services for model training.</strong>
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-white font-medium text-sm mb-1">
                      <Database className="h-4 w-4 text-emerald-400" />
                      Hosting & Cloud Infrastructure (Vercel Inc.)
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Our front-end application and serverless API endpoints are hosted on Vercel. Network traffic passes through Vercel's secure, DDoS-protected infrastructure using automated TLS encryption.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  We may also disclose information if strictly required by law, regulation, subpoena, or valid legal process, or to protect the safety, security, and rights of Prompt2Form, its users, or the public.
                </p>
              </div>

              <hr className="border-white/10" />

              {/* Section 4 - DATA PROTECTION MECHANISMS */}
              <div id="data-protection">
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-emerald-400" />
                  4. Data Protection Mechanisms for Sensitive Data
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  We employ rigorous technical, physical, and organizational security mechanisms to protect sensitive Google user data, credentials, and OAuth tokens against unauthorized access, alteration, disclosure, or loss:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <Shield className="h-4 w-4 text-emerald-400" />
                      Encryption in Transit
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      All network traffic between user browsers, Prompt2Form servers, and Google APIs is enforced via HTTPS using Transport Layer Security (TLS 1.2 and TLS 1.3) with strong cryptographic cipher suites, preventing interception and eavesdropping.
                    </p>
                  </div>

                  <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <KeyRound className="h-4 w-4 text-violet-400" />
                      Secure Token Storage & Sessions
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      OAuth tokens are encapsulated within cryptographically signed JSON Web Tokens (JWT using HS256) and transmitted via HTTP-only, SameSite=Lax, Secure cookies. Tokens are inaccessible to client-side scripts, protecting against XSS attacks.
                    </p>
                  </div>

                  <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <Database className="h-4 w-4 text-blue-400" />
                      Zero Persistent Database Storage
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Prompt2Form does not maintain persistent database storage of your Google user data, Google account passwords, or form contents. All form creation workflows operate entirely in-memory ephemerally during your active session.
                    </p>
                  </div>

                  <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <Trash2 className="h-4 w-4 text-amber-400" />
                      Automatic Expiration & Access Revocation
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Session tokens expire automatically after 7 days. Users can immediately terminate active sessions by logging out, which purges all session cookies. You can also revoke app permissions anytime via Google Account settings.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/30 border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-slate-300 font-semibold mb-1">
                    Administrative & Environmental Safeguards:
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    All application secrets and API credentials (including Google Client Secrets and Gemini API keys) are strictly isolated using encrypted environment variable vaults with least-privilege administrative access controls.
                  </p>
                </div>
              </div>

              <hr className="border-white/10" />

              {/* Section 5 - AI INTEGRATION & LIMITED USE COMPLIANCE */}
              <div id="ai-policy">
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-400" />
                  5. Google Workspace API User Data & AI / Machine Learning Models
                </h2>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
                  <p className="text-sm font-semibold text-blue-300 mb-1">
                    Strict Compliance with Google Workspace API User Data & Developer Policy
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Under the Google Workspace API User Data and Developer Policy Limited Use requirements, Prompt2Form strictly adheres to prohibitions against using Google user data for AI model development.
                  </p>
                </div>

                <ul className="space-y-3 text-sm text-slate-300 list-disc list-inside pl-2 mb-4">
                  <li>
                    <strong className="text-white">Prohibition on AI/ML Training:</strong> Google Workspace user data received via Google APIs—including raw, aggregated, or derived data—is <strong className="text-white">NEVER used to create, train, fine-tune, or improve foundational or generalized machine learning (ML) and artificial intelligence (AI) models</strong>.
                  </li>
                  <li>
                    <strong className="text-white">No Transfer of Workspace Data to Third-Party AI for Training:</strong> Prompt2Form does not transfer, provide, or disclose any Google Workspace API user data or Google account information to third-party AI services that utilize customer data for model training.
                  </li>
                  <li>
                    <strong className="text-white">AI Processing Scope:</strong> Prompt2Form utilizes Google Gemini (gemini-2.5-flash) exclusively for processing the user's natural language prompt (e.g., "build an attendee registration form") into a JSON schema representation of questions. Google account credentials, personal identifiers, and private files are never fed to the AI model.
                  </li>
                  <li>
                    <strong className="text-white">Enterprise & Developer API Data Isolation:</strong> We interact with Google GenAI / Gemini APIs under standard developer terms where prompt inputs are not used to train Google's public generative models.
                  </li>
                </ul>
              </div>

              <hr className="border-white/10" />

              {/* Section 6 - GOOGLE API LIMITED USE DISCLOSURE */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-violet-400" />
                  6. Google API User Data Limited Use Disclosure
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  Prompt2Form's use and transfer to any other app of information received from Google APIs will adhere to the{" "}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 underline hover:text-violet-300 inline-flex items-center gap-1"
                  >
                    Google API Services User Data Policy
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  , including the Limited Use requirements.
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  You can also review the specific{" "}
                  <a
                    href="https://developers.google.com/workspace/workspace-api-user-data-developer-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 underline hover:text-violet-300 inline-flex items-center gap-1"
                  >
                    Google Workspace API User Data and Developer Policy
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {" "}with which Prompt2Form remains in full compliance.
                </p>
              </div>

              <hr className="border-white/10" />

              {/* Section 7 */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-emerald-400" />
                  7. Data Retention, User Rights & Revocation
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  You have full authority and control over your personal data and Google account permissions:
                </p>
                <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside pl-2 mb-4">
                  <li>
                    <strong className="text-slate-200">Revoke Access:</strong> You can revoke Prompt2Form's access to your Google account at any time via your{" "}
                    <a
                      href="https://myaccount.google.com/permissions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 underline hover:text-violet-300 inline-flex items-center gap-1"
                    >
                      Google Account Security Permissions
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    . Upon revocation, Prompt2Form loses all ability to interact with your Google account.
                  </li>
                  <li>
                    <strong className="text-slate-200">Session Termination:</strong> Clicking "Log Out" within the Prompt2Form dashboard immediately purges your authentication cookie from your browser.
                  </li>
                  <li>
                    <strong className="text-slate-200">Data Deletion Requests:</strong> Because Prompt2Form operates with zero persistent database storage of Google user data, there is no lingering profile or form data retained on our servers. If you have inquiries regarding residual logs or records, contact us directly.
                  </li>
                </ul>
              </div>

              <hr className="border-white/10" />

              {/* Section 8 */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3">
                  8. Contact Us
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-2">
                  If you have questions, concerns, or requests regarding this Privacy Policy, our data protection practices, or compliance with Google API policies, please reach out to us at:
                </p>
                <div className="mt-2 text-sm text-violet-400 font-semibold">
                  tejastikkas2545@gmail.com
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Developer & Data Controller: Tejas Tikkas | Prompt2Form
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
