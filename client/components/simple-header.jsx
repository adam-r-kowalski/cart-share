const styles = {
  title: {
    fontSize: 36,
    marginLeft: 10,
    color: "white",
    userSelect: "none"
  },

  scaling: {
    "@media (min-width: 500px)": {
      fontSize: 36,
      width: 40,
      height: 40
    }
  }
};

SimpleHeader = Radium(React.createClass({
  displayName: "SimpleHeader",

  propTypes: {
    title: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    backButton: React.PropTypes.bool,
    backPath: React.PropTypes.string
  },

  render() {
    return (
      <Header backgroundColor={this.props.backgroundColor}>
        <Center style={{marginLeft: 10}}>
          { this.props.backButton ?
            <BorderIcon
              name="chevron-left"
              size={34}
              fontSize={30}
              style={styles.scaling}
              color="white"
              hoverColor="#2ecc71"
              backgroundColor={this.props.backgroundColor}
              onClick={() => FlowRouter.go(this.props.backPath)}
              /> :
            null
          }

          <div style={styles.title}>
            {this.props.title}
          </div>
        </Center>

        <Center style={{marginRight: 10}}>
          {this.props.children}
        </Center>
      </Header>
    );
  }
}))