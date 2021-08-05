import * as d3 from "d3";
import * as d3Array from "d3-array";
import { getSources, machineOrHuman } from "../application/generalHelpers";
import { hisBoolSingleton } from "../application/historyModeSingleton";
import { versionSingleton } from "../application/versionControlSingleton";
import { viewSingleton } from "../application/viewSingleton";
import { removeHistory, renderHistoryHorizontal, renderHistoryVertical } from "./historyVis";

const radius = 9;

export function tooltip(event, d, historyVis){

    let tooltip = d3.select('#tooltip');
    tooltip.style('opacity', 1);
    tooltip.style('top', `${event.clientY}px`).style('left', `${event.clientX + 30}px`);

    if(historyVis === false){

        if(d['Task'] === null){

            tooltip.html(`
            <h5><b>${d['Stage']}</b>: ${d['Step']}</h5>
            <h4>${d['Artifact Type']}</h4>
            <br>
            `)
    
        }else{
    
            tooltip.html(`
            <h5><b>${d['Stage']}</b>: ${d['Step']}</h5>
            <h4>${d['Artifact Type']}</h4>
            <br>
            <ul>
            <li><h6>${d['Artifact Group']}</h6></li>
            <li><h6>${d['Transmission Mode']}</h6></li>
            <li><h6>${d['Task']}</h6></li>
            <li><h6>${d['Source']}</h6></li>
            </ul>
            `)
        }
        
    }else{
        let datum = d3.select(event.target).data()[0];
        
        let html = datum.sources.reduce((ac, n) => {
           
            let starter = ac + `<h4><span>${n.key}</span>: `
            let adder = "";
            if(n.value === null){
                adder = "did not change."
            }else{
                adder = n.value.areas_changed.reduce((t, r)=> t + r + ", ", '');
            }
            return starter + adder + "</h4>";
        }, `<h3><span>${datum.version} ${datum.datum.name}</span></h3><h3>Source Changes:</h3>`);

        tooltip.html(html)

    }



}

