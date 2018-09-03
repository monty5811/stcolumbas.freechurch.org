import React from 'react';

const OurVisionPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    return (
      <div className="content">
        <div className="container">
          <h1>{entry.getIn(['data', 'title'])}</h1>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              {this.props.widgetsFor('row1').getIn(['widgets', 'left'])}
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              {this.props.widgetsFor('row1').getIn(['widgets', 'right'])}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="line" />
              <h4 style={{ textAlign: 'center' }} />
              <h2 style={{ textAlign: 'center' }}>
                {entry.getIn(['data', 'tagline', 'content'])}
              </h2>
              <div class="line" />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              {this.props.widgetsFor('row2').getIn(['widgets', 'left'])}
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              {this.props.widgetsFor('row2').getIn(['widgets', 'right'])}
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export { OurVisionPreview };
