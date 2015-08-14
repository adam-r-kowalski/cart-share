const getStyles = function(props) {
  return {
    container: {
      backgroundColor: props.backgroundColor || "#95a5a6",
      boxShadow: "0 0 5px black",
      height: 60
    },

    header: {
      width: "100%",
      maxWidth: 1000
    }
  };
};

Header = Radium(React.createClass({
  displayName: "Header",

  render() {
    let styles = getStyles(this.props);

    return (
      <Center style={styles.container}>
        <SpaceBetween style={styles.header}>
          {this.props.children}
        </SpaceBetween>
      </Center>
    );
  }
}));