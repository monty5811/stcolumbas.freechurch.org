import React from "react";

const OurVisionPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    return (
      <div className="content">
        <div className="container">
          <div className="flex flex-col items-center justify-center w-full py-1 mb-16 font-semibold text-center text-white bg-gray-500 min-h-24">
            <h1 className="my-2 text-6xl">{entry.getIn(["data", "title"])}</h1>
          </div>
          <div className="md:flex">
            <div className="flex-1 md:mr-8 content">
              {this.props.widgetsFor("row1").getIn(["widgets", "left"])}
            </div>
            <div className="flex-1 md:ml-8 content">
              {this.props.widgetsFor("row1").getIn(["widgets", "right"])}
            </div>
          </div>
          <div className="md:flex">
            <div className="">
              <div class="" />
              <h4 style={{ textAlign: "center" }} />
              <h2 style={{ textAlign: "center" }}>
                {entry.getIn(["data", "tagline", "content"])}
              </h2>
              <div class="" />
            </div>
          </div>
          <div className="md:flex">
            <div className="flex-1 md:mr-8 content">
              {this.props.widgetsFor("row2").getIn(["widgets", "left"])}
            </div>
            <div className="flex-1 md:ml-8 content">
              {this.props.widgetsFor("row2").getIn(["widgets", "right"])}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export { OurVisionPreview };
