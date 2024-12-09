import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

import Account from "../components/Account";
import Event from "../components/Event";
import CreateEvent from "../components/CreateEvent";

const AdminPage = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [events, setEvents] = useState([]);
  const [accounts, setAccounts] = useState([]);

  /*Currently events and accounts are only called for at the beginning,
  meaning refreshing is currently required to keep track of updates.
  Maybe a potential fix would be nice? But it's not necessary*/
  useEffect(() => {
    platformApi.getAccounts(accessToken).then((receivedAccounts) => {
      setAccounts(receivedAccounts);
      console.log(receivedAccounts)
    });
  }, []);

  useEffect(() => {
    platformApi.getEvents().then((receivedEvents) => {
      setEvents(receivedEvents);
      console.log(receivedEvents);
    });
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <h2>Events</h2>
        <ul>
          {events.map((event) => (
            <Event key={event.id} event={event} />
          ))}
        </ul>
      </div>
      <CreateEvent events={events} setEvents={setEvents} />
      <div>
        <h2>Registered Accounts</h2>
        <ul>
          {accounts.map((account) => (
            <Account key={account.id} account={account} events={events} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
