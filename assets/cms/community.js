import React from 'react';
import ActivitiesList from './components/activities_list';

const CommunityPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    return <div className="content">
      <div className="container">
        <h1>{ entry.getIn(['data', 'title']) }</h1>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              { this.props.widgetsFor('bible_verse').getIn(['widgets', 'content']) }
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              { this.props.widgetsFor('intro').getIn(['widgets', 'left']) }
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              { this.props.widgetsFor('intro').getIn(['widgets', 'right']) }
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <ActivitiesList acts={this.props.widgetsFor('communities')} groupInto={2} />
          </div>
        </div>
    </div>;
  }
});

export { CommunityPreview };
