import "../styles/index.scss";
import * as d3 from "d3";
import "bootstrap/dist/js/bootstrap.bundle";
import "../components/sidebar";
import * as dataF from "../../vendors/artifact-data.json";
import * as depend from "../components/dependencyVis";
import { dropDownInteraction } from "./generalHelpers";

let nodeFormat = dataF.map((m, i)=>{
  m.name = m['Artifact Type'];
  m.id = m['Artifact ID'];
  m.posID = i;
  return m});

let svg = d3.select('#container').select('#wrapper').append('svg').classed('svg-wrap', true);
dropDownInteraction(nodeFormat);
depend.renderDependencyVis(nodeFormat);



