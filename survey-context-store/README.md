Custom Client Context Store Sample for Surveys
==============================================

This is a sample custom Client Context Store that demonstrates how to build a Context Store that can fetch data from a remote system, in this case an application for performing surveys. For the sample, the responses to the survey are collected using a Google Form into a Google Drive spreadsheet.

In the configuration dialog, you can use the following value for the feed URL:

https://spreadsheets.google.com/feeds/cells/0AiT-6BvU6CoEdEd1eXo5OE91d3BzQTY5X0VwVUZuZ2c/od6/public/basic

You can also create a survey response by filling in the form at https://docs.google.com/forms/d/1QN6PEO1Wl6I4VwI8GKDf-Mn0EfHFSVxw6v2EHQj_4OM/viewform and specifying the email address of one of the CQ demo users and the client context should pick up those values when you switch to that user.