import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AppNavbar from "./components/AppNavbar";
import InputForm from "./components/InputForm";
import { Container } from "reactstrap";
import AppFooter from "./AppFooter";

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppNavbar />
        <Container>
          <InputForm />
        </Container>
        <AppFooter />
      </div>
    );
  }
}

export default App;
