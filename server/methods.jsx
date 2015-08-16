Meteor.methods({
  insertList: function(name) {
    if (!Meteor.user()) { return "Must be logged in"; }

    var email = Meteor.user().emails[0].address;
    var lists = ShoppingLists.find({ name: name }).fetch();

    var exists = R.any(x => x, R.map(list => {
      return R.contains(email, list.email);
    }, lists));

    if (exists) { return "List '" + name + "' already exists"; }

    lists = ReservedListNames.find({ name: name }).fetch();

    exists = false;
    R.map(list => {
      if (R.contains(email, list.email)) { exists = true; }
    }, lists);

    if (exists) { return "List '" + name + "' reserved"; }

    ShoppingLists.insert({
      email: [email],
      name: name,
      items: [],
      createdAt: new Date()
    });
  },

  renameList: function(name, list) {
    let current = ShoppingLists.findOne({_id: list._id});

    if (!Meteor.user()) {
      return {
        error: "Must be logged in",
        path: current.name
      };
    }

    if (!name) {
      return {
        error: "List name cannot be blank",
        path: current.name
      };
    }

    if (name == current.name) {
      return {
        path: current.name
      };
    }

    let email = Meteor.user().emails[0].address;
    let lists = ShoppingLists.find({ name: name }).fetch();

    let exists = R.any(
      x => x,
      R.map(l => R.contains(email, l.email), lists)
    );

    if (exists) {
      return {
        error: "List '" + name + "' already exists",
        path: current.name
      };
    }

    ShoppingLists.update(list._id, {
      $set: {name: name}
    });

    return {
      path: name
    };
  },

  removeList: function(list) {
    if (!Meteor.user()) { return { error: "Must be logged in" }; }

    var email = Meteor.user().emails[0].address;

    if (R.contains(email, list.email)) {
      ShoppingLists.remove(list._id);
    }

    return { list };
  },

  undoRemoveList: function(list) {
    ShoppingLists.insert({
      email: list.email,
      name: list.name,
      items: list.items,
      createdAt: list.createdAt
    });
  },

  insertEmail: function(list, email) {
    if (!Meteor.user()) { return; }

    if (Validate.email(email)) { return; }

    let current = ShoppingLists.findOne({_id: list._id});

    let exists = R.contains(email, current.email);

    if (exists) { return; }

    let users = Meteor.users.find().fetch();

    exists = R.filter(
      user => user.emails[0].address == email,
      users
    );

    if (exists.length === 0) { return; }

    exists = ShoppingLists.find({
      email: email
    }).fetch();

    exists = R.filter(l => l.name == list.name, exists);

    if (exists.length > 0) { return; }

    ShoppingLists.update(list._id, {
      $push: {
        email: email
      }
    });
  },

  removeEmail: function(list, email) {
    if (!Meteor.user()) { return; }

    ShoppingLists.update(list._id, {
      $pull: {
        email: email
      }
    });

    let exists = ShoppingLists.findOne({_id: list._id});
    let currentEmail = Meteor.user().emails[0].address;

    if (!R.contains(currentEmail, exists.email)) {
      return "redirect";
    }

    if (exists.email.length > 0) { return; }

    ShoppingLists.remove(list._id);

    return "redirect";
  },

  insertItem: function(list, name) {
    if (!Meteor.user()) { return "Must be logged in"; }

    const length = R.filter(item => { return item.name == name }, list.items).length;

    if (length > 0) { return "Item '" + name + "' already exists"; }

    ShoppingLists.update(list._id, {
      $push: {
        items: {
          name: name,
          checked: false,
          quantity: 1,
          store: "",
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
  },

  changeItemQuantity: function(list, item, quantity) {
    if (!Meteor.user()) { return; }

    let items = R.map(i => {
      if (i.name == item.name) {
        i.quantity += quantity;

        if (i.quantity < 1) { i.quantity = 1; }
      }

      return i;
    }, list.items);

    ShoppingLists.update(list._id, {
      $set: { items: items }
    });
  },

  insertReservedList: function(list) {
    if (!Meteor.user()) { return; }

    ReservedListNames.insert({
      name: list.name,
      email: list.email
    });
  },

  removeReservedList: function(list) {
    if (!Meteor.user()) { return; }

    let id = ReservedListNames.findOne({
      name: list.name,
      email: list.email
    })._id;

    ReservedListNames.remove(id);
  }
});