const styles = {
  cartList: {
    width: "100%",
    maxWidth: 1000,
    marginTop: 1
  },

  input: {
    padding: 10,
    fontSize: 24,
    borderRadius: 0
  },

  list: {
    cursor: "pointer",
    transition: "all 0.3s ease",

    ":hover": {
      backgroundColor: "#27ae60",
      color: "white"
    }
  },

  item: {
    fontSize: 24,
    userSelect: "none"
  },

  name: {
    padding: 10,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxWidth: "100%",
    userSelect: "none"
  },

  hr: {
    color: "#bdc3c7",
    backgroundColor: "#bdc3c7",
    margin: 0,
    height: 1,
    border: 0
  }
};

CartList = Radium(React.createClass({
  displayName: "CartList",

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      lists: ShoppingLists.find({}, {sort: {name: 1}}).fetch()
    };
  },

  getInitialState() {
    return {
      newListName: ""
    };
  },

  renderList(obj) {
    return (
      <div
        style={styles.list}
        key={obj.index}
        onClick={() => FlowRouter.go('/list/' + obj.list.name)}>
        <SpaceBetween style={styles.item}>
          <div style={styles.name}>{obj.list.name}</div>

          <Icon name="chevron-right" margin="0 10px 0 0" color="white" />
        </SpaceBetween>

        {obj.index !== obj.max ?
          <hr style={styles.hr} /> :
          null
        }
      </div>
    );
  },

  renderLists() {
    const f = (list, index) => {
      return {
        list,
        index,
        max: this.data.lists.length - 1
      };
    };

    return R.map(
      this.renderList,
      R.zipWith(
        f,
        this.data.lists,
        R.range(0, this.data.lists.length)
      )
    );
  },

  updateInput(event) {
    this.setState({newListName: event.target.value});
  },

  handleKeyPress(event) {
    if (event.charCode == 13) {
      this.addList();
    }
  },

  addList() {
    if (!this.state.newListName) { return; }

    Meteor.call("insertList", this.state.newListName, (err, result) => {
      if (result) {
        Notifications.push({title: result});
      }

      this.setState({newListName: ""});
    });
  },

  render() {
    return (
      <Center>
        <Column style={styles.cartList}>
          <input
            placeholder="New List Name"
            style={styles.input}
            onKeyPress={this.handleKeyPress}
            onChange={this.updateInput}
            value={this.state.newListName}
          />

          {this.renderLists()}
        </Column>

        <NotificationHandler />
      </Center>
    );
  }
}));