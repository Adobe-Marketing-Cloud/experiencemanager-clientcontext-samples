<%@ page session="false" import="com.day.cq.security.User,
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

            w.key("AUTOMATICPAYMENTDEBIT");
            w.object();
            w.key("key").value("AUTOMATICPAYMENTDEBIT");
            w.key("label").value("Automatic payment debit");
            w.key("value").value("true");
            w.endObject();

            w.key("ONLINESTATEMENT");        
			w.object();
            w.key("key").value("ONLINESTATEMENT");
            w.key("label").value("Online statement");
            w.key("value").value("false");
            w.endObject();

        }

	}

	w.endObject();

%>