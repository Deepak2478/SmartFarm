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

	return Controller.extend("sap.innventInnvent.controller.DetailPage", {
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
			this.initialiseCrops(this);
		},

		initialiseCrops : function(oController) {
			var that = oController;
			$.ajax({
                url: "/api/crop/all",
                contentType: 'text/plain',
                type: "GET",
                async: "async",
                csrfFetch: true,
                success: function(oResponse, status, xhr) {
                	oController._setViewModel();
                	oResponse.forEach(function(item){
                		if(that.getView().getModel("createModel")!==undefined){
                    		that.getView().getModel("createModel").getData().crops.push({"id":item.cropId, "name":item.name});
                    		that.getView().getModel("createModel").refresh();
                    	}
                	});
                	
                },
                error: function(a, b, c) {
                    var error= b;
                }
            });
		},
		getI18nText: function(text) {
			var resourceBundle = this.getView().getViewData().i18nModel;
			return resourceBundle.getProperty(text);
		},
		_setViewModel: function() {
			var viewModel = new sap.ui.model.json.JSONModel();
			var viewData = {
				"crops":[],
				"footer": false,
				"dimensions": [],
				"cropPeriod": "",
				"thresholds": [{
					"name": "Sowing",
					"src": "images/sowing.jpg"
				}, {
					"name": "Irrigation/Growth",
					"src": "images/irrigation.jpg"
				}, {
					"name": "Harvesting",
					"src": "images/harvest.jpg"
				}],
				"sectionVisibilty": false,
				"targetHeaderName": this.getI18nText("NEW_FARMER")
			};
			viewModel.setData(viewData);
			this.getView().setModel(viewModel, "createModel");
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
			var oPage = this.getView().byId("detailsPage");
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
				case "createNewFarmer":
					return true;
				case "displayFarmer":
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
				var oTable = targetController.getView().byId("idAMTargetTable");
				var targetModel = targetController.getView().getModel("farmerModel");
				if (targetModel && targetModel.getData().farmers[0].cropVariety === "") {
					targetModel.getData().farmers.splice(0, 1);
					targetModel.refresh();
					oTable.removeSelections(true);
				}
			}
			var layout = this.getView().getParent().getParent();
			if (layout !== undefined) {
				layout.setLayout(sap.f.LayoutType.OneColumn);
			}
		},

		onEnteringCropName: function(oEvent) {
			var value = oEvent.getSource().getSelectedKey();
			var defaultKey= oEvent.getSource().getItems()[0].getKey();
			if (value && value !== null && value.trim() !== "") {
				this.getView().getModel("createModel").setProperty('/cropId',value);
				this.getView().getModel("createModel").setProperty('/sectionVisibilty', true);
			} else {
				this.getView().getModel("createModel").setProperty('/cropId',defaultKey);
				this.getView().getModel("createModel").setProperty('/sectionVisibilty', true);
			}
			
			this.getView().getModel("createModel").refresh();
		},

		enterFarmerName: function(oEvent) {
			var value = oEvent.getSource().getValue();
			if (value && value !== null && value.trim() !== "") {
				this.getView().getModel("createModel").setProperty('/targetHeaderName', value);
			} else {
				this.getView().getModel("createModel").setProperty('/targetHeaderName', this.getI18nText("NEW_FARMER"));
			}
			this.getView().getModel("createModel").refresh();
		},
		setDisplayData: function(requiredData) {
			var oController = this;
			requiredData['thresholds']=[];
			var displayModel = new sap.ui.model.json.JSONModel();
			var sPath = jQuery.sap.getModulePath("sap/innventInnvent/model", "/thresholds.json");
			var thresholdModel = new sap.ui.model.json.JSONModel();
			thresholdModel.loadData(sPath);
			thresholdModel.attachRequestCompleted(function(oEvent) {
				oController.getView().setModel(thresholdModel, "thresholdModel");
				oController.getView().getModel("thresholdModel").refresh();
				var qrData = {"CropName": requiredData.crop.name, "CropType": requiredData.crop.type, "CropSeason":requiredData.crop.cropSeason,"Fertilizers":requiredData.crop.fertilizers,"Nitrogen":requiredData.crop.nitrogen,
						"Phosphorous":requiredData.crop.phosphorous, "Potassium": requiredData.crop.potassium}
				var qrcode = window.encodeURI(JSON.stringify(qrData));
				var qrUrl= "https://chart.googleapis.com/chart?cht=qr&chs=256x256&chl="+qrcode;
				requiredData['qrUrl']= qrUrl;
				var thresholdData = oController.getView().getModel("thresholdModel").getData().thresholds;
				thresholdData.forEach(function(item) {
					if (requiredData.name === item.name) {
						requiredData['thresholds'].push(item);
					}
				});
				requiredData.thresholds=[{
					"name": "Sowing",
					"src": "images/sowing.jpg",
					"displayColor": "Neutral",
			        "displayValue" : 0,
					"bars":[{
			         	"color": "Error",
			         	"value" : 0
			         },
			         {
			         	"color": "Critical",
			         	"value" : 40
			         },
			         {
			         	"color": "Critical",
			         	"value" : 70
			         },
			         {
			         	"color": "Good",
			         	"value" : 100
			         }
			         ]
				}, {
					"name": "Irrigation/Growth",
					"src": "images/irrigation.jpg",
					"displayColor": "Neutral",
			        "displayValue" : 0,
					"bars":[{
			         	"color": "Error",
			         	"value" : 0
			         },
			         {
			         	"color": "Critical",
			         	"value" : 40
			         },
			         {
			         	"color": "Critical",
			         	"value" : 70
			         },
			         {
			         	"color": "Good",
			         	"value" : 100
			         }
			         ]
				}, {
					"name": "Harvesting",
					"src": "images/harvest.jpg",
					"displayColor": "Neutral",
			        "displayValue" : 0,
					"bars":[{
			         	"color": "Error",
			         	"value" : 0
			         },
			         {
			         	"color": "Critical",
			         	"value" : 40
			         },
			         {
			         	"color": "Critical",
			         	"value" : 70
			         },
			         {
			         	"color": "Good",
			         	"value" : 100
			         }
			         ]
				}]
				requiredData.thresholds.forEach(function(item){
					if(item.name.toLowerCase().search(requiredData.progressPhase.toLowerCase())==0){
					   		item.displayColor=requiredData.color;
					    	item.displayValue=requiredData.progressPercent;
					}
					})
				if(requiredData.progressPhase.toLowerCase() === 'irrigation'){
				   requiredData.thresholds[0].displayColor = "Good";
				   requiredData.thresholds[0].displayValue=100;
				   }
				if(requiredData.progressPhase.toLowerCase() === 'harvesting'){
				   requiredData.thresholds[0].displayColor = "Good";
				   requiredData.thresholds[0].displayValue=100;
				   requiredData.thresholds[1].displayColor = "Good";
				   requiredData.thresholds[1].displayValue=100;
				}
				
				displayModel.setData(requiredData);
				oController.getView().setModel(displayModel, "displayData");
			});

		},
		
		onSaveFarmerDetails : function(){
			 var formData = this.getView().getModel("createModel");
			 var oController= this;
			 var dateRange1= formData.getData().DR1.toDateString();
			 var dateRange2= formData.getData().DR2.toDateString();
			 var addressObj = {"addressLine1" :  formData.getData().addressLine1,
					 "addressId" : 2,
					 "addressLine2" :  formData.getData().addressLine2,
					 "city" :  formData.getData().city,
					 "contactNo":formData.getData().contactNo,
					 "country":formData.getData().country};
			 var plotObj = {"address":{"addressLine1" :  formData.getData().plotAddressLine1,
				 "addressLine2" :  formData.getData().plotAddressLine2,
				 "city" :  formData.getData().plotCity,
				 "state":formData.getData().plotState,
				 "country":formData.getData().country}, "area":formData.getData().plotSize, "latitude":formData.getData().latitude,"longitude":formData.getData().longitude};
			 formData.getData()['plot'] = plotObj;
			 formData.getData()['address'] = addressObj;
			 formData.refresh();
			 var oFlexiController = oController.getView().getViewData().flexibleController;
	         var oTargetController = oFlexiController.getBeginColumnPages()[0].getController();
	         formData.setProperty('/cropPeriod', dateRange1 + " - " +dateRange2);
	         var payload={};
	         payload['land']={
	                 "area": formData.getData().plot.area,
	                 "expectedQuantity": formData.getData().expectedQuantity,
	                 "longitude": formData.getData().plot.longitude,
	                 "latitude": formData.getData().plot.latitude,
	                 "earthEngineUrl": ""
	         };
	         payload['crop']={'cropId' : formData.getData().cropId};
	         payload['address']={
	             "addressLine1": formData.getData().addressLine1,
	             "addressLine2": formData.getData().addressLine2,
	             "addressLine3": "",
	             "city": formData.getData().city,
	             "state": formData.getData().state,
	             "country": formData.getData().country
	         };
	         payload['name'] = formData.getData().name;
	         payload['contactNumber'] =  formData.getData().contactNo;
	         payload['emailId']= formData.getData().email;
	         payload['progressPhase']= "sowing";
	         payload['progressPercent']= 0;
	         payload['cropPeriod'] = formData.getData().cropPeriod;
			 var aData = formData.getData();
			 
			 $.ajax({
			     url: "/api/person/addFarmerWithPlot",
			     type: 'post',
	             dataType: 'json',
	             contentType: 'application/json',
		         data:JSON.stringify(payload),
		         async: true,
	             success: function(oResponse, status, xhr) {
	            	// oTargetController.initialiseModels(oTargetController);
	            	 oTargetController.getFarmerDetails(oTargetController);
		    		oController.handleCloseFlexibleColumnLayout();
	            	 MessageToast.show("Farmer has been onboarded");
	             },
	             error: function(a, b, c) {
	                 var error= b;
	                 MessageToast.show("Farmer Onboard has been failed!!!");
	             }
			 });
		}
	});
});