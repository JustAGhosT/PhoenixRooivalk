import React from 'react';

interface FeedItem {
  timestamp: string;
  message: string;
}

interface EventFeedProps {
  feedItems: FeedItem[];
}

const EventFeed: React.FC<EventFeedProps> = ({ feedItems }) => {
  return (
    <aside className="threatsim__feed" aria-live="polite" aria-atomic="false">
      {feedItems.map((item, index) => (
        <div key={index} className="feed-item">
          <span className="t">{item.timestamp}</span> {item.message}
        </div>
      ))}
    </aside>
  );
};

export default EventFeed;