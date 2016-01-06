/* global d3*/
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import debounce from 'debounce';
import format from 'format-number';

import PropTypes from '../../utils/CustomPropTypes';

// Treemap based on example from http://bost.ocks.org/mike/treemap/
export default React.createClass({
  propTypes: {
    treemapData: PropTypes.TreemapData.isRequired,
    height: React.PropTypes.number,
    marginTop: React.PropTypes.number,
    titlePad: React.PropTypes.number,
    showPercent: React.PropTypes.bool
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      height: 500,
      marginTop: 20,
      titlePad: 6,
      showPercent: false
    };
  },

  componentDidMount() {
    this.updateTreemap(this.props);
    this.debouncedUpdateTreemap = debounce(() => this.updateTreemap(this.props), 200);
    window.addEventListener('resize', this.debouncedUpdateTreemap.bind(this));
  },

  componentWillReceiveProps(nextProps) {
    this.updateTreemap(nextProps);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedUpdateTreemap);
  },

  updateTreemap(props) {
    const marginTop = props.marginTop;
    const height = props.height - marginTop;
    const width = this.refs.treemapContainer.offsetWidth;
    const titlePad = props.titlePad;
    let isTransitioning = false;

    const xScale = d3.scale.linear()
      .domain([0, width])
      .range([0, width]);

    const yScale = d3.scale.linear()
      .domain([0, height])
      .range([0, height]);

    this.treemap = d3.layout.treemap()
      .round(false)
      .sort((a, b) => a.value - b.value)
      .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
      .value((d) => d.value)
      .children((d, depth) => depth ? null : d._children);

    if (this.svg) {
      this.svg.remove();
    }

    this.svg = d3.select(this.refs.treemapContainer)
      .append('svg')
        .attr('width', width)
        .attr('height', height + marginTop);

    this.chartGroup = this.svg
      .append('g')
        .attr('transform', `translate(0,${marginTop})`)
        .style('shape-rendering', 'crispEdges');

    this.grandparent = this.chartGroup.append('g')
      .attr('class', 'grandparent');

    this.grandparent.append('rect')
      .attr('y', -marginTop)
      .attr('width', width)
      .attr('height', marginTop);

    this.grandparent.append('text')
      .attr('x', props.titlePad)
      .attr('y', props.titlePad - marginTop)
      .attr('dy', '0.75em');

    const chartGroup = this.chartGroup;
    const grandparent = this.grandparent;

    const initialize = (root) => {
      root.x = root.y = 0;
      root.dx = width;
      root.dy = height;
      root.depth = 0;
    };

    const accumulate = (d) => {
      d._children = d.children; //save reference
      if (d._children) {
        d.value = d.children.reduce((p, v) => p + accumulate(v), 0);
      }
      return d.value;
    };

    const layout = (d) => {
      if (d._children) {
        this.treemap.nodes({_children: d._children});
        d._children.forEach((c) => {
          c.x = d.x + c.x * d.dx;
          c.y = d.y + c.y * d.dy;
          c.dx *= d.dx;
          c.dy *= d.dy;
          c.parent = d;
          layout(c);
        });
      }
    };

    const text = (t) => {
      t.attr('x', (d) => xScale(d.x) + titlePad)
        .attr('y', (d) => yScale(d.y) + titlePad);
    };

    const rect = (r) => {
      r.attr("x", (d) => xScale(d.x))
        .attr("y", (d) => yScale(d.y))
        .attr("width", (d) => xScale(d.x + d.dx) - xScale(d.x))
        .attr("height", (d) => yScale(d.y + d.dy) - yScale(d.y));
    };

    const label = (d) => {
      if (this.props.showPercent && d.area) {
        let pct = (d.area * 100).toFixed();
        if (pct < 1) {
          pct = '<1';
        }
        return `${d.label} (${pct}%)`;
      }
      return d.label;
    };

    const title = (d) => {
      return label(d) + ': ' + format()(d.value);
    };

    const display = (d) => {
      const g1 = chartGroup.insert('g', '.grandparent')
        .datum(d)
        .attr('class', 'depth');

      const transition = (dd) => {
        if (isTransitioning || !dd) {
          return;
        }

        isTransitioning = true;

        const g2 = display(dd);
        const t1 = g1.transition().duration(750);
        const t2 = g2.transition().duration(750);

        xScale.domain([dd.x, dd.x + dd.dx]);
        yScale.domain([dd.y, dd.y + dd.dy]);

        chartGroup.style('shape-rendering', null);

        chartGroup.selectAll('.depth').sort((a, b) => a.depth - b.depth);

        g2.selectAll('text').style('fill-opacity', 0);

        t1.selectAll('text').call(text).style('fill-opacity', 0);
        t2.selectAll('text').call(text).style('fill-opacity', 1);
        t1.selectAll('rect').call(rect);
        t2.selectAll('rect').call(rect);

        t1.remove().each('end', () => {
          chartGroup.style('shape-rendering', 'crispEdges');
          isTransitioning = false;
        });
      };

      grandparent
        .datum(d.parent)
        .on('click', transition)
        .select('text')
          .text(label(d));

      const g = g1.selectAll('g')
        .data(d._children)
        .enter()
          .append('g');

      g.filter((dd) => dd._children)
        .classed('children', true)
        .on('click', transition);

      g.filter((dd) => !dd._children)
        .classed('no-children', true)
        .on('click', (dd) => transition(dd.parent.parent));

      g.selectAll('.child')
        .data((dd) => dd._children || [dd])
        .enter()
          .append('rect')
          .attr('class', (dd) => `child ${dd.className}`)
          .call(rect)
          .append('title')
            .text(title);

      g.append('rect')
        .attr('class', 'parent')
        .call(rect)
        .append('title')
          .text(title);

      g.append('text')
        .attr('dy', '0.75em')
        .text(label)
        .call(text);

      return g;
    };

    this.root = R.clone(props.treemapData);
    initialize(this.root);
    accumulate(this.root);
    layout(this.root);
    display(this.root);
  },

  render() {
    if (!this.props.treemapData) {
      return (<div />);
    }

    return (
      <div className="treemap-container">
        <div ref="treemapContainer" className="treemap-chart"></div>
      </div>
    );
  }
});