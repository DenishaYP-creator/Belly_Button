//--------INIT FUCTION 
function init() {
  var selector = d3.select("#selDataset"); // Grab a reference to the dropdown select element
  d3.json("samples.json").then((data) => { // Use the list of sample names to populate the select options
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    var firstSample = sampleNames[0]; // Use the first sample from the list to build the initial plots
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
init(); // Initialize the dashboard
//------NEW SAMPLE FUCTION 
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}
//BUILD METADATA FUCTION --Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata"); // Use d3 to select the panel with id of `#sample-metadata`
    PANEL.html(""); // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, use d3 to append new tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
//DELIVERABLE 1 // @TODO:1Create the buildCharts function.
function buildCharts(sample) {
  // @TODO:2 Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    //console.log(data)
    // @TODO:3 Create a variable that holds the samples array.
    //console.log(samples)
    let samples = data.samples;
    // @TODO:4 Create a variable that filters the samples for the object with the desired sample number.
    let sampleFilter = samples.filter(sampleObj => sampleObj.id.toString() == sample);
    //let sampleFilter = samples.filter(sampleObj => sampleObj.id == sample);
    //console.log(sampleFilter)
    // @TODO:5 Create a variable that holds the first sample in the array.
    let firstSample = sampleFilter[0];
    console.log(firstSample)
    // @TODO:6 Create variables that hold the otu_ids, otu_labels, and sample_values.
    let labels = sampleFilter.map(results => results.otu_labels.reverse());
    console.log(labels)
    let value = sampleFilter.map(results => results.sample_values.reverse());
    console.log(value)
    let Ids = sampleFilter.map(results => results.otu_ids.reverse());
    console.log(Ids)
    /*@TODO:7 Create the yticks for the bar chart. ** Hint: Get top 10 otu_ids 
    map them in descending order so the otu_ids with the most bacteria are last.*/
    let topTen = sampleFilter.map(results => results.otu_ids.slice(0, 10).reverse());
    console.log(topTen)

    let topTenid = topTen[0].map(temp => "OTU " + temp);
    console.log(topTenid)



    let topTenvalues = sampleFilter.map(results => results.sample_values.slice(0, 10).reverse());
    console.log(topTenvalues)
    let topTenlabels = sampleFilter.map(results => results.otu_labels.slice(0, 10).reverse());
    console.log(topTenlabels)

    /////////////////////////////Hover Text on Bubble Charts
    var trace1 = {
      x: Ids[0], //Sets the otu_ids as the x-axis values
      y: value[0], //Sets the sample_values as the y-axis values
      text: labels[0], //Sets the otu_labels as the hover-text values
      mode: 'markers', //^^
      marker: {
        color: Ids[0], //ets the otu_ids as the marker colors
        size: value[0] //Sets the sample_values as the marker size
        //colorscale: 
      }
    };

    var data = [trace1];
    /*To create the layout for the bubble chart in Step 2, 
    add a title, a label for the x-axis, margins, and the 
    hovermode property. The hovermode should show the text 
    of the 
    bubble on the chart when you hover near that bubble. */

    var layout = {
      title: 'Bacteria Cultures Per Sample', //^^^
      //xaxis
      showlegend: false,
      height: 600, //^^^
      width: 1000
      //margin: { t: 20, b: 40, l:100, r:100 }, 
    };

    Plotly.newPlot(bubble, data, layout);


    //In Step 3, create variable that converts washing frequency to a floating point number.


    /////////////////////////////Add Steps, Threshold, and Delta


    var data = [{
      domain: {
        x: [0, 1],
        y: [0, 1]
      },
      value: 3, ////Assign the variable created in Step 3 to the value property.
      title: {
        text: "Belly Button Washing Frequency"
      }, //assign the title as string using HTML syntax to the text property.
      //title: { text: "Scrubs per week" },
      type: "indicator", //The type property should be "indicator".
      mode: "gauge+number", //The mode property should be "gauge+number".
      //delta: { reference: 380 },
      gauge: {
        axis: {
          range: [null, 10]
        },
        steps: [{
            range: [0, 2],
            color: "red"
          },
          {
            range: [2, 4],
            color: "orange"
          },
          {
            range: [4, 6],
            color: "yellow"
          },
          {
            range: [6, 8],
            color: "lime"
          },
          {
            range: [8, 10],
            color: "green"
          }, //For maximum range for the gauge should be 10.

        ],
        threshold: {
          line: {
            color: "red",
            width: 4
          },
          thickness: 0.75,
          //value: 490
        }
      }
    }];

    var layout = {
      width: 700,
      height: 600,
      margin: {
        t: 20,
        b: 40,
        l: 100,
        r: 100
      }
    };
    Plotly.newPlot(gauge, data, layout);


    ///////////////////////////Bar Chart with Hover Text: Steps 8-9
    var trace1 = {
      type: 'bar',
      x: topTenvalues[0], // x values are the sample_values in descending order
      y: topTenid, //The y values are the otu_ids in descending order
      orientation: "h",
      text: topTenlabels[0], //hover text for the bars are the otu_labels in descending orde
      marker: {
        color: 'rgb(142,124,195)',
        width: 1
      }
    };

    var data = [trace1];

    var layout = {
      title: 'Top 10 Bacteria Cultures Found',
    };

    Plotly.newPlot("bar", data, layout);
    //--------------------------------------------------------------------




  });

}