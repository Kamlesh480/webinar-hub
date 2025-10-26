import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SearchAndFilters from "@/components/SearchAndFilters";
import WebinarCard from "@/components/WebinarCard";
import WebinarSkeleton from "@/components/WebinarSkeleton";
import Pagination from "@/components/Pagination";
import WhatBringsYouHere from "@/components/WhatBringsYouHere";
import { Webinar, FilterState } from "@/types/webinar";

const ITEMS_PER_PAGE = 9;

const Index = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    topics: [],
    durations: [],
    dateRange: "",
    authors: [],
    integrations: [],
    categories: [],
  });

  // Load webinars
  useEffect(() => {
    const loadWebinars = async () => {
      try {
        const response = await fetch("/data/webinars.json");
        const data = await response.json();
        setWebinars(data);
      } catch (error) {
        console.error("Failed to load webinars:", error);
      } finally {
        setLoading(false);
      }
    };
    loadWebinars();
  }, []);

  // Extract unique values for filters
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    webinars.forEach((w) => w.topics.forEach((t) => topics.add(t)));
    return Array.from(topics).sort();
  }, [webinars]);

  const allAuthors = useMemo(() => {
    const authors = new Set<string>();
    webinars.forEach((w) => w.authors.forEach((a) => authors.add(a.name)));
    return Array.from(authors).sort();
  }, [webinars]);

  const allIntegrations = useMemo(() => {
    const integrations = new Set<string>();
    webinars.forEach((w) => w.integration_tags.forEach((i) => integrations.add(i)));
    return Array.from(integrations).sort();
  }, [webinars]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    webinars.forEach((w) => w.what_brings_you_here?.forEach((c) => categories.add(c)));
    return Array.from(categories).sort();
  }, [webinars]);

  // Filter webinars
  const filteredWebinars = useMemo(() => {
    let result = webinars;

    // Tab filter
    if (activeTab !== "all") {
      result = result.filter((w) => w.type === activeTab);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(searchLower) ||
          w.description.toLowerCase().includes(searchLower) ||
          w.topics.some((t) => t.toLowerCase().includes(searchLower)) ||
          w.authors.some((a) => a.name.toLowerCase().includes(searchLower))
      );
    }

    // Topics filter
    if (filters.topics.length > 0) {
      result = result.filter((w) =>
        filters.topics.some((topic) => w.topics.includes(topic))
      );
    }

    // Duration filter
    if (filters.durations.length > 0) {
      result = result.filter((w) => {
        return filters.durations.some((duration) => {
          if (duration === "<15 min") return w.duration_minutes < 15;
          if (duration === "15-30 min") return w.duration_minutes >= 15 && w.duration_minutes < 30;
          if (duration === "30-60 min") return w.duration_minutes >= 30 && w.duration_minutes < 60;
          if (duration === "60+ min") return w.duration_minutes >= 60;
          return false;
        });
      });
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== "all") {
      const daysAgo = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      result = result.filter((w) => new Date(w.date_published) >= cutoffDate);
    }

    // Authors filter
    if (filters.authors.length > 0) {
      result = result.filter((w) => 
        w.authors.some((a) => filters.authors.includes(a.name))
      );
    }

    // Integrations filter
    if (filters.integrations.length > 0) {
      result = result.filter((w) =>
        filters.integrations.some((integration) => w.integration_tags.includes(integration))
      );
    }

    // Categories filter (What Brings You Here)
    if (filters.categories.length > 0) {
      result = result.filter((w) =>
        w.what_brings_you_here?.some((category) => filters.categories.includes(category))
      );
    }

    // Sort by popularity and date
    result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.popularity_score !== b.popularity_score) {
        return b.popularity_score - a.popularity_score;
      }
      return new Date(b.date_published).getTime() - new Date(a.date_published).getTime();
    });

    return result;
  }, [webinars, activeTab, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredWebinars.length / ITEMS_PER_PAGE);
  const paginatedWebinars = filteredWebinars.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, activeTab]);

  const featuredWebinars = webinars.filter((w) => w.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <WebinarSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements - Atlan inspired */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top left corner dots grid */}
        <div className="absolute left-0 top-32 w-40 h-40 opacity-20">
          <div className="grid grid-cols-8 gap-3">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={`dot-tl-${i}`} className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            ))}
          </div>
        </div>
        
        {/* Top right corner dots grid */}
        <div className="absolute right-0 top-32 w-40 h-40 opacity-20">
          <div className="grid grid-cols-8 gap-3">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={`dot-tr-${i}`} className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
            ))}
          </div>
        </div>
        
        {/* Bottom left dots */}
        <div className="absolute left-0 bottom-32 w-32 h-32 opacity-20">
          <div className="grid grid-cols-6 gap-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={`dot-bl-${i}`} className="w-1.5 h-1.5 rounded-full bg-accent"></div>
            ))}
          </div>
        </div>
        
        {/* Curved lines decoration - top right */}
        <svg className="absolute right-0 top-0 w-[500px] h-[400px] opacity-10" viewBox="0 0 500 400" preserveAspectRatio="none">
          <path d="M 500 0 Q 400 100 500 200" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
          <path d="M 500 20 Q 400 120 500 220" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
          <path d="M 500 40 Q 400 140 500 240" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
          <path d="M 500 60 Q 400 160 500 260" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
          <path d="M 500 80 Q 400 180 500 280" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
        </svg>
        
        {/* Subtle gradient blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <HeroSection featuredWebinars={featuredWebinars} />

        {/* What Brings You Here Section */}
        <WhatBringsYouHere
          allCategories={allCategories}
          onCategorySelect={(category) => {
            setFilters({
              ...filters,
              categories: category ? [category] : [],
            });
          }}
          selectedCategory={filters.categories[0] || ""}
        />

        {/* Main Content */}
        <section className="container mx-auto px-4 py-12" id="webinar-cards">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-8">
            {/* Tabs and View Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab} className="space-y-8">
              {/* Search and Filters */}
              <SearchAndFilters
                filters={filters}
                onFilterChange={setFilters}
                totalResults={filteredWebinars.length}
                allTopics={allTopics}
                allAuthors={allAuthors}
                allIntegrations={allIntegrations}
                hideAllTimeFilter={activeTab === "upcoming"}
              />

              {/* Gallery */}
              {paginatedWebinars.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg text-muted-foreground">No webinars found matching your criteria.</p>
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      search: "",
                      topics: [],
                      durations: [],
                      dateRange: "",
                      authors: [],
                      integrations: [],
                      categories: [],
                    })}
                    className="mt-4"
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                  }>
                    {paginatedWebinars.map((webinar) => (
                      <WebinarCard key={webinar.id} webinar={webinar} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
