sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("sap.innventInnvent.controller.Tile", {
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		navToFarmerPage : function(){
			this.getRouter().navTo("Farmer");
		},
		navToCropPage : function(){
			this.getRouter().navTo("Crop");
		},
		navToCropMonitor : function(){
			this.getRouter().navTo("Monitor");
		},
		navToAlertsPage: function(){
			this.getRouter().navTo("Alerts");
		}
	});
});