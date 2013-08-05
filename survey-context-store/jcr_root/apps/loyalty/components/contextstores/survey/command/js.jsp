<%@page session="false"%><%--

 ADOBE CONFIDENTIAL
 __________________

  Copyright 2013 Adobe Systems Incorporated
  All Rights Reserved.

 NOTICE:  All information contained herein is, and remains
 the property of Adobe Systems Incorporated and its suppliers,
 if any.  The intellectual and technical concepts contained
 herein are proprietary to Adobe Systems Incorporated and its
 suppliers and are protected by trade secret or copyright law.
 Dissemination of this information or reproduction of this material
 is strictly forbidden unless prior written permission is obtained
 from Adobe Systems Incorporated.
--%><%@ page import="com.adobe.granite.security.user.UserProperties,
                    com.adobe.granite.security.user.UserPropertiesManager,
					com.day.cq.commons.JSONWriterUtil,
                    com.day.cq.commons.TidyJSONWriter,
                    com.day.cq.commons.date.DateUtil,
                    com.day.cq.wcm.foundation.forms.FormsHelper,
                    com.day.cq.xss.ProtectionContext,
                    com.day.cq.xss.XSSProtectionService,
                    org.apache.sling.commons.json.JSONObject,
                    org.apache.sling.commons.json.io.JSONWriter,
					org.slf4j.Logger,
                    javax.xml.parsers.DocumentBuilderFactory,
                    javax.xml.parsers.DocumentBuilder,
                    org.w3c.dom.Document,
                    org.w3c.dom.NodeList,
                    org.w3c.dom.Element,
					javax.jcr.PropertyIterator,
                    java.io.StringWriter,
                    java.text.DateFormat,
                    java.net.URL,
                    java.util.Date,
                    java.util.Arrays,
                    java.util.List" %><%!
%><%@include file="/libs/foundation/global.jsp"%><%
%><%!
    // Read survey data from server
    void loadSurveyData(JSONWriter writer, String email, String feedURL, Logger log) throws Exception {
        writer.object();
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        URL url = new URL(feedURL);
		Document doc = dBuilder.parse(url.openStream());
		doc.getDocumentElement().normalize();
		NodeList entries = doc.getElementsByTagName("entry");
        char row = '0';
        for (int i = 0 ; i < entries.getLength() ; ++i) {
            Element entry = (Element) entries.item(i);
            org.w3c.dom.Node titleNode = entry.getElementsByTagName("title").item(0);
            String title = titleNode.getTextContent().trim();
            org.w3c.dom.Node contentNode = entry.getElementsByTagName("content").item(0);
            String value = contentNode.getTextContent().trim();

            if (title.charAt(1) == '1' && title.charAt(0) > 'B') {
                writer.key("Q." + title.substring(0, 1)).value(value);
            }

            if (title.charAt(0) == 'B' && email.equals(value)) {  // We have the row corresponding to the user
				row = title.charAt(1);
            }

            if (title.charAt(1) > '1' && title.charAt(0) > 'B' && title.charAt(1) == row) {
                writer.key("A." + title.substring(0, 1)).value(value);
            }
        }
        writer.endObject();
    }

	void fakeLoadSurveyData(JSONWriter writer) throws Exception {
        writer.object();
        writer.key("Error").value("Feed URL configuration parameter is not set");
        writer.endObject();
    }


%><%
    final UserPropertiesManager upm = resourceResolver.adaptTo(UserPropertiesManager.class);
    Resource userResource = null;

    List<Resource> resources = FormsHelper.getFormEditResources(slingRequest);
    if (resources != null && resources.size() > 0) {
       //1 - we are in formchooser-mode, get the requested resource
        userResource = resources.get(0);
    }

    UserProperties userProperties = userResource != null ? upm.getUserProperties(userResource.adaptTo(Node.class)) : null;

    response.setContentType("text/javascript");
    response.setCharacterEncoding("utf-8");

    out.print(request.getParameter("callback"));
    out.print("(");

    if( userProperties != null) {
        StringWriter sw = new StringWriter();
	    TidyJSONWriter writer = new TidyJSONWriter(sw);
        writer.setTidy(true);
        try {
	        final Session session = slingRequest.getResourceResolver().adaptTo(Session.class);
            Node node = session.getNode("/etc/clientcontext/default/content/jcr:content/stores/survey"); // FIXME
            if (node.hasProperty("feedURL")) {
	            Property feedURLProp = node.getProperty("feedURL");
				String feedURL = feedURLProp.getValue().getString();
	            String email = userProperties.getProperty("email", "", String.class);
    	        loadSurveyData(writer, email, feedURL, log);
            } else {
                log.error("feedURL property of store is not set.");
    	        fakeLoadSurveyData(writer);
            }
        } catch (Exception e) {
            log.error("Error while generating JSON profile initial data", e);
        }
        sw.close();
        out.print(sw.toString());

    } else {
        out.print("{}");
    }
    out.print(")");
%>
