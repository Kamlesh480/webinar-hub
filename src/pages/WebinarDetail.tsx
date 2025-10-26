import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Webinar } from "@/types/webinar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Bookmark, Share2, ArrowLeft, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import EmailGateModal from "@/components/EmailGateModal";
import RecommendedWebinars from "@/components/RecommendedWebinars";
import WebinarSkeleton from "@/components/WebinarSkeleton";
import RegistrationForm from "@/components/RegistrationForm";

const WebinarDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [allWebinars, setAllWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("scrollToSummary") === "true" && summaryRef.current) {
      setShowAiSummary(true);
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, [webinar]);

  useEffect(() => {
    const loadWebinars = async () => {
      try {
        const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
        const deliveryToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
        let data: Webinar[] = [];
        if (spaceId && deliveryToken) {
          const mod = await import("@/lib/contentful");
          data = await mod.fetchContentfulWebinars();
        } else {
          const response = await fetch("/data/webinars.json");
          data = await response.json();
        }

        setAllWebinars(data);
        const found = data.find((w: Webinar) => w.slug === slug);
        setWebinar(found || null);
        
        // Check if user has already provided email for this webinar
        const accessKey = `webinar_access_${slug}`;
        setHasAccess(localStorage.getItem(accessKey) === "true");
      } catch (error) {
        console.error("Failed to load webinar:", error);
      } finally {
        setLoading(false);
      }
    };
    loadWebinars();
  }, [slug]);

  const handleWatchClick = () => {
    if (!hasAccess) {
      setShowEmailGate(true);
    }
  };

  const handleEmailSubmit = () => {
    const accessKey = `webinar_access_${slug}`;
    localStorage.setItem(accessKey, "true");
    setHasAccess(true);
    setShowEmailGate(false);
    toast.success("Access granted! Enjoy the webinar.");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: webinar?.title,
        text: webinar?.description,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            <WebinarSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Webinar Not Found</h1>
            <p className="text-muted-foreground">The webinar you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Back Button */}
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Webinars
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {webinar.is_new && <Badge className="bg-accent">NEW</Badge>}
                {webinar.featured && <Badge className="bg-secondary">FEATURED</Badge>}
                {webinar.popularity_score > 80 && <Badge className="bg-primary">POPULAR</Badge>}
                {webinar.topics.map((topic) => (
                  <Badge key={topic} variant="outline">{topic}</Badge>
                ))}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                {webinar.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{webinar.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(webinar.date_published).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {webinar.authors.slice(0, 3).map((author, idx) => (
                      <img
                        key={idx}
                        src={author.avatar_url}
                        alt={author.name}
                        className="h-14 w-14 rounded-full ring-2 ring-background"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {webinar.authors.map((a) => a.name).join(", ")}
                    </p>
                    {webinar.authors[0]?.role && (
                      <p className="text-sm text-muted-foreground">{webinar.authors[0].role}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleBookmark}>
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Summary Section - Only for past webinars */}
            {webinar.type !== "upcoming" && (
              <div className="space-y-4" ref={summaryRef}>
                {!showAiSummary ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setIsGeneratingAiSummary(true);
                      // Simulate AI summary generation
                      setTimeout(() => {
                        setIsGeneratingAiSummary(false);
                        setShowAiSummary(true);
                        toast.success("AI summary generated!");
                      }, 2000);
                    }}
                    disabled={isGeneratingAiSummary}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGeneratingAiSummary ? "Generating AI Summary..." : "Generate AI Summary"}
                    {isGeneratingAiSummary && (
                      <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                    )}
                  </Button>
                ) : (
                  <div
                    className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl p-6 border border-primary/20 opacity-0 animate-fade-in"
                    style={{
                      animation: 'fadeIn 0.5s ease-out forwards',
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Sparkles className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">AI Summary</h3>
                          <p className="text-muted-foreground">{webinar.ai_summary}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsGeneratingAiSummary(true);
                          // Simulate AI summary regeneration
                          setTimeout(() => {
                            toast.success("AI summary updated!");
                            setIsGeneratingAiSummary(false);
                          }, 2000);
                        }}
                        disabled={isGeneratingAiSummary}
                        title="Regenerate AI summary"
                      >
                        <RefreshCw 
                          className={`h-4 w-4 ${isGeneratingAiSummary ? 'animate-spin' : ''}`}
                        />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

        {/* Video Player or Registration Form */}
        {webinar.type === "upcoming" ? (
          <RegistrationForm webinar={webinar} />
        ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {hasAccess ? (
                  <div className="aspect-video">
                    <iframe
                      src={webinar.video_url}
                      title={webinar.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={webinar.thumbnail_url}
                      alt={webinar.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm mb-4">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-2xl text-white">▶</span>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Watch This Webinar</h3>
                        <p className="text-white/80 max-w-md">
                          Enter your email to get instant access to this webinar
                        </p>
                        <Button
                          size="lg"
                          onClick={handleWatchClick}
                          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        >
                          Get Access
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">About This Webinar</h2>
              <p className="text-muted-foreground">{webinar.description}</p>
            </div>

            {/* Integrations */}
            {webinar.integration_tags.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Featured Integrations</h3>
                <div className="flex flex-wrap gap-3">
                  {webinar.integration_tags.map((integration) => (
                    <Badge key={integration} variant="secondary" className="text-sm px-4 py-2">
                      {integration}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <RecommendedWebinars
              currentWebinar={webinar}
              allWebinars={allWebinars}
            />
          </div>
        </div>
      </main>

      <Footer />

      <EmailGateModal
        open={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSubmit={handleEmailSubmit}
        webinarTitle={webinar.title}
      />
    </div>
  );
};

export default WebinarDetail;
