Meteor.methods({
  insertList: function(name) {
    if (!Meteor.user()) {
      return {
        error: "Must be logged in"
      };
    }

    var email = Meteor.user().emails[0].address;
    var lists = ShoppingLists.find({ name: name }).fetch();

    var exists = R.any(x => x, R.map(list => {
      return R.contains(email, list.email);
    }, lists));

    if (exists) {
      return {
        error: "List '" + name + "' already exists"
      };
    }

    lists = ReservedListNames.find({ name: name }).fetch();

    exists = false;
    R.map(list => {
      if (R.contains(email, list.email)) { exists = true; }
    }, lists);

    if (exists) {
      return {
        error: "List '" + name + "' reserved"
      };
    }

    ShoppingLists.insert({
      email: [email],
      name: name,
      items: [],
      createdAt: new Date()
    });

    return {
      success: "List '" + name + "' created"
    }
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

    lists = ReservedListNames.find({ name: name }).fetch();

    exists = false;
    R.map(l => {
      if (R.contains(email, l.email)) { exists = true; }
    }, lists);

    if (exists) {
      return {
        error: "List '" + name + "' reserved",
        path: current.name
      };
    }

    ShoppingLists.update(list._id, {
      $set: {name: name}
    });

    return {
      success: "List '" + current.name + "' renamed to '" + name + "'",
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
    if (!Meteor.user()) { return { error: "Must be logged in" }; }

    let validation = Validate.email(email);
    if (validation) { return { error: validation }; }

    let current = ShoppingLists.findOne({_id: list._id});

    let exists = R.contains(email, current.email);

    if (exists) { return { error: email + " already exists" }; }

    let users = Meteor.users.find().fetch();

    exists = R.filter(
      user => user.emails[0].address == email,
      users
    );

    if (exists.length === 0) { return { error: email + " does not exist" }; }

    exists = ShoppingLists.find({
      email: email
    }).fetch();

    exists = R.filter(l => l.name == list.name, exists);

    if (exists.length > 0) { return { error: email + " already has list '" + list.name + "'" }; }

    ShoppingLists.update(list._id, {
      $push: {
        email: email
      }
    });

    return { success: "Shared '" + list.name + "' with " + email };
  },

  removeEmail: function(list, email) {
    if (!Meteor.user()) { return { error: "Must be logged in" }; }

    ShoppingLists.update(list._id, {
      $pull: {
        email: email
      }
    });

    let exists = ShoppingLists.findOne({_id: list._id});
    let currentEmail = Meteor.user().emails[0].address;

    if (!R.contains(currentEmail, exists.email)) {
      return {
        success: "Removed " + email + " from '" + list.name + "'",
        redirect: true
      };
    }

    if (exists.email.length > 0) {
      return {
        success: "Removed " + email + " from '" + list.name + "'"
      };
    }

    ShoppingLists.remove(list._id);

    return {
      success: "Removed " + email + " from '" + list.name + "'",
      redirect: true
    };
  },

  insertItem: function(list, name) {
    if (!Meteor.user()) {
      return {
        error: "Must be logged in"
      };
    }

    const length = R.filter(item => { return item.name == name }, list.items).length;

    if (length > 0) {
      return {
        error: "Item '" + name + "' already exists"
      };
    }

    let exists = ReservedItemNames.findOne({
      listName: list.name,
      itemName: name,
      email: Meteor.user().emails[0].address
    });

    if (exists) {
      return {
        error: "Item '" + name + "' reserved"
      };
    }

    ShoppingLists.update(list._id, {
      $push: {
        items: {
          name: name,
          checked: false,
          quantity: 1,
          createdAt: new Date()
        }
      }
    });

    return {
      success: "Item '" + name + "' created"
    }
  },

  removeItem: function(list, item) {
    if (!Meteor.user()) {
      return {
        error: "Must be logged in"
      };
    }

    ShoppingLists.update(list._id, {
      $pull: { items: item }
    });

    return {
      success: {
        list,
        item
      }
    };
  },

  undoRemoveItem: function(success) {
    let list = success.list;
    let item = success.item;

    ShoppingLists.update(list._id, {
      $push: {
        items: {
          name: item.name,
          checked: item.checked,
          quantity: item.quantity,
          createdAt: item.createdAt
        }
      }
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
    if (!Meteor.user()) {
      return {
        error: "Must be logged in",
        path: item.name
      };
    }

    const existing = R.filter(i => {
      return i.name == name;
    }, list.items);

    if (item.name == name) { return { path: item.name }; }

    if (existing && existing.length > 0) {
      return {
        error: "Item '" + name + "' already exists",
        path: item.name
      };
    }

    if (!name) {
      return {
        error: "Name cannot be blank",
        path: item.name
      };
    }

    let exists = ReservedItemNames.findOne({
      listName: list.name,
      itemName: name,
      email: Meteor.user().emails[0].address
    });

    if (exists) {
      return {
        error: "Item '" + name + "' reserved",
        path: item.name
      };
    }

    var items = R.map(function(i) {
      if (i.name == item.name) {
        i.name = name;
      }

      return i;
    }, list.items);

    ShoppingLists.update(list._id, {
      $set: { items: items }
    });

    return {
      success: "Item '" + item.name + "' renamed to '" + name + "'",
      path: name
    };
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
  },

  insertReservedItem: function(success) {
    if (!Meteor.user()) { return; }

    let list = success.list;
    let item = success.item;

    ReservedItemNames.insert({
      listName: list.name,
      itemName: item.name,
      email: list.email
    });
  },

  removeReservedItem: function(success) {
    if (!Meteor.user()) { return; }

    let list = success.list;
    let item = success.item;

    let id = ReservedItemNames.findOne({
      listName: list.name,
      itemName: item.name,
      email: list.email
    })._id;

    ReservedItemNames.remove(id);
  }
});