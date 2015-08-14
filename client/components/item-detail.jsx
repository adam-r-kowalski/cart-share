ItemDetail = Radium(React.createClass({
  displayName: "ItemDetail",

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      lists: ShoppingLists.find().fetch()
    };
  },

  remove(list, item) {
    Meteor.call("removeItem", list, item, (err) => {
      FlowRouter.go("/list/" + list.name);
    });
  },

  rename(list, item, newName) {
    Meteor.call("renameItem", list, item, newName, (err, result) => {
      FlowRouter.go("/list/" + list.name + "/" + result);
    })
  },

  getList() {
    return R ?
      R.find(
        R.propEq(
          "name",
          this.props.params.listName
        ), this.data.lists
      ) :
      null;
  },

  getItem(list) {
    let tempItem = {
      name: "Title",
      checked: false,
      createdAt: new Date()
    };

    if (!list) { return tempItem; }
    if (!R) { return tempItem; }

    let filtered = R.filter(item => {
      return item.name == this.props.params.itemName;
    }, list.items);

    return filtered[0];
  },

  render() {
    let list = this.getList();
    let item = this.getItem(list);

    return (
      <div>
        <DetailHeader
          list={list}
          backgroundColor="#1abc9c"
          backPath={"/list/" + list.name}
          title={item.name}
          remove={() => this.remove(list, item)}
          rename={(newName) => this.rename(list, item, newName)}
        />
        Hello World
      </div>
    );
  }
}));