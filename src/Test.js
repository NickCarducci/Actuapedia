import React from "react";

class Test extends React.Component {
  componentDidUpdate = (prevProps) => {
    if (this.props.width !== prevProps.width) {
      this.props.setHeight({ testWidth: this.test.current.offsetWidth });
    }
  };
  render() {
    const { set, topics } = this.props;
    return (
      <div
        style={{
          opacity: "0",
          zIndex: "-9999",
          position: "fixed",
          overflow: "hidden",
          width: "100%",
          height: set,
          flexWrap: "wrap",
          margin: "0px 20px",
          display: "flex"
        }}
      >
        <div
          ref={this.test}
          style={{
            position: "absolute",
            width: "max-content",
            height: "100%",
            flexWrap: "wrap",
            margin: "0px 20px",
            display: "flex"
          }}
        >
          {topics.map((x) => (
            <div
              style={{
                height: "min-content",
                flexDirection: "column",
                width: "max-content",
                padding: "10px",
                border: "1px solid",
                margin: "10px",
                display: "flex",
                alignItems: "flex-start"
              }}
              key={x.title}
            >
              {x.title}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%"
                }}
              >
                <div style={{ fontSize: "10px" }}>{x.user.toLowerCase()}</div>
                <div style={{ fontSize: "10px", color: "blue" }}>
                  {x.topic.toLowerCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default Test;
