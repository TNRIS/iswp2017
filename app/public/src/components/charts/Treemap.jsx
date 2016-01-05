
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import format from 'format-number';

// Based on example http://bost.ocks.org/mike/treemap/

export default React.createClass({
  propTypes: {
    treemapData: React.PropTypes.object.isRequired, //TODO: test shape
    height: React.PropTypes.number,
    marginTop: React.PropTypes.number,
    titlePad: React.PropTypes.number
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      height: 500,
      marginTop: 20,
      titlePad: 6
    };
  },

  componentDidMount() {
    const marginTop = this.props.marginTop;
    const height = this.props.height - marginTop;
    const width = this.refs.treemapContainer.offsetWidth;

    this.treemap = d3.layout.treemap()
      .round(false)
      .sort((a, b) => a.value - b.value)
      .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
      .value((d) => d.value)
      .children((d, depth) => depth ? null : d._children);

    this.svg = d3.select(this.refs.treemapContainer)
      .append('svg')
        .attr('width', width)
        .attr('height', height + marginTop)
      .append('g')
        .attr('transform', `translate(0,${marginTop})`)
        .style('shape-rendering', 'crispEdges');

    this.grandparent = this.svg.append('g')
      .attr('class', 'grandparent');

    this.grandparent.append('rect')
      .attr('y', -marginTop)
      .attr('width', width)
      .attr('height', marginTop);

    this.grandparent.append('text')
      .attr('x', this.props.titlePad)
      .attr('y', this.props.titlePad - marginTop)
      .attr('dy', '0.75em');


    this.updateTreemap(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.updateTreemap(nextProps);
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

    const svg = this.svg;
    const grandparent = this.grandparent;

    this.root = props.treemapData;

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


    const display = (d) => {
      const g1 = svg.insert('g', '.grandparent')
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

        svg.style('shape-rendering', null);

        svg.selectAll('.depth').sort((a, b) => a.depth - b.depth);

        g2.selectAll('text').style('fill-opacity', 0);

        t1.selectAll('text').call(text).style('fill-opacity', 0);
        t2.selectAll('text').call(text).style('fill-opacity', 1);
        t1.selectAll('rect').call(rect);
        t2.selectAll('rect').call(rect);

        t1.remove().each('end', () => {
          svg.style('shape-rendering', 'crispEdges');
          isTransitioning = false;
        });
      };

      grandparent
        .datum(d.parent)
        .on('click', transition)
        .select('text')
          .text(d.name);

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
          .call(rect);

      g.append('rect')
        .attr('class', 'parent')
        .call(rect)
        .append('title')
          .text((dd) => format()(dd.value));

      g.append('text')
        .attr('dy', '0.75em')
        .text((dd) => dd.name)
        .call(text);

      return g;
    };


    initialize(this.root);
    accumulate(this.root);
    console.log(this.root);
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