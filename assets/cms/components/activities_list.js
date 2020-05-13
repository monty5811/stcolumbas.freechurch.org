import React from 'react';
import ActivityContact from './activity_contact';

const ActivitiesList = ({ acts, groupInto }) => {
  return acts.getIn(['data', 'activities']).map(function(activity, idx) {
    return (
      <div
        className="flex flex-col justify-between px-8 mb-16 lg:flex-1"
        key={idx}
      >
        <img src={activity.getIn(['picture']).toString()} />
        <h3 className="text-md">{activity.getIn(['name'])}</h3>
        <p>{activity.getIn(['content'])}</p>
        <ActivityContact contact={activity.getIn(['contact'])} />
      </div>
    );
  });
};

export default ActivitiesList;
