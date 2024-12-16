import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";
import EditName from "../components/EditName";
import EventJoinable from "../components/EventJoinable";

const LandingSignedInPage = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [events, setEvents] = useState([]);
  const [account, setAccount] = useState([]);

  const flexBoxWrapper = {
    display: "flex",
    flexDirection: "row",
    gap: 80,
  };

  const flexComponentMajor = {
    width: "55%",
  };

  const flexComponentMinor = {
    width: "30%"
  }

  useEffect(() => {
    platformApi.getEvents().then((receivedEvents) => {
      setEvents(receivedEvents);
    });
  }, [account]);

  useEffect(() => {
    platformApi.getAccounts(accessToken).then((receivedAccount) => {
      setAccount(receivedAccount);
    });
  }, []);

  return (
    <div style={flexBoxWrapper}>
      <div style={flexComponentMajor}>
        <h2>Events</h2>
        <ul>
          {events.map((event) => (
            <EventJoinable
              key={event.name}
              event={event}
              account={account}
              setAccount={setAccount}
            />
          ))}
        </ul>
      </div>
      <div style={flexComponentMinor}>
        <h2>User Details</h2>
        <p>Name: {account.name}</p>
        <p>Email: {account.email}</p>
        <EditName account={account} setAccount={setAccount} />
      </div>
    </div>
  );
};

export default LandingSignedInPage;
