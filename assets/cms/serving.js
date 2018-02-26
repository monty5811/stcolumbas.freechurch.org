import React from 'react';

const ServingPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    return <div className="content">
      <h1>{ entry.getIn(['data', 'title']) }</h1>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            { entry.getIn(['data', 'intro', 'left']) }
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            { entry.getIn(['data', 'intro', 'right']) }
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            { entry.getIn(['data', 'heading', 'left']) }
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            { entry.getIn(['data', 'heading', 'right']) }
          </div>
        </div>
      </div>
      { activities }
    </div>;
  }
});

export { ServingPreview };
