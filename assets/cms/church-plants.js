import React from 'react';

function members(team) {
  return team.getIn(['data', 'members']).map(function(member, idx) {
    return (
      <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2" key={idx}>
        <div className="thumbnail">
          <img src={member.get('picture')} />
        </div>
        <div className="caption">
          <h3>{member.get('name')}</h3>
          <p>{member.get('title')}</p>
        </div>
      </div>
    );
  });
}

const ChurchPlantsPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const rows = this.props
      .widgetsFor('church_plants')
      .map(function(plant, index) {
        return (
          <div className="container" key={index}>
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                {plant.getIn(['widgets', 'left'])}
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                {plant.getIn(['widgets', 'right'])}
              </div>
            </div>
          </div>
        );
      });

    return (
      <div className="content">
        <div className="container">
          <h1>{entry.getIn(['data', 'title'])}</h1>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              {this.props.widgetsFor('intro').getIn(['widgets', 'left'])}
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              {this.props.widgetsFor('intro').getIn(['widgets', 'right'])}
            </div>
          </div>
          {rows}
        </div>
      </div>
    );
  },
});

export { ChurchPlantsPreview };
