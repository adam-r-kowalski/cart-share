const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};

Center = Radium(React.createClass({
  displayName: "Center",

  propTypes: {
    style: React.PropTypes.object,
    onClick: React.PropTypes.func
  },

  render() {
    let style = this.props.style ?
      [this.props.style, styles.container] :
      styles.container;

    return (
      <div style={style} onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}));