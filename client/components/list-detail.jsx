const styles = {
  cartList: {
    width: "100%",
    maxWidth: 1000,
    marginTop: 1,
    display: "flex",
    flexDirection: "column"
  },

  input: {
    padding: 10,
    fontSize: 24,
    borderRadius: 0
  }
};

ListDetail = Radium(React.createClass({
  displayName: "ListDetail",

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      lists: ShoppingLists.find().fetch()
    };
  },

  getInitialState() {
    return {
      newItemName: ""
    };
  },

  showItem(obj) {
    return <ItemRow
      key={obj.index}
      list={this.getList()}
      obj={obj}
    />;
  },

  showItems() {
    let list = this.getList() || { items: [] };

    let items = R.sortBy(R.prop("name"), list.items);

    const f = (item, index) => {
      return {
        item,
        index,
        max: items.length > 0 ? items.length - 1 : 0
      };
    };

    return R ? R.map(
      this.showItem,
      R.zipWith(
        f,
        items,
        R.range(0, items.length)
      )
    ) : null;
  },

  addItem() {
    if (!this.state.newItemName) { return; }

    Meteor.call("insertItem", this.getList(), this.state.newItemName, (err) => {
      this.setState({newItemName: ""});
    })
  },

  handleKeyPress(event) {
    if (event.charCode === 13) {
      this.addItem();
    }
  },

  updateInput(event) {
    this.setState({newItemName: event.target.value});
  },

  getList() {
    return R ?
      R.find(
      R.propEq("name", this.props.params.name), this.data.lists) :
    null;
  },

  remove() {
    Meteor.call("removeList", this.getList(), (err) => {
      FlowRouter.go("/");
    });
  },

  rename(newName) {
    Meteor.call("renameList", newName, this.getList(), (err, result) => {
      FlowRouter.go("/list/" + result);
    });
  },

  render() {
    let list = this.getList();
    return (
      <div>
        <DetailHeader
          list={list}
          backgroundColor="#3498db"
          backPath="/"
          title={list.name}
          remove={this.remove}
          rename={this.rename}
        />

        <Center>
          <div style={styles.cartList}>
            <input
              placeholder="New Item Name"
              style={styles.input}
              onKeyPress={this.handleKeyPress}
              onChange={this.updateInput}
              value={this.state.newItemName}
            />

            <div>{this.showItems()}</div>
          </div>
        </Center>
      </div>
    );
  }
}));