sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/HashChanger",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	'jquery.sap.global'
], function (Controller, HashChanger, JSONModel, BusyIndicator, MessageBox, MessageToast, Filter, jQuery) {
	"use strict";
	return Controller.extend("sap.innventInnvent.controller.Farmers", {
		data: {},
		_saveFlag : true,
		onInit: function () {
			var oController = this;
			var farmerModel = new sap.ui.model.json.JSONModel();
			farmerModel.setData({"farmers" : []});
			oController.getView().setModel(farmerModel, "farmerModel");
			this.initialiseModels(oController);
		},

		initialiseModels: function (oController) {
			oController.setSearchModel();
//			var sPath = jQuery.sap.getModulePath("sap/innventInnvent/model", "/farmer.json");
//			var farmerModel = new sap.ui.model.json.JSONModel();
//			farmerModel.loadData(sPath);
//			farmerModel.attachRequestCompleted(function(oEvent){
//				oController.getView().setModel(farmerModel, "farmerModel");
//				var dataLength =oController.getView().getModel("farmerModel").getData().farmers.length;
//				oController.getView().getModel("farmerModel").setProperty('/farmerCount',dataLength);
//				oController.getView().getModel("farmerModel").refresh();
//			});
			var that = oController;
			var crops = [];
			$.ajax({
                url: "/api/crop/all",
                contentType: 'text/plain',
                type: "GET",
                async: "async",
                csrfFetch: true,
                success: function(oResponse, status, xhr) {
                	oResponse.forEach(function(item){
                    	crops.push({"id":item.cropId, "name":item.name});
                    	
                	});
                	that.getView().getModel("searchModel").setData({crops});
                	that.getView().getModel("searchModel").refresh();
                },
                error: function(a, b, c) {
                    var error= b;
                }
            });
			that.getFarmerDetails(that);
		},

		getFarmerDetails : function(oController){
			$.ajax({
                url: "/api/person/all",
                contentType: 'text/plain',
                type: "GET",
                async: "async",
                csrfFetch: true,
                success: function(oResponse, status, xhr) {
                	for(var i=0;i<oResponse.length;i++){
                		if(0<parseInt(oResponse[i].progressPercent) && parseInt(oResponse[i].progressPercent)<40){
                			oResponse[i]['color'] ="Error";
                		}
                		else if(40<parseInt(oResponse[i].progressPercent) && parseInt(oResponse[i].progressPercent)<70){
                			oResponse[i]['color'] ="Critical";
                		}
                		else if(70<parseInt(oResponse[i].progressPercent) && parseInt(oResponse[i].progressPercent)<100){
                			oResponse[i]['color'] ="Good";
                		}
                		oResponse[i]['performance']=[{"color":oResponse[i]['color'],"progressPercent":oResponse[i].progressPercent}];
                	}
                	var data = {"farmers" : oResponse};
                	var farmerModel = oController.getView().getModel("farmerModel");
                	farmerModel.setData(data);
                	var dataLength =oController.getView().getModel("farmerModel").getData().farmers.length;
    				oController.getView().getModel("farmerModel").setProperty('/farmerCount',dataLength);
    				oController.getView().getModel("farmerModel").refresh();
                },
                error: function(a, b, c) {
                    var error= b;
                }
            });
		},
		
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		setSearchModel: function () {
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "searchModel");
		},

		onCreateNewTargets: function (oEvent) {
			var oController = this;
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var oTable = this.getView().byId("idAMTargetTable");
			if (oTable.getModel("farmerModel")) {
				var existingData = oTable.getModel("farmerModel").getData().farmers;
				if (existingData.length > 1 && existingData[0].cropVariety === "") {
					return;
				} else {
					if (sap.ui.getCore().byId("detailPageView") !== undefined && sap.ui.getCore().byId("detailPageView").getController()._saveFlag ===
						false) {
						MessageBox.show(resourceBundle.getText("UNSAVED_CHANGES_WARNING"), {
							title: resourceBundle.getText("CONFIRMATION"),
							actions: [
								sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL
							],
							onClose: function (oEvt) {
								if (oEvt === "OK") {
									oController._handleAdd(existingData, oController, oTable);
									sap.ui.getCore().byId("detailPageView").getController()._saveFlag = true;
								} else {
									return;
								}
							}
						});
						return;
					}
					oController._handleAdd(existingData, oController, oTable);
					
				}
			} else {
				return;
			}
		},

		_handleAdd: function (existingData, oController, oTable) {
			existingData.unshift({
				"name": "",
				"cropVariety": "",
				"location": "",
				"range": "",
				"displayColor": "Neutral",
				"displayValue": 0,
				"bars": [],
				"expectedQuantity": ""
			});
			oTable.getModel("farmerModel").refresh();
			oController._saveFlag = false;
			oTable.getItems()[0].firePress();
			oController.bus = sap.ui.getCore().getEventBus();
			oController.bus.publish("flexible", "setDetailPage");
			oController.detailPageController = sap.ui.getCore().byId("detailPageView").getController();
			oController.detailPageController._showFormFragment("createNewFarmer", "Display");
			oController.detailPageController.onInit();
		},

		handleSelectionChange: function (oEvent) {
			var that = this;
			var selectedItem = oEvent.getParameter('listItem');
			var targetModel = this.getView().getModel("farmerModel");
			//handle edit after edit target not svaed
			if (sap.ui.getCore().byId("detailPageView") !== undefined && sap.ui.getCore().byId("detailPageView").getController()._saveFlag ===
				false) {
				this.showUnsavedChangesMessage(this,false,targetModel,selectedItem);
				return;
			}

			if (targetModel && targetModel.getData().farmers.length > 1 && targetModel.getData().farmers[0].cropVariety == "") {
				//handle edit after add target wasn't saved
				if (this._saveFlag == false) {
					this.showUnsavedChangesMessage(this,true,targetModel,selectedItem);
					return;
				}
			}
			if (targetModel && targetModel.getData().farmers.length === 1 && targetModel.getData().farmers[0].cropVariety == "") {
				return;
			}
			this._handlePress(selectedItem);
		},
		
		showUnsavedChangesMessage : function(oController,createFlag,targetModel,selectedItem){
			var resourceBundle = oController.getView().getModel("i18n").getResourceBundle();
			MessageBox.show(resourceBundle.getText("UNSAVED_CHANGES_WARNING"), {
				title: resourceBundle.getText("CONFIRMATION"),
				actions: [
					sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL
				],
				onClose: function (oEvt) {
					if (oEvt === "OK") {
						if(createFlag == true){
							targetModel.getData().farmers.splice(0, 1);
							targetModel.refresh();
							oController._saveFlag = true;
						}else{
							sap.ui.getCore().byId("detailPageView").getController()._saveFlag = true;
						}
						oController._handlePress(selectedItem);
					} else {
						return;
					}
				}
			});
		},
		
		_handlePress: function (selectedItem) {
			var requiredData = jQuery.extend(true, {}, selectedItem.getBindingContext("farmerModel").getObject());
			requiredData['dimCount'] = requiredData.dimensions ? requiredData.dimensions.length : 0;
			requiredData['threshCount'] = requiredData.thresholds ? requiredData.thresholds.length : 0;
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("flexible", "setDetailPage");
			this.detailPageController = sap.ui.getCore().byId("detailPageView").getController();
			this.detailPageController._showFormFragment("displayFarmer", "Display");
			this.detailPageController.setDisplayData(requiredData);
		},

		onSelectToDelete: function (oEvent) {
			this.getView().getModel("targetModel").setProperty('/enableDelete', true);
			this.getView().getModel("targetModel").refresh();
		},

		searchTargets: function () {
			var oThis = this;
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var searchModel = this.getView().getModel("searchModel");
			if (searchModel) {
				var searchData = searchModel.getData();
				if (!searchData.name && !searchData.amId && !searchData.nodeId) {
					MessageBoxUtil.displayError(resourceBundle.getText("SELECT_SEARCH_CRITERIA"));
					return;
				} else {
					Api.get(Urls.searchTargets(searchData.name, searchData.amId, searchData.nodeId)).done(function (d, s, x) {
							var result = d;
							oThis.setTargets(result, oThis);
							oThis.getView().setBusy(false);
						})
						.fail(function (d, s, x) {
							DateUtils.errorHandler(d);
							oThis.getView().setBusy(false);
						})
						.always(function () {
							oThis.getView().setBusy(false);
						});
				}
			}
		}

	});
});