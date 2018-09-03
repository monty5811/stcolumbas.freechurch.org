import React from 'react';

const ActivityContact = ({ contact }) => {
  return (
    <div class="team-contact">
      <a html="#">
        <div class="media">
          <div class="media-left media-middle">
            <img
              className="media-object img-circle"
              src={contact.getIn(['picture']).toString()}
            />
          </div>
          <div class="media-body">
            <p>Contact</p>
            <h3 class="media-heading">{contact.getIn(['name'])}</h3>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ActivityContact;
