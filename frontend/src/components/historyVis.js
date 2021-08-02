import * as d3 from "d3";
import { getSources } from "../application/generalHelpers";
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

    let text = history.append('text').text(d => d.version);
    text.style('fill', '#fff')
    .attr('transform', `translate(0, -22), rotate(-40)`);
    
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

function renderHistoryGroups(d3Selection, data){

    let versOb = versionSingleton.getInstance();
    versOb.allVersions();

    let pathG = d3Selection.append('g').classed('version-path', true);

    let history = d3Selection.selectAll('g.version_group')
        .data(data.filter(f=> f.version != versOb.currentVersion())).join('g')
        .classed('version_group', true);

    let versionIndex = versOb.allVersions().indexOf(versOb.currentVersion());

    let beforeHis = history.filter(f => versOb.allVersions().indexOf(f.version) < versionIndex);
    let afterHis = history.filter(f => versOb.allVersions().indexOf(f.version) > versionIndex);
    
    let moveB = d3.scaleLinear().domain([0, beforeHis.size()]).range([(-(beforeHis.size() * 150)), 0])
    let moveF = d3.scaleLinear().domain([0, 3]).range([0, 400])

    beforeHis.style('transform', (d, i, n) => {
        return `translate(10px, -${((n.length - i) * 130)}px)`});

    afterHis.style('transform', (d, i) => {
        return `translate(10px, ${((i + 1) * 150)}px)`});

    let first = beforeHis.size() > 0 ? beforeHis.nodes()[0].getBoundingClientRect().y - d3.select('.clicked-selected').node().getBoundingClientRect().y : 0;
    let second = afterHis.size() > 0 ? afterHis.nodes()[(afterHis.nodes().length - 1)].getBoundingClientRect().y - d3.select('.clicked-selected').node().getBoundingClientRect().y : 0;
        
    if(beforeHis.size() > 1){
        d3.select('svg').select('g').attr('transform', 'translate(5, 190)')
        d3.select('svg').style('width', '1100px');
    }
    pathG.append('line')
        .classed('version-line', true)
        .style("stroke", "gray")
        .style("stroke-width", 2)
        .style("stroke-dasharray", "5,5")
        .attr("y1", first)
        .attr("x1", 7)
        .attr("y2", second)
        .attr("x2", 10);

    return history;

}

export function renderHistoryVertical(sources){

    let parent = d3.select(d3.select('.clicked-selected').node().parentNode);

    let history = renderHistoryGroups(parent, sources);

    //GETTING DEPENDICIES AND THEIR HISTORY
    let testFilter = d3.selectAll('.artifact').filter(f=> {
        return (f.Dependencies != null && f.Dependencies.includes(parent.data()[0].id)) || (f.Dependencies != null && parent.data()[0].Dependencies.includes(f['Artifact ID']))
    });
    
    let testS = testFilter.data().map(m => {
        let sources = getSources(m);
        return sources;
    });

    let otherHistories = renderHistoryGroups(testFilter, testS);

    otherHistories.append('circle').attr('r', 10).attr('cx', 0).attr('cy', 0);
    d3.select('.secondary-vis').style('opacity', .1);

    //THIS IS WHERE IT CHANGED

    let historyThatChanged = history.filter(async f=> {
        let changed = f.sources.filter(async s => {
            let sou = await s;
            return sou['value'].changed_from_prev = true;
        });
        return changed;
    });

    historyThatChanged.append('circle').attr('r', 20).attr('cx', 0).attr('cy', 0);
    d3.select('.secondary-vis').style('opacity', .1);

    let text = history.append('text').text(d => d.version);

    text.style('fill', '#fff')
    .attr('transform', `translate(25, 0)`);

}

export function removeHistory(){
    d3.select('.secondary-vis').style('opacity', 1);
    d3.selectAll('.version-path').remove();
    d3.selectAll('.version_group').remove();
}