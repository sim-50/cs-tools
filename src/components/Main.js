import React, { Component } from 'react';
import Bookshelf from './Bookshelf';
import "../styles/Main.css";
import "antd/dist/antd.css";
import Container from 'react-bootstrap/Container';
import '../App.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Catalog } from './Catalog.js';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Storage from './Storage';
import { message, Button, List, Tooltip, Select, Popconfirm } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

function getStoredBooks() {
    try {
        const retrievedBooksString = localStorage.getItem('STORED_BOOK_KEY');
        if (!retrievedBooksString) {
            localStorage.setItem('STORED_BOOK_KEY', "[]")
            return [];
        }
        return JSON.parse(retrievedBooksString);
    } catch (err) {
        return [];
    }
}

function allStorage() {
    try {
        var archive = {};
        Object.entries(localStorage).map(([key, valueJSON]) => {
            const value = JSON.parse(valueJSON);
            archive = value;
        }
        )
        return (archive)
    }
    catch (err) {
        return [];
    }
}

function getStoredSteps() {
    try {
        const retrievedStepsString = localStorage.getItem('STORED_STEP_KEY');
        if (!retrievedStepsString) {
            localStorage.setItem('STORED_STEP_KEY', "[]")
            return [];
        }
        return JSON.parse(retrievedStepsString);
    } catch (err) {
        return [];
    }
}

class Main extends Component {

    constructor(props) {
        super(props);
        this.hiddenFileInput = React.createRef();
        this.handleClickNext = this.handleClickNext.bind(this);
        this.handleClickPrevious = this.handleClickPrevious.bind(this);
        this.handleClickShowSteps = this.handleClickShowSteps.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.state = {
            role: this.props.role,
            value: '',
            lib: [],
            catalogShow: false,
            numOfShelfLevels: 5,
            numOfBooksPerLevel: 3,
            numOfBins: 4,
            books: allStorage(), // location: 0-storage; 1-bookshelf
            query: '',
            error: 0,
            steps: getStoredSteps(),
            files: "",
            pointer: 0,
            isToggleOn: false,
            display: 'none',
            disableNext: false,
            loading: false,
            hasMore: true,
            undoStep: null
        }
    }

    dragHandler = (item, toLocation, toBin, toLevel, toPosition) => {
        let booksCopy = [...this.state.books];
        let bookDragged = booksCopy.filter(book => book.code === item.code);
        let index = booksCopy.indexOf(bookDragged[0]);
        bookDragged[0].location = toLocation;
        bookDragged[0].bin = toBin;
        bookDragged[0].level = toLevel;
        bookDragged[0].position = toPosition;
        booksCopy[index] = bookDragged[0];
        this.setState({ books: booksCopy });

        var is_empty = 0;
        var shelf_book = 1;
        var storedBooks = getStoredBooks();
        for (var i = 0; i < storedBooks.length; i++) {
            if (storedBooks[i].name !== item.name && toLocation === 1) {
                if (storedBooks[i].level === toLevel && storedBooks[i].position === toPosition) {
                    is_empty = 1;
                }
            }

            if (storedBooks[i].location === 1) {
                shelf_book += 1;
            }
        }

        if (toLocation === 1 && shelf_book > this.state.numOfShelfLevels * this.state.numOfBooksPerLevel) {
            is_empty = 2;
        }

        if (is_empty === 0) {
            for (i = 0; i < storedBooks.length; i++) {
                if (storedBooks[i].code === item.code) {
                    if (storedBooks[i].location === 0 && toLocation === 1) {
                        var today = new Date();
                        storedBooks[i].created_date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        sessionStorage.setItem("STORED_BOOK_KEY", item.name);
                    }
                    storedBooks[i].name = item.name;
                    storedBooks[i].location = toLocation;
                    storedBooks[i].bin = toBin;
                    storedBooks[i].level = toLevel;
                    storedBooks[i].position = toPosition
                }
                var storedBooksJson = JSON.stringify(storedBooks);
                localStorage.setItem("STORED_BOOK_KEY", storedBooksJson);
            }
            if (toLocation === 1) {
                message.success(item.name + " is available on bookshelf now. Please double click to access.");
                this.props.handleRoleChange("Student");
            }
        }
        else if (is_empty === 1) {
            message.error("A book already exists on this position. Please choose another position as a librarian again!");
            this.setState({ error: 1 });
        }
        else {
            message.error("The bookshelf is full. Please remove a book from the shelf to storage bin before adding another book to the shelf.", 15);
            message.info("You can remove the book with least frequency.", 15);
            this.setState({ error: 1 });
        }
    }

