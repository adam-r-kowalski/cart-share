// React Meteor:         http://react-in-meteor.readthedocs.org/en/latest/
// Tutorial:             http://tutorial-viewer.meteor.com/tutorial/0/react
// Meteor Documentation: http://docs.meteor.com/#/basic/
// React Documentation:  https://facebook.github.io/react/docs/getting-started.html
// Router Documentation: https://atmospherejs.com/kadira/reaktor
// Subscriptions:        https://kadira.io/academy/meteor-routing-guide/content/subscriptions-and-data-management/with-react

injectTapEventPlugin();

Meteor.subscribe("shopping-lists");

const Layout = Radium(React.createClass({
  displayName: "Layout",

  render() {
    return <div>{this.props.content}</div>;
  }
}));

const checkLogin = (context, redirect) => {
 if (!Meteor.userId())  {
   redirect("/login");
 }
};

const checkLogout = (context, redirect) => {
  if (Meteor.userId()) {
    redirect("/");
  }
};

Reaktor.init(
  <Router>
    <Route
      path="/"
      layout={Layout}
      content={Home}
      triggersEnter={checkLogin}
    />

    <Route
      path="/login"
      layout={Layout}
      content={Login}
      triggersEnter={checkLogout}
    />

    <Route
      path="/signup"
      layout={Layout}
      content={SignUp}
      triggersEnter={checkLogout}
    />

    <Route
      path="/list/:name"
      layout={Layout}
      content={ListDetail}
      triggersEnter={checkLogin}
    />

    <Route
      path="/list/:listName/:itemName"
      layout={Layout}
      content={ItemDetail}
      triggersEnter={checkLogin}
    />
  </Router>
);
