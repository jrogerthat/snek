import "../styles/index.scss";
import * as d3 from "d3";
import * as d3Array from "d3-array";
import "bootstrap/dist/js/bootstrap.bundle";
import "../components/sidebar";
import * as dataF from "../../vendors/artifact-data.json";
import * as artifactDependencies from "../../vendors/artifact-dependencies.json";

const radius = 5;

let nodeFormat = dataF.map((m, i)=>{
  m.name = m['Artifact Type'];
  m.id = m['Artifact ID'];
  m.posID = i;
  return m});

let artData = d3Array.groups(nodeFormat, d=> d.Stage);

function machineOrHuman(d){
  if(d['Transmission Mode'] === "Boundry Crossing/M-H" || d['Transmission Mode'] === "Non-Boundary/M-M"){ return "machine"}
  else if(d['Transmission Mode'] === "Boundry Crossing/H-M" || d['Transmission Mode'] === "Non-Boundary/H-H" ){
    return "human"
  }
}

let svg = d3.select('#container').select('#wrapper').append('svg').classed('svg-wrap', true);

let arcGroup = svg.append('g').classed('arc-wrap', true);
arcGroup.attr('transform', 'translate(0, 200)');

let stages = svg.selectAll('g.stage').data(artData).join('g').attr('class', d=> d[0]).classed('stage', true);
let step = stages.selectAll('g.step').data(d=> d3Array.groups(d[1], g=> g.Step)).join('g').attr('class', d=> d[0]).classed('step', true);
let artifactGroup = step.selectAll('g.artifact').data(d=> d[1]).join('g').classed('artifact', true);
let artifactCircle = artifactGroup.selectAll('circle').data(d=> [d]).join('circle').attr('r', radius).attr('cx', 10).attr('cy', 10);
artifactCircle.attr('class', d=> machineOrHuman(d));

function buildArc (d) {
  // d.source and d.target are the locations in graphData.links
  // xScale takes a node name and finds its location on the x axis from 0 to width
  // So start is the location in pixels of the start of the arc
 
  let startT = artifactGroup.filter(f=> f.id === d.Source);
  let endT = artifactGroup.filter(f=> f.id === d.Target);
  let height = 140;

  let end = (+startT.attr('x') + 10);//xScale(idToNode[d.source].name);
  let start = (+endT.attr('x') + 10);//xScale(idToNode[d.target].name);
 
  // This code builds up the SVG arc path element
  const arcPath = ['M',            // start the path
           start, height,       // declare the (x,y) of where to start
          'A',                     // specify an eliptical curve
          (start - end)/2, ',',    // xradius: height of arc is proportional to start - end
          (start - end)/2,         // yradius 
           0, 0, ",",              // rotation of ellipse is 0 along x and y; see arc url for details
           start < end ? 1: 0,     // make all arcs curve above the nodes; see arc documentation
           end, height]         // declare (x,y) of endpoint
        .join(' ');                // convert the bracketed array into a string
  return arcPath;
};
 
// to create the arcs, we use graphData.links instead of graphData.nodes
// arcGroup.selectAll("arcs")
//  .data(graphData.links)
//  .enter().append("path")
//  .attr("d", d => buildArc(d))
//   .style("fill", "none")            // no fill color for the arcs
//   .attr("stroke", "black")          // make the arc's lines be black
     
// let xScale = d3.scaleLinear()
//   .domain([0, nodeFormat.length])
//   .range([0, svg.node().getBoundingClientRect().width])

// yScale = d3.scalePoint()
//   .domain(nodeFormat.map(m=> m.name))
//   .range([0, svg.node().getBoundingClientRect().height])

// stages.attr('transform', (d, i)=> {
//   return `translate(${d[1][0].posID * 13},10)`});

// step.attr('transform', (d, i, n)=> {
//   if(i === 0){
//     return `translate(0,10)`
//   }else{
//     return `translate(${d3.select(n[i-1]).data()[0][1].length * 12}, 10)`;
//   }
// });
artifactGroup.attr('transform', (d, i)=>{
  return `translate(${d.posID * ((radius * 3) + 5)}, ${335})`;
});
artifactGroup.attr('x', (d, i)=> d.posID * ((radius * 3) + 5))
             .attr('y', (d, i)=> (svg.node().getBoundingClientRect().height)-20);

arcGroup.selectAll("arcs")
 .data(artifactDependencies.map(m=> {
   let startT = artifactGroup.filter(f=> f.id === m.Source);
   m.data = startT.data()[0];
   return m}))
 .join("path")
 .attr("d", d => buildArc(d))
 .style("fill", "none")            // no fill color for the arcs
 .attr('class', d=> machineOrHuman(d.data));
//  .attr("stroke", (d)=> {
//    console.log('path', d);
//    return "black"})  


