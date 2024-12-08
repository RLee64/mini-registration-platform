import { useEffect, useState } from "react";

import platformApi from "../services/platform-api";

const LandingSignedOutPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    platformApi.getEvents().then((receivedEvents) => {
      setEvents(receivedEvents);
    });
  }, []);

  return (
    <div>
      Landing Page (real) - you are signed out
      <h2>Events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id}>{event.name}</li>
          ))}
        </ul>
    </div>
  );
};

export default LandingSignedOutPage;
