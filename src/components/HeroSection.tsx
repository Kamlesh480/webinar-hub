import { useEffect, useState } from "react";
import { Webinar } from "@/types/webinar";
import { ChevronLeft, ChevronRight, Calendar, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  featuredWebinars: Webinar[];
}

const HeroSection = ({ featuredWebinars }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredWebinars.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredWebinars.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredWebinars.length) % featuredWebinars.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredWebinars.length);
  };

  if (featuredWebinars.length === 0) return null;

  const currentWebinar = featuredWebinars[currentIndex];

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute w-full left-0 top-0">
        <img
          className="w-full h-auto hidden lg:inline-block"
          src="https://website-assets.atlan.com/img/events-hero-bg.svg"
          alt="hero"
        />
        <img
          className="w-full h-auto inline-block lg:hidden"
          src="https://website-assets.atlan.com/img/events-hero-bg-mobile.svg"
          alt="hero mobile"
        />
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Featured Webinars</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              Learn from the Experts
            </h1>
            <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
              Discover insights on data governance, cataloging, quality, and the modern data stack
            </p>
          </div>

          <div className="relative group">
            <div
              className="bg-card rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => navigate(`/webinar/${currentWebinar.slug}`)}
            >
              <div className="grid md:grid-cols-2 gap-6 p-6 lg:p-8">
                <div className="relative rounded-xl overflow-hidden aspect-video border border-borderGray">
                  <img
                    src={currentWebinar.thumbnail_url}
                    alt={currentWebinar.title}
                    className="w-full h-full object-cover"
                  />
                  {currentWebinar.is_new && (
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      NEW
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {currentWebinar.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl lg:text-[1.75rem] font-bold text-card-foreground">
                    {currentWebinar.title}
                  </h2>

                  <p className="text-muted-foreground line-clamp-3">
                    {currentWebinar.description}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{currentWebinar.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(currentWebinar.date_published).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {currentWebinar.authors.slice(0, 2).map((author, idx) => (
                        <img
                          key={idx}
                          src={author.avatar_url}
                          alt={author.name}
                          className="h-10 w-10 rounded-full ring-2 ring-background"
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {currentWebinar.authors.map((a) => a.name).join(", ")}
                      </p>
                      {currentWebinar.authors[0]?.role && (
                        <p className="text-xs text-muted-foreground">
                          {currentWebinar.authors[0].role}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/webinar/${currentWebinar.slug}`);
                    }}
                  >
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {featuredWebinars.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
