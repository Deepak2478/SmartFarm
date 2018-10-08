sap.ui.define([
	"sap/m/SplitContainer",
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller"
], function (SplitContainer, Device, Controller) {
	"use strict";

	return Controller.extend("sap.innventInnvent.controller.FlexibleColumnLayout", {
		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
			this.bus.subscribe("flexible", "setDetailPage", this.setDetailPage, this);
			this.oFlexibleColumnLayout = this.getView().byId("targetLayout");
		},

		onExit: function () {
			this.bus.unsubscribe("flexible", "setDetailPage", this.setDetailPage, this);
		},

		// Lazy loader for the mid page - only on demand (when the user clicks)
		setDetailPage: function () {

			if (!this.detailView) {
				this.detailView = sap.ui.view({
					id: "detailPageView",
					viewName: "sap.innventInnvent.view.DetailPage",
					type: "XML",
					viewData : {
				        "i18nModel" : this.getOwnerComponent().getModel("i18n"),
				        "flexibleController" : this.oFlexibleColumnLayout
					} 
				});
			}

			this.oFlexibleColumnLayout.addMidColumnPage(this.detailView);
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
		}
	});
}, true);