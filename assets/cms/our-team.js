import React from "react";

function members(team) {
  return team.getIn(["data", "members"]).map(function(member, idx) {
    return (
      <div className="w-1/2 px-4 md:w-1/3 lg:w-1/6" key={idx}>
        <div className="mb-4">
          <img src={member.get("picture")} />
        </div>
        <div className="mb-8 leading-tight">
          <h3 className="pb-0 mb-0 font-medium">{member.get("name")}</h3>
          <p className="pb-0 mb-0 text-gray-400">{member.get("title")}</p>
        </div>
      </div>
    );
  });
}

const OurTeamPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const rows = this.props.widgetsFor("teams").map(function(team, index) {
      return (
        <div className="container">
          <div className="md:flex">
            <div className="flex-1 md:mr-8 content">
              <h2 className="heading">{team.getIn(["data", "title"])}</h2>
            </div>
            <div className="flex-1 md:mr-8 content" />
          </div>
          <div className="our-staff">
            <div className="container">
              <div className="flex flex-wrap">{members(team)}</div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="content">
        <div className="container">
          <div className="md:flex">
            <div className="flex-1 md:mr-8 content">
              {this.props.widgetsFor("heading").getIn(["widgets", "left"])}
            </div>
            <div className="flex-1 md:ml-8 content">
              {this.props.widgetsFor("heading").getIn(["widgets", "right"])}
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
          {rows}
        </div>
      </div>
    );
  }
});

export { OurTeamPreview };
