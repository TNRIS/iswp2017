
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';

import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';

const themesAndPopulation = R.append('population', constants.THEMES);

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData,
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired
  },

  mixins: [PureRenderMixin],

  componentDidMount() {
    const width = 600;
    const height = 400;

    this.treemap = d3.layout.treemap()
      .round(false)
      .sticky(true)
      .size([width, height]) //TODO: resize
      .value((d) => d.size);

    d3.select(this.refs.treemap)
      .attr('class', 'chart')
      .style('width', `${width}px`)
      .style('height', `${height}px`)
      .append('svg:svg')
        .attr('width', width)
        .attr('height', height)
      .append('svg:g')
        .attr('transform', 'translate(0.5, 0.5)');

    this.updateTreemap(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.updateTreemap(nextProps);
  },

  updateTreemap(props) {
    console.log("viewData", props.viewData);
    //ref: view-source:http://mbostock.github.io/d3/talk/20111018/treemap.html
    //data form:
    /*
      {
        name: 'root'
        children: [
          {
            name: 'child'
            size: 1234
          },
          {
            name: 'child2'
            children: [
              {
                name: 'subchild'
                size: 4567
              }
            ]
          }
        ]
      }
    */
  },

  render() {
    if (!this.props.viewData) {
      return (<div />);
    }

    const selectedDecade = this.props.decade;
    const selectedTheme = this.props.theme;
    const themeTitle = constants.THEME_TITLES[selectedTheme];
    const units = selectedTheme === 'population' ? "people" : "acre-feet/year";
    const selectedData = this.props.viewData[selectedTheme].regionalSummary[selectedDecade];

    return (
      <div>
        <h4>
          Treemap of Usage Type - {selectedDecade} - {themeTitle}
          <span className="units">({units})</span>
        </h4>
        <div ref="treemap"></div>
      </div>
    );
  }
});