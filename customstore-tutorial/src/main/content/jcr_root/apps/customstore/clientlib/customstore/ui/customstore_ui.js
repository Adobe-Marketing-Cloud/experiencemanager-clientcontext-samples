if (CQ_Analytics.CustomStoreMgr ) {


    // HTML template
    CQ_Analytics.CustomStoreMgr.template = 
        "<input class='customstore-input' type='checkbox' id='customstore-input-%key%' name='%key%' value='%key%' %checked%>" +
        "<label for='customstore-input-%key%' class='%checkedClass%'>" +
        "<div class='toggle'><div class='green'></div><div class='red'></div></div>" +
        "%label%</label>";

    CQ_Analytics.CustomStoreMgr.templateRenderer = function(key, label, value) {

         var checkedString = ""; var checkedClass = "";
         if (value==="true") {
             checkedString = "checked='checked'";
             checkedClass  = "checked";
         }
         var template = CQ_Analytics.CustomStoreMgr.template;
         return template.replace(/%label%/g, label)
             .replace(/%key%/g, key)
             .replace(/%checked%/g, checkedString)
             .replace(/%checkedClass%/g, checkedClass);
     }


    CQ_Analytics.CustomStoreMgr.renderer = function(store, divId) {

        // first load data
		// CQ_Analytics.CustomStoreMgr.loadData();

		$CQ("#" + divId).children().remove();

		var name = CQ_Analytics.ProfileDataMgr.getProperty("formattedName");
		var templateRenderer = CQ_Analytics.CustomStoreMgr.templateRenderer;

        // Set title
		$CQ("#" + divId).addClass("cq-cc-customstore");
		var div = $CQ("<div>").html(name + " services");
		$CQ("#" + divId).append(div);           


		var data = this.getJSON();

        if (data) {
            for (var i in data) {
                if (typeof data[i] === 'object') {
                    $CQ("#" + divId).append(templateRenderer(data[i].key,data[i].label,data[i].value));
                }
            }
        }

		$CQ(".customstore-input").change(function(){
            var value = false;
        	if ($CQ(this).attr("checked")) {
            	value = true;
        	}
        	var key = $CQ(this).attr("name");
        	$CQ("label[for='customstore-input-" + key + "']").toggleClass('checked');
        	var newValue = (value === true)?"true":"false";
			CQ_Analytics.CustomStoreMgr.setTraitValue(key,newValue);
        	CQ_Analytics.ProfileDataMgr.fireEvent("update");
    	});         

    }

    CQ_Analytics.CustomStoreMgr.setTraitValue = function(trait, newValue) {

        var data = CQ_Analytics.CustomStoreMgr.data;
        if (data) {
            for (var i in data) {
                if (typeof data[i] === 'object') {
                    if (data[i].key === trait) data[i].value = newValue;
                }
            }
        }
    };

    
	CQ_Analytics.ClickstreamcloudMgr.register(CQ_Analytics.CustomStoreMgr);

}