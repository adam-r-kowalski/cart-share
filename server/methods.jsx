Meteor.methods({
  insertList: function(name) {
    if (!Meteor.user()) { return; }

    var email = Meteor.user().emails[0].address;
    var lists = ShoppingLists.find({ name: name }).fetch();

    var exists = R.any(x => x, R.map(list => {
      return R.contains(email, list.email);
    }, lists));

    if (exists) { return; }

    ShoppingLists.insert({
      email: [email],
      name: name,
      items: [],
      createdAt: new Date()
    });
  },

  renameList: function(name, list) {
    var current = ShoppingLists.findOne({_id: list._id});

    if (!Meteor.user()) { return current.name; }
    if (!name) { return current.name; }

    ShoppingLists.update(list._id, {
      $set: {name: name}
    });

    return name;
  },

  removeList: function(list) {
    if (!Meteor.user()) { return; }

    var email = Meteor.user().emails[0].address;

    if (R.contains(email, list.email)) {
      ShoppingLists.remove(list._id);
    }
  },

  insertItem: function(list, name) {
    if (!Meteor.user()) { return; }

    const length = R.filter(item => { return item.name == name }, list.items).length

    if (length > 0) { return; }

    ShoppingLists.update(list._id, {
      $push: {
        items: {
          name: name,
          checked: false,
          createdAt: new Date()
        }
      }
    });
  },

  removeItem: function(list, item) {
    if (!Meteor.user()) { return; }

    console.log(list, item);

    ShoppingLists.update(list._id, {
      $pull: { items: item }
    });
  },

  toggleItemChecked: function(list, obj) {
    if (!Meteor.user()) { return; }

    var items = R.map(function(item) {
      if (item.name == obj.item.name) {
        item.checked = !item.checked;
      }

      return item;
    }, list.items);

    ShoppingLists.update(list._id, {
      $set: { items: items }
    });
  },

  renameItem: function(list, item, name) {
    if (!Meteor.user()) { return item.name; }

    const existing = R.filter(i => {
      return i.name == name;
    }, list.items);

    if (!existing) { return item.name; }
    if (existing.length > 0) { return item.name; }
    if (!name) { return item.name; }

    var items = R.map(function(i) {
      if (i.name == item.name) {
        i.name = name;
      }

      return i;
    }, list.items);

    ShoppingLists.update(list._id, {
      $set: { items: items }
    });

    return name;
  }
});