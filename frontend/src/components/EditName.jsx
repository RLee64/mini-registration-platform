import { useState } from "react";
import { useAtomValue } from "jotai";

import { accessTokenAtom } from "../atoms";

const EditName = ({ account, setAccount }) => {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const accessToken = useAtomValue(accessTokenAtom);

  const changeName = (event) => {
    event.preventDefault();
    platformApi.editName(newName, accessToken).then((response) => {
      setAccount({ ...account, name: response.newName });
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

export default EditName