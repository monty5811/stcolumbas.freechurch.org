import React from 'react';
import ActivitiesList from './components/activities_list';

const ServingPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    return (
      <div className="content">
        <div className="container">
          <h1>{entry.getIn(['data', 'title'])}</h1>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              {entry.getIn(['data', 'intro', 'left'])}
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              {entry.getIn(['data', 'intro', 'right'])}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              {this.props.widgetsFor('heading').getIn(['widgets', 'left'])}
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              {this.props.widgetsFor('heading').getIn(['widgets', 'right'])}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <ActivitiesList
              acts={this.props.widgetsFor('serving_areas')}
              groupInto={3}
            />
          </div>
        </div>
      </div>
    );
  },
});

export { ServingPreview };
