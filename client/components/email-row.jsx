const styles = {
  item: {
    fontSize: 24,
    userSelect: "none",
    height: 45
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
    width: "100%"
  },

  email: {
    padding: 10,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    flex: "1",
    userSelect: "none"
  }
};

EmailRow = Radium(React.createClass({
  displayName: "EmailRow",

  propTypes: {
    obj: React.PropTypes.object
  },

  delete() {
    let obj = this.props.obj;

    Meteor.call("removeEmail", obj.list, obj.email, (err, result) => {
      if (result.error) {
        Notifications.push({ title: result.error });
      }

      if (result.success) {
        Notifications.push({
          title: result.success,
          backgroundColor: "#2ecc71"
        })
      }

      if (result.redirect) {
        FlowRouter.go("/");
      }
    });
  },

  render() {
    let obj = this.props.obj;

    return (
      <div>
        <SpaceBetween style={styles.item}>
          <Center style={styles.left}>
            <BorderIcon
              name="trash"
              fontSize={24}
              size={30}
              color="black"
              hoverColor="#e74c3c"
              backgroundColor="white"
              onClick={this.delete}
            />

            <div style={styles.email}>
              {obj.email}
            </div>
          </Center>
        </SpaceBetween>

        { obj.index !== obj.max ?
          <hr style={styles.hr} /> :
          null
        }
      </div>
    );
  }
}));