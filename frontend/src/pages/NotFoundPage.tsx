import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileX } from "lucide-react";
import { Button } from "@components/ui";
import { Container } from "@components/common";

/**
 * 404 Not Found page — wildcard route "*"
 */
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[100px]" />
      </div>

      <Container size="sm" className="relative z-10 text-center py-20">
        {/* Icon */}
        <div className="flex items-center justify-center h-24 w-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30">
          <FileX className="h-12 w-12 text-violet-400" strokeWidth={1.5} />
        </div>

        {/* Error code */}
        <p className="text-8xl font-black gradient-text mb-4">404</p>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>

        {/* Description */}
        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            id="not-found-go-back"
            variant="secondary"
            size="lg"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            id="not-found-go-home"
            variant="primary"
            size="lg"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
