import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import platformApi from "../services/platform-api";
import { accessTokenAtom } from "../atoms";

const EditName = ({account, setAccount}) => {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const accessToken = useAtomValue(accessTokenAtom)

  const changeName = (event) => {
    event.preventDefault();
    platformApi.editName(newName, accessToken).then((response) => {
      setAccount({...account, name: response.newName})
      setEditingName(false);
      setNewName("");
    });
  };

  if (!editingName) {
    return <button onClick={() => setEditingName(true)}>Edit name</button>;
  }
  return (
    <form onSubmit={changeName}>
      <label htmlFor="newAccountName">New Name</label>
      <input
        id="newAccountName"
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
      />
      <button type="submit">Submit</button>
      <button type="button" onClick={() => setEditingName(false)}>
        Cancel
      </button>
    </form>
  );
};

const LandingSignedInPage = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  const [events, setEvents] = useState([]);
  const [account, setAccount] = useState([]);

  useEffect(() => {
    platformApi.getEvents().then((receivedEvents) => {
      setEvents(receivedEvents);
    });
  }, []);

  useEffect(() => {
    platformApi.getAccounts(accessToken).then((receivedAccount) => {
      setAccount(receivedAccount);
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
      <h2>User Details</h2>
      <ul>
        <li>Name: {account.name}</li>
        <li>Email: {account.email}</li>
      </ul>
      <EditName account={account} setAccount={setAccount} />
    </div>
  );
};

export default LandingSignedInPage;
