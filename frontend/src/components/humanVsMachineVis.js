import * as d3 from "d3";
import * as d3Array from "d3-array";
import * as humanMachineLinks from "../../vendors/links/links-human-machine.json";
import { viewSingleton } from "../application/viewSingleton";
import { artifactClicked, nodeHoverInteraction } from "./nodes";

const radius = 9;

export function renderHumanVsMachine(nodes){

    let viewOb = viewSingleton.getInstance();
    viewOb.changeView('human-machine');

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

    let sourceLabels = humanMachineGroups.selectAll('text.source-label').data(d=> [d]).join('text').classed('source-label', true);
    sourceLabels.text(d=> d[0])
    sourceLabels.attr('transform', d=> `translate(-10, ${d[1].length * 5})`)

    let sourcRects = humanMachineGroups.selectAll('rect').data(d=> d[1]).join('rect').attr('width', 10).attr('height', 8);
    sourcRects.attr('opacity', 0);
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
          obTarget.x = +artifactNode.attr('x') + 5;
          obTarget.y = (svg.node().getBoundingClientRect().width * .7) + 6;
          obTarget.id = artifactNode.data()[0].id;

        return {source: obSource, target: obTarget};
    });

    var linkG = d3.linkHorizontal()
        .source( d => [d.source.x, d.source.y] )
        .target( d => [d.target.y, d.target.x] );

    var link = svg.select('.secondary-vis').select('.arc-wrap')//.append("g")
        .selectAll(".link")
        .data(linkData)
        .join("path")
        .attr("class", "link")
        .attr("d", linkG )
        .style("stroke-width", 10);

    link.filter(f=> f.source.id === 'Human').classed('human', true);
    link.filter(f=> f.source.id === 'Machine').classed('machine', true);

    nodeHoverInteraction(artifactGroup, 'link');

    let stageLabels = d3.select('#container').select('.svg-wrap').selectAll('.stage');
    let lineGen = d3.line();

    stageLabels.nodes().map(m=>{
        let svgHeight = d3.select('svg').node().getBoundingClientRect().width * .74;
        let nodeD = d3.select(m).data()[0][1];
        let start = yScale(nodeD[0].posID);

        let data = [
            [svgHeight, start], 
            [svgHeight, (start + (yScale(nodeD.length)) - 10)]];
        
        let pathData = lineGen(data);
        let wrap = d3.select(m).append('g').classed('label-wrap', true);

        wrap.append('path')
            .attr('d', pathData)
            .attr('stroke-width', .5)
            .attr('stroke', '#fff');

        let labels = wrap.append('text').text(d=> d[0])
        .style('text-anchor', 'start')
        .style('fill', '#fff')
        .attr('transform', `translate(${(svgHeight + 15)}, ${(start + (yScale(nodeD.length) * .45))})`);

    });

    let labels = d3.selectAll('.label-wrap');

    labels.on('mouseover', (event, d)=> {
      let artifacts = d3.select(event.target.parentNode.parentNode).selectAll('.artifact');
      artifacts.selectAll('circle').attr('r', 12);
      let ids = artifacts.data().map(m => m['Artifact ID']);

      d3.selectAll('.link').filter(f=> ids.indexOf(ids.indexOf(f.target.id) > -1 )).classed('hover', true);

      d3.selectAll('.link').filter(f=> ids.indexOf(f.target.id) === -1).classed('non-hover', true);

      }).on('mouseout', (event, d)=> {
      let artifacts = d3.select(event.target.parentNode.parentNode).selectAll('.artifact');
      artifacts.selectAll('circle').attr('r', radius);
      d3.selectAll('.link').classed('non-hover', false);
      d3.selectAll('.link').classed('hover', false);
    });

    artifactGroup.on('click', (event, d)=> artifactClicked(event, d));
}

