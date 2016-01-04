
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import titleize from 'titleize';

import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';

const themesAndPopulation = R.append('population', constants.THEMES);
const posOrZero = (v) => v > 0 ? v : 0;

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData,
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired
  },

  mixins: [PureRenderMixin],

  componentDidMount() {
    const width = 750;
    const height = 500;

    this.treemap = d3.layout.treemap()
      .round(false)
      .sticky(true)
      .size([width, height]) //TODO: resize
      .value((d) => d.size);

    this.svg = d3.select(this.refs.treemap)
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
    const color = d3.scale.category20c(); //TODO: Use Region Colors (can do via class)
    const selectedDecade = props.decade;
    const selectedTheme = props.theme;
    const selectedData = props.viewData[selectedTheme].regionalSummary[selectedDecade];

    //ref: view-source:http://mbostock.github.io/d3/talk/20111018/treemap.html

    const treemapData = {
      name: 'Statewide',
      children: selectedData.map((entry) => {
        return {
          name: `Region ${entry.REGION}`,
          children: constants.USAGE_TYPES.map((type) => {
            return {
              name: `${titleize(type)} - Region ${entry.REGION}`,
              size: entry[type] || 0
            };
          })
        };
      })
    };

    this.root = this.node = treemapData;

    const nodes = this.treemap.nodes(this.root)
      .filter((d) => !d.children);

    const cell = this.svg.selectAll('g')
        .data(nodes)
      .enter().append('svg:g')
        .attr('class', 'cell')
        .attr('transform', (d) => `translate(${d.x},${d.y})`)
        .on('click', (d) => this.zoom(this.node === d.parent ? this.root : d.parent));

    cell.append('svg:rect')
      .attr('width', (d) => posOrZero(d.dx - 1))
      .attr('height', (d) => posOrZero(d.dy - 1))
      .style('fill', (d) => color(d.parent.name));

    cell.append('svg:text')
      .attr('x', (d) => d.dx / 2)
      .attr('y', (d) => d.dy / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text((d) => d.name)
      .style('opacity', function getOpacity(d) {
        d.w = this.getComputedTextLength();
        return d.dx > d.w ? 1 : 0;
      });
  },

  zoom(dd) {
    const kx = 750 / dd.dx; //TODO: width from props
    const ky = 500 / dd.dy; //TODO: height from props
    const x = d3.scale.linear().range([0, 750]);
    const y = d3.scale.linear().range([0, 500]);

    x.domain([dd.x, dd.x + dd.dx]);
    y.domain([dd.y, dd.y + dd.dy]);

    const t = this.svg.selectAll('g.cell').transition()
      .duration(750)
      .attr('transform', (d) => `translate(${x(d.x)},${y(d.y)})`);

    t.select('rect')
      .attr('width', (d) => posOrZero(kx * d.dx - 1))
      .attr('height', (d) => posOrZero(ky * d.dy - 1));

    t.select('text')
      .attr('x', (d) => kx * d.dx / 2)
      .attr('y', (d) => ky * d.dy / 2)
      .style('opacity', (d) => kx * d.dx > d.w ? 1 : 0);

    this.node = dd;
    d3.event.stopPropagation();
  },

  render() {
    if (!this.props.viewData) {
      return (<div />);
    }

    const selectedDecade = this.props.decade;
    const selectedTheme = this.props.theme;
    const themeTitle = constants.THEME_TITLES[selectedTheme];
    const units = selectedTheme === 'population' ? "people" : "acre-feet/year";

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