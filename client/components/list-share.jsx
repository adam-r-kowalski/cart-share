const styles = {
  emailList: {
    width: "100%"  ,
    maxWidth: 1000,
    marginTop: 1
  },

  input: {
    padding: 10,
    fontSize: 24,
    borderRadius: 0
  },

  scaling: {
    "@media (min-width: 500px)": {
      fontSize: 36,
      width: 40,
      height: 40
    }
  }
};

ListShare = Radium(React.createClass({
  displayName: "ListShare",

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      lists: ShoppingLists.find({}, {sort: {name: 1}}).fetch()
    };
  },

  getInitialState() {
    return {
      newEmailName: ""
    };
  },

  renderEmail(obj) {
    return (
      <EmailRow
        key={obj.index}
        obj={obj}
      />
    );
  },

  renderEmails(list) {
    if (!list[0].email) { return; }

    const f = (email, index) => {
      return {
        list: list[0],
        email,
        index,
        max: list[0].email.length - 1
      };
    };

    const emails = R.zipWith(
      f,
      list[0].email,
      R.range(0, list[0].email.length)
    );

    return emails.map(this.renderEmail);
  },

  getList() {
    let name = this.props.params.name;

    return R.filter(
      list => name == list.name,
      this.data.lists
    );
  },

  updateInput(event) {
    this.setState({newEmailName: event.target.value});
  },

  handleKeyPress() {
    if (event.charCode == 13) {
      this.addEmail();
    }
  },

  addEmail() {
    if (!this.state.newEmailName) { return; }

    let list = this.getList();

    if (!list[0].email) { return; }

    Meteor.call("insertEmail", list[0], this.state.newEmailName, err => {
      this.setState({newEmailName: ""});
    });
  },

  render(){
    let backPath = "/list/" + this.props.params.name;
    let list = this.getList();

    return (
      <div>
        <SimpleHeader
          title="Share"
          backgroundColor="#9b59b6"
          backButton={true}
          backPath={backPath}>
          <BorderIcon
            name="cloud"
            fontSize={36}
            size={40}
            color="white"
            hoverColor="#3498db"
            backgroundColor="#9b59b6"
            style={styles.scaling}
            onClick={() => FlowRouter.go(backPath)}
            />
        </SimpleHeader>

        <Center>
          <Column style={styles.emailList}>
            <input
              placeholder="New Email"
              style={styles.input}
              onKeyPress={this.handleKeyPress}
              onChange={this.updateInput}
              value={this.state.newEmailName}
            />

            {this.renderEmails(list)}
          </Column>
        </Center>
      </div>
    );
  }
}));