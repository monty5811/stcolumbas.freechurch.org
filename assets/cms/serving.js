var ServingPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    return h('div', {'className': 'content'},
      h('h1', {}, entry.getIn(['data', 'title'])),
      h('div', {'className': 'container'},
        h('div', {'className': 'row'},
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'intro', 'left'])),
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'intro', 'right'])),
        ),
        h('div', {'className': 'row'},
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'heading', 'left'])),
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'heading', 'right'])),
        ),
      )
    );
  }
});

export { ServingPreview };
