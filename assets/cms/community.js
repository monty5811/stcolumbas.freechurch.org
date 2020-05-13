import React from "react";
import ActivitiesList from "./components/activities_list";

const CommunityPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    return (
      <div className="content">
        <div className="container">
          <div className="flex flex-col items-center justify-center w-full py-1 mb-16 font-semibold text-center text-white bg-gray-500 min-h-24">
            <h1 className="my-2 text-6xl">{entry.getIn(["data", "title"])}</h1>
          </div>
          <div className="">
            <div className="">
              {this.props
                .widgetsFor("bible_verse")
                .getIn(["widgets", "content"])}
            </div>
          </div>
          <div className="md:flex">
            <div className="flex-1 md:mr-8 content">
              {this.props.widgetsFor("intro").getIn(["widgets", "left"])}
            </div>
            <div className="flex-1 md:ml-8 content">
              {this.props.widgetsFor("intro").getIn(["widgets", "right"])}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="md:flex">
            <ActivitiesList
              acts={this.props.widgetsFor("communities")}
              groupInto={2}
            />
          </div>
        </div>
      </div>
    );
  }
});

export { CommunityPreview };
