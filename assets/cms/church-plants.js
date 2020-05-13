import React from "react";

const ChurchPlantsPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const rows = this.props
      .widgetsFor("church_plants")
      .map(function(plant, index) {
        return (
          <div className="container mb-8" key={index}>
            <div className="md:flex">
              <div className="flex-1 md:mr-8 content">
                {plant.getIn(["widgets", "left"])}
              </div>
              <div className="flex-1 md:ml-8 content">
                {plant.getIn(["widgets", "right"])}
              </div>
            </div>
          </div>
        );
      });

    return (
      <div className="content">
        <div className="container mb-8">
          <div className="flex flex-col items-center justify-center w-full py-1 mb-16 font-semibold text-center text-white bg-gray-500 min-h-24">
            <h1 className="my-2 text-6xl">{entry.getIn(["data", "title"])}</h1>
          </div>
          <div className="md:flex">
            <div className="flex-1 md:mr-8 content">
              {this.props.widgetsFor("intro").getIn(["widgets", "left"])}
            </div>
            <div className="flex-1 md:ml-8 content">
              {this.props.widgetsFor("intro").getIn(["widgets", "right"])}
            </div>
          </div>
          {rows}
        </div>
      </div>
    );
  }
});

export { ChurchPlantsPreview };
