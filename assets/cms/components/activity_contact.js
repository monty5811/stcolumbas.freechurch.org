import React from 'react';

const ActivityContact = ({ contact }) => {
  return (
    <div class="">
      <a html="#">
        <div class="">
          <div class="">
            <img
              className="media-object img-circle"
              src={contact.getIn(['picture']).toString()}
            />
          </div>
          <div class="">
            <p>Contact</p>
            <h3 class="">{contact.getIn(['name'])}</h3>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ActivityContact;
