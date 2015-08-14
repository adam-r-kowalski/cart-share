const getStyles = function(props) {
  return {
    container: {
      fontSize: props.fontSize || 24,
      color: props.color || "black",
      margin: props.margin || "2px"
    }
  };
};

Icon = Radium(React.createClass({
  displayName: "Icon",

  propTypes: {
    name: React.PropTypes.string,
    fontSize: React.PropTypes.number,
    color: React.PropTypes.string,
    margin: React.PropTypes.string,
    onClick: React.PropTypes.func,
    style: React.PropTypes.object
  },

  style() {
    let style = getStyles(this.props).container;

    if (!this.props.style) { return style; }

    if (!R.mapObjIndexed) { return style; }

    R.mapObjIndexed((value, key) => {
      style[key] = value;
    }, this.props.style);

    return style;
  },

  render() {
    let name = this.props.name || "plus";

    return (
      <Center style={this.style()} onClick={this.props.onClick}>
        <i className={"fa fa-" + name} />
      </Center>
    );
  }
}));