export function nodeHoverInteraction(nodeGroups, linkClass){//dependent-arc
    
    nodeGroups.on('mouseover', (event, d)=>{


        let hisBoolOb = hisBoolSingleton.getInstance();
        if(!hisBoolOb.isHistoryOn()){
            
            let targetSelection = d3.select(event.target);
     
            if(targetSelection.data()[0].version === undefined && targetSelection.classed('clicked-selected') === false){
                d3.select(event.target).classed('hover', true);
                d3.select(event.target).attr('r', 15);
            }
            
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
            if(targetSelection.data()[0].version === undefined){
                tooltip(event, d, false);
            }else{
                tooltip(event, d, true);
            }
    
            let shared = d3.selectAll('.artifact').filter(f=>{
                return (f.id === d.id) || (d.Dependencies != null && d.Dependencies.includes(f.id)) || (f.Dependencies != null && f.Dependencies.includes(d.id));
            })
    
            d3.selectAll('.label-wrap').attr('opacity', 0);
            
            let hoverLabel = shared.append('text').classed('hover-label', true);
            hoverLabel.text(t=> t['Artifact Type']);
    
            let viewOb = viewSingleton.getInstance();
      
            if(viewOb.currentView() === 'human-machine'){
                hoverLabel.style('transform', 'translate(40px, 12px)');
            }else{
                hoverLabel.attr('transform', 'translate(5, 40), rotate(45)')
            }
           


        }
      
      
       

      
       
    }).on('mouseout', (event, d)=>{

        let hisBoolOb = hisBoolSingleton.getInstance();
        hisBoolOb.isHistoryOn()
        if(hisBoolOb.isHistoryOn() === false){

            d3.selectAll('.label-wrap').attr('opacity', 1);
            d3.selectAll('.hover-label').remove();

        }
 

        let targetSelection = d3.select(event.target);
        if(targetSelection.data()[0].version === undefined && targetSelection.classed('clicked-selected') === false){
        d3.select(event.target).classed('hover', false);
        d3.selectAll('.hover').classed('hover', false);
        d3.select(event.target).attr('r', radius);
        }
        d3.selectAll(`.${linkClass}`).filter(f=> {
            return f.Source ===  d.id || f.Target === d.id;
        }).classed('hover', false);
   
        d3.selectAll(`.${linkClass}`).filter(f=> {
            return f.Source !=  d.id && f.Target != d.id;
        }).classed('non-hover',false);
        d3.select('#tooltip').style('left', '-20px').style('top', '-20px').style('opacity', 0)
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

export function artifactClicked(event, d){

    removeHistory();

    let versOb = versionSingleton.getInstance();
    let version = versOb.currentVersion();
   
    d3.selectAll('.clicked-selected').each((f, i, n)=>{
      d3.select(n[i]).attr('r', radius);
      d3.select(n[i]).classed('click-selected', false);
    });
  
    d3.selectAll('.clicked-selected').classed('clicked-selected', false);
  
    let clickedSelected = d3.select(event.target);
    clickedSelected.classed('clicked-selected', true);
    clickedSelected.attr('r', 16);
  
    d3.select('#wrapper').select('.more-info').remove(); 
    let height = d3.select('svg').node().getBoundingClientRect().height;
    let div = d3.select('#wrapper').append('div').classed('more-info', true);
    div.style('height', `${height}px`);
  
    let x = div.append('div').classed('exit', true);
  
    x.append('i').attr('class', 'fas fa-times-circle');
    x.on('click', ()=> {
      d3.select('.more-info').remove();
      d3.selectAll('.clicked-selected').each((f, i, n)=>{
        d3.select(n[i]).attr('r', radius);
        d3.select(n[i]).classed('click-selected', false);
      });
  
      d3.selectAll('.clicked-selected').classed('clicked-selected', false);
      removeHistory();
    });
  
    let h4 = div.append('h4').text(d['Artifact Type']);
  
    let dataUl = div.append('ul');
  
    let liData = Object.keys(d).filter(f=> f != "name" && f != "id" && f != "posID" && f != "Artifact Type" && f != "Source File");
  
    let li = dataUl.selectAll('li').data(liData).join('li');
    li.html(l=> `${l}: <span class="badge bg-secondary">${d[l]}</span>`);
  
    li.selectAll('span').on('mouseover', (event, m)=> {
      let param = d3.select(event.target.parentNode).data();
     
      let what = d[param];
      let shared = d3.selectAll('.artifact').filter(f=> f[param] === what)
      let sharedCircle = shared.select('circle');
   
      sharedCircle.filter((f, i, n)=> d3.select(n[i]).classed('clicked-selected') === false).classed('hover', true);
      sharedCircle.filter((f, i, n)=> d3.select(n[i]).classed('clicked-selected') === false).attr('r', 12);
      let notShared = d3.selectAll('.artifact').filter(f=> f[param] != what).select('circle');
      notShared.classed('non-hover', true);
      notShared.attr('opacity', .2);

      d3.selectAll('.artifact').filter(f=> f.posID === d.posID).select('circle').classed('specific-chosen', true);
      let selectedIDs = shared.data().map(s=> s['Artifact ID']);
      
      let hoverLines = d3.selectAll('.link').filter(f=> {
        return selectedIDs.indexOf(f.target.id) > -1}).classed('hover', true);
      
        d3.selectAll('.label-wrap').attr('opacity', 0);
        
        let hoverLabel = shared.append('text').classed('hover-label', true);
        hoverLabel.text(t=> t['Artifact Type']);

        let viewOb = viewSingleton.getInstance();
  
        if(viewOb.currentView() === 'human-machine'){
            hoverLabel.style('transform', 'translate(40px, 12px)');
        }else{
            hoverLabel.attr('transform', 'translate(40, 40), rotate(45)')
        }
       
        
    }).on('mouseout', (event, m)=>{
        
        let param = d3.select(event.target.parentNode).data();
        let what = d[param];
        let shared = d3.selectAll('.artifact').filter(f=> f[param] === what).select('circle');
        shared.filter((f, i, n)=> d3.select(n[i]).classed('clicked-selected') === false).classed('hover', false);
        shared.filter((f, i, n)=> d3.select(n[i]).classed('clicked-selected') === false).attr('r', radius);
        let notShared = d3.selectAll('.artifact').filter(f=> f[param] != what).select('circle');
        notShared.filter((f, i, n)=> d3.select(n[i]).classed('clicked-selected') === false).classed('non-hover', false);
        d3.selectAll('.artifact').filter(f=> f.posID === d.posID).select('circle').classed('specific-chosen', false);
        d3.selectAll('.link').classed('hover', false);
        d3.selectAll('.link').classed('not-hover', false);

        d3.selectAll('.hover-label').remove();
        d3.selectAll('.label-wrap').attr('opacity', 1);
    });

    if(d['Source File'] != null){
        let buttonHistory = div.append('button')
        buttonHistory.classed('btn btn-outline-light btn-lg', true)
        buttonHistory.text('View Artifact History');
        buttonHistory.attr('id', 'history-button')
        buttonHistory.style('margin-top', '25px');
        buttonHistory.style('margin-bottom', '25px');

        let viewOb = viewSingleton.getInstance();

        buttonHistory.on('click', async (event, h)=>{

            let hisBoolOb = hisBoolSingleton.getInstance();
            hisBoolOb.changeHistoryBool();
            console.log('switch history', hisBoolOb.isHistoryOn())

            if(event.target.innerHTML === "View Artifact History"){

                event.target.innerHTML = "Hide Artifact History";
               
                let chosenSources = await getSources(d);

                let parent = d3.select(d3.select('.clicked-selected').node().parentNode);

                  //GETTING DEPENDICIES AND THEIR HISTORY
                let otherArtifacts = d3.selectAll('.artifact').filter(f=> {
                    return (f.Dependencies != null && f.Dependencies.includes(parent.data()[0].id)) || (parent.data()[0].Dependencies != null && parent.data()[0].Dependencies.includes(f['Artifact ID']))
                });

                let otherSources = await Promise.all(otherArtifacts.data().map(async m => {
                    return {'id': m.id, 'sources': await getSources(m)};
                }));

                if(viewOb.currentView() === "human-machine"){
                    renderHistoryHorizontal(chosenSources, otherSources);
                }else{
                    renderHistoryVertical(chosenSources, otherSources);
                }

            }else{
                event.target.innerHTML = "View Artifact History";
                removeHistory();
            }
        });

        div.append('h4').text(`Source Files for ${version}`);
        let source = div.selectAll('div.source').data(d['Source File']).join('div').classed('source', true);
        source.selectAll('text').data(d=> [d]).join('text').text(t=> `${t.format} for ${t.what}`);
       
        let buttonRawFile = source.selectAll('button').data(b=> [b]).join('button').classed('btn btn-secondary btn-sm', true).text('See Artifact');
        buttonRawFile.style('margin-left', '25px');

        buttonRawFile.on('click', (event, b)=> {

            if(event.target.innerHTML === "See Artifact"){

                d3.select('#wrapper').select('.more-info').select('div.raw-file').remove();

                d3.json(`${b.path}${version}/${version}${b.file_name}`).then(json => {
                
                    let rawData = d3.select('#wrapper').select('.more-info')
                    .append('div').classed('raw-file', true);
    
                    rawData.html(`${JSON.stringify(json)}`);
                    rawData.style('width', '440px');
                    rawData.style('height', '300px');
                    rawData.style('overflow-x', 'auto');
                    rawData.style('overflow-y', 'auto');
    
                });
                event.target.innerHTML = "Hide Artifact";
            }else{
                event.target.innerHTML = "See Artifact";
                d3.select('.raw-file').remove();
            }
          });
    }
  }