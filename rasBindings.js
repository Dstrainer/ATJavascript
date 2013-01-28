/**
 * @desc This is the entry point for the script
 * @author lcovey
*/
AJS.$(document).ready(function() {
  /*
     JIRA.Events.NEW_CONTENT_ADDED should be used to look for and bind to custom fields
     because their HTML elements might not be on the page until after the page loads. 
     See https://developer.atlassian.com/display/JIRADEV/Custom+Fields+that+use+CSS+or+JavaScript+Web+Resources+in+JIRA+5.0
  */
  JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e,context) {
    //abstract each binding into its own function
    populateSummary();
    populateProposalDataRequestor();
    populateProjectPersonnel();
    populatePreAwardAdmin();
    defineOrgCodeOnChange();
    defineTransitionCommentOnFocus();
    colorFieldLabels();
  });

});

/**
 * @desc determines the issue type currently being entered
 * @author lcovey
*/
function determineIssueType() {
  issuetype = document.getElementById('issuetype');
  if (issuetype != null) { 
    return issuetype.options[issuetype.selectedIndex].text;
  } else {
    return "Unknown";
  }
}

/**
 * @desc generate the default summary value
 * @author lcovey
*/
function generateDefaultSummaryString() {
  piFname = document.getElementById('customfield_10105');
  piLname = document.getElementById('customfield_10003');
  sponsorName = document.getElementById('customfield_10006');
  proposalNumber = document.getElementById('customfield_10102');
  
  var summaryString = "";
  if ((piLname != null) && (piFname != null)) {
    summaryString = piLname.value + ", " + piFname.value;
  }
  if (sponsorName != null) {
    summaryString = summaryString + " - " + sponsorName.value;
  }
  if (proposalNumber != null) {
    summaryString = summaryString + " : " + proposalNumber.value;
  }

  return summaryString;
}

/**
 * @desc autopopulates the summary field with the pi's pid when the summary receives focus
 * @author lcovey
*/
function populateSummary() {
  summary = document.getElementById('summary');
  if (summary != null) { 
    summary.onfocus = function() {
	var issueType = determineIssueType();
        switch (issueType) {
          case "COI Review":
              summary.value = "COI Review";
            break;
          case "IRB Review":
              summary.value = "IRB Review";
            break;
          case "IBC Review":
              summary.value = "IBC Review";
            break;
          case "OESRC Review":
              summary.value = "OESRC Review";
            break;
          case "Solvency Check":
              summary.value = "Solvency Check";
            break;
          default:
              summary.value = generateDefaultSummaryString();
            break;
        }
    };
  }
}

/**
 * @desc searches through the meta tags and returns the content for the tag requested
 * @author lcovey
*/
function findMetaContentByName(name) {
  metaTags = document.getElementsByTagName('meta');
  for (i=0;i<metaTags.length;i++) {
    if (metaTags[i].name == name) {
      return metaTags[i].content;
    }
  }
  return null;
}

/**
 * @desc autopopulates the proposal data requestor field with the logged in user
 * @author lcovey
*/
function populateProposalDataRequestor() {
  dataRequestor = document.getElementById('customfield_13701');
  currentUser = findMetaContentByName("ajs-remote-user");
  if ((dataRequestor != null) && (currentUser != null)) {
    dataRequestor.value = currentUser;
    //dataRequestor.disabled = true;
  }
}

/**
 * @desc autopopulates the project personnel field with the pi's pid when the pi's pid changes
 * @author lcovey
*/
function populateProjectPersonnel() {
  dbBackedPIPid = document.getElementById('customfield_10401');
  dbBackedCoPIPids = document.getElementById('customfield_14006');
  projectPersonnel = document.getElementById('customfield_10400');

  if (dbBackedPIPid != null) { 
    dbBackedPIPid.onchange=function() {
      if (dbBackedPIPid.value != '') {
        // add PI
        if (projectPersonnel.value === '') {
          projectPersonnel.value = dbBackedPIPid.value;
        } else {
          projectPersonnel.value = projectPersonnel.value + ", " + dbBackedPIPid.value;
        }
        // add Co-PIs
        if (dbBackedCoPIPids != null) { 
          for (var i=0;i<dbBackedCoPIPids.options.length;i++) {
            projectPersonnel.value = projectPersonnel.value + ", " + dbBackedCoPIPids.options[i].value;
          }
        }  
      }
    };
  }
}

