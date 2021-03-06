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
  // Deliverable 1
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array.
      var jsSamples = data.samples; 
  
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var sampleArray = jsSamples.filter(sampleObj => sampleObj.id == sample);
      //console.log(sampleArray);
  
      // Delieverable 3 # 1. Create a variable that filters the metadata array for the object with the desired sample number.
      // Deliverable 3 # 2. Create a variable that holds the first sample in the metadata array.
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      //console.log(result);
  
      //  5. Create a variable that holds the first sample in the array.
      var individualResults = sampleArray[0];
      //console.log(individualResults);
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIds = individualResults.otu_ids;
      var otuLabels = individualResults.otu_labels;
      var sampleValues = individualResults.sample_values;
      
      // Deliverable 3 # 3. Create a variable that holds the washing frequency.
      var washFreq = parseFloat(result.wfreq);
      //console.log(washFreq);
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      var yticks = otuIds.map(object => "OTU "+object).slice(0,10).reverse();
      var slicedOtuLabels = otuLabels.map(object => object).slice(0,10).reverse();
      var slicedSampleValues = sampleValues.map(object => object).slice(0,10).reverse();
  
      // 8. Create the trace for the bar chart. 
      // Use Plotly to plot the bar data and layout.
      // Plotly.newPlot();     
      var barData = {
        x: slicedSampleValues,
        y: yticks,
        text: slicedOtuLabels,
        type: "bar",
        orientation: "h"
      };
      var plotData = [barData];
  
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {
          l: 200,
          r: 0,
          t: 100,
          b: 100
        }
      };
  
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", plotData, barLayout);
    
  // Deliverable 2
  // Use Plotly to plot the bubble data and layout.
  // Plotly.newPlot();
  // 1. Create the trace for the bubble chart.
  var bubbleData = [{
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
    color: otuIds,
    size: sampleValues
    }
  }];
  
  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: 'Bacteria Cultures Per Sample',
    showlegend: false,
    xaxis: {
      title: {
        text: 'OTU ID'
      }
    },
    height: 500,
    width: 600,
    margin: {
      l: 30,
      r: 0,
      t: 100,
      b: 100
    }
  };
  
  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
  
  // Deliverable 3
  // Deliverable 3, parts 1-3 were completed earlier. Please see above.
     
      // 4. Create the trace for the gauge chart.
      var gaugeData = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: washFreq,
          title: { text: "Belly Button Washing Frequency <br><sup>Scrubs per Week</sup>", font: { size: 24 } },
          gauge: {
            axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "black" },
            bgcolor: "white",
            borderwidth: 1,
            bordercolor: "black",
            steps: [
              { range: [0, 2], color: "red" },
              { range: [2, 4], color: "orange" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "lightgreen" },
              { range: [8, 10], color: "green" }
            ]
          }
        }
      ];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = {
        width: 400,
        height: 300,
        margin: { t: 100, r: 25, l: 25, b: 25 },
        font: { color: "black", family: "Arial" }
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
  }