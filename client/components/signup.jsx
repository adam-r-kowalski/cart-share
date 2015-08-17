const styles = {
  container: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },

  form: {
    width: "100%",
    maxWidth: "500px"
  },

  title: {
    fontSize: 48,
    textAlign: "center",
    padding: 0,
    margin: 0,
    userSelect: "none",
    transition: "all 0.3s ease",

    "@media (max-width: 768px)": {
      fontSize: 32
    }
  },

  span: {
    display: "flex",
    width: "100%",
    margin: 0
  },

  input: {
    flex: 1,
    padding: 20,
    fontSize: 24,
    margin: 0,
    borderRadius: 0
  },

  button: {
    border: "1px solid white",
    backgroundColor: "white",
    transition: "all 0.3s ease",

    ":hover": {
      border: "1px solid #2ecc71"
    },

    ":focus": {
      outline: 0
    },

    ":active": {
      backgroundColor: "#2ecc71",
      color: "white"
    }
  }
};

SignUp = Radium(React.createClass({
  displayName: "SignUp",

  getInitialState() {
    return {
      email: Session.get("email") || "",
      password: Session.get("password") || "",
      confirmPassword: ""
    };
  },

  login() {
    Session.set("email", this.state.email);
    Session.set("password", this.state.password);
    FlowRouter.go("/login");
  },

  signUp() {
    let error = Validate.email(this.state.email);
    if (error) {
      Notifications.push({ title: error });
      React.findDOMNode(this.refs.email).focus();
      return;
    }

    error = Validate.password(this.state.password);
    if (error) {
      Notifications.push({ title: error });
      React.findDOMNode(this.refs.password).focus();
      return;
    }

    if (this.state.confirmPassword != this.state.password) {
      Notifications.push({ title: "Passwords must match" });
      React.findDOMNode(this.refs.confirmPassword).focus();
      return;
    }

    Accounts.createUser({email: this.state.email, password: this.state.password }, (err) => {
      if (err) {
        Notifications.push({ title: err.reason });
        return;
      }

      Meteor.loginWithPassword(this.state.email, this.state.password, (err) => {
        if (err) {
          Notifications.push({ title: err.reason });
          return;
        }

        Session.set("email", null);
        Session.set("password", null);

        FlowRouter.go("/");
      });
    });
  },

  updateInput(input, event) {
    let state = {};
    state[input] = event.target.value;

    this.setState(state);
  },

  submit(event) {
    if (event.charCode === 13) { this.signUp(); }
  },

  render() {
    return (
      <Center style={styles.container}>
        <Column style={styles.form}>
          <h1 style={styles.title}>Cart Share - Sign Up</h1>
          <Column style={styles.span}>
            <input
              type="email"
              placeholder="Email"
              ref="email"
              style={styles.input}
              value={this.state.email}
              autoFocus={true}
              onKeyPress={this.submit}
              onChange={this.updateInput.bind(this, "email")} />

            <input
              type="password"
              placeholder="Password"
              ref="password"
              style={styles.input}
              value={this.state.password}
              onKeyPress={this.submit}
              onChange={this.updateInput.bind(this, "password")} />

            <input
              type="password"
              placeholder="Confirm Password"
              ref="confirmPassword"
              style={styles.input}
              value={this.state.confirmPassword}
              onKeyPress={this.submit}
              onChange={this.updateInput.bind(this, "confirmPassword")} />
          </Column>

          <div style={styles.span}>
            <button
              style={[styles.input, styles.button]}
              key={0}
              onClick={this.login}>
              Login
            </button>

            <button
              style={[styles.input, styles.button]}
              key={1}
              onClick={this.signUp}>
              Sign Up
            </button>
          </div>
        </Column>

        <NotificationHandler />
      </Center>
    );
  }
}));

