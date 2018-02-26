import React from 'react';

function members(team) {
  return team.getIn(['data', 'members']).map(function(member, idx) {
    return <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2" key={idx}>
      <div className="thumbnail"><img src={member.get('picture')}/></div>
      <div className="caption">
        <h3>{ member.get('name') }</h3>
        <p>{ member.get('title') }</p>
      </div>
    </div>;
  });
}

const OurTeamPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const heading = entry.getIn(['data', 'heading', 'left']);
    const rows = this.props.widgetsFor('teams').map(function(team, index) {
      return <div className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <h2 className="heading">{ team.getIn(['data', 'title']) }</h2>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          </div>
        </div>
        <div className="our-staff">
          <div className="container">
            <div className="row">
              { members(team) }
            </div>
          </div>
        </div>
      </div>;
    });

    return <div className="content">
      <h1>{ heading }</h1>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            { entry.getIn(['data', 'intro', 'left']) }
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            { entry.getIn(['data', 'intro', 'right']) }
          </div>
        </div>
        { rows }
      </div>
    </div>;
  }
});

export { OurTeamPreview };
