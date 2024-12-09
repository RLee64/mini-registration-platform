import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

// Displays events and allows users to join them
const EventJoinable = ({ event, account, setAccount }) => {
  const accessToken = useAtomValue(accessTokenAtom);

  const joinEvent = () => {
    platformApi.joinEvent(event.id, accessToken).then((response) => {
      console.log("successful in joining event");
      console.log(response.joinedEvents);
      setAccount({ ...account, joinedEvents: response.joinedEvents });
    });
  };

  return (
    <li>
      <p>{event.name}</p>
      {account.joinedEvents?.find((eventId) => eventId === event.id) ? (
        <label>Joined!</label>
      ) : (
        <button onClick={joinEvent}>Join Event</button>
      )}
    </li>
  );
};

export default EventJoinable