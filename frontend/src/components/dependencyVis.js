import * as d3 from "d3";
import * as d3Array from "d3-array";
import * as artifactDependencies from "../../vendors/links/artifact-dependencies.json";
import { machineOrHuman } from "../application/generalHelpers";
import { nodeHoverInteraction } from "./nodes";

const radius = 9;

function buildArc (d, artifactGroup) {
 
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

export function renderDependencyVis(nodes){

    let artifactGroup = d3.select('#container').selectAll('g.artifact');
    let visWrap = d3.select('#container').select('.secondary-vis');
    let arcGroup = visWrap.append('g').classed('arc-wrap', true);
    arcGroup.attr('transform', 'translate(0, 200)');
    let svg = d3.select('#container').select('svg');

    let xScale = d3.scaleLinear()
        .domain([0, nodes.length])
        .range([0, svg.node().getBoundingClientRect().width])
    
    artifactGroup
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .attr('transform', (d, i)=>{
        return `translate(${xScale(d.posID)}, ${335})`;
    });
    artifactGroup.attr('x', (d, i)=> xScale(d.posID))
                .attr('y', (d, i)=> (svg.node().getBoundingClientRect().height)-20);
    
    arcGroup.selectAll("arcs")
    .data(artifactDependencies.map(m=> {
        let startT = artifactGroup.filter(f=> f.id === m.Source);
        m.data = startT.data()[0];
        return m}))
    .join("path")
    .attr("d", d => buildArc(d, artifactGroup))
    .style("fill", "none")            // no fill color for the arcs
    .attr('class', d=> machineOrHuman(d.data))
    .classed('dependent-arc', true);

    //ADDING INTERACTIVITY TO NODES
    nodeHoverInteraction(artifactGroup, 'dependent-arc');

}

