sap.ui.define(['sap/ui/core/UIComponent'],
	function (UIComponent) {
		"use strict";

		var Component = UIComponent.extend("kpk.kandroid.Component", {

			metadata: {
				rootView: "kpk.kandroid.V",
				includes: ["styles.css"],
				dependencies: {
					libs: [
					"sap.m",
					"sap.ui.layout"
				]
				},
				config: {
					sample: {
						files: [
						"V.view.xml",
						"C.controller.js"
					]
					}
				}
			}
		});

		return Component;

	});