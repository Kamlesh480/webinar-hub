import { Webinar } from "@/types/webinar";
import WebinarCard from "@/components/WebinarCard";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Bookmark } from "lucide-react";

interface BookmarkedWebinarsProps {
  allWebinars: Webinar[];
  viewMode: "grid" | "list";
}

const BookmarkedWebinars = ({ allWebinars, viewMode }: BookmarkedWebinarsProps) => {
  const { getBookmarkedWebinars } = useBookmarks();
  const bookmarkedWebinars = getBookmarkedWebinars(allWebinars);

  if (bookmarkedWebinars.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bookmark className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Bookmarked Webinars</h2>
      </div>
      
      <div className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-6"
      }>
        {bookmarkedWebinars.map((webinar) => (
          <WebinarCard key={webinar.id} webinar={webinar} />
        ))}
      </div>
    </div>
  );
};

export default BookmarkedWebinars;