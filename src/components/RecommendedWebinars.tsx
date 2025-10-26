import { useMemo } from "react";
import { Webinar } from "@/types/webinar";
import WebinarCard from "./WebinarCard";

interface RecommendedWebinarsProps {
  currentWebinar: Webinar;
  allWebinars: Webinar[];
}

const RecommendedWebinars = ({ currentWebinar, allWebinars }: RecommendedWebinarsProps) => {
  // Smart recommendation algorithm
  const recommendations = useMemo(() => {
    // Calculate similarity scores
    const scoredWebinars = allWebinars
      .filter((w) => w.id !== currentWebinar.id)
      .map((webinar) => {
        let score = 0;

        // Topic overlap (most important)
        const topicOverlap = webinar.topics.filter((t) =>
          currentWebinar.topics.includes(t)
        ).length;
        score += topicOverlap * 10;

        // Same author
        const authorOverlap = webinar.authors.some((a) =>
          currentWebinar.authors.some((ca) => ca.name === a.name)
        );
        if (authorOverlap) {
          score += 5;
        }

        // Integration overlap
        const integrationOverlap = webinar.integration_tags.filter((i) =>
          currentWebinar.integration_tags.includes(i)
        ).length;
        score += integrationOverlap * 3;

        // Popularity score
        score += webinar.popularity_score / 10;

        // Featured bonus
        if (webinar.featured) {
          score += 2;
        }

        // Recent content bonus
        const daysSincePublished = Math.floor(
          (Date.now() - new Date(webinar.date_published).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSincePublished < 30) {
          score += 3;
        }

        return { webinar, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.webinar);

    return scoredWebinars;
  }, [currentWebinar, allWebinars]);

  if (recommendations.length === 0) return null;

  return (
    <div className="border-t border-border pt-12">
      <div className="flex items-center space-x-2 mb-6">
        <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
        <h2 className="text-2xl font-bold text-foreground">You Might Also Like</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((webinar) => (
          <WebinarCard key={webinar.id} webinar={webinar} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedWebinars;
