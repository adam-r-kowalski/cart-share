const getStyles = (notification) => {
  return {
    container: {
      position: "absolute",
      bottom: 10,
      left: 10,
      right: 10,
      display: "flex",
      alignItems: "center",
      maxWidth: 500,
      zIndex: 100,
      backgroundColor: notification.backgroundColor || "#e74c3c"
    },

    notification: {
      flex: 1,
      padding: 10,
      fontSize: 24,
      color: notification.color || "white"
    }
  };
};

class NotificationList {
  constructor() {
    this.notifications = [];
  }

  push(notification) {
    this.notifications.push(notification);
  }

  get() {
    return this.notifications;
  }

  shift() {
    this.notifications.shift();
  }

  decrement() {
    if (!this.notifications[0]) { return; }

    if (!this.notifications[0].timer) {
      this.notifications[0].timer = 5;
    }

    this.notifications[0].timer--;

    if (this.notifications[0].timer <= 0) {
      if (this.notifications[0].end) {
        this.notifications[0].end(this.notifications[0]);
      }

      this.notifications.shift();
    }
  }
}

Notifications = new NotificationList();

var timer;

NotificationHandler = Radium(React.createClass({
  displayName: "NotificationHandler",

  getInitialState() {
    return {
      notifications: Notifications.get()
    }
  },

  componentDidMount() {
    timer = setInterval(this.tick, 1000);
  },

  tick() {
    Notifications.decrement();
    this.setState({ notifications: Notifications.get() });
  },

  componentWillUnmount() {
    clearInterval(timer);
  },

  render() {
    let notification = this.state.notifications[0];

    if (notification) {
      let styles = getStyles(notification);

      return (
        <div style={styles.container}>
          { notification.undo ?
            <BorderIcon
              name="undo"
              margin="0 0 0 10px"
              size={30}
              fontSize={24}
              color={notification.color || "white"}
              hoverColor={notification.hoverColor || "black"}
              backgroundColor={notification.backgroundColor || "#e74c3c"}
              onClick={() => {
                Notifications.shift();
                notification.undo(notification);
                notification.end(notification);
              }}
            /> :
            null
          }

          <div style={styles.notification}>{notification.title}</div>
        </div>
      );
    }

    return null;
  }
}));