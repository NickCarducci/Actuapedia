import React from "react";
import firebase from ".././init-firebase";

class New extends React.Component {
  state = { message: "", body: "" };
  render() {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (this.props.auth !== undefined) {
            firebase
              .firestore()
              .collection("topics")
              .doc(this.state.message)
              .add({});
          } else {
            var answer = window.confirm("login?");
            if (answer) this.props.history.push("/login");
          }
        }}
        style={{
          zIndex: "9999",
          width: "100%",
          height: "100%",
          display: "flex",
          position: "fixed",
          backgroundColor: "white",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          <input
            style={{
              textIndent: "4px",
              display: "flex",
              width: "calc(100% - 56px)",
              height: "36px"
            }}
            value={this.state.message}
            placeholder="2-5 words, hyphens ok, ',' get another"
            onChange={(e) => {
              var message = e.target.value.toLowerCase();
              var arr = message.split(" ");

              if (
                message === "" ||
                (arr.length < 6 &&
                  !message.includes("  ") &&
                  !message.includes("--") &&
                  !message.includes("- ") &&
                  !message.includes(" -") &&
                  !message.match(/[^a-zA-Z\s-]/) &&
                  !message.startsWith(" ") &&
                  !message.startsWith("-"))
              ) {
                var found = arr.find((a) => {
                  var f = a.split("-");
                  return f && f.length > 2;
                });
                !found && this.setState({ message });
              }
            }}
          />
          <div
            onClick={() => {
              if (this.state.message !== "" || this.state.body !== "") {
                var answer = window.confirm("remove progress?");
                if (answer) {
                  this.setState({ body: "", message: "" });
                  this.props.history.push("/");
                }
              } else {
                this.props.history.push("/");
              }
            }}
            value={this.state.body}
            style={{
              display: "flex",
              width: "56px",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "7px",
                height: "15px",
                width: "15px",
                borderRight: "4px solid rgb(20,20,25)",
                borderBottom: "4px solid rgb(20,20,25)",
                transform: "rotate(45deg)"
              }}
            />
          </div>
        </div>
        <textarea
          placeholder="really go for it"
          value={this.state.body}
          onChange={(e) => {
            if (this.props.auth !== undefined) {
              var body = e.target.value;
              this.setState({ body });
            } else {
              var answer = window.confirm("login?");
              if (answer) {
                this.props.history.push("/login");
              }
            }
          }}
          style={{
            width: "100%",
            height: "200px"
          }}
        />
        <span style={{ display: "inline-block" }}>
          {this.state.body.replace(/(\r\n|\r|\n)/g, <br />)}
        </span>
      </form>
    );
  }
}
export default New;