    dbclick = () => {
        document.ondblclick = DoubleClick;
        function DoubleClick(e) {
            if (e.target.draggable === true) {
                let book_name = e.target.offsetParent.innerText;
                let data = sessionStorage.getItem('STORED_BOOK_KEY');

                if (data === book_name) {
                    alert("You have successfully retrieved " + data);

                    var storedBooks = getStoredBooks();
                    var today = new Date();
                    for (var i = 0; i < storedBooks.length; i++) {
                        if (storedBooks[i].name === data) {
                            storedBooks[i].frequency += 1;
                            storedBooks[i].last_borrowed = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.toLocaleTimeString();
                        }
                        var storedBooksJson = JSON.stringify(storedBooks);
                        localStorage.setItem("STORED_BOOK_KEY", storedBooksJson);
                    }
                    sessionStorage.setItem('STORED_BOOK_KEY', '');
                    window.location.reload();
                }
                else {
                    message.warning("Please choose again");
                }
            }
        }
    }

    catalogClose = () => this.setState({ catalogShow: false });

    componentDidUpdate(prevProps, prevStates) {
        if (this.state.error !== prevStates.error) {
            this.setState({
                books: allStorage(),
            });
            this.setState({ error: 0 });
        }

        if (this.state.catalogShow !== prevStates.catalogShow) {
            this.setState({
                books: allStorage(),
            });
            this.catalogClose();
        }
    }

