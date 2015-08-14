const styles = {
  title: {
    fontSize: 36,
    marginLeft: 10,
    color: "white",
    userSelect: "none"
  }
};

HomeHeader = Radium(React.createClass({
  displayName: "HomeHeader",

  signOut() {
    Meteor.logout((err) => {
      if (err) { console.log(err); }
      FlowRouter.go("/login");
    });
  },

  render() {
    return (
      <Header backgroundColor="#2ecc71">
        <div style={styles.title}>
          Cart Share
        </div>

        <BorderIcon
          name="sign-out"
          fontSize={36}
          size={40}
          color="white"
          hoverColor="#34495e"
          backgroundColor="#2ecc71"
          onClick={this.signOut}
        />
      </Header>
    );
  }
}))