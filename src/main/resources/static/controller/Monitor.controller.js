sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/HashChanger",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	'jquery.sap.global'
], function(Controller, HashChanger, JSONModel, BusyIndicator, MessageBox, MessageToast, Filter, jQuery) {
	"use strict";
	return Controller.extend("sap.innventInnvent.controller.Monitor", {
		data: {},
		_saveFlag: true,
		onInit: function() {
			var oController = this;
			this.getView().byId("map_canvas").addStyleClass("myMap");
//			var sPath = jQuery.sap.getModulePath("sap/innventInnvent/model", "/monitorDetails.json");
			var oDetails = new sap.ui.model.json.JSONModel();
//			var mapDetails = new sap.ui.model.json.JSONModel();
//			oController.getView().setModel(mapDetails, "mapDetails");
//			oDetails.loadData(sPath);
//			oDetails.attachRequestCompleted(function(oEvent) {
				
				
//			});
			$.ajax({
                url: "/api/person/all",
                contentType: 'text/plain',
                type: "GET",
                async: "async",
                csrfFetch: true,
                success: function(oResponse, status, xhr) {
                	oController.getView().setModel(oDetails, "monitorDetails");
    				
                	oResponse.forEach(function(item){
                		  item.land.expectedQuantity =  parseFloat(item.land.expectedQuantity.split(" ")[0]);
                		  item.land.actualQuantity = item.land.actualQuantity?  parseFloat(item.land.actualQuantity.split(" ")[0]) : 0;
                		  item.land['diff'] = parseFloat(item.land.expectedQuantity) - parseFloat(item.land.actualQuantity);
                		  if(item.land.diff>=500){
                  			item.land['color'] ="Error";
                  			item.land['indicator']="Down";
                  		  }
                  		  else if(item.land.diff>300 && item.land.diff<500){
                  			item.land['color'] ="Critical";
                  			item.land['indicator']="Down";
                  		  }
                  		  else if(item.land.diff<=300){
                  			item.land['color'] ="Good";
                  			item.land['indicator']="Up";
                  		  }
                	})
                	var data = {"details" : oResponse};
                	var farmerModel = oController.getView().getModel("monitorDetails");
                	farmerModel.setData(data);
                	var headerContainer = oController.getView().byId('oh1').getHeaderContainer();
    				var oContent = headerContainer.getContent()[0];
                	oContent.addEventDelegate({
    					onAfterRendering: function() {
    						jQuery('#' + oContent.getId()).addClass("tilePressed");
    						oController.showDetails(oController);
    					}
    				});
    				oController.getView().getModel("monitorDetails").refresh();
                },
                error: function(a, b, c) {
                    var error= b;
                }
            });
		},

		showDetails: function(oController, oEvent) {
			var oSource = "",
				name = "";
			var headerContainer = oController.getView().byId('oh1').getHeaderContainer();
			var oContent = headerContainer.getContent()[0];
			if (oEvent) {
				oSource = oEvent.getSource().getParent().getParent();
				name = oSource.getItems()[0].getText();
			} else {
				oSource = oContent.getContent();
				name = oSource.getItems()[0].getText();
			}
	         var oModelData = oController.getView().getModel('monitorDetails').getData().details;
//	         oFrameContent.setAttribute("src", "https://sapui5.hana.ondemand.com/sdk/"); 
//			var sPath = jQuery.sap.getModulePath("sap/innventInnvent/model", "/monitor.json");
			var selectedObject;
			var oDetails = new sap.ui.model.json.JSONModel();
//			oDetails.loadData(sPath);
//			oDetails.attachRequestCompleted(function(oEvent) {
				oController.getView().setModel(oDetails, "moreDetails");
//				var oModelData = oController.getView().getModel("moreDetails").getData().mapDetails;
				for (var i = 0; i < oModelData.length; i++) {
					if (oModelData[i].name === name) {
						selectedObject = oModelData[i];
//						oController.getView().byId("idFrame").setContent("<iframe height='100%' width='100%' src=" + oModelData[i].land.earthEngineUrl + "/>"); 
//						oFrameContent.setAttribute("src", oModelData[i].land.earthEngineUrl); 
					}
				}
				var plots = [{'area':selectedObject.land.area,'crop':selectedObject.crop.name,'link':selectedObject.land.earthEngineUrl}];
				oController.getView().getModel("moreDetails").setData({'plots' : plots});
//				oController.getView().getModel("mapDetails").refresh();
				oController.showMarkersOnMap(selectedObject.land);
//			});
		},

		onPress: function(oEvent) {
			var oControl = oEvent.getSource().getParent().getParent().getParent();
			var currentTile = oControl.getId();
			$('.tilePressed').removeClass("tilePressed");
			jQuery('#' + currentTile).addClass("tilePressed");
			this.showDetails(this, oEvent);
		},
		onAfterRendering: function() {
			if (!this.initialized) {
				this.initialized = true;
				var markers = {'latitude':"12.95389",'longitude':"12.95389"};
//				var markers = [{
//					"lat":"30.9010",
//         			"lng":"75.8573",
//					"content": "48%",
//					"title": "Plot 1"
//				}, {
//					"lat":"30.9007",
//         			"lng":"75.8563",
//					"content": "78%",
//					"title": "Plot 2"
//				}, {
//					"lat":"30.9012",
//         			"lng":"75.8503",
//					"content": "26%",
//					"title": "Plot 3"
//				}];
				this.showMarkersOnMap(markers);
			}

		},

		showMarkersOnMap: function(markers) {
			window.mapOptions = {
				center: new google.maps.LatLng(markers.latitude,markers.longitude),
				zoom: 24,
				mapTypeId: 'satellite'
			};
			var map = new google.maps.Map(this.getView().byId("map_canvas").getDomRef(), window.mapOptions);
			var infoWindow = new google.maps.InfoWindow();
			var lat_lng = new Array();
			var latlngbounds = new google.maps.LatLngBounds();
//			for (var i = 0; i < markers.length; i++) {
				var data = markers;
				var myLatlng = new google.maps.LatLng(data.latitude, data.longitude);
				lat_lng.push(myLatlng);
				this.newmap = map;
//				var content = data.content.substr(0, data.content.length - 1);
				var marker = new google.maps.Marker({
					position: myLatlng,
					map: map,
					title: data.title,
					icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
				});
				latlngbounds.extend(marker.position);
//				(function(marker, data) {
//					google.maps.event.addListener(marker, "click", function(e) {
//						var oContent = data.content.substr(0, data.content.length - 1);
//						var additionalInfo = (parseInt(oContent) < 50) ? "has less chlorophyll content" : "has sufficient chlorophyll content";
//						infoWindow.setContent(data.title + " " + additionalInfo);
//						infoWindow.open(map, marker);
//					});
//				})(marker, data);
	//		}
			map.setCenter(latlngbounds.getCenter());
			map.fitBounds(latlngbounds);

		},

		onShowMessage: function(msg) {
			MessageToast.show(msg);
		}

	});
});