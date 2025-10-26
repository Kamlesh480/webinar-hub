import { Webinar } from "@/types/webinar";
import { Clock, Calendar, Bookmark, Share2, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface WebinarCardProps {
  webinar: Webinar;
}

const WebinarCard = ({ webinar }: WebinarCardProps) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.share({
        title: webinar.title,
        text: webinar.description,
        url: `/webinar/${webinar.slug}`,
      });
    } catch (err) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/webinar/${webinar.slug}`);
      toast.success("Link copied to clipboard");
    }
  };

  const handleWatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/webinar/${webinar.slug}?scrollToSummary=true`);
  };

  return (
    <div
      className="group relative bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/webinar/${webinar.slug}`)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={webinar.thumbnail_url}
          alt={webinar.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {webinar.is_new && (
            <Badge className="bg-accent text-accent-foreground">NEW</Badge>
          )}
          {webinar.featured && (
            <Badge className="bg-secondary text-secondary-foreground">FEATURED</Badge>
          )}
          {webinar.popularity_score > 80 && (
            <Badge className="bg-primary text-primary-foreground">POPULAR</Badge>
          )}
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
            <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
          <Clock className="h-3 w-3 text-white" />
          <span className="text-xs font-medium text-white">{webinar.duration_minutes} min</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Author */}
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            {webinar.authors.slice(0, 3).map((author, idx) => (
              <img
                key={idx}
                src={author.avatar_url}
                alt={author.name}
                className="h-10 w-10 rounded-full ring-2 ring-background"
                title={author.name}
              />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {webinar.authors.map((a) => a.name).join(", ")}
            </p>
            {webinar.authors[0]?.role && (
              <p className="text-xs text-muted-foreground truncate">
                {webinar.authors[0].role}
              </p>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {webinar.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {webinar.description}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-2">
          {webinar.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(webinar.date_published).toLocaleDateString()}</span>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleBookmark}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleWatch}
              className="ml-2"
            >
              <Play className="h-3 w-3 mr-1" />
              Watch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarCard;
