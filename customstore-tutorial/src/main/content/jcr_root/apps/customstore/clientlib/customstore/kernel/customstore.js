
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
                if (object) {
                    this.data = {};
                    for (var d in object) {
                        this.data[d] = object[d];
                    }
                }

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