Home = Radium(React.createClass({
  displayName: "Home",

  signOut() {
    Meteor.logout((err) => {
      if (err) { console.log(err); }
      FlowRouter.go("/login");
    });
  },

  render() {
    return (
      <div>
        <SimpleHeader
          title="Cart Share"
          backgroundColor="#2ecc71" >
          <BorderIcon
            name="sign-out"
            fontSize={36}
            size={40}
            color="white"
            hoverColor="#34495e"
            backgroundColor="#2ecc71"
            onClick={this.signOut}
            />
        </SimpleHeader>

        <CartList />
      </div>
    );
  }
}));
