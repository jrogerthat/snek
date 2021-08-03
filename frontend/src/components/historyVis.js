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

    let beforeAfter = moveGroups(history);

    renderPaths(beforeAfter[0], beforeAfter[1], pathG);

    return history;

}

function renderHistoryGroupsCopy(d3Selection, data){

    console.log('data', data);

    let versOb = versionSingleton.getInstance();
    versOb.allVersions();

    let pathG = d3Selection.append('g').classed('version-path', true);

    let history = d3Selection.selectAll('g.version_group')
        .data(data.filter(f=> f.version != versOb.currentVersion())).join('g')
        .classed('version_group', true);

    let versionIndex = versOb.allVersions().indexOf(versOb.currentVersion());

    let beforeHis = history.filter(f => versOb.allVersions().indexOf(f.version) < versionIndex);
    let afterHis = history.filter(f => versOb.allVersions().indexOf(f.version) > versionIndex);
    
    let moveB = d3.scaleLinear().domain([0, beforeHis.size()]).range([(-(beforeHis.size() * 150)), 0]);
    let moveF = d3.scaleLinear().domain([0, 3]).range([0, 400]);

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

function renderPaths(before, after, pathG){

    let first = before.size() > 0 ? before.nodes()[0].getBoundingClientRect().y - d3.select('.clicked-selected').node().getBoundingClientRect().y : 0;
    let second = after.size() > 0 ? after.nodes()[(after.nodes().length - 1)].getBoundingClientRect().y - d3.select('.clicked-selected').node().getBoundingClientRect().y : 0;
        
    pathG.append('line')
        .classed('version-line', true)
        .style("stroke", "gray")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "5,5")
        .attr("y1", first)
        .attr("x1", 7)
        .attr("y2", second)
        .attr("x2", 10);
}

function moveGroups(groups){

    let versOb = versionSingleton.getInstance();

    let versionIndex = versOb.allVersions().indexOf(versOb.currentVersion());

    let beforeHis = groups.filter(f => versOb.allVersions().indexOf(f.version) < versionIndex);
    let afterHis = groups.filter(f => versOb.allVersions().indexOf(f.version) > versionIndex);

    beforeHis.style('transform', (d, i, n) => {
        return `translate(10px, -${((n.length - i) * 130)}px)`});

    afterHis.style('transform', (d, i) => {
        return `translate(10px, ${((i + 1) * 150)}px)`});

    if(beforeHis.size() > 1){
        d3.select('svg').select('g').attr('transform', 'translate(5, 190)')
        d3.select('svg').style('width', '1100px');
    }

    return [beforeHis, afterHis];

}

export function renderHistoryVertical(sources, otherSources){


    d3.select('.secondary-vis').style('opacity', .1);

    let parent = d3.select(d3.select('.clicked-selected').node().parentNode);
    let history = renderHistoryGroups(parent, sources);

    otherSources.map(m => {
        let hisWrap = d3.selectAll('.artifact').filter(f => f.id === m.id).selectAll('g.other-history-wrap').data([m]).join('g').classed('other-history-wrap', true);
        hisWrap.append('g').classed('path-wrap', true);
    });

    let otherGroups = d3.selectAll('.other-history-wrap').selectAll('g.history-group').data(d => d.sources).join('g').classed('history-group', true);
    let beforeAfter = moveGroups(otherGroups);
    renderPaths(beforeAfter[0], beforeAfter[1], d3.selectAll('.path-wrap'));


    let circGroup = otherGroups.filter(f => {
        let test = f.sources.filter(t=> t.value != null);
        return test.length > 0;
    }).selectAll('g.circ-group').data(d => [d]).join('g').classed('circ-group', true);

    circGroup.append('circle').attr('r', 10).attr('cy', 0).attr('cy', 0);

    //THIS IS WHERE IT CHANGED

    let historyThatChanged = history.each(async (f, i, n)=> {

        let changed = f.sources.filter(async s => {
            let sou = await s;
            return sou['value'].changed_from_prev === true;
        });

        let test = await changed[0];
      
        if(test.value != null){
            d3.select(n[i]).append('circle').attr('r', 20).attr('cx', 0).attr('cy', 0);
            d3.select('.secondary-vis').style('opacity', .1);
        }


    });

  console.log('history that changed',historyThatChanged);

    let text = history.append('text').text(d => d.version);

    text.style('fill', '#fff')
    .attr('transform', `translate(25, 0)`);

}

export function removeHistory(){
    d3.select('.secondary-vis').style('opacity', 1);
    d3.selectAll('.version-path').remove();
    d3.selectAll('.version_group').remove();
}