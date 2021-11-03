import React, { Component } from "react";
import Editor from "./Editor";
import "antd/dist/antd.css";
import "./App.css";
import './i18n';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Editor />
      </div>
    );
  }
}
export default App;
