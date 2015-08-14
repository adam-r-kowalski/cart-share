Meteor.publish("shopping-lists", function() {
  if (!this.userId) { return; }

  let email = Meteor.users.findOne(this.userId).emails[0].address;

  return ShoppingLists.find({email: email});
});