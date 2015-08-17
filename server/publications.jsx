Meteor.publish("shopping-lists", function() {
  if (!this.userId) { return; }

  let email = Meteor.users.findOne(this.userId).emails[0].address;

  return ShoppingLists.find({email: email});
});

Meteor.publish("reserved-list-names", function() {
  if (!this.userId) { return; }

  let email = Meteor.users.findOne(this.userId).emails[0].address;

  return ReservedListNames.find({email: email});
});

Meteor.publish("reserved-item-names", function() {
  if (!this.userId) { return; }

  let email = Meteor.users.findOne(this.userId).emails[0].address;

  return ReservedItemNames.find({email: email});
});