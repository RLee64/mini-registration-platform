import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

import Account from "../components/Account";
import EventAreaAdmin from "../components/EventAreaAdmin";

const AdminPage = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [events, setEvents] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const flexBoxWrapper = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "0 20px",
  };

  /*Currently events and accounts are only called for at the beginning,
  meaning refreshing is currently required to keep track of updates.
  Maybe a potential fix would be nice? But it's not necessary*/
  useEffect(() => {
    platformApi.getAccounts(accessToken).then((receivedAccounts) => {
      setAccounts(receivedAccounts);
    });
  }, []);

  useEffect(() => {
    platformApi.getEvents().then((receivedEvents) => {
      setEvents(receivedEvents);
    });
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>
      <EventAreaAdmin events={events} setEvents={setEvents} />
      <div>
        <h2>Registered Accounts</h2>
        <ul style={flexBoxWrapper}>
          {accounts.map((account) => (
            <Account key={account.id} account={account} events={events} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
