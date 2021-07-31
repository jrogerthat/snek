import * as d3 from "d3";
import { versionSingleton } from "../application/versionControlSingleton";

export function renderHistoryHorizontal(sources){

    let versOb = versionSingleton.getInstance();
    versOb.allVersions();

    let parent = d3.select(d3.select('.clicked-selected').node().parentNode);
    let pathG = parent.append('g').classed('version-path', true);

    let history = parent.selectAll('g.version_group')
        .data(sources.filter(f=> f.version != versOb.currentVersion())).join('g')
        .classed('version_group', true);

    let versionIndex = versOb.allVersions().indexOf(versOb.currentVersion());

    let beforeHis = history.filter(f => versOb.allVersions().indexOf(f.version) < versionIndex);
    let afterHis = history.filter(f => versOb.allVersions().indexOf(f.version) > versionIndex);
    
    let moveB = d3.scaleLinear().domain([0, beforeHis.size()]).range([(-(beforeHis.size() * 150)), 0])
    let moveF = d3.scaleLinear().domain([0, 3]).range([0, 400])

    beforeHis.style('transform', (d, i, n) => {
        return `translate(-${((n.length - i) * 170)}px, 10px)`});

    afterHis.style('transform', (d, i) => {
        return `translate(${((i + 1) * 150)}px, 10px)`});
    
    history.append('circle').attr('r', 20).attr('cx', 0).attr('cy', 0);
    d3.select('.secondary-vis').style('opacity', .1);
    
    let first = beforeHis.size() > 0 ? beforeHis.nodes()[0].getBoundingClientRect().x - d3.select('.clicked-selected').node().getBoundingClientRect().x : 0;
    let second = afterHis.size() > 0 ? afterHis.nodes()[(afterHis.nodes().length - 1)].getBoundingClientRect().x - d3.select('.clicked-selected').node().getBoundingClientRect().x : 0;
    if(afterHis.size() > 1){
        d3.select('svg').select('g').attr('transform', 'translate(-100, 0)')
        d3.select('svg').style('width', '1100px');
    }
    pathG.append('line')
        .classed('version-line', true)
        .style("stroke", "gray")
        .style("stroke-width", 2)
        .style("stroke-dasharray", "5,5")
        .attr("x1", first)
        .attr("y1", 7)
        .attr("x2", second)
        .attr("y2", 10);
}

export function removeHistory(){
    d3.select('.secondary-vis').style('opacity', 1);
    d3.selectAll('.version-path').remove();
    d3.selectAll('.version_group').remove();
}