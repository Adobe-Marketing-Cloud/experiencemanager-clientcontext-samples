<%--
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
--%><%@ page session="false" import="com.day.cq.security.User,
                    com.day.cq.security.profile.Profile,
                    com.day.cq.security.profile.ProfileManager,
                    org.apache.sling.commons.json.io.JSONWriter"
%><%@include file="/libs/foundation/global.jsp" %><%

    response.setContentType("application/json");
    response.setCharacterEncoding("utf-8");

    String authorizableId = request.getParameter("authorizableId");

    Profile profile = null;
    ProfileManager pMgr = sling.getService(ProfileManager.class);


    JSONWriter w = new JSONWriter(response.getWriter());

    w.object();

	if (!authorizableId.equals("anonymous")) {

		if (authorizableId != null) {
            try {
                profile = pMgr.getProfile(authorizableId, resourceResolver.adaptTo(Session.class));
            } catch (RepositoryException e) {
                slingResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED, "");
            }
        } else {
			profile = resourceResolver.adaptTo(User.class).getProfile();
        }

        if (profile != null) {

            // here we simulate the result from a back-end system
            w.key("AUTOMATICPAYMENTDEBIT/key").value("AUTOMATICPAYMENTDEBIT");
            w.key("AUTOMATICPAYMENTDEBIT/label").value("Automatic payment debit");
            w.key("AUTOMATICPAYMENTDEBIT/value").value("true");
            w.key("ONLINESTATEMENT/key").value("ONLINESTATEMENT");
            w.key("ONLINESTATEMENT/label").value("Online statement");
            w.key("ONLINESTATEMENT/value").value("false");

        }

	}

	w.endObject();

%>