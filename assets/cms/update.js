import React from "react";

const UpdatePreview = createClass({
  render: function() {
    const entry = this.props.entry;
    return (
      <div>
        <h2 className="mb-8 text-xl">{entry.getIn(["data", "title"])}</h2>
        <div className="container w-11/12 md:w-4/5 lg:w-3/5">
          <div className="mb-12 md:mb-16 lg:mb-20">
            <img src={entry.getIn(["data", "thumbnail"]).toString()} />
          </div>
        </div>
        <div className="container w-4/5 pb-32 content lg:w-2/5">
          <div className="markdown">{this.props.widgetFor("body")}</div>
        </div>
      </div>
    );
  }
});

export { UpdatePreview };
