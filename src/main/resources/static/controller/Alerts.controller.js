sap.ui
		.define(
				[ 'jquery.sap.global', 'sap/m/MessageToast',
						'sap/m/MessageBox', 'sap/ui/core/mvc/Controller',
						'sap/ui/model/json/JSONModel' ],
				function(jQuery, MessageToast, MessageBox, Controller,
						JSONModel) {
					"use strict";

					var ListController = Controller
							.extend(
									"sap.innventInnvent.controller.Alertst",
									{

										onInit : function() {
											/*
											 * var oController = this; var sPath =
											 * jQuery.sap.getModulePath("sap/innventInnvent/model",
											 * "/Alerts.json"); var alerts = new
											 * sap.ui.model.json.JSONModel();
											 * alerts.loadData(sPath);
											 * alerts.attachRequestCompleted(function(oEvent) {
											 * oController.getView().setModel(alerts,
											 * "alerts"); });
											 */
											var oController = this;
											var alertDetails = new sap.ui.model.json.JSONModel();
											alertDetails.setData([]);
											oController.getView().setModel(
													alertDetails,
													"alertDetails");
											this.initialiseModels(oController);
										},
										initialiseModels : function(oController) {
											var that = oController;
											$
													.ajax({
														url : "/api/alerts/all",
														contentType : 'text/plain',
														type : "GET",
														async : "async",
														// csrfFetch: true,
														success : function(
																oResponse,
																status, xhr) {
															oResponse
																	.forEach(function(
																			item) {
																		item['Actions'] = [
																				{
																					"Text" : "Get Remidiation",
																					"Icon" : "sap-icon://search",
																					"Key" : "find"
																				},
																				{
																					"Text" : "Share",
																					"Icon" : "sap-icon://share-2",
																					"Key" : "share"
																				} ];
																		item['Type'] = "Request";
																		var url = item.imageUrl
																				.replace(
																						/\\/g,
																						"/");
																		item['finalPath'] = url;
																		item['concatPath'] = "."
																				+ url
																						.substring(
																								url
																										.indexOf("/upload"),
																								url.length);
																	});
															var alertDetails = oController
																	.getView()
																	.getModel(
																			"alertDetails");
															alertDetails
																	.setData(oResponse);
															alertDetails
																	.refresh();
															/*
															 * var oTable =
															 * oController.getView().byId("productsTable");
															 * oTable.getItems()[0].firePress();
															 */
														},
														error : function(a, b,
																c) {
															var error = b;
														}
													});
										},

										onPress : function(oEvent) {
											MessageToast.show("Pressed on "
													+ oEvent.getSource()
															.getSender());
										},

										onActionPressed : function(oEvent) {
											var oController = this;
											var sAction = oEvent.getSource()
													.getKey();
											var oItem = oEvent.getSource()
													.getParent();
											var selectedObj = oItem
													.getBindingContext(
															'alertDetails')
													.getObject();
											var oPath = selectedObj.finalPath;
											if (sAction === "find") {
												$
														.ajax({
															url : "http://127.0.0.1:8088/predict",
															dataType : 'json',
															type : "POST",
															data : JSON
																	.stringify({
																		"path" : oPath
																	}),
															contentType : "application/json; charset=utf-8",
															async : "async",
															success : function(
																	oResponse,
																	status, xhr) {
																var vController = oController;
																vController.subject = oResponse.disease;
																vController.emailBody = oResponse.recommendation;
																vController.selectedObj = selectedObj;
																var message = "Disease : "
																		+ oResponse.disease
																		+ " Remidiation: "
																		+ oResponse.recommendation;
																var dialog = new sap.m.Dialog(
																		{
																			title : 'Disease Details',
																			type : 'Message',
																			content : new sap.m.Text(
																					{
																						text : message
																					}),
																			beginButton : new sap.m.Button(
																					{
																						text : 'Submit',
																						press : function() {
																							var getController = vController;
																							$
																									.ajax({
																										url : "/api/doJob/sendEmail",
																										contentType : "application/json; charset=utf-8",
																										type : "GET",
																										async : "async",
																										data : {
																											"subject" : getController.subject,
																											"farmerId" : getController.selectedObj.farmerId,
																											"body" : getController.emailBody
																										}
																									});
																							dialog
																							.close();
																						}

																					}),
																			endButton : new sap.m.Button(
																					{
																						text : 'Cancel',
																						press : function() {
																							dialog
																									.close();
																						}
																					}),
																			afterClose : function() {
																				dialog
																						.destroy();
																			}
																		});

																dialog.open();
																// MessageBox.success(
																// message,
																// {
																// actions:
																// ["Save and
																// Notify",
																// sap.m.MessageBox.Action.CLOSE],
																// //styleClass:
																// bCompact ?
																// "sapUiSizeCompact"
																// : "",
																// onClose:
																// function(sAction)
																// {
																// MessageToast.show("Action
																// selected: " +
																// sAction);
																// }
																// }
																// );
																// MessageToast.show(oResponse.disease
																// + " " + "has
																// been
																// detected.");
															},
															error : function(a,
																	b, c) {
																var error = b;
																MessageToast
																		.show("Disease can't be detected");
															}
														});
											} else {
												MessageToast.show("Action \""
														+ sAction
														+ "\" pressed.");
											}
										},

										triggerMail : function(me) {
											$
													.ajax({
														url : "/api/doJob/sendMail",
														contentType : "application/json; charset=utf-8",
														type : "POST",
														async : "async",
														data : {
															"subject" : me.subject,
															"emailId" : me.selectedObj.farmerId,
															"emailContents" : me.emailBody
														}
													});
										},

										removeItem : function(oFeedListItem) {
											var sFeedListItemBindingPath = oFeedListItem
													.getBindingContext()
													.getPath();
											var sFeedListItemIndex = sFeedListItemBindingPath
													.split("/").pop();
											var aFeedCollection = this
													.getView().getModel()
													.getProperty(
															"/EntryCollection");

											aFeedCollection.splice(
													sFeedListItemIndex, 1);
											this.getView().getModel()
													.setProperty(
															"/EntryCollection",
															aFeedCollection);
										}
									});

					return ListController;
				});
