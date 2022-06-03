import { Meteor } from 'meteor/meteor';
import { Missions } from '../imports/db/Collections';

const insertMission = missionTitle => Missions.insert({ title: missionTitle });

Meteor.startup(() => {

});
Meteor.publish("missions", function() {
    return Missions.find({
        $or: [
            { isPrivate: { $ne: true } },
            { owner: this.userId }
        ]
    });
});
Meteor.methods({
    'addMission' (title) {
        Missions.insert({
            title,
            createdAt: new Date(),
            owner: Meteor.userId(),
        });
    },

    'removeMission' (id) {
        var mis = Missions.findOne(id);
        if (mis.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorize')
        }
        Missions.remove(id);
    },

    'checkDoneMission' (id, check) {
        var mis = Missions.findOne(id);
        if (mis.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorize')
        }
        Missions.update(id, {
            $set: { isChecked: check },
        });
    },

    'setPrivate' (id, isPrivate) {
        var mis = Missions.findOne(id);
        if (mis.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorize')
        }
        Missions.update(id, { $set: { isPrivate: isPrivate } })
    },


});