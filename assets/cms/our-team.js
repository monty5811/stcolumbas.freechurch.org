var OurTeamPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var heading = entry.getIn(['data', 'heading', 'left']);
    return h('div', {'className': 'content'},
      h('h1', {}, this.props.widgetFor('heading')),
      h('div', {'className': 'container'},
        h('div', {'className': 'row'},
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'intro', 'left'])),
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'intro', 'right'])),
        ),
        this.props.widgetsFor('teams').map(function(team, index) {
          return h('div', {},
            h('div', {className: 'container'},
              h('div', {className: 'row'},
                h('div', {className: 'col-xs-12 col-sm-6 col-md-6 col-lg-6'},
                  h('h2', {className: 'heading'}, team.getIn(['data', 'title']))
                ),
              ),
              h('div', {className: 'our-staff'},
                h('div', {className: 'container'},
                  h('div', {className: 'row'},
                    team.getIn(['data', 'members']).map(function(member) {
                      return h('div', {className: 'col-xs-6 col-sm-4 col-md-3 col-lg-2'},
                        h('div', {className: 'thumbnail'}, h('img', {src: member.get('picture')})),
                        h('div', {className: 'caption'},
                          h('h3', {}, member.get('name')),
                          h('p', {}, member.get('title')),
                        ),
                      );
                    })
                  )
                )
              )
            )
          );
        }),
      )
    );
  }
});

export { OurTeamPreview };
