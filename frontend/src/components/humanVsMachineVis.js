import * as d3 from "d3";
import * as d3Array from "d3-array";
import * as humanMachineLinks from "../../vendors/links/links-human-machine.json";
import * as graphFile from "../../vendors/links/sankey.json";
import { theSankey } from "../application/sankey";

const radius = 9;



export function renderTest(nodes){

    const svg = d3.select("#container").select("svg");

    var units = "Widgets";

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = svg.node().getBoundingClientRect().width,//700 - margin.left - margin.right,
        height = svg.node().getBoundingClientRect().width;//300 - margin.top - margin.bottom;

    // format variables
    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function(d) { return formatNumber(d) + " " + units; },
        color = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg object to the body of the page

    svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = theSankey()
    .nodeWidth(10)
    .nodePadding(10)
    .size([width, height]);

var path = sankey.link();

// load the data
//d3.json().then(function(graph) {

let graph = graphFile;
console.log('graph', graph.links)

  sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

console.log('graph links', sankey.links())

// add in the links
  var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

// add the link titles
  link.append("title")
        .text(function(d) {
    		return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value); });

// add in the nodes
  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; })
      .call(d3.drag()
        .subject(function(d) {
          return d;
        })
        .on("start", function() {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));

// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { 
		  return d.color = color(d.name.replace(/ .*/, "")); })
      .style("stroke", function(d) { 
		  return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { 
		  return d.name + "\n" + format(d.value); });

// add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

// the function for moving the nodes
  function dragmove(d) {
    d3.select(this)
      .attr("transform", 
            "translate(" 
               + d.x + "," 
               + (d.y = Math.max(
                  0, Math.min(height - d.dy, d3.event.y))
                 ) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
//});

}

export function renderHumanVsMachine(nodes){

    let svg = d3.select('#container').select('svg');
    let artifactGroup = d3.select('#container').selectAll('g.artifact');
    let visWrap = d3.select('#container').select('svg').select('.secondary-vis');
    let arcGroup = visWrap.append('g').classed('arc-wrap', true);
    arcGroup.attr('transform', 'translate(0, 5)');
    
    let yScale = d3.scaleLinear()
        .domain([0, nodes.length])
        .range([0, svg.node().getBoundingClientRect().height])
    
    artifactGroup
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr('transform', (d, i)=>{
            return `translate(${(svg.node().getBoundingClientRect().width * .7)}, ${yScale(d.posID)})`;
        });

    artifactGroup.attr('x', (d, i)=> yScale(d.posID))
                .attr('y', (d, i)=> (svg.node().getBoundingClientRect().height)-20);

    let humanMachineGroups = visWrap.selectAll('g.source-nodes').data(d3Array.groups(humanMachineLinks.map(m=>m), d=> d.source)).join('g').attr('class', d=> d[0]).classed('source-nodes', true);
    humanMachineGroups.attr('transform', (d,i,n)=>{
        let calcY = i === 0 ? svg.node().getBoundingClientRect().height * .3 : svg.node().getBoundingClientRect().height * .5;
        return `translate(${(svg.node().getBoundingClientRect().width * .1)}, ${(calcY)})`;
    });

   let sourcRects = humanMachineGroups.selectAll('rect').data(d=> d[1]).join('rect').attr('width', 10).attr('height', 8);
   sourcRects.attr('fill', '#fff');
   sourcRects.attr('y', (d, i)=> i * 10);

   /////ARCS
   ///SHAPING THE DATA
   let linkData = sourcRects.nodes().map(m=> {

        let obSource = {};
        obSource.id = d3.select(m).data()[0].source;
        obSource.x = (svg.node().getBoundingClientRect().width * .1);

        let calcY = humanMachineGroups.data().map(h=> h[0]).indexOf(obSource.id) === 0 ? svg.node().getBoundingClientRect().height * .3 : svg.node().getBoundingClientRect().height * .5;
        obSource.y = +d3.select(m).attr('y') + calcY;
        
        let artifactNode = artifactGroup.filter(f=> f.id === d3.select(m).data()[0].target);

        let obTarget = {};
        obTarget.x = artifactNode.attr('x');
        obTarget.y = (svg.node().getBoundingClientRect().width * .7);//+artifactNode.attr('y') - 60;
        obTarget.id = artifactNode.data()[0].id;

        console.log(obTarget)

       return {source: obSource, target: obTarget};
   });

   var linkG = d3.linkHorizontal()
    .source( d => [d.source.x, d.source.y] )
    .target( d => [d.target.y, d.target.x] );

    var link = svg.select('.secondary-vis').select('.arc-wrap').append("g")
    .selectAll(".link")
    .data(linkData)
    .join("path")
    .attr("class", "link")
    .attr("d", linkG )
    .style("stroke-width", 10);


}