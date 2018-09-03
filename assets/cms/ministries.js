import React from 'react';
import ActivitiesList from './components/activities_list';

const MinistriesPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    return (
      <div className="content">
        <div className="container">
          <h1>{entry.getIn(['data', 'title'])}</h1>
          <div className="row">
            <ActivitiesList
              acts={this.props.widgetsFor('ministries')}
              groupInto={2}
            />
          </div>
        </div>
      </div>
    );
  },
});

export { MinistriesPreview };
