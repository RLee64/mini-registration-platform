const Account = ({ account, events }) => {
  const accountStyle = {
    width: "30%",
  };

  return (
    <li className="item" style={accountStyle}>
      <h3>{account.name}</h3>
      <p>
        <strong>ID:</strong> {account.id}
      </p>
      <p>
        <strong>Email:</strong> {account.email}
      </p>
      {account.joinedEvents.length > 0 ? (
        <p>
          <strong>Joined Events:</strong>
          <ul>
            {account.joinedEvents.map((eventId) => (
              <li key={eventId}>
                - {events.find((event) => event.id === eventId)?.name}
              </li>
            ))}
          </ul>
        </p>
      ) : (
        <p>No events joined</p>
      )}
    </li>
  );
};

export default Account;
