import * as d3 from "d3";
import { getSources } from "../application/generalHelpers";
import { versionSingleton } from "../application/versionControlSingleton";

export function renderHistoryHorizontal(sources){

    let versOb = versionSingleton.getInstance();
    versOb.allVersions();

    d3.select('.secondary-vis').style('opacity', .1);
    //HIDE CHOSEN CIRCLE
    d3.select('.clicked-selected').style('opacity', 0);

    let parent = d3.select(d3.select('.clicked-selected').node().parentNode);
    let pathG = parent.append('g').classed('version-path', true);

    let history = parent.selectAll('g.version_group').data(sources).join('g').classed('version_group', true);

    let versionIndex = versOb.allVersions().indexOf(versOb.currentVersion());

    let beforeHis = history.filter(f => versOb.allVersions().indexOf(f.version) < versionIndex);
    let afterHis = history.filter(f => versOb.allVersions().indexOf(f.version) > versionIndex);

    beforeHis.style('transform', (d, i, n) => {
        return `translate(-${((n.length - i) * 170)}px, 10px)`});

    afterHis.style('transform', (d, i) => {
        return `translate(${((i) * 150)}px, 10px)`});
    
   // history.append('circle').attr('r', 20).attr('cx', 0).attr('cy', 0);
    renderCircles(history, 10);
    renderTriangles(history);

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
        .style("stroke-width", .75)
        .style("stroke-dasharray", "5,5")
        .attr("x1", first)
        .attr("y1", 7)
        .attr("x2", second)
        .attr("y2", 10);
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

function moveGroups(groups, orient){

    let versOb = versionSingleton.getInstance();

    let versionIndex = versOb.allVersions().indexOf(versOb.currentVersion());

    let beforeHis = groups.filter(f => versOb.allVersions().indexOf(f.version) < versionIndex);
    let afterHis = groups.filter(f => versOb.allVersions().indexOf(f.version) > versionIndex);

    if(orient === 'vertical'){

        beforeHis.style('transform', (d, i, n) => {
            return `translate(10px, -${((n.length - i) * 130)}px)`});
    
        afterHis.style('transform', (d, i) => {
            return `translate(10px, ${((i + 1) * 150)}px)`});
    
        if(beforeHis.size() > 1){
            d3.select('svg').select('g').attr('transform', 'translate(5, 190)')
            d3.select('svg').style('width', '1100px');
        }

    }else{



    }

    return [beforeHis, afterHis];

}

function renderCircles(d3Selection, radius){

    let circGroup = d3Selection.filter(f => {
        let test = f.sources.filter(t=> t.value != null);
        return test.length > 0;
    }).selectAll('g.circ-group').data(d => [d]).join('g').classed('circ-group', true);

    circGroup.append('circle').attr('r', radius).attr('cy', 0).attr('cy', 0);
}

function renderTriangles(d3Selection){

    let triangleGroup = d3Selection.filter(f => {
        let test = f.sources.filter(t=> t.value === null);
        return test.length > 0;
    }).selectAll('g.tri-group').data(d => [d]).join('g').classed('tri-group', true);

    let triangle = triangleGroup.append("polygon")
    .attr("points", (d)=> "0,0 25,0 12,25").join(" ")
    .attr("stroke","gray")
    .attr("fill", 'none')
    .attr("stroke-width",2)

    triangle
    .attr('transform', 'translate(0, 10) rotate(-90)');

}

export function renderHistoryVertical(sources, otherSources){

    let versOb = versionSingleton.getInstance();
    versOb.allVersions();

    d3.select('.secondary-vis').style('opacity', .1);

    let parent = d3.select(d3.select('.clicked-selected').node().parentNode);

    let pathG = parent.append('g').classed('version-path', true);

    let history = parent.selectAll('g.version_group')
        //.data(sources.filter(f=> f.version != versOb.currentVersion())).join('g')
        .data(sources).join('g')
        .classed('version_group', true);

    let beforeAfter = moveGroups(history, 'vertical');
    renderPaths(beforeAfter[0], beforeAfter[1], pathG);

    otherSources.map(m => {
        let hisWrap = d3.selectAll('.artifact').filter(f => f.id === m.id).selectAll('g.other-history-wrap').data([m]).join('g').classed('other-history-wrap', true);
        hisWrap.append('g').classed('path-wrap', true);
    });

    let otherGroups = d3.selectAll('.other-history-wrap').selectAll('g.version-group').data(d => d.sources).join('g').classed('version-group', true);
    let beforeAfterOther = moveGroups(otherGroups, 'vertical');
    renderPaths(beforeAfterOther[0], beforeAfterOther[1], d3.selectAll('.path-wrap'));

    renderCircles(otherGroups, 10);
    renderCircles(history, 20);

    //THIS IS WHERE IT CHANGED
    let text = history.append('text').text(d => d.version);

    text.style('fill', '#fff')
    .attr('transform', `translate(25, 0)`);

}

export function removeHistory(){
    d3.select('.secondary-vis').style('opacity', 1);
    d3.selectAll('.version-path').remove();
    d3.selectAll('.version_group').remove();
    d3.selectAll('.other-history-wrap').remove();
    d3.select('.clicked-selected').style('opacity', 1);
}