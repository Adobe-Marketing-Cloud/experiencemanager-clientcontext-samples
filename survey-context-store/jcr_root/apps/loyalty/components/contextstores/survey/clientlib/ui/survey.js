/*
 * ***********************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2013 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 * ***********************************************************************
 */

if (CQ_Analytics.SurveyMgr) {

    CQ_Analytics.SurveyMgr.renderJSON = function(divId) {
        $CQ("#" + divId).children().remove();
        CQ_Analytics.SurveyMgr.reset();
        var json = CQ_Analytics.SurveyMgr.getJSON();

        console.debug("CQ_Analytics.SurveyMgr.internalRenderer: rendering JSON: " + JSON.stringify(json));

        var div = $CQ("<div>").addClass("cq-cc-survey");
        div.append('<div class="cq-cc-survey-title">Survey answers</div>');
        jQuery.each(json, function(key, val) {
            if (key.substring(0, 1) == "Q") {
                div.append('<div class="cq-cc-survey-question">' + val + '</div>');
                var ansKey = "A" + key.substring(1);
                if (json[ansKey] != undefined) {
                    div.append('<div class="cq-cc-survey-answer">' + json[ansKey] + '</div>');
                } else {
                    div.append('<div class="cq-cc-survey-answer"></div>');
                }
            }
        });
        div.hide();
        $CQ("#" + divId).append(div);
        div.fadeIn("fast");
    };

    /**
     * Loads and renders the survey responses
     * @param {String} divId Id of the div to render to
     * @static
     */
    CQ_Analytics.SurveyMgr.internalRenderer = function(divId, uid) {
        var uid = CQ_Analytics.ProfileDataMgr.getProperty("authorizableId");
        CQ_Analytics.SurveyMgr.lastUid = uid;

        this.persistence = new CQ_Analytics.SessionPersistence({'container': 'ClientContext'});
		var value = this.persistence.get(this.getStoreKey());
        if (value) {
			var data = this.parse(value);
            if (data['uid'] == uid) {
	            CQ_Analytics.SurveyMgr.initJSON(data);
    	        console.debug("Found persisted data: " + JSON.stringify(data));
        	    this.renderJSON(divId);
            } else {
                this.clear();
            }
        }
        if (this.getData()['uid'] != uid) {
            var profilePath = CQ_Analytics.ProfileDataMgr.getProperty("path");
            var url = profilePath + ".form.html";
            url += CQ_Analytics.ClientContextMgr.getClientContextURL("/contextstores/survey.js");
            // url += "?callback=${callback}";

            console.debug("Fetching data from " + url);

            $CQ.getJSON(url, function(data) {
                data['uid'] = uid;
                CQ_Analytics.SurveyMgr.initJSON(data);
                CQ_Analytics.SurveyMgr.renderJSON(divId);
                CQ_Analytics.SurveyMgr.persist();
            });
        }
    };

    /**
     * Delegates the rendering to {@link #SurveyMgr.internalRenderer}.
     * @param {String} store The store to render
     * @param {String} divId Id of the div to render to
     * @static
     */
    CQ_Analytics.SurveyMgr.renderer = function(store, divId) {
        var uid = CQ_Analytics.ProfileDataMgr.getProperty("authorizableId");
        if (uid != CQ_Analytics.SurveyMgr.lastUid) {
            CQ_Analytics.SurveyMgr.internalRenderer(divId, uid);
        }
    };
}