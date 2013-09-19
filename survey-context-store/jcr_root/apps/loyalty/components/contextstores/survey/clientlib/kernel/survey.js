/*
 * Copyright 2013 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
if (!CQ_Analytics.SurveyMgr) {

    console.debug("Registering new instance of SurveyMgr");
    
    CQ_Analytics.SurveyMgr = CQ_Analytics.PersistedJSONStore.registerNewInstance("survey", {});


    CQ_Analytics.CCM.addListener("configloaded", function() {

        CQ_Analytics.CCM.register(this);

        CQ_Analytics.ProfileDataMgr.addListener("update", function() {
            var uid = CQ_Analytics.ProfileDataMgr.getProperty("authorizableId");
            if (uid != this.lastUid) {
                console.debug("Firing update event");
                this.fireEvent("update");
            }
        }, CQ_Analytics.SurveyMgr);
    }, CQ_Analytics.SurveyMgr);
} 
