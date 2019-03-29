import React, { Component } from "react";
import { locations } from "./Store";
import {
  Form,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem,
  FormText
} from "reactstrap";

const axios = require("axios");
class InputForm extends Component {
  // Component states
  state = {
    email: "",
    location: "",
    date: "",
    suggestions: [],
    dropdownOpen: false,
    isFormSubmitted: false
  };

  // LifeCycleMethods
  componentDidMount() {
    this.load();
  }

  // Controlling render functions
  load = () => {
    if (this.state.isFormSubmitted) return this.renderThankYou();
    else return this.renderForm();
  };

  // 1- renderForm
  renderForm = () => {
    const { email, location, date } = this.state;
    return (
      <Form onSubmit={this.formSubmitted}>
        <h2 className="text-center">Cleaning Service</h2>
        <h3 className="mb-10 text-center">
          Welcome To Kaodim, fill the Form and enjoy the Service
        </h3>
        {/*email input*/}
        <FormGroup>
          <Label className="font-weight-bold" for="exampleEmail">
            Email:
          </Label>
          <Input
            onChange={this.onChange}
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
          />
        </FormGroup>

        {/*date input*/}
        <FormGroup>
          <Label className="font-weight-bold" for="locationInput">
            Date:
          </Label>
          <Input
            type="date"
            className="input-group-field"
            onChange={this.onChange}
            name="date"
            value={date}
          />
        </FormGroup>

        {/*location input*/}
        <FormGroup>
          <Label className="font-weight-bold" for="locationInput">
            Location:{" "}
            <FormText color="muted">
              Enter a space to see all the available locaations.
            </FormText>
          </Label>
          <Input
            type="text"
            onChange={this.onLocationChange}
            // onDoubleClick={this.setState({ empty: !empty })}
            name="locationInput"
            value={location}
            placeholder="Start typing..."
          />
          {this.renderSuggestions()}
        </FormGroup>

        <button
          color="dark"
          onClick={this.formSubmitted}
          className="mt-4 btn-dark"
          type="submit"
        >
          Submit
        </button>
      </Form>
    );
  };

  // 2- renderSuggestions
  renderSuggestions() {
    const { suggestions } = this.state;
    if (suggestions.length === 0) return null;
    return (
      <ListGroup>
        {suggestions.map(place => (
          <ListGroupItem
            tag="li"
            action
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() =>
              // an arrow function that will set the value of a selected location
              // as well as hiding the rest of the locations
              this.setState(() => ({ location: place, suggestions: [] }))
            }
          >
            {place}
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }

  // 3- render a msg after the submission of the form
  renderThankYou = () => {
    return (
      <h3 className="text-info text-center">
        Thank you for choosing our service. <br /> Stay tuned for the other
        services.
      </h3>
    );
  };

  //Handling events
  // 1-handling the change of the email and date inputs
  onChange = e => {
    this.setState({ [e.target.name]: [e.target.value] });
  };

  // 2-handling the change of the location input
  onLocationChange = e => {
    // value of the location input
    const value = e.target.value;

    let suggestions = [];
    if (value.length > 0) {
      // Regular Expression is used to get the matching locations
      const regex = new RegExp(`^${value}`, "i");
      suggestions = locations.sort().filter(place => regex.test(place));
    }
    // enter space to show all the available locations
    if (value === " ") {
      suggestions = locations.sort();
    }
    this.setState({ suggestions, location: value });
  };

  // 3- handling the submission of the form
  formSubmitted = e => {
    e.preventDefault();

    this.setState({ isFormSubmitted: true });
    this.load();

    // TODO: send the data to the server using axios pkg
    axios
      .get("http://localhost:2098/jobrequest/add", {
        params: {
          email: `${this.state.email}`,
          date: `${this.state.date}`,
          location: `${this.state.location}`
        }
      })
      .then(function(response) {
        console.log("Form is Submitted");
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return <div>{this.load()}</div>;
  }
}

export default InputForm;