    handleUpload = e => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            this.setState({
                files: JSON.parse(e.target.result),
                books: JSON.parse(e.target.result)[0],
                steps: JSON.parse(e.target.result)
            });
            localStorage.setItem('STORED_BOOK_KEY', JSON.stringify(JSON.parse(e.target.result)[0]))
            localStorage.setItem('STORED_STEP_KEY', JSON.stringify(JSON.parse(e.target.result)))
            message.success("The Json file has uploaded successfully!")
        };
    };

    handleClickUpload = e => {
        this.hiddenFileInput.current.click();
    }

    handleClickRecord = () => {
        const storedSteps = getStoredSteps();
        var currentStep = this.state.books;
        if (JSON.stringify(storedSteps[storedSteps.length - 1]) === JSON.stringify(currentStep)) {
            console.log("Duplicate step")
            message.error("Duplicate step")
        }
        else {
            console.log("Step added");
            message.success("Step added")
            storedSteps.push(currentStep);
        }
        const storedStepsJson = JSON.stringify(storedSteps);
        localStorage.setItem('STORED_STEP_KEY', storedStepsJson);
        this.setState({ steps: storedSteps });
    }

    handleClickPrevious() {
        const fileContent = this.state.files;
        if (fileContent && this.state.pointer > 0) {
            this.setState((prevState) => ({
                pointer: prevState.pointer - 1,
                disableNext: false
            }), function () {
                this.setState({ books: fileContent[this.state.pointer] })
                localStorage.setItem('STORED_BOOK_KEY', JSON.stringify(fileContent[this.state.pointer]))
                message.success("Previous clicked! You are at step " + (this.state.pointer+1))
            });
        }
    }

    handleClickNext() {
        const fileContent = this.state.files;
        if (fileContent && this.state.pointer < fileContent.length - 1) {
            this.setState((prevState) => ({
                pointer: prevState.pointer + 1,
            }), function () {
                this.setState({ books: fileContent[this.state.pointer] })
                localStorage.setItem('STORED_BOOK_KEY', JSON.stringify(fileContent[this.state.pointer]))
                message.success("Next clicked! You are at step " + (this.state.pointer+1))
            });
        }
        if (this.state.pointer >= fileContent.length - 2) {
            this.setState((prevState) => ({
                disableNext: !prevState.disableNext
            }))
        }
    }

    handleClickShowSteps() {
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn,
            display: prevState.isToggleOn ? 'none' : 'block'
        }));
    }

    handleInfiniteOnLoad = () => {
        let { steps } = this.state;
        this.setState({
            loading: true,
        });
        if (steps.length > 15) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
    }
    handleSelectChange(value) {
        console.log(`selected ${value}`);
        this.setState({ undoStep: value })
    }

    handleConfirm = () => {
        if (this.state.undoStep !== null && this.state.undoStep > 1) {
            this.setState({
                steps: this.state.steps.slice(0, this.state.undoStep - 1),
                books: this.state.steps[this.state.undoStep - 2]
            })
            localStorage.setItem('STORED_STEP_KEY', JSON.stringify(this.state.steps.slice(0, this.state.undoStep - 1)))
            localStorage.setItem('STORED_BOOK_KEY', JSON.stringify(this.state.steps[this.state.undoStep - 2]))
            message.success('Step ' + this.state.undoStep + ' and all the following steps have been removed. Now you can redo the recording from there.');
        }
        else if (this.state.undoStep === 1) {
            this.setState({
                steps: [],
                books: []
            })
            localStorage.setItem('STORED_STEP_KEY', '[]')
            localStorage.setItem('STORED_BOOK_KEY', '[]')
        }
        else {
            message.error('Step value cannot be empty! Please try again to select a step.');
        }

    };

    render() {
        const role = this.props.role;
        const { Option } = Select;

        return (
            <div className="main" >
                <Container fluid="xxl">
                    <Row>
                        <Col>
                            <h5 className="computer-title"><strong>Catalog Computer</strong></h5>
                            <div className={(role === "Librarian") ? "wrapper" : ""}>
                                <div className={(role === "Librarian") ? "is-disabled" : ""}>
                                    <div className="search-monitor">
                                        <div className="search-container">
                                            <Row>
                                                Press Enter after Search
                                            </Row>
                                            <Row>
                                                <div className="form-inline mt-4 mb-4" >
                                                    <input className="form-control-sm" type="text" placeholder="Find a Book" aria-label="Search"
                                                        value={this.state.query}
                                                        // onSubmit={event => this.setState({ query: event.target.value })}
                                                        onClick={event => {
                                                            message.info("You can enter any book you want")
                                                        }}
                                                        onChange={event => this.setState({ query: event.target.value })}
                                                        onKeyPress={event => {
                                                            if (event.key === 'Enter') {
                                                                if (!this.state.query) {
                                                                    alert('Please input a name!');
                                                                } else {
                                                                    this.setState({ catalogShow: true, value: event.target.value })
                                                                }
                                                            }
                                                        }} />
                                                </div>
                                            </Row>
                                            <Row>
                                                <strong>Catalog Card</strong>
                                            </Row>
                                            <Row>
                                                <Catalog
                                                    query={this.state.value}
                                                    show={this.state.catalogShow}
                                                    onHide={this.catalogClose}
                                                    numOfBins={this.state.numOfBins}
                                                    role={this.props.role}
                                                    handleRoleChange={this.props.handleRoleChange}
                                                />
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <DndProvider backend={HTML5Backend}>
                            <Col className="bookshelf-view">
                                <div>
                                    <Bookshelf
                                        numOfLevels={this.state.numOfShelfLevels}
                                        numOfBooksPerLevel={this.state.numOfBooksPerLevel}
                                        books={this.state.books}
                                        dragHandler={this.dragHandler.bind(this)}
                                        dbclick={this.dbclick()}
                                    />
                                </div>
                            </Col>
                            <Col className="storage-view">
                                <div className={(role === "Student") ? "wrapper" : ""}>
                                    <div className={(role === "Student") ? "is-disabled" : ""}>
                                        <Storage
                                            books={this.state.books}
                                            numOfBins={this.state.numOfBins}
                                            dragHandler={this.dragHandler.bind(this)}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </DndProvider>
                        <Col style={{ display: this.state.display }}>
                            <h5 className="computer-title"><strong>Steps Info</strong></h5>
                            <div className="demo-infinite-container">
                                <InfiniteScroll
                                    initialLoad={false}
                                    pageStart={0}
                                    loadMore={this.handleInfiniteOnLoad}
                                    hasMore={!this.state.loading && this.state.hasMore}
                                    useWindow={false}
                                >
                                    <List
                                        dataSource={this.state.steps}
                                        bordered
                                        renderItem={step => (
                                            // <Card title={step.id}>
                                            <List.Item key={step.id}>
                                                <h5>Step {this.state.steps.indexOf(step) + 1}: </h5>
                                                {step.map(book => (
                                                    // <Card type="inner"
                                                    //     title={book.name}>
                                                    //     {(book.location === 0 ? "storage: bin" + book.bin : "bookshelf: level" + book.level + "; position" + book.position)}
                                                    // </Card>
                                                    // <List.Item.Meta
                                                    //     title={book.name}
                                                    //     description={(book.location === 0 ? "storage: bin" + book.bin : "bookshelf: level" + book.level + "; position" + book.position)} />
                                                    <p><strong>{book.name}</strong> {(book.location === 0 ? "storage: bin" + book.bin : "bookshelf: level" + book.level + "; position" + book.position)}</p>
                                                ))}
                                            </List.Item>
                                            // </Card>
                                        )} />
                                </InfiniteScroll>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 6, offset: 3 }}>
                            <Select placeholder="Select a step" style={{ width: 120 }} onChange={this.handleSelectChange}>
                                {this.state.steps.map(step => (
                                    <Option value={this.state.steps.indexOf(step) + 1}>{this.state.steps.indexOf(step) + 1}</Option>
                                ))}
                            </Select>
                            <Popconfirm
                                title={"Are you sure to undo step " + this.state.undoStep + " and all the following steps?"}
                                onConfirm={this.handleConfirm}
                                okText="Yes"
                                cancelText="No">
                                <Button>Undo</Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button type="primary"
                                onClick={this.handleClickPrevious}
                                disabled={this.state.pointer === 0 ? true : false}>
                                Previous
                            </Button>
                            <Button type="primary"
                                onClick={this.handleClickUpload}>
                                Upload Json
                            </Button>
                            <input type="file"
                                ref={this.hiddenFileInput}
                                onChange={this.handleUpload}
                                style={{ display: 'none' }}
                            />
                            <Button type="primary"
                                onClick={this.handleClickNext}
                                disabled={this.state.disableNext}>
                                Next
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                    JSON.stringify(this.state.steps)
                                    // JSON.stringify(JSON.parse(localStorage.getItem(`STORED_STEP_KEY`)))
                                )}`}
                                download="steps.json"
                            >
                                Download Json
                            </Button>
                            <Tooltip placement="bottom" title="Have any confusion? Check user manual from overview button.">
                                <Button type="primary" onClick={this.handleClickRecord}>Record Step</Button>
                            </Tooltip>
                            <Button type="primary" onClick={() => {
                                localStorage.setItem("STORED_STEP_KEY", "[]");
                                this.setState({ steps: [] })
                            }}>Clear all Steps</Button>
                        </Col>
                        <Col>
                            {/* Reset Library */}
                            <Button type="primary" onClick={() => {
                                localStorage.setItem("STORED_BOOK_KEY", "[]");
                                this.setState({ books: [] });
                                this.props.handleRoleChange("Student");
                            }}>Reset Library</Button>
                            <Button type="primary" onClick={this.handleClickShowSteps}>
                                {this.state.isToggleOn ? 'Hide Steps Info' : 'Show Steps Info'}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div >
        );
    }
}

export default Main;