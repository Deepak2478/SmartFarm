sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/HashChanger",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/innventInnvent/formatter/formatter"
], function(Controller, HashChanger, JSONModel, BusyIndicator, MessageBox, MessageToast, Filter, formatter) {
	"use strict";

	return Controller.extend("sap.innventInnvent.controller.Crop", {
		data: {},
		formatter : formatter,
		_saveFlag : true,
		onInit: function() {
			var oController = this;
			var cropDetail = new sap.ui.model.json.JSONModel();
			cropDetail.setData([]);
			oController.getView().setModel(cropDetail, "cropDetails");
			this.initialiseModels(oController);
		},

		initialiseModels: function(oController) {
			var that = oController;
			$.ajax({
                url: "/api/crop/all",
                contentType: 'text/plain',
                type: "GET",
                async: "async",
                csrfFetch: true,
                success: function(oResponse, status, xhr) {
                	oResponse.forEach(function(item){
                		item['icon']= that.setImage(item.name);
                	});
                	var cropDetail = oController.getView().getModel("cropDetails");
                	cropDetail.setData(oResponse);
                	cropDetail.refresh();
    				var oTable = oController.getView().byId("productsTable");
    				oTable.getItems()[0].firePress();
                },
                error: function(a, b, c) {
                    var error= b;
                }
            });
		},
		
		setImage : function(crop){
			var path ="";
			switch(crop){
				case "Carrots":
					path = "images/carrots.jpg";
					break;
				case "Maize":
					path = "images/maize.jpg";
					break;
				case "Peas":
					path = "images/peas.jpg";
					break;
				case "Potato":
					path = "images/potato.jpg";
					break;
				case "Tomatoes":
					path = "images/tomato.jpg";
					break;
				default:
					break;
			}
			return path;
		},
		
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onCreateNewTargets: function (oEvent) {
			var oController = this;
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var oTable = this.getView().byId("productsTable");
			if (oTable.getModel("cropDetails")) {
				var existingData = oTable.getModel("cropDetails").getData();
				if (existingData.length > 1 && existingData[0].cropVariety === "") {
					return;
				} else {
					if (sap.ui.getCore().byId("detailPageCropView") !== undefined && sap.ui.getCore().byId("detailPageCropView").getController()._saveFlag ===
						false) {
						MessageBox.show(resourceBundle.getText("UNSAVED_CHANGES_WARNING"), {
							title: resourceBundle.getText("CONFIRMATION"),
							actions: [
								sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL
							],
							onClose: function (oEvt) {
								if (oEvt === "OK") {
									oController._handleAdd(existingData, oController, oTable);
									sap.ui.getCore().byId("detailPageCropView").getController()._saveFlag = true;
								} else {
									return;
								}
							}
						});
						return;
					}
					oController._handleAdd(existingData, oController, oTable);
					oController._saveFlag = false;
				}
			} else {
				return;
			}
		},

		_handleAdd: function (existingData, oController, oTable) {
			existingData.unshift({
				"name": "",
				"type": "",
				"season": ""
			});
			oTable.getModel("cropDetails").refresh();
			oTable.getItems()[0].firePress();
			oController.bus = sap.ui.getCore().getEventBus();
			oController.bus.publish("flexible", "setDetailPage");
			oController.detailPageController = sap.ui.getCore().byId("detailPageCropView").getController();
			oController.detailPageController._showFormFragment("createNewCrop", "Display");
			oController.detailPageController.onInit();
		},

		onListItemPress: function (oEvent) {
			var selectedItem = oEvent.getSource();
			var selectedObject = selectedItem.getBindingContext("cropDetails").getObject();
			var targetModel = this.getView().getModel("cropDetails");
			//handle edit after edit target not svaed
			if (sap.ui.getCore().byId("detailPageCropView") !== undefined && sap.ui.getCore().byId("detailPageCropView").getController()._saveFlag ===
				false) {
				this.showUnsavedChangesMessage(this,false,targetModel,selectedItem,selectedObject);
				return;
			}

			if (targetModel && targetModel.getData().length > 1 && targetModel.getData()[0].name === "") {
				//handle edit after add target wasn't saved
				if (this._saveFlag === false) {
					this.showUnsavedChangesMessage(this,true,targetModel,selectedItem,selectedObject);
					return;
				}
			}
			if (targetModel && targetModel.getData().length === 1 && targetModel.getData()[0].name === "") {
				return;
			}
			this._handlePress(selectedItem,selectedObject);
		},
		
		showUnsavedChangesMessage : function(oController,createFlag,targetModel,selectedItem,selectedObject){
			var resourceBundle = oController.getView().getModel("i18n").getResourceBundle();
			MessageBox.show(resourceBundle.getText("UNSAVED_CHANGES_WARNING"), {
				title: resourceBundle.getText("CONFIRMATION"),
				actions: [
					sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL
				],
				onClose: function (oEvt) {
					if (oEvt === "OK") {
						if(createFlag === true){
							targetModel.getData().splice(0, 1);
							targetModel.refresh();
				//			selectedItem.getTable().removeItem(0);
							oController._saveFlag = true;
						}else{
							sap.ui.getCore().byId("detailPageCropView").getController()._saveFlag = true;
						}
						oController._handlePress(selectedItem,selectedObject);
					} else {
						return;
					}
				}
			});
		},
		
		_handlePress: function (selectedItem,selectedObject) {
			var requiredData = jQuery.extend(true, {}, selectedObject);
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.publish("flexible", "setDetailPage");
			this.detailPageController = sap.ui.getCore().byId("detailPageCropView").getController();
			this.detailPageController._showFormFragment("displayCrop", "Display");
			this.detailPageController.setDisplayData(requiredData);
		},

		onSelectToDelete: function (oEvent) {
			this.getView().getModel("cropDetails").setProperty('/enableDelete', true);
			this.getView().getModel("cropDetails").refresh();
		},

		onDeleteTarget: function (oEvent) {
			var oThis = this,targetId, targetName;
			var layout = oThis.getView().getParent().getParent();
			var resourceBundle = oThis.getView().getModel("i18n").getResourceBundle();
			BusyIndicator.show(0);
			var oTable = this.getView().byId("productsTable");
			var oModel = this.getView().getModel("cropDetails");
			if(oModel){
				var modelData = oModel.getProperty('/crops');
				var selectedContexts = oTable.getSelectedContexts('cropDetails');
				var formData = (selectedContexts && selectedContexts.length > 0) ? oModel.getProperty(selectedContexts[0].sPath) : undefined;
				if (formData && formData !== null) {
					targetId = formData.targetId;
					targetName = formData.name;
				}
				//If target id is there then only call service to delete else normally delete entry from table
				MessageBox.show(resourceBundle.getText("DELETE_CONFIRMATION"), {
					title: resourceBundle.getText("CONFIRMATION"),
					actions: [
						sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL
					],
					onClose: function (oEvt) {
						if(oEvt === "OK") {
							if (targetId) {
								Api.delete(Urls.getTargets(targetId))
									.done(function (d, s, x) {
										for (var i = 0; i < modelData.length; i++) {
											if (modelData[i].targetId === targetId) {
												modelData.splice(i, 1);
												break;
											}
										}
										oModel.setProperty('/enableDelete', true);
										oModel.setProperty('/count', modelData.length);
										oModel.refresh();
										oTable.removeSelections(true);
										MessageToast.show(resourceBundle.getText("TARGET_DELETE_SUCCESS", targetName), {
											duration: 5000,
											width: "20em"
										});
										BusyIndicator.hide();
									}).fail(function (d, s, x) {
										DateUtils.errorHandler(d);
										BusyIndicator.hide();
									});
							} else {
								for (var i=selectedContext.length - 1; i >= 0; i--) {
									var path = selectedContexts[i].sPath;
									var lastIndex = path.lastIndexOf('/');
					        		var indexValue = path.substring(lastIndex+1,path.length);
									modelData.splice(indexValue, 1);
									oModel.refresh();
									oTable.removeSelections(true);
									BusyIndicator.hide();
								}
							}
						} else {
							BusyIndicator.hide();
							return;
						}
					}
				});
				
				if (layout != undefined) {
					layout.setLayout(sap.f.LayoutType.OneColumn);
				}
			}else{
				return;
			}
		}
	});
});