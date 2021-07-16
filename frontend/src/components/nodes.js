import * as d3 from "d3";
import * as d3Array from "d3-array";
import { machineOrHuman } from "../application/generalHelpers";

const radius = 9;

export function nodeHoverInteraction(nodeGroups, linkClass){//dependent-arc

    nodeGroups.on('mouseover', (event, d)=>{
        
        d3.select(event.target).classed('hover', true);
        d3.select(event.target).attr('r', 15);
        if(linkClass === 'link'){

            d3.selectAll(`.${linkClass}`).filter(f=> {
                return f.target.id === d.id;
            }).classed('hover', true);
    
            d3.selectAll(`.${linkClass}`).filter(f=> {
                return f.target.id != d.id;
            }).classed('non-hover', true);

        }else{

            d3.selectAll(`.${linkClass}`).filter(f=> {
                return f.Source ===  d.id || f.Target === d.id;
            }).classed('hover', true);
    
            d3.selectAll(`.${linkClass}`).filter(f=> {
                return f.Source !=  d.id && f.Target != d.id;
            }).classed('non-hover', true);
        }
       
    }).on('mouseout', (event, d)=>{
        d3.select(event.target).classed('hover', false);
        d3.select(event.target).attr('r', radius);
        d3.selectAll(`.${linkClass}`).filter(f=> {
            return f.Source ===  d.id || f.Target === d.id;
        }).classed('hover', false);
        d3.selectAll(`.${linkClass}`).filter(f=> {
            return f.Source !=  d.id && f.Target != d.id;
        }).classed('non-hover',false);
    });

}

export function renderNodes(nodes){
    const svg = d3.select('#container').select('#wrapper').select('svg');
    let visWrap = svg.append('g');
    visWrap.attr('transform', 'translate(5,0)');
    let artData = d3Array.groups(nodes, d=> d.Stage);

    let secondaryVis = visWrap.append('g').classed('secondary-vis', true);

    let stages = visWrap.selectAll('g.stage').data(artData).join('g').attr('class', d=> d[0]).classed('stage', true);
    let step = stages.selectAll('g.step').data(d=> d3Array.groups(d[1], g=> g.Step)).join('g').attr('class', d=> d[0]).classed('step', true);
    let artifactGroup = step.selectAll('g.artifact').data(d=> d[1]).join('g').classed('artifact', true);
    let artifactCircle = artifactGroup.selectAll('circle').data(d=> [d]).join('circle').attr('r', radius).attr('cx', 10).attr('cy', 10);
    artifactCircle.attr('class', d=> machineOrHuman(d));

    let xScale = d3.scaleLinear()
        .domain([0, nodes.length])
        .range([0, (svg.node().getBoundingClientRect().width - 100)])
    
    artifactGroup.attr('transform', (d, i)=>{
        return `translate(${xScale(d.posID)}, ${335})`;
    });
    artifactGroup.attr('x', (d, i)=> xScale(d.posID))
                .attr('y', (d, i)=> (svg.node().getBoundingClientRect().height)-20);
}