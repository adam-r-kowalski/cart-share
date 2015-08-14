const styles = {
  container: {
    display: "flex",
    flexDirection: "column"
  }
};

Column = Radium(React.createClass({
  displayName: "Column",

  propTypes: {
    style: React.PropTypes.object
  },

  render() {
    let style = this.props.style ?
      [styles.container, this.props.style] :
      styles.container;

    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  }
}));