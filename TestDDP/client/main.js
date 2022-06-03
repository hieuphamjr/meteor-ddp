import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Missions } from '../imports/db/Collections';

import './main.html';

Meteor.subscribe('missions');

const HIDE_COMPLETED_STRING = 'hideCompleted';

Template.mainContainer.onCreated(function mainContainerOnCreated() {
    this.state = new ReactiveDict();
});

Template.mainContainer.helpers({
    missions() {
        const instance = Template.instance();
        const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

        const hideCompletedFilter = { isChecked: { $ne: true } };

        return Missions.find(hideCompleted ? hideCompletedFilter : {}, {
            sort: { createdAt: -1 },
        }).fetch();
    },
    hideCompleted() {
        return Template.instance().state.get(HIDE_COMPLETED_STRING);
    },
});

Template.mainContainer.events({
    'click #hide-completed-button' (event, instance) {
        const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
        instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
    },
});

Template.form.events({
    "submit .mission-form" (event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const title = target.title.value;

        // Insert a task into the collection
        Meteor.call('addMission', title);

        // Clear form
        target.title.value = '';
    }
})
Template.mission.helpers({
    'isOwner' () {
        return this.owner === Meteor.userId();
    }
})
Template.mission.events({
    'click .toggle-checked' () {
        // Set the checked property to the opposite of its current value
        Meteor.call('checkDoneMission', this._id, !this.isChecked);
    },
    'click .delete' () {
        Meteor.call('removeMission', this._id);
    },
    'click .toggle-private' () {
        Meteor.call('setPrivate', this._id, !this.isPrivate);
    },
});

// Accounts.ui.config({
//     passwordSignupFields: "USERNAME_ONLY"
// })