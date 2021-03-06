import React, { PureComponent } from 'react';
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
import { message, Button, List, Tooltip, Select, Popconfirm, InputNumber, Statistic, Card, Popover, Input } from 'antd';
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

function getStoredFaults() {
    try {
        const retrivedNumOfFaults = localStorage.getItem('STORED_FAULTS_KEY');
        if (!retrivedNumOfFaults) {
            localStorage.setItem('STORED_FAULTS_KEY', 0)
            return 0;
        }
        return JSON.parse(retrivedNumOfFaults);
    } catch (err) {
        return [];
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function storeBook(name, numOfBins) {
    console.log('storing book', name);
    const today = new Date();
    const storedBooks = getStoredBooks();
    const found = storedBooks.find(book => {
        return book.name === name;
    })
    if (found) {
        // sessionStorage.setItem('STORED_BOOK_KEY', name);
    } else {
        // store the book
        var uniqid = require('uniqid');
        const bookObj = {
            code: uniqid(),
            name: name,
            location: 0,
            bin: getRandomIntInclusive(1, numOfBins),  // store to bin randomly
            level: 0,
            position: 0,
            created_date: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
            frequency: 0,
            last_borrowed: 0,
        };
        storedBooks.push(bookObj);
        const storedBooksJson = JSON.stringify(storedBooks);
        localStorage.setItem('STORED_BOOK_KEY', storedBooksJson);
    }
}

class Main extends PureComponent {

    constructor(props) {
        super(props);
        this.hiddenFileInput = React.createRef(); // Element reference for upload JSON input
        this.handleClickNext = this.handleClickNext.bind(this);
        this.handleClickPrevious = this.handleClickPrevious.bind(this);
        this.handleClickShowSteps = this.handleClickShowSteps.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleFaultsIncrement = this.handleFaultsIncrement.bind(this);
        this.queryRef = React.createRef(); // Element reference for search input
        this.state = {
            role: this.props.role,
            value: '',
            lib: [],
            catalogShow: false,
            numOfShelfLevels: 5,
            numOfBooksPerLevel: 3,
            bookcaseHeight: '120px',
            bookcaseWidth: '340px',
            bookstandMarginTop: '30px',
            bookstandMarginLeft: '5px',
            numOfBins: 4,
            books: getStoredBooks(), // location: 0-storage; 1-bookshelf
            error: 0,
            steps: getStoredSteps(),
            pointer: 0,
            isToggleOn: false,
            displayStepInfos: 'none',
            disableNext: true,
            loading: false,
            hasMore: true,
            undoStep: null,
            pageFaults: getStoredFaults(),
            animationShow: false,
            bouncingBooks: [],
            flyingBooks: [],
            nextClicked: false,
            configVisible: false, // show config table in "build your own" or not
            isSuccess: false,
            displayToLibrarianDialog: 'none',
            displayMoveBookDialog: 'none',
            displayNoticeDialog: 'none',
            displayRetriveSuccessDialog: 'none',
            targetBookBinNumber: 0,
            bookshelfDim: [],
            storageDim: [],
        }
    }

    updateBookshelfDim = (newDim) => {
        this.setState(() => ({
            bookshelfDim: newDim
        }), function () {
        })
    }

    updateStorageDim = (newDim) => {
        this.setState(() => ({
            storageDim: newDim
        }), function () {
        })
    }

    onAnimComplete = () => {
        if (this.state.animationShow) {
            setTimeout(() => {
                let steps = this.state.steps;
                this.setState({
                    books: steps[this.state.pointer],
                    animationShow: false,
                })
            }, 1700)
        }
    }

    dragHandler = (item, toLocation, toBin, toLevel, toPosition) => {
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
                        if (item.name === this.state.value) {
                            this.handleToStudent();
                        } else if (this.state.value) {
                            message.error("Moved a wrong book! Please move " + this.state.value + " again!");
                        }
                    }
                    storedBooks[i].name = item.name;
                    storedBooks[i].location = toLocation;
                    storedBooks[i].bin = toBin;
                    storedBooks[i].level = toLevel;
                    storedBooks[i].position = toPosition

                    var storedBooksJson = JSON.stringify(storedBooks);
                    localStorage.setItem("STORED_BOOK_KEY", storedBooksJson);
                    if (item.name === this.state.value) {
                        // update catalog
                        this.setState({ catalogShow: true })
                    }
                    this.setState({ animationShow: false, books: getStoredBooks() })
                }
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

    showRetriveSuccess() {
        if (this.state.isSuccess === true) {
            this.setState({
                displayRetriveSuccessDialog: 'block',
                displayNoticeDialog: 'none'
            })
        }
    }

    dbclick = () => {
        document.ondblclick = DoubleClick.bind(this);
        function DoubleClick(e) {
            if (e.target.draggable === true) {
                let book_name = e.target.offsetParent.innerText;
                let data = sessionStorage.getItem('STORED_BOOK_KEY');
                let retrieveSuccess = false;
                let storedBooks = getStoredBooks();
                let found = storedBooks.find(book => book.name === book_name)
                if (found) {
                    if (found.location === 1) {
                        if (data === book_name && book_name === this.state.value) {
                            retrieveSuccess = true;
                            this.setState({
                                isSuccess: retrieveSuccess,
                            });
                            this.showRetriveSuccess();
                            let today = new Date();
                            let index = storedBooks.indexOf(found)
                            found.frequency += 1;
                            found.last_borrowed = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                            storedBooks[index] = found
                            let storedBooksJson = JSON.stringify(storedBooks);
                            localStorage.setItem("STORED_BOOK_KEY", storedBooksJson);
                            sessionStorage.setItem('STORED_BOOK_KEY', '');
                            this.setState({
                                books: getStoredBooks()
                            });
                        }
                        else if (this.state.value && data) {
                            message.warning("Chose a wrong book. Please try again!")
                        }
                    }
                    if (found.location === 0 && this.state.value && data) {
                        message.warning("Cannot retrieve book in storage! Please drag the book to bookshelf.")
                    }
                }
            }
        }
    }

    catalogClose = () => this.setState({ catalogShow: false });

    componentDidUpdate(prevProps, prevStates) {
        if (this.state.error !== prevStates.error) {
            this.setState({
                books: getStoredBooks(),
            });
            this.setState({ error: 0 });
        }
    }

    showToLibrarianDialog = () => {
        this.setState({
            displayToLibrarianDialog: 'block',
            displayNoticeDialog: 'none',
            displayRetriveSuccessDialog: 'none'
        })
    }

    handleToLibrarian = () => {
        this.setState({
            displayToLibrarianDialog: 'none',
            displayMoveBookDialog: 'block',
            displayRetriveSuccessDialog: 'none'
        })
        this.props.handleRoleChange("Librarian");

    }

    handleToStudent = () => {
        this.setState({
            displayToLibrarianDialog: 'none',
            displayMoveBookDialog: 'none',
            displayNoticeDialog: 'block',
            displayRetriveSuccessDialog: 'none',
        })
        this.props.handleRoleChange("Student");
    }

    handleFinishDialog = () => {
        this.setState({
            displayNoticeDialog: 'none'
        })
    }

    onSearch = (value) => {
        if (value === "") {
            alert('Please input a name!');
        } else {
            storeBook(value, this.state.numOfBins);
            this.setState({
                catalogShow: true,
                value: value,
                books: getStoredBooks()
            })
            sessionStorage.setItem('STORED_BOOK_KEY', value)
            let books = getStoredBooks()
            let targetBook = books.find(book => book.name === value)
            if (targetBook) {
                if (targetBook.location === 0) {
                    this.showToLibrarianDialog();
                    this.setState({ targetBookBinNumber: targetBook.bin, animationShow: false });
                    this.handleFaultsIncrement();
                }
                if (targetBook.location === 1) {
                    this.setState({ displayNoticeDialog: 'block', displayRetriveSuccessDialog: 'none', animationShow: false });
                    message.warn("Please double click on the book to retrieve");
                }
            }
        }
    }

    handleUpload = e => {
        /* To do: upload error handling */
        if (e.target.files[0]) {
            let fileReader = new FileReader();
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = e => {
                // check empty array; todo: check format
                if ((JSON.parse(e.target.result).length > 0)) {
                    this.setState({
                        books: JSON.parse(e.target.result)[0],
                        steps: JSON.parse(e.target.result),
                        pointer: 0,
                        disableNext: false,
                        flyingBooks: [],
                        animationShow: true,
                        bouncingBooks: JSON.parse(e.target.result)[0]
                    });
                    if (JSON.parse(e.target.result)[0].length > 0) {
                        this.setState({ pageFaults: JSON.parse(e.target.result)[0][0].faults })
                    }
                    else {
                        this.setState({ pageFaults: 0 })
                    }
                    localStorage.setItem('STORED_BOOK_KEY', JSON.stringify(JSON.parse(e.target.result)[0]))
                    localStorage.setItem('STORED_STEP_KEY', JSON.stringify(JSON.parse(e.target.result)))
                    message.success("The Json file has uploaded successfully!")
                    // set to libarian mode automatically with both bookshelf and storage
                    this.props.handleRoleChange("Librarian");
                }
                else {
                    message.error("There is something wrong with your file. Please try again!")
                }
                this.hiddenFileInput.current.value = ""; // Enable uploading duplicate files
            };
        }
    };

    handleClickUpload = e => {
        this.hiddenFileInput.current.click();
    }

    handleClickRecord = () => {
        const storedSteps = getStoredSteps();
        var currentStep = this.state.books;
        currentStep.map(book => book.faults = this.state.pageFaults)
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
        const fileContent = this.state.steps;
        if (fileContent && this.state.pointer > 0) {
            this.setState((prevState) => ({
                pointer: prevState.pointer - 1,
                disableNext: false,
                animationShow: false,
                bouncingBooks: [],
            }), function () {
                this.setState({ books: fileContent[this.state.pointer] })
                if (fileContent[this.state.pointer].length > 0) {
                    this.setState({ pageFaults: fileContent[this.state.pointer][0].faults })
                }
                else {
                    this.setState({ pageFaults: 0 })
                }
                localStorage.setItem('STORED_BOOK_KEY', JSON.stringify(fileContent[this.state.pointer]))
                message.success("Previous clicked! You are at step " + (this.state.pointer + 1))
            });
        }
    }

    getDimension(level, position, binId) {
        const bookshelfDim = this.state.bookshelfDim;
        const storageDim = this.state.storageDim;
        let dim = [];
        if (level !== 0 && position !== 0) {
            dim = bookshelfDim.find(bookstand => bookstand.level === level && bookstand.position === position)
            if (dim) {
                return ({ x: dim.x, y: dim.y })
            }
        }
        if (binId !== 0) {
            dim = storageDim.find(bin => bin.binId === binId)
            if (dim) {
                return ({ x: dim.x, y: dim.y })
            }
        }
    }

    handleClickNext() {
        const fileContent = this.state.steps;
        if (fileContent && this.state.pointer < fileContent.length - 1) {
            let currStep = fileContent[this.state.pointer]
            let nextStep = fileContent[this.state.pointer + 1]
            let existingBook = []
            let newBook = []
            for (let i = 0; i < currStep.length; i++) {
                // compare existing book location
                if (nextStep.length > 0 && currStep[i].code === nextStep[i].code &&
                    (currStep[i].level !== nextStep[i].level ||
                        currStep[i].position !== nextStep[i].position ||
                        currStep[i].bin !== nextStep[i].bin)) {
                    if (currStep[i].location === 1 &&
                        nextStep[i].location === 0) {
                        let from = this.getDimension(currStep[i].level, currStep[i].position, 0)
                        let to = this.getDimension(0, 0, nextStep[i].bin)
                        existingBook.push({
                            code: currStep[i].code,
                            name: currStep[i].name,
                            created_date: nextStep[i].created_date,
                            frequency: nextStep[i].frequency,
                            last_borrowed: nextStep[i].last_borrowed,
                            from: { level: currStep[i].level, position: currStep[i].position, bin: currStep[i].bin },
                            to: { level: nextStep[i].level, position: nextStep[i].position, bin: nextStep[i].bin },
                            bezier: { x: to.x - from.x, y: to.y - from.y }
                        })
                    }
                    if (currStep[i].location === 0 &&
                        nextStep[i].location === 1) {
                        let from = this.getDimension(0, 0, currStep[i].bin)
                        let to = this.getDimension(nextStep[i].level, nextStep[i].position, 0)
                        existingBook.push({
                            code: currStep[i].code,
                            name: currStep[i].name,
                            created_date: nextStep[i].created_date,
                            frequency: nextStep[i].frequency,
                            last_borrowed: nextStep[i].last_borrowed,
                            from: { level: currStep[i].level, position: currStep[i].position, bin: currStep[i].bin },
                            to: { level: nextStep[i].level, position: nextStep[i].position, bin: nextStep[i].bin },
                            bezier: { x: to.x - from.x, y: to.y - from.y }
                        })
                    }
                    if (currStep[i].location === 1 &&
                        nextStep[i].location === 1) {
                        let from = this.getDimension(currStep[i].level, currStep[i].position, 0)
                        let to = this.getDimension(nextStep[i].level, nextStep[i].position, 0)
                        existingBook.push({
                            code: currStep[i].code,
                            name: currStep[i].name,
                            created_date: nextStep[i].created_date,
                            frequency: nextStep[i].frequency,
                            last_borrowed: nextStep[i].last_borrowed,
                            from: { level: currStep[i].level, position: currStep[i].position, bin: currStep[i].bin },
                            to: { level: nextStep[i].level, position: nextStep[i].position, bin: nextStep[i].bin },
                            bezier: { x: to.x - from.x, y: to.y - from.y }
                        })
                    }
                    if (currStep[i].location === 0 &&
                        nextStep[i].location === 0) {
                        let from = this.getDimension(0, 0, currStep[i].bin)
                        let to = this.getDimension(0, 0, nextStep[i].bin)
                        existingBook.push({
                            code: currStep[i].code,
                            name: currStep[i].name,
                            created_date: nextStep[i].created_date,
                            frequency: nextStep[i].frequency,
                            last_borrowed: nextStep[i].last_borrowed,
                            from: { location: currStep[i].location, level: currStep[i].level, position: currStep[i].position, bin: currStep[i].bin },
                            to: { location: currStep[i].location, level: nextStep[i].level, position: nextStep[i].position, bin: nextStep[i].bin },
                            bezier: { x: to.x - from.x, y: to.y - from.y }
                        })
                    }
                }
            }

            if (nextStep.length > currStep.length) {
                // handling new added book
                for (let j = currStep.length; j < nextStep.length; j++) {
                    newBook.push(nextStep[j])
                }
            }

            this.setState({
                flyingBooks: existingBook,
                bouncingBooks: newBook,
                animationShow: true,
                pointer: this.state.pointer + 1,
                books: fileContent[this.state.pointer],
            })
            if (fileContent[this.state.pointer + 1].length > 0) {
                this.setState({ pageFaults: fileContent[this.state.pointer + 1][0].faults })
            }
            else {
                this.setState({ pageFaults: 0 })
            }
            localStorage.setItem('STORED_BOOK_KEY', JSON.stringify(fileContent[this.state.pointer + 1]))
            message.success("Next clicked! You are at step " + (this.state.pointer + 2))
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
            displayStepInfos: prevState.isToggleOn ? 'none' : 'block'
        }));
    }

    // used for step infos inner scroll
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
                books: this.state.steps[this.state.undoStep - 2],
                pointer: this.state.undoStep - 2,
            })
            if (this.state.steps[this.state.undoStep - 2].length > 0) {
                this.setState({ pageFaults: this.state.steps[this.state.undoStep - 2][0].faults })
            }
            else {
                this.setState({ pageFaults: 0 })
            }
            this.handleToStudent();
            localStorage.setItem('STORED_STEP_KEY', JSON.stringify(this.state.steps.slice(0, this.state.undoStep - 1)))
            localStorage.setItem('STORED_BOOK_KEY', JSON.stringify(this.state.steps[this.state.undoStep - 2]))
            message.success('Step ' + this.state.undoStep + ' and all the following steps have been removed. Now you can redo the recording from there.');
        }
        else if (this.state.undoStep === 1) {
            this.setState({
                steps: [],
                books: [],
                pointer: 0,
                pageFaults: 0,
            })
            localStorage.setItem('STORED_STEP_KEY', '[]')
            localStorage.setItem('STORED_BOOK_KEY', '[]')
            this.handleToStudent();
        }
        else {
            message.error('Step value cannot be empty! Please try again to select a step.');
        }

    };

    onChangeLevelInput = value => {
        this.setState({
            numOfShelfLevels: value,
        });
    };

    onChangePositionInput = value => {
        if (value === 4) {
            this.setState({
                numOfBooksPerLevel: value,
                bookcaseHeight: '165px',
                bookcaseWidth: '475px',
                bookstandMarginTop: '60px'
            });
        } else if (value === 5) {
            this.setState({
                numOfBooksPerLevel: value,
                bookcaseHeight: '200px',
                bookcaseWidth: '567px',
                bookstandMarginTop: '90px',
                bookstandMarginLeft: '3px',
            });
        } else {
            this.setState({
                numOfBooksPerLevel: value,
                bookcaseHeight: '120px',
                bookcaseWidth: '340px',
                bookstandMarginTop: '30px',
                bookstandMarginLeft: '5px',
            });
        }
    };
    handleFaultsIncrement = () => {
        localStorage.setItem('STORED_FAULTS_KEY', this.state.pageFaults + 1);
        this.setState((prevState) => ({
            pageFaults: prevState.pageFaults + 1,
        }))
    };

    hideConfig = () => {
        this.setState({
            configVisible: false,
        });
    };

    handleConfigVisibleChange = configVisible => {
        this.setState({ configVisible });
    };

    render() {
        const role = this.props.role;
        const { Option } = Select;

        return (
            <div className="main" >
                <Container fluid="xxl">
                    <Row>
                        <Col style={{ flexGrow: 1.2, marginLeft: 25 }}>
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
                        <Col style={{ flexGrow: 1.5 }}>
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
                                this.setState({ steps: [], pointer: 0 })
                            }}>Clear all Steps</Button>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={() => {
                                localStorage.setItem("STORED_BOOK_KEY", "[]");
                                localStorage.setItem("STORED_STEP_KEY", "[]");
                                localStorage.setItem("STORED_FAULTS_KEY", 0);
                                this.queryRef.current.state.value = "";
                                this.setState({
                                    books: [],
                                    steps: [],
                                    bouncingBooks: [],
                                    flyingBooks: [],
                                    pageFaults: 0,
                                    value: "",
                                    displayMoveBookDialog: 'none',
                                    displayToLibrarianDialog: 'none',
                                    displayNoticeDialog: 'none',
                                    displayRetriveSuccessDialog: 'none',
                                });
                            }}>Reset Library</Button>
                            <Button type="primary" onClick={this.handleClickShowSteps}>
                                {this.state.isToggleOn ? 'Hide Steps Info' : 'Show Steps Info'}
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 6, offset: 3 }}>
                            <Select placeholder="Select a step" style={{ width: 120 }} onChange={this.handleSelectChange}>
                                {this.state.steps.map((step) => (
                                    <Option key={this.state.steps.indexOf(step)} value={this.state.steps.indexOf(step) + 1}>{this.state.steps.indexOf(step) + 1}</Option>
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
                            <h5 className="computer-title"><strong>Catalog Computer</strong></h5>
                            <div className={(role === "Librarian") ? "wrapper" : ""}>
                                <div className={(role === "Librarian") ? "is-disabled" : ""}>
                                    <div className="search-monitor">
                                        <div className="search-container">
                                            <Row>
                                                Please Search for any Book
                                            </Row>
                                            <Row>
                                                <div className="form-inline mt-4 mb-4" >
                                                    <Input.Search
                                                        type="text"
                                                        placeholder="Find a Book"
                                                        ref={this.queryRef}
                                                        onClick={event => {
                                                            message.info("You can enter any book you want")
                                                        }}
                                                        enterButton="Search"
                                                        onSearch={this.onSearch}
                                                    />
                                                </div>
                                            </Row>
                                            <Row>
                                                <strong>Catalog Card</strong>
                                            </Row>
                                            <Row>
                                                <Catalog
                                                    query={this.state.value}
                                                    onHide={this.catalogClose}
                                                    show={this.state.catalogShow}
                                                    numOfBins={this.state.numOfBins}
                                                    handleRoleChange={this.props.handleRoleChange}
                                                />
                                            </Row>
                                            <Row>
                                                <div style={{ display: this.state.displayToLibrarianDialog }}>
                                                    <strong style={{ display: this.state.displayToLibrarianDialog }}>Sorry, the book is not available now. You need to wait for librarian to retrieve the book from storage.</strong>
                                                    <Button type="primary" onClick={this.handleToLibrarian}>Accept</Button>
                                                </div>
                                                <div style={{ display: this.state.displayNoticeDialog }}>
                                                    <strong style={{ display: this.state.displayNoticeDialog }}>The book is available! Please refer to the information on the catalog card, and retrieve the book by double clicking.</strong>
                                                </div>
                                                <div style={{ display: this.state.displayRetriveSuccessDialog }}>
                                                    <strong style={{ display: this.state.displayRetriveSuccessDialog }}>You have retrieved {this.state.value} successfully! Thank you so much!</strong>
                                                </div>
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                                <div className="pageFaults">
                                    <Card
                                        style={{
                                            width: 320,
                                            height: 115,
                                            marginTop: 25,
                                            textAlign: 'center',
                                            marginLeft: 20
                                        }}>
                                        <Statistic
                                            title="Page Faults"
                                            value={this.state.pageFaults}
                                            valueStyle={{ color: '#cf1322' }}
                                        />
                                    </Card>
                                </div>
                            </div>
                        </Col>
                        <DndProvider backend={HTML5Backend}>
                            <Col className="bookshelf-view" style={{ marginLeft: 40 }}>
                                <h5 className="computer-title">
                                    <strong>Bookshelf</strong>
                                    <Popover
                                        content={
                                            <div>
                                                <p><strong>Number of levels:</strong>  <InputNumber min={1} max={8} value={this.state.numOfShelfLevels} onChange={this.onChangeLevelInput} /> (Range: 1~8)</p>
                                                <p><strong>Number of positions per level:</strong> <InputNumber min={1} max={5} value={this.state.numOfBooksPerLevel} onChange={this.onChangePositionInput} /> (Range: 1~5)</p>
                                                <a onClick={this.hideConfig} className="closeButton">Close</a>
                                            </div>
                                        }
                                        placement="right"
                                        title="Bookshelf Control Panel"
                                        trigger="click"
                                        visible={this.state.configVisible}
                                        onVisibleChange={this.handleConfigVisibleChange}
                                    >
                                        <a className="configButton">Build Your Own</a>
                                    </Popover>
                                </h5>
                                <div>
                                    <Bookshelf
                                        numOfLevels={this.state.numOfShelfLevels}
                                        numOfBooksPerLevel={this.state.numOfBooksPerLevel}
                                        bookcaseHeight={this.state.bookcaseHeight}
                                        bookcaseWidth={this.state.bookcaseWidth}
                                        bookstandMarginTop={this.state.bookstandMarginTop}
                                        bookstandMarginLeft={this.state.bookstandMarginLeft}
                                        books={this.state.books}
                                        dragHandler={this.dragHandler}
                                        dbclick={this.dbclick()}
                                        animationShow={this.state.animationShow}
                                        bouncingBooks={this.state.bouncingBooks}
                                        flyingBooks={this.state.flyingBooks}
                                        bookshelfDim={this.state.bookshelfDim}
                                        updateBookshelfDim={this.updateBookshelfDim}
                                        showStepsInfo={this.state.isToggleOn}
                                        onAnimComplete={this.onAnimComplete.bind(this)}
                                    />
                                </div>
                            </Col>
                            <Col className="storage-view">
                                <Row>
                                    <div className="bubble bubble-bottom-left" style={{ display: (role === "Student" ? 'none' : this.state.displayMoveBookDialog) }}>
                                        <p>Your role is librarian now! Please move {this.state.value} from bin {this.state.targetBookBinNumber}  to bookshelf.</p>
                                    </div>
                                </Row>
                                <Row style={{ justifyContent: "center" }}>
                                    <div className={(role === "Student") ? "wrapper" : ""}>
                                        <div className={(role === "Student") ? "is-disabled" : ""}>
                                            <Storage
                                                books={this.state.books}
                                                numOfBins={this.state.numOfBins}
                                                dragHandler={this.dragHandler.bind(this)}
                                                animationShow={this.state.animationShow}
                                                bouncingBooks={this.state.bouncingBooks}
                                                flyingBooks={this.state.flyingBooks}
                                                storageDim={this.state.storageDim}
                                                updateStorageDim={this.updateStorageDim}
                                                showStepsInfo={this.state.isToggleOn}
                                                numOfLevels={this.state.numOfShelfLevels}
                                                numOfBooksPerLevel={this.state.numOfBooksPerLevel}
                                                onAnimComplete={this.onAnimComplete.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </Row>
                            </Col>
                        </DndProvider>
                        <Col style={{ display: this.state.displayStepInfos }}>
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
                                            <List.Item>
                                                <h5>Step {this.state.steps.indexOf(step) + 1}: </h5>
                                                {step.map(book => (
                                                    <p key={step.indexOf(book)}><strong>{book.name}</strong> {(book.location === 0 ? "storage: bin" + book.bin : "bookshelf: level" + book.level + "; position" + book.position)}</p>
                                                ))}
                                                <p><strong>Current page faults:</strong> {step[0].faults}</p>
                                            </List.Item>
                                        )} />
                                </InfiniteScroll>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div >
        );
    }
}

export default Main;