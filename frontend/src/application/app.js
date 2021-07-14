import "../styles/index.scss";
import * as d3 from "d3";
import * as d3Array from "d3-array";
import "bootstrap/dist/js/bootstrap.bundle";
import "../components/sidebar";
import * as dataF from "../../vendors/artifact-data.json";
import * as depend from "../components/dependencyVis";

const radius = 9;

let nodeFormat = dataF.map((m, i)=>{
  m.name = m['Artifact Type'];
  m.id = m['Artifact ID'];
  m.posID = i;
  return m});

let svg = d3.select('#container').select('#wrapper').append('svg').classed('svg-wrap', true);

depend.renderDependencyVis(nodeFormat);



