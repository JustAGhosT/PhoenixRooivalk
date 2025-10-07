import { useState, useCallback } from "react";

interface FeedItem {
  timestamp: string;
  message: string;
}

export const useEventFeed = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  const addFeed = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const newItem: FeedItem = { timestamp, message };

    setFeedItems((prevItems) => {
      const newItems = [newItem, ...prevItems];
      // Keep the feed to a maximum of 40 items
      return newItems.slice(0, 40);
    });
  }, []);

  return { feedItems, addFeed };
};
