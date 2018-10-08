sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/HashChanger",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter"
], function(Controller, HashChanger, JSONModel, BusyIndicator, MessageBox, MessageToast, Filter) {
	"use strict";

	return Controller.extend("sap.innventInnvent.controller.DetailPageCrop", {
		oEditFlag: false,
		_addFlag: false,
		data: {},
		_saveFlag: true,
		oModel: new sap.ui.model.json.JSONModel(),
		_formFragments: {},
		onInit: function() {
			this._formFragments = {};
			this.bus = sap.ui.getCore().getEventBus();
			this.setModels();
		},
		setModels: function() {
			this.oModel.setData(this.data);
			this.getView().setModel(this.oModel);
			this._setViewModel();
		},

		getI18nText: function(text) {
			var resourceBundle = this.getView().getViewData().i18nModel;
			return resourceBundle.getProperty(text);
		},
		_setViewModel: function() {
			var viewModel = new sap.ui.model.json.JSONModel();
			var viewData = {
				"footer": false,
				"cropHeaderName": this.getI18nText("NEW_CROP"),
				"thresholds": [{
					"name": "Sowing",
					"src": "images/sowing.jpg"
				}, {
					"name": "Irrigation/Growth",
					"src": "images/irrigation.jpg"
				}, {
					"name": "Harvest",
					"src": "images/harvest.jpg"
				}]
			};
			viewModel.setData(viewData);
			this.getView().setModel(viewModel, "createModelCrop");
		},
		onExit: function() {
			var oThis = this;
			oThis._destroyDialogs();
		},

		_getFormFragment: function(sFragmentName) {
			var oFormFragment = this._formFragments[sFragmentName];
			if (oFormFragment) {
				return oFormFragment;
			}
			oFormFragment = sap.ui.xmlfragment("id" + sFragmentName, "sap.innventInnvent.fragment." + sFragmentName, this);
			return (this._formFragments[sFragmentName] = oFormFragment);
		},

		_showFormFragment: function(sFragmentName, bType) {
			var oPage = this.getView().byId("detailsPageCrop");
			oPage.setShowFooter(this._setFooterVisibilty(sFragmentName));
			var saveButton = oPage.getFooter().getContent()[1];
			saveButton.setEnabled(this._enableSaveButton(sFragmentName));
			if (oPage.getContent().length > 0) {
				oPage.destroyContent();
				oPage.removeAllContent();
				this._formFragments[sFragmentName] = null;
			}
			if (sFragmentName !== null) {
				oPage.insertContent(this._getFormFragment(sFragmentName));
			}
		},
		_setFooterVisibilty: function(oFormFragment) {
			switch (oFormFragment) {
				case "createNewCrop":
					return true;
				case "displayCrop":
					return false;
				case "EditTarget":
					return true;
			}
		},

		_enableSaveButton: function(oFormFragment) {
			switch (oFormFragment) {
				case "CreateNewTarget":
					return true;
				case "EditTarget":
					return true;
				default:
					return true;
			}
		},

		handleFullScreenButton: function(oEvent) {
			var layout = this.getView().getParent().getParent();
			if (layout !== undefined) {
				var layoutType = layout.getLayout();
				if (layoutType === "MidColumnFullScreen") {
					layout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
				} else {
					layout.setLayout(sap.f.LayoutType.MidColumnFullScreen);
				}
			}
		},

		handleCloseFlexibleColumnLayout: function() {
			var oController = this;
			oController._saveFlag = true;
			var oFlexiController = oController.getView().getViewData().flexibleController;
			var targetController = oFlexiController.getBeginColumnPages()[0].getController();
			if (targetController) {
				targetController._saveFlag = true;
				var oTable = targetController.getView().byId("productsTable");
				var targetModel = targetController.getView().getModel("cropDetails");
				if (targetModel && targetModel.getData()[0].name=== "") {
					targetModel.getData().splice(0, 1);
					targetModel.refresh();
					oTable.removeSelections(true);
				}
			}
			var layout = this.getView().getParent().getParent();
			if (layout !== undefined) {
				layout.setLayout(sap.f.LayoutType.OneColumn);
			}
		},

		setDisplayData: function(requiredData) {
			var oController = this;
			var displayModel = new sap.ui.model.json.JSONModel();
			var sPath = jQuery.sap.getModulePath("sap/innventInnvent/model", "/cropData.json");
			var cropDetails = new sap.ui.model.json.JSONModel();
			cropDetails.loadData(sPath);
			cropDetails.attachRequestCompleted(function(oEvent) {
				oController.getView().setModel(cropDetails, "cropDetailsModel");
				oController.getView().getModel("cropDetailsModel").refresh();
				var cropData = oController.getView().getModel("cropDetailsModel").getData().cropsDetails;
				// var thresholdData = oController.getView().getModel("cropDetails").getData().crops;
				cropData.forEach(function(item) {
					if (requiredData.name === item.name) {
						requiredData=jQuery.extend(requiredData, true, item);
						
					}
					requiredData = jQuery.extend(requiredData, true, {"thresholds": [{
						"name": "Sowing",
						"src": "images/sowing.jpg",
						"fromDate" :requiredData.sowingFrom,
						"toDate" : requiredData.sowingTo
					}, {
						"name": "Irrigation/Growth",
						"src": "images/irrigation.jpg",
						"fromDate" : requiredData.irrigationFrom,
						"toDate" : requiredData.irrigationTo
					}, {
						"name": "Harvest",
						"src": "images/harvest.jpg",
						"fromDate" : requiredData.harvestingFrom,
						"toDate" : requiredData.harvestingTo
					}]})
				});
				displayModel.setData(requiredData);
				oController.getView().setModel(displayModel, "displayCropData");
				oController.getView().getModel("displayCropData").refresh();
			});

		},
		onAddNewCropName: function(oEvent) {
			var value = oEvent.getSource().getValue();
			if (value && value !== null && value.trim() !== "") {
				this.getView().getModel("createModelCrop").setProperty('/cropHeaderName', value);
			} else {
				this.getView().getModel("createModelCrop").setProperty('/cropHeaderName', this.getI18nText("NEW_CROP"));
			}
			this.getView().getModel("createModelCrop").refresh();
		},
		 handleUploadComplete : function(oEvent){
		 	var f = oEvent.getSource().oFileUpload.files[0];
		 //	var path = URL.createObjectURL(f); 
			var path ="images/potato.jpg";
		 	this.getView().getModel("createModelCrop").setProperty('/icon', path);
		 	this.getView().getModel("createModelCrop").refresh();
		 },
		 
		 onSaveDetails : function(oEvent){
			 var formData = this.getView().getModel("createModelCrop");
			 var oController= this;
			 var oFlexiController = oController.getView().getViewData().flexibleController;
	         var oTargetController = oFlexiController.getBeginColumnPages()[0].getController();
			 var aData = formData.getData();
			 for(var i=0; i<aData.thresholds.length; i++){
					if(aData.thresholds[i].name==="Sowing"){
				        aData['sowingFrom'] = parseInt(aData.thresholds[i].fromDate);
				        aData['sowingTo'] = parseInt(aData.thresholds[i].toDate);
				    }
				    if(aData.thresholds[i].name==="Irrigation/Growth"){
				        aData['irrigationFrom'] = parseInt(aData.thresholds[i].fromDate);
				        aData['irrigationTo'] = parseInt(aData.thresholds[i].toDate);
				    }
				    if(aData.thresholds[i].name==="Harvest"){
				        aData['harvestingFrom'] = parseInt(aData.thresholds[i].fromDate);
				        aData['harvestingTo'] = parseInt(aData.thresholds[i].toDate);
				    }
			}
			 delete aData.cropHeaderName;
			 delete aData.thresholds;
			 delete aData.footer;
			 $.ajax({
			     url: "/api/crop/add",
			     type: 'post',
	             dataType: 'json',
	             contentType: 'application/json',
		         data:JSON.stringify(aData),
		         async: true,
	             success: function(oResponse, status, xhr) {
	            	 oTargetController.initialiseModels(oTargetController);
	            	 MessageToast.show("Crop has been created");
	             },
	             error: function(a, b, c) {
	                 var error= b;
	                 MessageToast.show("Crop creation got failed!!!");
	             }
			 });
		 }
	});
});