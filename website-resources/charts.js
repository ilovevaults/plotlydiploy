const config = {
  displayModeBar: false, // this is the line that hides the bar.
};
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wfreq=result.wfreq;
    var floatWfreq=parseInt(wfreq);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var metadata = data.metadata;
    var result = resultsArray[0];
    var resultArray2 = metadata.filter(sampleObj => sampleObj.id == sample);
    var result2 = resultArray2[0];
    var wfreq=result2.wfreq;
    var floatWfreq=parseInt(wfreq);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids
    var otu_labels = result.otu_labels
    var sample_values = result.sample_values
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
    {
      x:sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      y:yticks,
      type:"bar",
      orientation: "h"
    }];
   
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title:"Top 10 Bacteria Cultures Found",
     xaxis: {fixedrange: true},
     yaxis: {fixedrange: true}
    };
    var config={
      displayModeBar: false
    }
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", barData, barLayout,config);
    var bubbleData = [{
      x:otu_ids,
      y:sample_values,
      text:otu_labels,
      mode:'markers',
      marker: {
        color: otu_ids,
        size: sample_values}
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:'Bacteria Cultures Per Sample',
      xaxis: { title: "OTU ID" },
      xaxis: {fixedrange: true},
      yaxis: {fixedrange: true}
    };
    console.log(floatWfreq);
    console.log(wfreq);
    console.log(result)
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout,config); 
    var gaugeData = [{
      type:"indicator",
      mode:'gauge+number',
      value: floatWfreq,
      title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" },
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 490
        }
      }
    }
  ];
    
    // 5. Create the layout for the gauge chart.
  var gaugeLayout = {
    width: 500,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    paper_bgcolor: "white",
    font: { color: "black", family: "Arial" },
    xaxis: {fixedrange: true},
    yaxis: {fixedrange: true}
  };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData,gaugeLayout,config,);
  });
}
