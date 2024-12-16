import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import { accessTokenAtom } from "../atoms";
import platformApi from "../services/platform-api";
import Message from "./Message";

// The Component that Allows Account Name Changing
const EditName = ({ account, setAccount }) => {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const accessToken = useAtomValue(accessTokenAtom);

  const rightMargin = {
    marginRight: 25,
  };

  // Wipes error message when user starts re-entering information
  useEffect(() => {
    setErrorMessage(null);
  }, [newName]);

  const changeName = (event) => {
    event.preventDefault();

    if (!newName) {
      setErrorMessage("Please enter a new name");
      return;
    }

    platformApi
      .editName(newName, accessToken)
      .then((response) => {
        setAccount({ ...account, name: response.name });
        setNewName("");
        setSuccessMessage("Successful Name Change!")
        setTimeout(() => {
          setSuccessMessage(null)
        }, "3000");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Server Error - Name change was unsuccessful");
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
      <Message message={errorMessage} type="error" />
      <Message message={successMessage} type="success" />
      <button type="submit" style={rightMargin}>
        Submit
      </button>
      <button type="button" onClick={() => setEditingName(false)}>
        Cancel
      </button>
    </form>
  );
};

export default EditName;
