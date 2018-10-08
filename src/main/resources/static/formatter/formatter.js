sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (sStatus) {
			switch (sStatus) {
				case "October to December":
					return "Upcoming Season";
				case "June to August":
					return "Out-of-Season";
				case "June to October":
					return "On-going Season";
				case "October to November":
					return "Upcoming Season";
				case "January to December":
					return "All Season";
				default:
					return "";
			}
		},
		
		setStatusText: function (sStatus) {
			switch (sStatus) {
				case "October to December":
					return "Warning";
				case "June to August":
					return "Error";
				case "June to October":
					return "Success";
				case "January to December":
					return "Success";
				case "October to November":
					return "Warning";
				default:
					return "None";
			}
		}
		
	};
});