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
    let labels = sampleFilter.map(results => results.otu_labels);
    console.log(labels)
    let value = sampleFilter.map(results => results.sample_values);
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

    /////////////////////////////Add Steps, Threshold, and Delta
    //In Step 3, create variable that converts washing frequency to 
    //a floating point number.
    let wf = data.metadata.filter(sampleObj => sampleObj.id.toString() == sample)[0];
    var frequency = parseFloat(wf.wfreq)

    var data = [{
      domain: {
        x: [0, 1],
        y: [0, 1]
      },
      value: frequency, ////Assign the variable created in Step 3 to the value property.
      title: {
        text: "Belly Button Washing Frequency",
        // font: {
        //   size: 28,
        //   color: "black",
        //   pad: 10,
        // }
      }, //assign the title as string using HTML syntax to the text property.
      //title: { text: "Scrubs per week" },
      type: "indicator", //The type property should be "indicator".
      mode: "gauge+number", //The mode property should be "gauge+number".
      //delta: { reference: 10, increasing: { color: "darkorange" }  },
      gauge: {
        axis: {
          range: [null, 10],
        },
        bar: {
          color: "navy"
        },
        steps: [{
            range: [0, 2],
            color: "steelblue"
          },
          {
            range: [2, 4],
            color: "skyblue"
          },
          {
            range: [4, 6],
            color: "wheat"
          },
          {
            range: [6, 8],
            color: "bisque"
          },
          {
            range: [8, 10],
            color: "orange"
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
      // paper_bgcolor: "blue",
      autosize: true, // set autosize to rescale
      // width: 500,
      // height: 500,
      // margin: {
      //   t: 30,
      //   b: 30,
      //   l: 50,
      //   r: 50,
      //   pad: 4
      // },
      // font: {
      //   family: 'Arial, monospace',
      //   size: 18,
      //   color: 'black',
      // },
      title: {
        color: "black",
        // size: 24,

      }
    };
    var config = {
      responsive: true,
      staticPlot: true,
    }
    Plotly.newPlot(gauge, data, layout, config);

    ///////////////////////////Bar Chart with Hover Text: Steps 8-9
    var trace1 = {
      type: 'bar',
      x: topTenvalues[0], // x values are the sample_values in descending order
      y: topTenid, //The y values are the otu_ids in descending order
      orientation: "h",
      text: topTenlabels[0], //hover text for the bars are the otu_labels in descending orde
      marker: {
        color: 'blue',
        width: 1
      }
    };

    var data = [trace1];

    var layout = {
      title: 'Top 10 Bacteria Cultures Found',
    };
    var config = {
      responsive: true
    };

    Plotly.newPlot("bar", data, layout, config);
    //--------------------------------------------------------------------



    /////////////////////////////Hover Text on Bubble Charts
    let bubbleValue = sampleFilter.map(results => results.sample_values.reverse());
    console.log(bubbleValue)
    var trace1 = {
      x: Ids[0], //Sets the otu_ids as the x-axis values
      y: bubbleValue[0], //Sets the sample_values as the y-axis values
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

      title: 'Bacteria Cultures Per Sample',
      //^^^
      //xaxis
      //paper_bgcolor: "midnightblue",
      // showlegend: false,
      // height: 600, //^^^
      // width: 900,

      //margin: { t: 20, b: 40, l:100, r:100 }, 
    };

    var config = {
      responsive: true,
      autosize: true, // set autosize to rescale
    };

    Plotly.newPlot(bubble, data, layout, config);

  });

}