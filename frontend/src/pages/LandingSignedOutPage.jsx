import { useEffect, useState } from "react";

import platformApi from "../services/platform-api";
import Event from "../components/Event"

const LandingSignedOutPage = () => {
  const [events, setEvents] = useState([]);

  const eventListStyle = {
    width: "100%",
    maxWidth: 750,
  }

  useEffect(() => {
    platformApi.getEvents().then((receivedEvents) => {
      setEvents(receivedEvents);
    });
  }, []);

  return (
    <div>
      <h2>LOGGED OUT</h2>
      <p>Please log in to register for events</p>
      <h2>Events</h2>
        <ul style={eventListStyle}>
          {events.map((event) => (
            <Event key={event.id} event={event}/>
          ))}
        </ul>
    </div>
  );
};

export default LandingSignedOutPage;