/**
 * @desc autopopulates the pre-award admin with the pre-award admin's pid
 * @author lcovey
*/
function populatePreAwardAdmin() {
  preAwardAdminUserPicker = document.getElementById('customfield_10010');
  preAwardAdminInBanner = document.getElementById('customfield_13000');

  if ((preAwardAdminInBanner != null) && (preAwardAdminUserPicker != null) ){
    preAwardAdminInBanner.onchange=function() {
      if (preAwardAdminInBanner.value != '') {
          preAwardAdminUserPicker.value = preAwardAdminInBanner.value;
      }
    };
  }
}
/**
 * @desc define the orgCode's onchange event, autopopulating both departmentContacts and department
 * @author lcovey
*/
function defineOrgCodeOnChange() {
  orgCode = document.getElementById('customfield_10500');
  departmentContacts = document.getElementById('customfield_10501');
  department = document.getElementById('customfield_10007');

  if (orgCode !== null) {

    orgCode.onchange=function() {
      //Populate departmentContacts
      if (departmentContacts !== null) {
        if (departmentContacts.value == '') {
          departmentContacts.value = orgCode.value;
        } else {
          departmentContacts.value = departmentContacts.value + ", " + orgCode.value;
        }
      }

      //Populate department
      if (department !== null) {
        var found = false;
        for (var i=0;i < department.options.length;i++) {
          if (department.options[i].text.indexOf(orgCode.value) != -1) {
            department.options[i].selected = true;
            found = true;
          }
        }
        if (!found) {
          rootDept = orgCode.value.substr(0,4) + "00";
          for (var i=0;i < department.options.length;i++) {
            if (department.options[i].text.indexOf(rootDept) != -1) {
              department.options[i].selected = true;
            }
          }
        }
      }

    };
  }
}

/**
 * @desc define a TRANSITIION comment's onfocus event, adding the transition name as a prefix 
 * @author lcovey
 *
 * This was more complicated than it had to be because JIRA is incorrectly using the comment id
 * multiple times in the same document.  tsk tsk.  Anyways, I have to find the comment that is
 * specifically inside the transition form, and then set its value.  You cannot call getElementbyId
 * on transitionForm, so I examine all of its textarea tags and find the one called comment.
*/
function defineTransitionCommentOnFocus() {
  var transitionForm = document.getElementById('issue-workflow-transition');
  if (transitionForm != null) {
    var textareas = transitionForm.getElementsByTagName('textarea');
    transitionSubmitButton = document.getElementById('issue-workflow-transition-submit');

    if (transitionSubmitButton != null) {

      for (var i=0;i<textareas.length;i++) {

        if (textareas[i].id === "comment") {
          var comment = textareas[i];
          comment.onfocus=function() {
            if (comment.value === '') {
              comment.value = transitionSubmitButton.value + "\n=================\n";
            }
          };  

        }

      }

    }

  }

}

/**
 * @desc set the labels for the various issue fields to particular colors 
 * @author lcovey
*/
function colorFieldLabels() {

  //scan for labels, and assign the label to its form element;
  var labels = document.getElementsByTagName('LABEL');
  for (var i=0; i < labels.length; i++) {
    if (labels[i].htmlFor != '') {
      var elem = document.getElementById(labels[i].htmlFor);
      if (elem) {
        elem.label = labels[i];
      } 
    }
  }

  setLabelColor('customfield_10006','#660000'); //sponsor name
}

/**
 * @desc set a field's label to a particular color
 * @author lcovey
*/
function setLabelColor(fieldId,color) {
  field = document.getElementById(fieldId);
  if (field) {
    field.label.style.color = color;
  }  
}

