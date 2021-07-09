import "../styles/index.scss";
import * as d3 from "d3";
import "bootstrap/dist/js/bootstrap.bundle";
import "../components/sidebar";
import * as directory from "../../vendors/data_jsons/json_directory.json"
import * as dataF from "../../vendors/API-Artifact-Characterization.csv"

window.document.addEventListener("DOMContentLoaded", function () {
  window.console.log("dom ready 1");
});

//let data = d3.json('static/data_jsons/json_directory.json');

console.log('data',d3.csv("../../vendors/API-Artifact-Characterization.csv"));

let wrap = d3.select('body').append('div').attr('id', 'directories').classed('container', true);
let folder = wrap.selectAll('div.folder').data(directory.folders).join('div').classed('folder', true);
let link = folder.selectAll('a').data(d=> [d]).join('a').text(d=> d);
//link.selectAll('text').data(d=> [d]).join('text').text(d=> d);
link.text(d=> d);
link.attr('href', d => d)
folder.on('click', (event, d)=>{
  console.log(event, d, window.location.host);
})
