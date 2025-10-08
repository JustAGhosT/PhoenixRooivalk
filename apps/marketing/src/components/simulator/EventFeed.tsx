import React from "react";
import styles from "./EventFeed.module.css";

interface FeedItem {
  timestamp: string;
  message: string;
}

interface EventFeedProps {
  feedItems: FeedItem[];
}

const EventFeed: React.FC<EventFeedProps> = ({ feedItems }) => {
  return (
    <aside className={styles.feed} aria-live="polite" aria-atomic="false">
      {feedItems.length === 0 && (
        <div className={styles.feedItem}>
          <span className={styles.timestamp}>--:--:--</span> System initialized.
          Awaiting events.
        </div>
      )}
      {feedItems.map((item, index) => (
        <div key={index} className={styles.feedItem}>
          <span className={styles.timestamp}>{item.timestamp}</span>{" "}
          {item.message}
        </div>
      ))}
    </aside>
  );
};

export default EventFeed;
