import { useState, useEffect } from 'react';
import { Webinar } from '@/types/webinar';

const BOOKMARKS_KEY = 'webinar_bookmarks';

export const useBookmarks = () => {
  const [bookmarkedWebinars, setBookmarkedWebinars] = useState<string[]>(() => {
    const storedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
    return storedBookmarks ? JSON.parse(storedBookmarks) : [];
  });

  // Add or remove a bookmark
  const toggleBookmark = (webinarId: string) => {
    setBookmarkedWebinars(prev => {
      const newBookmarks = prev.includes(webinarId)
        ? prev.filter(id => id !== webinarId)
        : [...prev, webinarId];
      
      // Save to localStorage
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  // Check if a webinar is bookmarked
  const isBookmarked = (webinarId: string): boolean => {
    if (!webinarId) return false;
    return bookmarkedWebinars.includes(webinarId);
  };

  // Filter webinars to get only bookmarked ones
  const getBookmarkedWebinars = (allWebinars: Webinar[]) => {
    return allWebinars.filter(webinar => isBookmarked(webinar.id));
  };

  return {
    bookmarkedWebinars,
    toggleBookmark,
    isBookmarked,
    getBookmarkedWebinars,
  };
};