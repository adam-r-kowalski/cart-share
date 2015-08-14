const styles = {
  title: {
    fontSize: 30,
    marginLeft: 10,
    color: "white",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxWidth: 150,
    userSelect: "none",
    transition: "all 0.3s ease",

    "@media (min-width: 400px)": {
      maxWidth: 200
    },

    "@media (min-width: 450px)": {
      maxWidth: 250
    },

    "@media (min-width: 500px)": {
      maxWidth: 300,
      fontSize: 36
    },

    "@media (min-width: 550px)": {
      maxWidth: 350
    },

    "@media (min-width: 600px)": {
      maxWidth: 400
    },

    "@media (min-width: 650px)": {
      maxWidth: 450
    },

    "@media (min-width: 700px)": {
      maxWidth: 500
    },

    "@media (min-width: 750px)": {
      maxWidth: 550
    }
  },

  newNameInput: {
    fontSize: 36,
    width: "100%",
    margin: "0 10px",
    padding: 0,
    borderRadius: 0,

    "@media (max-width: 400px)": {
      maxWidth: 250
    }
  },

  scaling: {
    "@media (min-width: 500px)": {
      fontSize: 36,
      width: 40,
      height: 40
    }
  }
};

DetailHeader = Radium(React.createClass({
  displayName: "DetailHeader",

  propTypes: {
    list: React.PropTypes.object,
    backgroundColor: React.PropTypes.string,
    backPath: React.PropTypes.string,
    title: React.PropTypes.string,
    remove: React.PropTypes.func,
    rename: React.PropTypes.func
  },

  getInitialState() {
    return {
      renaming: false,
      newName: ""
    };
  },

  rename() {
    this.setState({
      renaming: true,
      newName: this.props.title
    });
  },

  updateNewName(event) {
    this.setState({newName: event.target.value});
  },

  handleKeyPress(event) {
    if (event.charCode == 13) {
      this.setState({
        renaming: false
      });

      this.props.rename(this.state.newName);
    }
  },

  render() {
    return (
      <Header backgroundColor={this.props.backgroundColor}>
        <Center style={{marginLeft: 10}}>
          <BorderIcon
            name="chevron-left"
            size={34}
            fontSize={30}
            style={styles.scaling}
            color="white"
            hoverColor="#2ecc71"
            backgroundColor={this.props.backgroundColor}
            onClick={() => FlowRouter.go(this.props.backPath)}
          />

          { !this.state.renaming ?
            <div style={styles.title}>
              {this.props.title}
            </div> :
            <input
              style={styles.newNameInput}
              value={this.state.newName}
              ref="newName"
              onChange={this.updateNewName}
              onKeyPress={this.handleKeyPress}
            />
          }
        </Center>

        <Center margin="0 10px 0 0">
          { !this.state.renaming ?
            <BorderIcon
              name="pencil"
              fontSize={30}
              style={styles.scaling}
              size={34}
              color="white"
              hoverColor="#f1c40f"
              backgroundColor={this.props.backgroundColor}
              onClick={this.rename}
            />  :
            null
          }

          { !this.state.renaming ?
            <BorderIcon
              name="trash"
              fontSize={30}
              style={styles.scaling}
              size={34}
              color="white"
              hoverColor="#e74c3c"
              backgroundColor={this.props.backgroundColor}
              onClick={this.props.remove}
            /> :
            null
          }
        </Center>
      </Header>
    );
  }
}));