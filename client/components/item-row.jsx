const styles = {
  item: {
    fontSize: 24,
    userSelect: "none",
    height: 45,
    cursor: "pointer",

    ":hover": {
      backgroundColor: "#2980b9",
      color: "white"
    }
  },

  hr: {
    color: "#bdc3c7",
    backgroundColor: "#bdc3c7",
    margin: 0,
    height: 1,
    border: 0
  },

  left: {
    marginLeft: 10,
    cursor: "pointer",
    width: "100%"
  }
};

const nameStyles = function(checked) {
  return {
    textDecoration: checked ? "line-through" : "none",
    padding: 10,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    flex: "1",
    userSelect: "none"
  };
};


ItemRow = Radium(React.createClass({
  displayName: "ItemRow",

  propTypes: {
    obj: React.PropTypes.object
  },

  toggleChecked(obj) {
    Meteor.call("toggleItemChecked", this.props.list, obj);
  },

  viewDetail() {
    FlowRouter.go("/list/" + this.props.list.name + "/" + this.props.obj.item.name);
  },

  render() {
    let obj = this.props.obj;

    return (
      <div>
        <div style={styles.item}>
          <Center style={styles.left}>
            <Icon
              name={obj.item.checked ? "check-circle" : "circle-o"}
              onClick={this.toggleChecked.bind(this, obj)}
            />

            <div style={nameStyles(obj.item.checked)} onClick={this.viewDetail}>
              {obj.item.name}
            </div>
          </Center>
        </div>

        {obj.index !== obj.max ?
          <hr style={styles.hr} /> :
          null
        }
      </div>
    );
  }
}));