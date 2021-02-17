// This React app maintains a simple inventory list.
// The design goal was to put all of the functions in
// a single file to help study how they work.
// Local storage is used in this version.
// by John Phillips on 2021-02-17 revised 2021-02-17

import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import "./Style.css";

// ***** Main function *******************************************************
export default function InventoryListLocalStorage() {
  // Grab any existing list data from the browser local storage. If none exist,
  // then set the list to be an empty array.
  const initialList = JSON.parse(window.localStorage.getItem("list") || "[]");

  // Create the state array and a function to change the data.
  // rowDataArray contains all of our list data organized by row.
  const [rowDataArray, setRowDataArray] = useState(initialList);

  // Any time rowDataArray changes then this hook will automatically be called
  // to update the local storage.
  useEffect(() => {
    window.localStorage.setItem("list", JSON.stringify(rowDataArray));
  }, [rowDataArray]);

  function addNewRow(item, qty) {
    // make a new array out of all the existing elements plus a new one
    const updatedItems = [
      ...rowDataArray,
      { name: item, qty: qty, id: uuid() },
    ];
    setRowDataArray(updatedItems);
  }

  function updateRow(oneRow, qty) {
    // just update qty and leave name and id as is
    const updatedRow = { name: oneRow.name, qty: qty, id: oneRow.id };
    // check each row for the matching id and if found return the updated row
    const updatedItems = rowDataArray.map((row) => {
      if (row.id === oneRow.id) {
        return updatedRow;
      }
      return row;
    });
    setRowDataArray(updatedItems);
  }

  function removeRow(id) {
    // filter out any row where the ids don't match
    const updatedItems = rowDataArray.filter((row) => row.id !== id);
    setRowDataArray(updatedItems);
  }

  return (
    <div>
      <div className="Wrapper">
        <h1>Inventory List With Local Storage</h1>
        <InputForm addNewRow={addNewRow} className="InputForm" />
        <div className="ListContainer">
          <ul>
            {rowDataArray.map((oneRow) => (
              <li key={oneRow.id}>
                <ListRow
                  oneRow={oneRow}
                  remove={removeRow}
                  update={updateRow}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
// ***** End Main function ***************************************************
// export default InventoryListNoStorage;

// Displays a single row of data with delete and edit buttons.
// It needs to be a separate function so that each row can
// have its own isEditing toggle.
function ListRow({ oneRow, remove, update }) {
  const [isEditing, toggle] = useToggle(false);
  return (
    <div>
      {isEditing ? (
        <EditRowForm oneRow={oneRow} update={update} toggle={toggle} />
      ) : (
        // span to wrap elements and later add style
        <span>
          <span>
            {oneRow.name} : {oneRow.qty}
          </span>
          <span className="ButtonGroup">
            <button
              className="Button"
              aria-label="Delete"
              onClick={() => remove(oneRow.id)}
            >
              Delete
            </button>
            <button className="Button" aria-label="Edit" onClick={toggle}>
              Edit
            </button>
          </span>
        </span>
      )}
    </div>
  );
}

// display's empty item name and qty text fields; when submitted it
// adds a new row to the data array
function InputForm({ addNewRow }) {
  const [name, handleNameChange, resetNameField] = useInputState("");
  const [qty, handleQtyChange, resetQtyField] = useInputState("");

  // next 2 lines enable the focus to return to the first textbox
  // after the 'add new item' button is clicked
  const textInput = React.createRef();
  const focus = () => textInput.current.focus();

  return (
    <form
      className="InputForm"
      onSubmit={(e) => {
        e.preventDefault();
        addNewRow(name, qty);
        resetNameField();
        resetQtyField();
        focus(); // returns focus to first textbox after submit
      }}
    >
      <input
        type="text"
        value={name}
        placeholder="Type new item name"
        onChange={handleNameChange}
        label="Add New Item"
        autoFocus
        ref={textInput} // returns focus to first textbox after submit
      />
      <input
        type="text"
        value={qty}
        placeholder="Type new quantity"
        onChange={handleQtyChange}
        label="Add New Quantity"
      />
      <button type="submit">Add new item</button>
    </form>
  );
}

// allows user to update an item's quantity
function EditRowForm({ oneRow, update, toggle }) {
  const [value, handleChange, reset] = useInputState(oneRow.qty);
  return (
    <form
      className="InputForm"
      onSubmit={(e) => {
        e.preventDefault();
        update(oneRow, value);
        reset();
        toggle();
      }}
    >
      {oneRow.name}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        label="Update quantity"
        autoFocus={true}
      />
      Press Enter to Update
    </form>
  );
}

// utility function to toggle a state from false to true and back
function useToggle(initialVal = false) {
  const [state, setState] = useState(initialVal);
  const toggle = () => setState(!state);
  return [state, toggle];
}

// utility functions to fill in a text field as the user types;
// resets the text field to "" after the user presses enter
function useInputState(initialVal) {
  const [value, setValue] = useState(initialVal);
  const handleChange = (e) => setValue(e.target.value);
  const reset = () => setValue("");
  return [value, handleChange, reset];
}

function Footer() {
  return (
    <p className="Footer">
      Simple Inventory List with local storage by John Phillips on Febuary 17,
      2021. Source at{" "}
      <a href="https://github.com/profphillips/inventorylistlocalstorage">
        https://github.com/profphillips/inventorylistlocalstorage
      </a>
      . Live page at{" "}
      <a href="https://profphillips.github.io/inventorylistlocalstorage/">
        https://profphillips.github.io/inventorylistlocalstorage/
      </a>
      .
    </p>
  );
}

// ***** End Of File *********************************************************
