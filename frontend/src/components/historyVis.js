import * as d3 from "d3";
import * as d3Array from "d3-array";
import { machineOrHuman } from "../application/generalHelpers";
import { versionSingleton } from "../application/versionControlSingleton";
import { viewSingleton } from "../application/viewSingleton";

export function renderHistoryHorizontal(sources){
    let parent = d3.select(d3.select('.clicked-selected').node().parentNode);
    let historyWrap = parent.selectAll('g.hist-wrap').data(sources).join('g').classed('hist-wrap', true);
    let history = historyWrap.selectAll('g.hist').data(d => d).join('g').classed('hist', true);
    
    let moveBack = d3.scaleLinear().domain([0, 3]).range([400, 0])
    
    d3.selectAll('g.hist').style('transform', (d, i) => {
        return `translate(-${moveBack(i)}px, 10px)`})
    
    history.append('circle').attr('r', 20).attr('cx', 0).attr('cy', 0);
    d3.select('.secondary-vis').style('opacity', .1);
}

export function removeHistory(){
    d3.select('.secondary-vis').style('opacity', 1);
    d3.selectAll('.hist-wrap').remove();
}