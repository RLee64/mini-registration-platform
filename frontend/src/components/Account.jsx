const Account = ({ account, events }) => {
  return (
    <li>
      <h3>{account.name}</h3>
      <ul>
        <li>ID: {account.id}</li>
        <li>Email: {account.email}</li>
        <li>
          Joined Events:
          <ul>
            {account.joinedEvents.map((eventId) => (
              <li key={eventId}>
                {events.find((event) => event.id === eventId)?.name}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </li>
  );
};

export default Account;
