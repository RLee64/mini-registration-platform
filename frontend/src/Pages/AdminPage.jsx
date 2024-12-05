import { useState } from "react";

const AdminPage = () => {
  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const createEvent = (event) => {
    event.preventDefault();
    console.log("Creating event");
  };

  return (
    <div>
      ADMIN STUFF
      <div>
        {/*List all events here*/}
        EVENTS
      </div>
      <div>
        CREATE EVENT
        <form onSubmit={createEvent}>
          name <input value={newEventName} onChange={setNewEventName} />
          description <input value={newEventDescription} onChange={setNewEventDescription} />
          date <input value={newEventDate} onChange={setNewEventDate} type="date" />
          <button type="submit">Login</button>
        </form>
      </div>
      <div>
        {/*List all accounts here*/}
        ACCOUNTS
      </div>
    </div>
  );
};

export default AdminPage;
