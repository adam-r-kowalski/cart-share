const styles = {
  quantityContainer: {
    marginTop: 20,
    fontSize: 36,
    userSelect: "none",
    transition: "0.3s all ease",

    "@media (min-width: 600px)": {
      fontSize: 48
    }
  }
};

ItemDetail = Radium(React.createClass({
  displayName: "ItemDetail",

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      lists: ShoppingLists.find().fetch()
    };
  },

  remove(list, item) {
    Meteor.call("removeItem", list, item, (err, result) => {
      if (result.error) {
        Notifications.push({ title: result.error });
      }

      if (result.success) {
        Meteor.call("insertReservedItem", result.success);

        Notifications.push({
          title: "Removed item '" + result.success.item.name + "'",
          backgroundColor: "#2ecc71",
          undo: () => Meteor.call("undoRemoveItem", result.success),
          end: () => Meteor.call("removeReservedItem", result.success)
        });
      }

      FlowRouter.go("/list/" + list.name);
    });
  },

  rename(list, item, newName) {
    Meteor.call("renameItem", list, item, newName, (err, result) => {
      console.log(result);

      if (result.error) {
        Notifications.push({ title: result.error });
      }

      if (result.success) {
        Notifications.push({
          title: result.success,
          backgroundColor: "#2ecc71"
        })
      }

      FlowRouter.go("/list/" + list.name + "/item/" + result.path);
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

  changeQuantity(quantity) {
    let list = this.getList();
    let item = this.getItem(list);

    Meteor.call("changeItemQuantity", list, item, quantity);
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

        <Column>
          <Center style={styles.quantityContainer}>
            <div>Quantity</div>

            <Column style={{marginLeft: 10}}>
              <BorderIcon
                name="chevron-up"
                backgroundColor="white"
                hoverColor="#e67e22"
                onClick={this.changeQuantity.bind(this, 1)}
              />

              <Center>{item.quantity}</Center>

              <BorderIcon
                name="chevron-down"
                backgroundColor="white"
                hoverColor="#e67e22"
                onClick={this.changeQuantity.bind(this, -1)}
              />
            </Column>
          </Center>
        </Column>

        <NotificationHandler />
      </div>
    );
  }
}));