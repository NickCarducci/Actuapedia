import React from "react";

class TickerTape extends React.Component {
  render() {
    return (
      <div className="ticker-tape">
        <div
          style={{
            margin: "auto 10px",
            position: "absolute",
            color: "white"
          }}
        >
          Latest Stories:
        </div>

        <div className="ticker-tape-collection">
          {[
            "science",
            "linguistics",
            "history",
            "law",
            "statistics",
            "economics",
            "logic",
            "investigations",
            "anthropology",
            "theology"
          ].map((x) => (
            <div
              key={x}
              style={{
                margin: "0px 10px",
                height: "100%",
                display: "flex",
                alignItems: "center"
              }}
            >
              {x}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default TickerTape;
