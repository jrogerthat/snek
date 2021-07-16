import * as d3 from "d3";
import { renderDependencyVis } from "../components/dependencyVis";
import { renderHumanVsMachine } from "../components/humanVsMachineVis";

export function machineOrHuman(d){
    if(d['Transmission Mode'] === "Boundry Crossing/M-H" || d['Transmission Mode'] === "Non-Boundary/M-M"){ return "machine"}
    else if(d['Transmission Mode'] === "Boundry Crossing/H-M" || d['Transmission Mode'] === "Non-Boundary/H-H" ){
      return "human"
    }
  }

  const dropdownDictionary = {
      'Human vs Machine' : renderHumanVsMachine,
      'Artifact Dependencies' : renderDependencyVis
  }

  export function dropDownInteraction(nodes){
      d3.select('.dropdown').selectAll('.dropdown-content').selectAll('p').on('click', (event, d)=>{
        d3.select('.dropdown').select('span').text(d3.select(event.target).text());
        d3.select('#wrapper').select('svg').selectAll('.secondary-vis').selectAll('*').remove();
        dropdownDictionary[d3.select(event.target).text()](nodes);
      });
  }