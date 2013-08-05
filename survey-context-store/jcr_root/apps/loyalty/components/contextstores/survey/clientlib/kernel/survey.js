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

if (!CQ_Analytics.SurveyMgr) {
    CQ_Analytics.SurveyMgr = CQ_Analytics.JSONPStore.registerNewInstance("survey");

    CQ_Analytics.CCM.addListener("configloaded", function() {

        CQ_Analytics.CCM.register(this);

        CQ_Analytics.ProfileDataMgr.addListener("update", function() {
            var uid = CQ_Analytics.ProfileDataMgr.getProperty("authorizableId");
            if (uid != this.lastUid) {
                this.fireEvent("update");
            }
        }, CQ_Analytics.SurveyMgr);
    }, CQ_Analytics.SurveyMgr);
} 
