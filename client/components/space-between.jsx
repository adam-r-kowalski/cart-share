const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
};

SpaceBetween = Radium(React.createClass({
  displayName: "SpaceBetween",

  propTypes: {
    style: React.PropTypes.object,
    onClick: React.PropTypes.func
  },

  render() {
    var style = this.props.style ?
      [ styles.container, this.props.style ] :
      styles.container;

    return (
      <div style={style} onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}));