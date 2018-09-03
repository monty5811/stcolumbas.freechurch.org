import React from 'react';
import ActivityContact from './activity_contact';

const ActivitiesList = ({ acts, groupInto }) => {
  return acts.getIn(['data', 'activities']).map(function(activity, idx) {
    return (
      <div
        className={`col-xs-12 col-sm-${12 / groupInto} col-md-${12 /
          groupInto} col-lg-${12 / groupInto}`}
        key={idx}
      >
        <img src={activity.getIn(['picture']).toString()} />
        <h3>{activity.getIn(['name'])}</h3>
        <p>{activity.getIn(['content'])}</p>
        <ActivityContact contact={activity.getIn(['contact'])} />
      </div>
    );
  });
};

export default ActivitiesList;
