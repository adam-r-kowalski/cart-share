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
  },

  error: {
    height: 30,
    fontSize: 18,
    color: "#e74c3c"
  }
};

Login = Radium(React.createClass({
  displayName: "Login",

  getInitialState() {
    return {
      email: Session.get("email") || "",
      password: Session.get("password") || "",
      error: ""
    };
  },

  login() {
    let error = Validate.email(this.state.email);
    if (error) {
      this.setState({error: error});
      React.findDOMNode(this.refs.email).focus();
      return;
    }

    error = Validate.password(this.state.password);
    if (error) {
      this.setState({error: error});
      React.findDOMNode(this.refs.password).focus();
      return;
    }

    Meteor.loginWithPassword(this.state.email, this.state.password, (err) => {
      if (err) {
        if (err.reason === "User not found") {
          Session.set("email", this.state.email);
          Session.set("password", this.state.password);
          FlowRouter.go("/signup");
        }

        this.setState({error: err.reason});
      } else {
        Session.set("email", null);
        Session.set("password", null);
        FlowRouter.go("/");
      }
    });
  },

  signUp() {
    Session.set("email", this.state.email);
    Session.set("password", this.state.password);
    FlowRouter.go("/signup");
  },

  updateInput(input, event) {
    let state = {};
    state[input] = event.target.value;

    this.setState(state);
  },

  submit(event) {
    if (event.charCode === 13) { this.login(); }
  },

  render() {
    return (
      <Center style={styles.container}>
        <Column style={styles.form}>
          <h1 style={styles.title}>Cart Share - Login</h1>

          <Center style={styles.error}>{this.state.error}</Center>

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
          </Column>

          <div style={styles.span}>
            <button
              style={[styles.input, styles.button]}
              key={0}
              onClick={this.signUp}>
              Sign Up
            </button>

            <button
              style={[styles.input, styles.button]}
              key={1}
              onClick={this.login}>
              Login
            </button>
          </div>
        </Column>
      </Center>
    );
  }
}));

