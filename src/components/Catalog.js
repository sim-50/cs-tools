import React, { Component } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';

const STORED_BOOK_KEY = 'STORED_BOOK_KEY';


function getStoredBooks() {
  const retrievedBooksString = localStorage.getItem(STORED_BOOK_KEY);
  if (!retrievedBooksString) {
    localStorage.setItem(STORED_BOOK_KEY, "[]")
    return [];
  }
  return JSON.parse(retrievedBooksString);
}
// function updateBook(name, location) {
//   // TODO
// }

function storeBook(name) {
  console.log('storing book', name);
  const storedBooks = getStoredBooks();
  const found = storedBooks.find(book => {
    return book.name === name;
  })
  if (found) {

  } else {
    // store the book
    var uniqid = require('uniqid');
    const bookObj = {
      code: uniqid(),
      name: name,
      location: 0,
      level: 0,
      position: 0,
    };
    storedBooks.push(bookObj);
    const storedBooksJson = JSON.stringify(storedBooks);
    localStorage.setItem(STORED_BOOK_KEY, storedBooksJson);
  }
}


export function Catalog(props) {
  const [location, setLocation] = React.useState();
  const [level, setLevel] = React.useState();
  const [position, setPosition] = React.useState();
  // when modal open
  React.useEffect(() => {
    if (props.show) {
      storeBook(props.query);
      const books = getStoredBooks();
      const found = books.find(book => book.name === props.query);
      if (found) {
        setLocation(found.location, found.level, found.position);
        setLevel(found.location, found.level, found.position);
        setPosition(found.location, found.level, found.position);
      }
    }
  }, [props.show, props.query]);



  return (
    <Modal
      {...props}
      // size="lg"
      dialogClassName='custom-dialog'
    // aria-labelledby="contained-modal-title-vcenter"
    // centered
    >
      <Modal.Header closeButton>
        <Modal.Title
        // id="contained-modal-title-vcenter"
        >
          Library Catalog
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Library Catalog Card</h4>
        <p>
          Book Name: {props.query}
        </p >
        <p>
          Location: {location === 0 ? 'storage' : 'bookshelf'}
          {/* TODO: check for location to hide level and position*/}
          <br />
          Level: {level}
          <br />
          Position: {position}
        </p >
        {/* if ({location} === 1) {
          <p>
            level: {level}
            position: {position}
          </p>
        } */}
      </Modal.Body>
      <Modal.Footer>

        <Button type="button" onClick={() => { props.onHide(); window.location.reload(); }}>Close</Button>
      </Modal.Footer>
    </Modal>

  );
}


