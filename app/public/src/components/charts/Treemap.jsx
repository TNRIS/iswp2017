
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
    height: React.PropTypes.number,
    viewData: PropTypes.ViewData,
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      height: 500
    };
  },

  componentDidMount() {
    const width = this.refs.treemapContainer.offsetWidth;
    const height = this.props.height;

    this.treemap = d3.layout.treemap()
      .round(true)
      .sticky(true)
      .padding(1)
      .size([width, height])
      .sort((a, b) => a.value - b.value)
      .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
      .value((d) => d.value);

    this.svg = d3.select(this.refs.treemapContainer)
      .attr('class', 'chart')
      .style('width', `${width}px`)
      .style('height', `${height}px`)
      .append('svg:svg')
        .attr('width', width)
        .attr('height', height)
      .append('svg:g')
        .attr('class', 'treemap')
        .attr('transform', 'translate(0.5, 0.5)');

    this.updateTreemap(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.updateTreemap(nextProps);
  },

  updateTreemap(props) {
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
              value: entry[type] || 0,
              region: entry.REGION
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
        .attr('class', (d) => `cell region-${d.region.toLowerCase()}`)
        .attr('transform', (d) => `translate(${d.x},${d.y})`)
        .on('click', (d) => this.zoom(this.node === d.parent ? this.root : d.parent));

    cell.append('svg:rect')
      .attr('width', (d) => posOrZero(d.dx - 1))
      .attr('height', (d) => posOrZero(d.dy - 1));

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

    cell.append('svg:title')
      .text((d) => d.name);
  },

  zoom(dd) {
    const width = this.refs.treemapContainer.offsetWidth;
    const kx = width / dd.dx;
    const ky = this.props.height / dd.dy;
    const x = d3.scale.linear().range([0, this.refs.treemapContainer.offsetWidth]);
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
        <div ref="treemapContainer"></div>
      </div>
    );
  }
});