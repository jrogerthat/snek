import * as d3 from "d3";
import { renderDependencyVis } from "../components/dependencyVis";
import { renderHumanVsMachine } from "../components/humanVsMachineVis";
import { versionSingleton } from "./versionControlSingleton";

export function machineOrHuman(d){
    if(d['Transmission Mode'] === "Boundry Crossing/M-H" || d['Transmission Mode'] === "Non-Boundary/M-M"){ 
      return "machine";
    }else if(d['Transmission Mode'] === "Boundry Crossing/H-M" || d['Transmission Mode'] === "Non-Boundary/H-H" ){
      return "human";
    }else{
      return "other";
    }
  }

  const dropdownDictionary = {
      'Human vs Machine' : renderHumanVsMachine,
      'Artifact Dependencies' : renderDependencyVis
  }

  export function dropDownChangeView(nodes){
      d3.select('#view.dropdown').selectAll('.dropdown-content').selectAll('p').on('click', (event, d)=>{
        d3.select('.dropdown').select('span').text(d3.select(event.target).text());
        d3.select('#wrapper').select('svg').selectAll('.secondary-vis').selectAll('*').remove();
        d3.selectAll('.label-wrap').remove();
        dropdownDictionary[d3.select(event.target).text()](nodes);
      });
  }

  export function dropDownChangeVersion(){
    d3.select('#version.dropdown').selectAll('.dropdown-content').selectAll('p').on('click', (event, d)=>{
      d3.select('.dropdown').select('span').text(d3.select(event.target).text());
      let versOb = versionSingleton.getInstance();
      versOb.changeVersion(d3.select(event.target).text());
      console.log(versOb.currentVersion());
    });


}

export function getSources(data){
  let versOb = versionSingleton.getInstance();
  return versOb.otherVersions().map( ov => {
    let topOb = {};
    topOb.version = ov;
    console.log(data['Source File'])
    let sourceFile = data['Source File'] != null ? data['Source File'] : [];
    topOb.sources = sourceFile.map( async m => {

        let ob = {}
        if(sourceFile.length > 0){

          let json = await d3.json(`${m.path}${ov}/${ov}${m.file_name}`);
          ob.key = m.what;
          ob.value = json.changed_from_prev === true ? json : null;

        }

        return ob;
    });
    return topOb;
  });
}