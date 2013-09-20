/*
| Copyright 2013 Adobe
|
| Licensed under the Apache License, Version 2.0 (the "License");
| you may not use this file except in compliance with the License.
| You may obtain a copy of the License at
|
| http://www.apache.org/licenses/LICENSE-2.0
|
| Unless required by applicable law or agreed to in writing, software
| distributed under the License is distributed on an "AS IS" BASIS,
| WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
| See the License for the specific language governing permissions and
| limitations under the License.
*/
// Create the session store called "customstore"
if (!CQ_Analytics.CustomStoreMgr ) {

    // Create the session store as a JSONStore
    CQ_Analytics.CustomStoreMgr = CQ_Analytics.JSONStore.registerNewInstance("customstore");

	CQ_Analytics.CustomStoreMgr.currentId = "";

    // Function to load the data for the current user
    CQ_Analytics.CustomStoreMgr.loadData = function() {

        console.info("Loading CustomStoreMgr data");

        var authorizableId = CQ_Analytics.ProfileDataMgr.getProperty("authorizableId");
        var url = "/apps/customstore/components/loader.json";

        if ( (authorizableId !== CQ_Analytics.CustomStoreMgr.currentId) & CQ_Analytics.CustomStoreMgr.initialized ) {

            url = CQ_Analytics.Utils.addParameter(url, "authorizableId", authorizableId);

            try {

                var object = CQ.shared.HTTP.eval(url);
                if (object) { this.data = object; }
                    //this.data = {};
                    //for (var d in object) {
                    //    this.data[d] = object[d];
                    //}
                //}

            } catch(error) {
                console.log("Error", error);
            }

			CQ_Analytics.CustomStoreMgr.currentId = authorizableId;

        }

    };

    CQ_Analytics.CCM.addListener("configloaded", function() {

        CQ_Analytics.ProfileDataMgr.addListener("update", function() {
			this.loadData();
            this.fireEvent("update");
        }, CQ_Analytics.CustomStoreMgr);

	}, CQ_Analytics.CustomStoreMgr);

    CQ_Analytics.CustomStoreMgr.addListener("initialize", function() {
		this.loadData();
    });

    CQ_Analytics.CustomStoreMgr.initialized = false;

    CQ_Analytics.CustomStoreMgr.getValue = function(service) {
        if (CQ_Analytics.CustomStoreMgr.data) {
            if (CQ_Analytics.CustomStoreMgr.data[service]) return  CQ_Analytics.CustomStoreMgr.data[service].value;
        }
        return "";
    }


}