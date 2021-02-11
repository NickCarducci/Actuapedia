import React from "react";
import firebase from ".././init-firebase";

class Open extends React.Component {
  state = { document: { message: "" } };
  componentDidUpdate = (prevProps) => {
    if (this.props.pathname !== prevProps.pathname) {
      var path = this.props.pathname.replace(/%20/g, " ").toLowerCase();
      path !== "/" &&
        firebase
          .firestore()
          .collection("topics")
          .doc(path)
          .onSnapshot((doc) => {
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              this.setState({ document: foo });
            }
          });
    }
  };
  render() {
    return (
      <div>
        {this.state.document.message
          .replace(/(\r\n|\r|\n)/g, "\n")
          .split("\n")
          .map((item, i) => (
            <span style={{ fontSize: "14px" }} key={i}>
              {item}
              <br />
            </span>
          ))}
      </div>
    );
  }
}

export default Open;
