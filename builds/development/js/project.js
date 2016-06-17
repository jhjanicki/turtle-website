
			var southWest = L.latLng(23, 122),
				northEast = L.latLng(29, 132),
				bounds = L.latLngBounds(southWest, northEast);

			var map = new L.Map("mapContainer", {
						center: [25.5, 127], 
						zoom: 8,
						minZoom:6,
						maxBounds: bounds,
						maxZoom:12
					});
		
			var tile1 = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
								attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
								}),
				tile2 = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
			
				});
		
				tile1.addTo(map);
			
			var layerControlItems = {
					  "<div class='layer-titles'> OSM Landscape </div>": tile1,
					  "<div class='layer-titles'> Topo </div>": tile2
					};
		
			L.control.layers(layerControlItems).addTo(map);
	
			map.scrollWheelZoom.disable();
			map.touchZoom.disable();
			
			var svg = d3.select(map.getPanes().overlayPane).append("svg"),
			g = svg.append("g").attr("class", "leaflet-zoom-hide");
			var okinawaPath =g.append("g");
	

			function projectPoint(x, y) {
				var point = map.latLngToLayerPoint(new L.LatLng(y, x)); 
				this.stream.point(point.x, point.y); 

			}
			var transform = d3.geo.transform({point: projectPoint}),
				path = d3.geo.path().projection(transform);


			var okinawa;
			
			
			
			 d3.json("../data/okinawa.json", function(error,data){
			 	console.log(data);
			 	
			 	
			 	  okinawa = data;
		  	  
		  
				  okinawaPath.selectAll("path")
					   .data(data.features)
					   .enter()
					   .append("path")
					   .attr("d", path)
					   .attr("fill", '#3F454C')
					   .classed('island',true)
					   .attr('id',function(d){
					   		return d.properties.NAME_2;
					   })
					   .style("stroke","white")
				   	   .style("stroke-width",0.5)
				       .style("opacity",0.7)
				       .on('mouseover',function(){
				       		d3.select(this)
				       		.style("opacity",0.4)
				       		.style('cursor','pointer');
				       })
				       .on('mouseout',function(){
				       		d3.select(this).style("opacity",0.7);
				       });
			 	
			 	
			 	
			 	var bounds = path.bounds(data),
					topLeft = bounds[0],
					bottomRight = bounds[1];
				
				 svg.attr("width", bottomRight[0] - topLeft[0])
					.attr("height", bottomRight[1] - topLeft[1])
					.style("left", topLeft[0] + "px")
					.style("top", topLeft[1] + "px");

				 g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
			 	
			 	
			 	var islandArray = [];
				$.each(data.features, function(i, value) {
					// console.log(value.properties.NAME_2);
					islandArray[i]=value.properties.NAME_2;
					 // $('#island').append($('<option>').text(value.properties.NAME_2).attr('value', value.properties.NAME_2));
				});
				
				// console.log(islandArray);
    			islandArray.sort();
    			// console.log(islandArray);
    			$.each(islandArray, function(i, value) {
    				$('#island').append($('<option>').text(value).attr('value', value));
    			});
    			
    			
    			
			 	
			 });
			 
			 
			 
			 $('#island').change(function() {
			 	var selected = $( "#island option:selected" ).text();
				zoomTo(selected);	
			});
			 
			 
			 function zoomTo(islandName){
				var islandGeom = lookupIsland(islandName);
				// console.log(islandGeom);
				var bounds = path.bounds(islandGeom); // this is in pixels, not geographic coordinates
			
				var southWest = map.layerPointToLatLng([bounds[1][0],bounds[0][1]]);
				var northEast = map.layerPointToLatLng([bounds[0][0],bounds[1][1]]);
		
				var leafletBounds = new L.LatLngBounds([southWest,northEast]);
				map.fitBounds(leafletBounds, {maxZoom:10, animate:true});
				
				colorSelected(islandName);
			
			}
			
			
			function getIslands(){
				return g.selectAll('.island');
			}

			function lookupIsland(islandName){
				var selectedPath;
				
				getIslands().each(function(d) {
					if(d.properties.NAME_2==islandName){
						selectedPath = d;
						// console.log(d);
					}
				});
				
				return selectedPath;
			}
			
			function colorSelected(selectedID){
				g.selectAll('.island').attr("fill", '#3F454C');
				g.select('#'+selectedID).attr("fill",'#57BD91');
				
			}
			 
			 map.on("viewreset", resetView);
			 
			function resetView() {
				if (okinawa) {
					var bounds = path.bounds(okinawa),
						topLeft = bounds[0],
						bottomRight = bounds[1];
				

					svg.attr("width", bottomRight[0] - topLeft[0] + 1000)
							.attr("height", bottomRight[1] - topLeft[1])
							.style("left", topLeft[0] + "px")
							.style("top", topLeft[1] + "px");

					g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

					okinawaPath.selectAll('path').attr("d", path);		
				}
			
			}
			 
			 
			 
			 
			 
			 
			 
