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

console.log('ad',artData)

let svg = d3.select('#container').select('#wrapper').append('svg').classed('svg-wrap', true);
let stages = svg.selectAll('g.stage').data(artData).join('g').attr('class', d=> d[0]).classed('stage', true);
let step = stages.selectAll('g.step').data(d=> d3Array.groups(d[1], g=> g.Step)).join('g').attr('class', d=> d[0]).classed('step', true);
let artifactGroup = step.selectAll('g.artifact').data(d=> d[1]).join('g').classed('artifact', true);
let artifactCircle = artifactGroup.selectAll('circle').data(d=> [d]).join('circle').attr('r', radius).attr('cx', 10).attr('cy', 10);
artifactCircle.attr('class', d=> {
  if(d['Transmission Mode'] === "Boundry Crossing/M-H" || d['Transmission Mode'] === "Boundry Crossing/M-H"){ return "machine"}
  else if(d['Transmission Mode'] === "Boundry Crossing/H-M" || d['Transmission Mode'] === "Boundry Crossing/M-H" ){
    return "human"
  }
});

// xScale = d3.scalePoint()
//   .domain(nodeFormat.map(m=> m.name))
//   .range([0, svg.node().getBoundingClientRect().width])

let xScale = d3.scaleLinear()
  .domain([0, nodeFormat.length])
  .range([0, svg.node().getBoundingClientRect().width])

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
  return `translate(${d.posID * ((radius * 3) + 5)}, ${(svg.node().getBoundingClientRect().height)-20})`;
});
console.log('links', artifactDependencies);
