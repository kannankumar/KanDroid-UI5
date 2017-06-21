sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageToast'
], function (jQuery, Controller, MessageToast) {
	"use strict";

	var CController = Controller.extend("kpk.kandroid.C", {
		onInit: function () {
			var oThis = this;
			//oThis.accessToken = "0a863377b34143728d5b3323b14e8fc7";
			oThis.accessToken = "bf6e310e656b45ac9ec02bd805c90d9b";
			oThis.baseUrl = "https://api.api.ai/v1/";
			oThis.bSayHiDone = false;
			oThis.recognition;
		},
		onAfterRendering: function () {

		},
		handleMsgSendBtnPress: function () {
			this.send();
		},
		handleMicBtnPress: function () {
			this.switchRecognition();
		},
		startRecognition: function () {
			var oThis = this;
			var userMsgListItem;
			oThis.recognition = new webkitSpeechRecognition();
			oThis.recognition.onstart = function (event) {

				userMsgListItem = new sap.m.NotificationListItem({
					description: "Listening ...",
					showCloseButton: false,
					//dateTime: new Date(),
					priority: "Low",
					authorName: "Me",
					authorPicture: "user-icon.png"
				})
				oThis.oView.byId('chatMsgGrid').addContent(userMsgListItem);

				oThis.updateRec("start");
			};
			oThis.recognition.onresult = function (event) {
				var text = "";
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					text += event.results[i][0].transcript;
				}

				oThis.oView.byId('chatMsgGrid').removeContent(userMsgListItem);

				oThis.setInput(text);
				oThis.stopRecognition();
			};
			oThis.recognition.onend = function () {
				oThis.stopRecognition();
			};
			oThis.recognition.lang = "en-US";
			oThis.recognition.start();
		},

		stopRecognition: function () {
			var oThis = this;
			if (oThis.recognition) {
				oThis.recognition.stop();
				oThis.recognition = null;
			}
			this.updateRec("stop");
		},

		switchRecognition: function () {
			var oThis = this;
			if (oThis.recognition) {
				this.stopRecognition();
			} else {
				this.startRecognition();
			}
		},

		setInput: function (text) {
			this.oView.byId("chatInput").setValue(text);
			//Add to chat list on right
			this.send();
		},

		updateRec: function (sEvent) {
			switch (sEvent) {
			case "start":
			case "stop":
			}
		},

		send: function () {
			var oThis = this;
			if (!oThis.bSayHiDone) {
				oThis.bSayHiDone = true;
				this.oView.byId("chatInput").setPlaceholder('Type a message');
			}
			var text = this.oView.byId("chatInput").getValue();
			this.setUserInput(text); //Adding the text to chat box
			this.oView.byId("chatInput").setValue(""); //Clearing Input box

			$.ajax({
				type: "POST",
				url: oThis.baseUrl + "query/",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + oThis.accessToken
				},
				data: JSON.stringify({
					q: text,
					lang: "en"
				}),

				success: function (data) {
					var msg = new SpeechSynthesisUtterance(data.result.speech);
					window.speechSynthesis.speak(msg);

					oThis.setResponse(data.result.speech);
				},
				error: function () {
					oThis.setResponse("Internal Server Error");
				}
			});
			//setResponse("Loading...");
		},

		setUserInput: function (msg) {
			var userMsgListItem = new sap.m.NotificationListItem({
				description: msg,
				showCloseButton: false,
				//dateTime: new Date(),
				priority: "Low",
				authorName: "Me",
				authorPicture: "user-icon.png"
			})
			this.oView.byId('chatMsgGrid').addContent(userMsgListItem);
			console.log(msg);
		},

		setResponse: function (msg) {
			var kandroidMsgListItem = new sap.m.NotificationListItem({
				description: msg,
				showCloseButton: false,
				//dateTime: new Date(),
				priority: "None",
				authorName: "Kandroid",
				authorPicture: "kandroid-logo.png"
			})
			this.oView.byId('chatMsgGrid').addContent(kandroidMsgListItem);
			console.log(msg);

		}

	});

	return CController;

});
