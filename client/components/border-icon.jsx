const getStyles = function(props) {
  return {
    container: {
      width: props.size || 30,
      height: props.size || 30,
      borderRadius: "50%",
      border: "2px solid " + (props.backgroundColor || "black"),
      transition: "all 0.3s ease",
      cursor: "pointer",

      ":hover": {
        border: "2px solid " + (props.hoverColor || "gray"),
        color: props.hoverColor || "gray"
      }
    }
  };
};

BorderIcon = Radium(React.createClass({
  displayName: "BorderIcon",

  propTypes: {
    name: React.PropTypes.string,
    size: React.PropTypes.number,
    fontSize: React.PropTypes.number,
    color: React.PropTypes.string,
    margin: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    hoverColor: React.PropTypes.string,
    onClick: React.PropTypes.func
  },

  render() {
    let style = getStyles(this.props).container;

    if (this.props.style) {
      R.mapObjIndexed((value, key) => {
        style[key] = value;
      }, this.props.style);
    }

    return (
      <Icon
        name={this.props.name}
        fontSize={this.props.fontSize}
        color={this.props.color}
        margin={this.props.margin}
        onClick={this.props.onClick}
        style={style}
      />
    )
  }
}));