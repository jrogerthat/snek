import "bootstrap/dist/js/bootstrap.bundle";

import "../components/sidebar";
import * as d3 from "d3";

const path = require('path');
const fs = require('fs');

window.document.addEventListener("DOMContentLoaded", function () {
  window.console.log("dom ready 2");
  window.console.log(d3.select('.d-flex.justify-content-center').select('table').selectAll('tr'))
});
