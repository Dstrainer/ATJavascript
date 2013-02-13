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
    parseProposalAttributes();
    defineOrgCodeOnChange();
    defineTransitionCommentOnFocus();
    colorFieldLabels();
    colorFieldsetLegends();
    createLinkIntoPANSystem();
    changeNoneOptionsToBlanks()
    calculateBudgetTotals();
    displayUnassignedAssignee();
    warnOnCOICreate();
    setDefaultAssigneeForTransitions(context);
    //hideOZTabs();
    //showFullName();
    setDeferredAcctCodeByBillFormat();
    disableProposalNumberAndRevNumber();
    setIndirectCalcByTypeOfIndirect();
    setBillingBindings();
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
 * @desc generate the Other Agreement summary value
 * @author lcovey
*/
function generateOtherAgreementSummaryString() {
  piFname = document.getElementById('customfield_10105');
  piLname = document.getElementById('customfield_10003');
  sponsorName = document.getElementById('customfield_10006');
  otherType = document.getElementById('customfield_10110');

  var summaryString = "";
  if (otherType != null) {
    summaryString = otherType.options[otherType.selectedIndex].text + ": ";
  }
  if ((piLname != null) && (piFname != null)) {
    summaryString = summaryString + piLname.value + ", " + piFname.value;
  }
  if (sponsorName != null) {
    summaryString = summaryString + " - " + sponsorName.value;
  }

  return summaryString;
}

/**
 * @desc generate the RFP Review summary value
 * @author lcovey
*/
function generateRFPReviewSummaryString() {
  piFname = document.getElementById('customfield_10105');
  piLname = document.getElementById('customfield_10003');
  sponsorName = document.getElementById('customfield_10006');

  var summaryString = "RFP Review: ";
  if ((piLname != null) && (piFname != null)) {
    summaryString = summaryString + piLname.value + ", " + piFname.value;
  }
  if (sponsorName != null) {
    summaryString = summaryString + " - " + sponsorName.value;
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
          case "VTARC":
              summary.value = "VTARC";
            break;
          case "Approval/Review":
              summary.value = "Approval/Review";
            break;
          case "Environment Health and Safety":
              summary.value = "Environment Health and Safety";
            break;
          case "IACUC Review":
              summary.value = "IACUC Review";
            break;
          case "Legal (OSP)":
              summary.value = "Legal (OSP)";
            break;
          case "Other":
              summary.value = "Other";
            break;
          case "PI":
              summary.value = "PI";
            break;
          case "Sponsor":
              summary.value = "Sponsor";
            break;
          case "VT Foundation":
              summary.value = "VT Foundation";
            break;
          case "Legal (General Counsel)":
              summary.value = "Legal (General Counsel)";
            break;
          case "Budget":
              summary.value = "Budget";
            break;
          case "Vendor/Subrecipient Form":
              summary.value = "Vendor/Subrecipient Form";
            break;
          case "Sponsor Files":
              summary.value = "Sponsor Files";
            break;
          case "RFP Review":
              summary.value = generateRFPReviewSummaryString();
            break;
          case "LOG - Funded Modification":
              summary.value = "LOG: " + generateDefaultSummaryString();
            break;
          case "LOG - Funded Agreement":
              summary.value = "LOG: " + generateDefaultSummaryString();
            break;
          case "Other Agreement":
              summary.value = generateOtherAgreementSummaryString();
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
        projectPersonnel.value = dbBackedPIPid.value;
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
  preAwardAdminUserPicker = document.getElementById('customfield_14800');
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
 * @desc parses the attributes pulled from banner and interprets each attribute as appropriate
 * @author lcovey
*/
function parseProposalAttributes() {
  attributesSelectList = document.getElementById('customfield_14200');

  if (attributesSelectList != null) {
    attributesSelectList.onchange=function() {
      //set attribute defaults in case they are not present on this proposal
      var costShare="";
      var discoveryDomain="";
      var fcoi="";
      var irb="";
      var iacuc="";
      var ibc="";
      var clinicalTrials="";
      for (var i=0;i<attributesSelectList.options.length;i++) {
        var attributeCode = attributesSelectList.options[i].value.match(/\((.*)\)/);
        var attributeValue = attributesSelectList.options[i].value.match(/\=(.*)$/);
        if ((attributeCode[1] != null) && (attributeValue[1] != null) ) {
          switch (attributeCode[1]) {
            case "CS":
                costShare = attributeValue[1];
              break;
            case "DISDOM":
                discoveryDomain = attributeValue[1];
              break;
            case "FCOI":
                fcoi = attributeValue[1];
              break;
            case "HS":
                irb = attributeValue[1];
              break;
            case "VA":
                iacuc = attributeValue[1];
              break;
            case "DNA":
                ibc = attributeValue[1];
              break;
            case "CT":
                clinicalTrials = attributeValue[1];
              break;
          }
        }
      }
      //now that we've parsed through the attributes, set them as appropriate
      populateCostShare(costShare);
      populateDiscoveryDomain(discoveryDomain);
      populateFCOI(fcoi);
      populateIRB(irb);
      populateIACUC(iacuc);
      populateIBC(ibc);
      populateClinicalTrials(clinicalTrials); 
    };
  }
}

/**
 * @desc set the Cost Share dropdown based on its consumed Banner attributes
 * @author lcovey
*/
function populateCostShare(attributeValue) {
  costShareCombo = document.getElementById('customfield_14201');
  if (costShareCombo) { 
    //if the costShare attribute was set to anything at all, there is costshare
    if (attributeValue == "") {
      costShareCombo.value="-1"; //None
    } else {
      costShareCombo.value="12700"; //Yes
    }
  } 
}

/**
 * @desc set the Discovery Domain dropdown based on its consumed Banner attributes
 * @author lcovey
*/
function populateDiscoveryDomain(attributeValue) {
  discoveryDomainCombo = document.getElementById('customfield_10526');
  if (discoveryDomainCombo != null) {
    if (attributeValue == "") { 
      discoveryDomainCombo.value="-1";
    } else {
      for(var i=0; i<discoveryDomainCombo.options.length; i++) {
        if (discoveryDomainCombo.options[i].text.indexOf(attributeValue) != "-1") {
          discoveryDomainCombo.value = discoveryDomainCombo.options[i].value;
        } else {
        }
      }
    }
  }
}

/**
 * @desc set the FCOI checkbox based on its consumed Banner attributes
 * @author lcovey
*/
function populateFCOI(attributeValue) {
  fcoiFieldOTH = document.getElementById('customfield_11902-2');
  fcoiFieldPHS = document.getElementById('customfield_11902-1');

  // The FCOI checkbox is kinda weird.  They didn't want a none, so they put two checkboxes that act
  // as radio buttons.  Therefore, setting one to true means setting the other to false.
  if ((fcoiFieldOTH) && (fcoiFieldPHS)) {
    if (attributeValue === "OTH") {
      fcoiFieldPHS.checked = false;
      fcoiFieldOTH.checked = true;
    } else if (attributeValue === "PHS") {
      fcoiFieldOTH.checked = false;
      fcoiFieldPHS.checked = true;
    } else {
      fcoiFieldOTH.checked = false;
      fcoiFieldPHS.checked = false;
    }
  }

}

/**
 * @desc set the IRB checkbox based on its consumed Banner attributes
 * @author lcovey
*/
function populateIRB(attributeValue) {
  irbCheckbox = document.getElementById('customfield_11903-1');
  if (irbCheckbox != null) {
    if ((attributeValue === "A") || (attributeValue === "Y")) {
      irbCheckbox.checked = true;
    } else {
      irbCheckbox.checked = false;
    }
  }  
}

/**
 * @desc set the IACUC checkbox based on its consumed Banner attributes
 * @author lcovey
*/
function populateIACUC(attributeValue) {
  iacucCheckbox = document.getElementById('customfield_11904-1');

  if (iacucCheckbox != null) {
    if ((attributeValue === "A") || (attributeValue === "Y")) {
      iacucCheckbox.checked = true;
    } else {
      iacucCheckbox.checked = false;
    }

  }
}

/**
 * @desc set the IBC checkbox based on its consumed Banner attributes
 * @author lcovey
*/
function populateIBC(attributeValue) {
  ibcCheckbox = document.getElementById('customfield_11905-1');

  if (ibcCheckbox != null) {
    if ((attributeValue == "A") || (attributeValue == "Y")) {
      ibcCheckbox.checked = true;
    } else {
      ibcCheckbox.checked = false;
    }

  }
}

/**
 * @desc set the Clinical Trials checkbox based on its consumed Banner attributes
 * @author lcovey
*/
function populateClinicalTrials(attributeValue) {
  clinicalTrialsCheckbox = document.getElementById('customfield_14300-1');
  if (clinicalTrialsCheckbox != null) {
    if ((attributeValue === "A") || (attributeValue === "Y")) {
      clinicalTrialsCheckbox.checked = true;
    } else {
      clinicalTrialsCheckbox.checked = false;
    }
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
  responsibleDepartment = document.getElementById('customfield_14400');

  if (orgCode !== null) {

    orgCode.onchange=function() {
      //Populate departmentContacts
      if (departmentContacts !== null) {
          departmentContacts.value = orgCode.value;
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

  labelsToColor = ["customfield_10209","customfield_10006","customfield_11623","customfield_10502","customfield_10212","customfield_10105",
                   "customfield_10003","customfield_10500","customfield_10109","customfield_10523","customfield_10525","customfield_10524",
                   "customfield_10526","customfield_10902","customfield_10528","customfield_10531","customfield_10102","customfield_14600",
                   "customfield_10004","customfield_11902","customfield_10831","customfield_10812","customfield_11903","customfield_11904",
                   "customfield_10816","customfield_11905","customfield_10820","customfield_10825","customfield_14100","customfield_14002",
                   "customfield_10714","customfield_12105","customfield_10612","customfield_10611","customfield_10900","customfield_10901",
                   "customfield_10903","customfield_10904","customfield_10906","customfield_10531","customfield_10907","customfield_10908",
                   "customfield_10910","customfield_12107","customfield_14102","customfield_14202","customfield_14300","customfield_14500",
                   "customfield_10924","customfield_10925","customfield_10926","customfield_10927","customfield_10928","customfield_14005",
                   "customfield_10930","customfield_10932","customfield_14201","customfield_14004","customfield_11907","customfield_10918",
                   "customfield_10901","customfield_10920","customfield_11906","customfield_11908","customfield_10917","customfield_10923",
                   "customfield_10921","customfield_10916","customfield_10919","customfield_12003","customfield_13165","customfield_12004",
                   "customfield_12005","customfield_13159","customfield_13160","customfield_13161","customfield_13162","customfield_13163",
                   "customfield_13164","customfield_12006","customfield_13150","customfield_12100","customfield_12101","customfield_13144",
                   "customfield_13145","customfield_13146","customfield_13147","customfield_13148","customfield_13149","customfield_12102",
                   "customfield_13157","customfield_12103","customfield_12104","customfield_13151","customfield_13152","customfield_13153",
                   "customfield_13158","customfield_13155","customfield_13156","customfield_12200","customfield_13200","customfield_12201",
                   "customfield_12202","customfield_13194","customfield_13195","customfield_13196","customfield_13197","customfield_13198",
                   "customfield_13199","customfield_12601","customfield_12600","customfield_12203","customfield_13337","customfield_12204",
                   "customfield_12205","customfield_13185","customfield_13187","customfield_13188","customfield_13189","customfield_13335",
                   "customfield_13336","customfield_12206","customfield_13193","customfield_12207","customfield_12208","customfield_13182",
                   "customfield_13183","customfield_13184","customfield_13190","customfield_13191","customfield_13192","customfield_12209",
                   "customfield_13179","customfield_12210","customfield_12211","customfield_13173","customfield_13174","customfield_13181",
                   "customfield_13176","customfield_13177","customfield_13178","customfield_12300","customfield_13207","customfield_12301",
                   "customfield_12302","customfield_13201","customfield_13202","customfield_13203","customfield_13204","customfield_13205",
                   "customfield_13206","customfield_12400","customfield_13214","customfield_12401","customfield_12402","customfield_13208",
                   "customfield_13209","customfield_13210","customfield_13211","customfield_13212","customfield_13213","customfield_12405",
                   "customfield_12406","customfield_12407","customfield_13300","customfield_13301","customfield_13302","customfield_13303",
                   "customfield_13304","customfield_13305","customfield_13306","customfield_12408","customfield_12409","customfield_12410",
                   "customfield_13307","customfield_13308","customfield_13309","customfield_13310","customfield_13311","customfield_13312",
                   "customfield_13313","customfield_12411","customfield_12412","customfield_12413","customfield_13314","customfield_13315",
                   "customfield_13316","customfield_13317","customfield_13318","customfield_13319","customfield_13320","customfield_12500",
                   "customfield_13172","customfield_12501","customfield_12502","customfield_13166","customfield_13167","customfield_13168",
                   "customfield_13169","customfield_13170","customfield_13171","customfield_12503","customfield_13334","customfield_12504",
                   "customfield_12505","customfield_13328","customfield_13329","customfield_13330","customfield_13331","customfield_13332",
                   "customfield_13333","customfield_11004","customfield_12912","customfield_11601","customfield_11712","customfield_12902",
                   "customfield_12903","customfield_12904","customfield_12905","customfield_12906","customfield_12907","customfield_11008",
                   "customfield_13142","customfield_11608","customfield_11718","customfield_13136","customfield_13137","customfield_13138",
                   "customfield_13139","customfield_13140","customfield_13141","customfield_11007","customfield_13135","customfield_11607",
                   "customfield_11717","customfield_13129","customfield_13130","customfield_13131","customfield_13132","customfield_13133",
                   "customfield_13134","customfield_13120","customfield_11605","customfield_11713","customfield_13113","customfield_13114",
                   "customfield_13115","customfield_13117","customfield_13118","customfield_13119","customfield_13327","customfield_12403",
                   "customfield_12404","customfield_13321","customfield_13322","customfield_13323","customfield_13324","customfield_13325",
                   "customfield_13004","customfield_13326","customfield_12000","customfield_11710","customfield_12916","customfield_12917",
                   "customfield_12918","customfield_13001","customfield_13002","customfield_13003","customfield_13011","customfield_12007",
                   "customfield_12008","customfield_13005","customfield_13006","customfield_13007","customfield_13008","customfield_13009",
                   "customfield_13010","customfield_13112","customfield_11709","customfield_11715","customfield_13106","customfield_13107",
                   "customfield_13108","customfield_13109","customfield_13110","customfield_13111","customfield_13105","customfield_11708",
                   "customfield_11714","customfield_13012","customfield_13100","customfield_13101","customfield_13102","customfield_13103",
                   "customfield_15001","customfield_15002","customfield_15003","customfield_15004","customfield_15005","customfield_15006",
                   "customfield_15007","customfield_15008","customfield_15009","customfield_13104","customfield_10833","customfield_13900",
                   "customfield_14801","customfield_15301","customfield_15302","customfield_15303","customfield_15304","customfield_15305",
                   "customfield_15306","customfield_15307","customfield_15308","customfield_15309" ];

  setLabelColor(labelsToColor,'#660000'); 

}

/**
 * @desc set a particular color for a given array of fields's labels
 * @author lcovey
*/
function setLabelColor(fields,color) {

  for (var i=0; i < fields.length;i++) {
 
    field = document.getElementById(fields[i]);
    if (field) {
      field.label.style.color = color;
    }  
  }
}

/**
 * @desc  set the legends for the various issue fieldsets to particular colors
 * @author lcovey
*/
function colorFieldsetLegends() {

  //scan for legend tag, and assign the legend to its fieldset parent element;
  var legends = document.getElementsByTagName('LEGEND');
  for (var i=0; i < legends.length; i++) {
    if (legends[i].parentNode != null) {
      var elem = legends[i].parentNode;
      elem.legend = legends[i];
    }
  }

  legendsToColor = ["customfield_11006-1","customfield_14100-1","customfield_14002-1","customfield_11902-1","customfield_10831-1",
                    "customfield_10904-1","customfield_10908-1","customfield_10910-1","customfield_12107-1","customfield_14300-1",
                    "customfield_11906-1","customfield_10714-1","customfield_10528-1","customfield_11903-1","customfield_11904-1",
                    "customfield_11905-1","customfield_10925-1","customfield_14005-1","customfield_10926-1","customfield_10932-1",
                    "customfield_14004-1","customfield_13128-1","customfield_11006-1","customfield_11606-1","customfield_11716-1",
                    "customfield_13122-1","customfield_13123-1","customfield_13124-1","customfield_13125-1","customfield_13126-1",
                    "customfield_13127-1"];

  setLegendColor(legendsToColor,'#660000');
}

/**
 * @desc set the particular color for a given array of fieldset legends
 * @author lcovey
*/
function setLegendColor(fields,color) {

  for (var i=0; i < fields.length;i++) {
    field = document.getElementById(fields[i]);
   if (field) {
     checkboxDiv = field.parentNode;
     if (checkboxDiv) {
       fieldSet = checkboxDiv.parentNode;
       if (fieldSet) {
         fieldSet.legend.childNodes[0].style.color = color;  
       }
     }
   }
  }
}

/**
 * @desc create a link into the PAN system with some variables set in the query string
 * @author lcovey
*/
function createLinkIntoPANSystem() {
  var confirmation = document.getElementById("customfield_14404-1");
  
  if (confirmation != null) {

    //we need to move the description to be before the checkbox, instead of after it
    var confirmationDescription = document.getElementById("panInitiatedDescription");
    if (confirmationDescription != null) {
      var confirmationParentDiv = confirmation.parentNode;
      confirmationParentDiv.insertBefore(confirmationDescription,confirmation);
    }

    //now create the URL that goes into the PAN system
    var panLink = document.getElementById("panURL");
    if (panLink != null) {
      
      var queryString = "";

      var proposalNumber = document.getElementById("customfield_10102");
      if (proposalNumber != null) {
        if (proposalNumber.value != "") {
          queryString= queryString + "&proposalNumber="+proposalNumber.value;
        }
      }

      var processor = document.getElementById("customfield_10517");
      if (processor != null) {
	if (processor.value != "") {
          queryString= queryString + "&processorPID="+processor.value;
        }
      }

      var postAwardAdmin = document.getElementById("customfield_10109");
      if (postAwardAdmin != null) {
        if (postAwardAdmin.value != "") {
          queryString=queryString + "&postAwardAdmin="+postAwardAdmin.value;
        }
      }

      var subcontractor = document.getElementById("customfield_10911-1");
      if (subcontractor != null) {
        if (subcontractor.checked) {
          queryString= queryString + "&is_subcontractor=1";
        }
      }

      var revisionNumber = document.getElementById("customfield_14600");
      if (revisionNumber != null) {
        if (revisionNumber.value != "") {
          queryString=queryString + "&revisionNumber="+revisionNumber.value;
        }
      }

      var returnLink = document.getElementById("key-val");
      if (returnLink != null) {
        queryString= queryString + "&agreement="+returnLink.text;
      }

      panLink.href = panLink.href + queryString;
    }
  } 
}

/**
 * @desc Change the 'None' option to blank spaces since JIRA doesn't allow you to remove the None option
 * @author lcovey
*/
function changeNoneOptionsToBlanks() {

  fieldsToChange = ["customfield_10101","customfield_10525","customfield_10523","customfield_10902","customfield_10605","customfield_10607",
                    "customfield_10610","customfield_10613","customfield_10800","customfield_10806","customfield_10822","customfield_10827",
                    "customfield_10700","customfield_10702","customfield_10704","customfield_10708","customfield_10717","customfield_10900",
                    "customfield_10901","customfield_10903","customfield_10906","customfield_10907","customfield_14500","customfield_14102",
                    "customfield_10928","customfield_10930","customfield_11004","customfield_12912","customfield_11601","customfield_11712",
                    "customfield_12902","customfield_12903","customfield_12904","customfield_12905","customfield_12906","customfield_12907",
                    "customfield_10917","customfield_10918","customfield_10920","customfield_10921","customfield_10110","customfield_10526",
                    "customfield_15010","customfield_14801","customfield_15201","customfield_15202","customfield_15203" ];

  overrideOption(fieldsToChange,"-1","");
}

/**
 * @desc Takes an array of select fields and changes a given value's text 
 * @author lcovey
*/
function overrideOption(fields,whichValue,updatedText) {

  for (var i=0; i < fields.length;i++) {
    field = document.getElementById(fields[i]);
   if (field) {
     for (var j = 0; j < field.options.length; j++) {
       if (field.options[j].value == whichValue) {
         field.options[j].text = updatedText;
       }
     }
   }
  }

}

/**
 * @desc Set up onchange functions for calculating the various budget totals
 * @author lcovey
*/
function calculateBudgetTotals() {

 budget1 = ["customfield_12006", "customfield_12102", "customfield_12003", "customfield_12500", "customfield_12209", "customfield_12203",
            "customfield_12206", "customfield_12200", "customfield_12300", "customfield_12400", "customfield_12405", "customfield_12408",
            "customfield_12411" ];
 budget2 = ["customfield_12100", "customfield_12103", "customfield_12004", "customfield_12501", "customfield_12210", "customfield_12204",
            "customfield_12207", "customfield_12201", "customfield_12301", "customfield_12401", "customfield_12406", "customfield_12409",
            "customfield_12412", "customfield_12403" ];
 budget3 = ["customfield_12101", "customfield_12104", "customfield_12005", "customfield_12502", "customfield_12211", "customfield_12205",
            "customfield_12208", "customfield_12202", "customfield_12302", "customfield_12402", "customfield_12407", "customfield_12410",
            "customfield_12413", "customfield_12404" ];
 budget4 = ["customfield_13144", "customfield_13151", "customfield_13159", "customfield_13166", "customfield_13173", "customfield_13185",
            "customfield_13182", "customfield_13194", "customfield_13201", "customfield_13208", "customfield_13300", "customfield_13307",
            "customfield_13314", "customfield_13321" ];
 budget5 = ["customfield_13145", "customfield_13152", "customfield_13160", "customfield_13167", "customfield_13174", "customfield_13187",
            "customfield_13183", "customfield_13195", "customfield_13202", "customfield_13209", "customfield_13301", "customfield_13308",
            "customfield_13315", "customfield_13322" ];
 budget6 = ["customfield_13146", "customfield_13153", "customfield_13161", "customfield_13168", "customfield_13181", "customfield_13188",
            "customfield_13184", "customfield_13196", "customfield_13203", "customfield_13210", "customfield_13302", "customfield_13309",
            "customfield_13316", "customfield_13323" ];
 budget7 = ["customfield_13147", "customfield_13158", "customfield_13162", "customfield_13169", "customfield_13176", "customfield_13189",
            "customfield_13190", "customfield_13197", "customfield_13204", "customfield_13211", "customfield_13303", "customfield_13310",
            "customfield_13317", "customfield_13324" ];
 budget8 = ["customfield_13148", "customfield_13155", "customfield_13163", "customfield_13170", "customfield_13177", "customfield_13335",
            "customfield_13191", "customfield_13198", "customfield_13205", "customfield_13212", "customfield_13304", "customfield_13311",
            "customfield_13318", "customfield_13325" ];
 budget9 = ["customfield_13149", "customfield_13156", "customfield_13164", "customfield_13171", "customfield_13178", "customfield_13336",
            "customfield_13192", "customfield_13199", "customfield_13206", "customfield_13213", "customfield_13305", "customfield_13312",
            "customfield_13319", "customfield_13326" ];
 budget10 = ["customfield_13150", "customfield_13157", "customfield_13165", "customfield_13172", "customfield_13179", "customfield_13337",
             "customfield_13193", "customfield_13200", "customfield_13207", "customfield_13214", "customfield_13306", "customfield_13313",
             "customfield_13320", "customfield_13327" ];
 
 setBudgetOnChangeEvents(budget1,"customfield_12503","customfield_11004",null,null,null);
 setBudgetOnChangeEvents(budget2,"customfield_12504","customfield_11601","customfield_12403","customfield_15001","customfield_15301");
 setBudgetOnChangeEvents(budget3,"customfield_12505","customfield_11712","customfield_12404","customfield_15002","customfield_15302");
 setBudgetOnChangeEvents(budget4,"customfield_13328","customfield_12902","customfield_13321","customfield_15003","customfield_15303");
 setBudgetOnChangeEvents(budget5,"customfield_13329","customfield_12903","customfield_13322","customfield_15004","customfield_15304");
 setBudgetOnChangeEvents(budget6,"customfield_13330","customfield_12904","customfield_13323","customfield_15005","customfield_15305");
 setBudgetOnChangeEvents(budget7,"customfield_13331","customfield_12905","customfield_13324","customfield_15006","customfield_15306");
 setBudgetOnChangeEvents(budget8,"customfield_13332","customfield_12906","customfield_13325","customfield_15007","customfield_15307");
 setBudgetOnChangeEvents(budget9,"customfield_13333","customfield_12907","customfield_13326","customfield_15008","customfield_15308");
 setBudgetOnChangeEvents(budget10,"customfield_13334","customfield_12912","customfield_13327","customfield_15009","customfield_15309");

}

/**
 * @desc set the onchange event for an array of fields to sum up into a total fields
 * @author lcovey
*/
function setBudgetOnChangeEvents(fieldsToSum,totalField,budgetCodeField,miscCSField,nameCSField,shortNameCSField) {

  //set onchange events for each number that needs to be summed in this particular budget
  for (var i=0; i < fieldsToSum.length;i++) {
    field = document.getElementById(fieldsToSum[i]);
    if (field) {
      field.onchange=function() {
        alertIfBudgetCodeIsBlank(budgetCodeField);
        sumUpBudget(fieldsToSum,totalField);
        recalculateTotals();
      };
    } 
  }

  // disable the total field for this particular budget so it must be a calculated field
  var budgetTotal = document.getElementById(totalField);
  if (budgetTotal) { 
    budgetTotal.disabled = true;
  }

  //Wire up budget code for this particular budget
  var budgetCode = document.getElementById(budgetCodeField);
  if (budgetCode) {
    enableOrDisableBudgetFieldsBasedOnBudgetCode(budgetCodeField,miscCSField,nameCSField,shortNameCSField,false);
    
    budgetCode.onchange=function() {
      enableOrDisableBudgetFieldsBasedOnBudgetCode(budgetCodeField,miscCSField,nameCSField,shortNameCSField,true);
      sumUpBudget(fieldsToSum,totalField);
      recalculateTotals();
    };
  }

  //when the page is displayed, sum up the budget and recalc totals on initial display
  sumUpBudget(fieldsToSum,totalField);
  recalculateTotals();
}

/**
 * @desc MISC CS and Name CS fields should only been enabled if their budgetCode is NOT IN BANNER
 * @author lcovey
*/
function enableOrDisableBudgetFieldsBasedOnBudgetCode(budgetCodeField,miscCSField,nameCSField,shortNameCSField,displayWarning) {
  var budgetCode = document.getElementById(budgetCodeField);
  var miscCS = document.getElementById(miscCSField);
  var nameCS = document.getElementById(nameCSField);
  var shortNameCS = document.getElementById(shortNameCSField);

  if ( (budgetCode) && (miscCS) && (nameCS) && (shortNameCS) ) {
    //determine if the miscCSField should be zeroed out and disabled based on the budget Code
    if (budgetCode.options[budgetCode.selectedIndex].text.indexOf("NOT IN BANNER") == -1) {
      if ( (miscCS.disabled == false) && (displayWarning) ) { //if the MISC field was enabled, the last choice was NOT IN BANNER, so alert if desired
         alert ("The MISC CS field and Names of 3rd Party CS field for this budget have been zeroed out and disabled.");
      }
      miscCS.disabled = true;
      miscCS.value = "";
      nameCS.disabled = true;
      nameCS.value = "";
      if (budgetCode.options[budgetCode.selectedIndex].text.indexOf("Cost Share") == -1) {   //Short Name is editable is Code is NiB OR Cost Share
        shortNameCS.disabled = true;
        shortNameCS.value = "";
      } else {
        shortNameCS.disabled = false;
      }
    } else {
      if ((miscCS.disabled == true) && (displayWarning) ) {   //if the MISC field was disabled, the last choice was something other than NOT IN BANNER, so alert if desired
         alert ("You can now put values into the MISC CS and Names of 3rd Party CS fields");
      }
      miscCS.disabled = false;
      nameCS.disabled = false;
      shortNameCS.disabled = false;
    }
  }
}

/**
 * @desc BudgetCode cannot be blank.  If a budget value is entered and the code is blank, throw alert
 * @author lcovey
*/
function alertIfBudgetCodeIsBlank(budgetCodeField) {

  var budgetCode = document.getElementById(budgetCodeField);
  if (budgetCode) {
    if (budgetCode.options[budgetCode.selectedIndex].value == "-1") {
      alert("WARNING: The Budget Rule Code for this budget has not been set!");
    }
  }
}

/**
 * @desc take an array of fields and sum them up into a given field
 * @author lcovey
*/
function sumUpBudget(fieldsToSum,totalField) {

  var budgetTotal = document.getElementById(totalField);
  var total = 0;
  for (var i=0; i < fieldsToSum.length;i++) {
    field = document.getElementById(fieldsToSum[i]);
    if (field) {
      if (!isNaN(field.value)) {
        total = total + Number(field.value); 
      }
    }
  }

  if (budgetTotal) {
    budgetTotal.value = total;
  }
}

/**
 * @desc look at the various budget totals and add them to the appropriate total based on rule code
 * @author lcovey
*/
function recalculateTotals() {

  var fieldsToSum = [ ["customfield_12503","customfield_11004"],
                      ["customfield_12504","customfield_11601"],
                      ["customfield_12505","customfield_11712"],
                      ["customfield_13328","customfield_12902"],
                      ["customfield_13329","customfield_12903"],
                      ["customfield_13330","customfield_12904"],
                      ["customfield_13331","customfield_12905"],
                      ["customfield_13332","customfield_12906"],
                      ["customfield_13333","customfield_12907"],
                      ["customfield_13334","customfield_12912"] ];
  var awardAmount = document.getElementById("customfield_12600");
  var costShare = document.getElementById("customfield_12601");
  var awardTotal = 0;
  var csTotal = 0;
  for (var i=0; i < fieldsToSum.length;i++) {
    total = document.getElementById(fieldsToSum[i][0]);
    code = document.getElementById(fieldsToSum[i][1]);
    if ((total) && (code)) {
      if (!isNaN(total.value)){
        if ((code.options[code.selectedIndex].text.indexOf("BSPL") != -1) || 
            (code.options[code.selectedIndex].text.indexOf("BREG") != -1) ){
          awardTotal = awardTotal + Number(total.value);
        } else if (code.options[code.selectedIndex].text.indexOf("Cost Share") != -1) {
          csTotal = csTotal + Number(total.value);
        }
      }
    }
  }

  if ((awardAmount) && (costShare)) {
    awardAmount.value = awardTotal;
    costShare.value = csTotal;
  }

}

/**
 * @desc swap Automatic assignee for Unassigned (they are the same thing, but the display difference is important for our users)
 * @author lcovey
*/
function displayUnassignedAssignee() {
  var createIssueButton = document.getElementById("create-issue-submit");
  if (createIssueButton) {
    var assigneeField = document.getElementById("assignee-field");
    if (assigneeField) {
      assigneeField.value = "Unassigned";
    }
  }
}

/**
 * @desc show a popup when submitting a new COI issue
 * @author lcovey
*/
function warnOnCOICreate() {
  var createIssueButton = document.getElementById("create-issue-submit");
  if (createIssueButton) {
    var issueType = determineIssueType(); 
    if (issueType == "COI Review") {
      var jiraForm = document.forms["jiraform"];
      if (jiraForm) {
        var existingHandler = jiraForm.onsubmit;
        jiraForm.onsubmit = function(e) {
          alert("REMINDER: Attach SPAF, budget, external entity certification form (if applicable), and CONA form to the COI subtask");
        }
      }
    }
  }
}

/**
 * @desc set default assignee for various transitions
 * @author lcovey
 *
 * This solution is based on information found at https://answers.atlassian.com/questions/59501/change-assignee-via-javascript
*/
function setDefaultAssigneeForTransitions(context) {
  var transitionForm = document.getElementById('issue-workflow-transition');
  if (transitionForm != null) {
    var transitionSubmitButton = document.getElementById('issue-workflow-transition-submit');
    var assignee = document.getElementById("assignee");
    if ((transitionSubmitButton) && (assignee) ) {
      var optionToAdd = document.createElement("option");
      switch (transitionSubmitButton.value) {
          case "Assign To Contracts":
              var assigneeSelect = AJS.$("#assignee", context);
              assigneeSelect.trigger('set-selection-value', "ospcontracts");
            break; 
      }
    }
  }

}
/**
 * @desc this is a PoC that demonstrates how to hit JIRA's REST api to grab user data and display to the screen. if it were ever used, make a
 *       user just for this purpose.
 * @author lcovey
*/
function showFullName() {
  preAwardAdminUserPicker = document.getElementById('customfield_14800'); 
  if (preAwardAdminUserPicker){
    preAwardAdminUserPicker.onchange=function() {
      AJS.$.ajax({
            url: "https://webapps-pprd.es.vt.edu/agreements/rest/api/2/user?username=" + preAwardAdminUserPicker.value,
            type: "GET",
            user: "lcovey",
            password: "dafdafd",
            success: function(msg) {
              alert(msg.displayName);
            }
      });
    };
  }
}

/** 
 * @desc Hide the tabs where we have our temporary holding fields
 * @author lcovey
*/
function hideOZTabs() {
  anchors = document.getElementsByTagName('a');
  for (i=0;i<anchors.length;i++) {
    if (anchors[i].text.indexOf("(OZ)") != "-1" ) {
      anchors[i].style.display="none";
    }
  }
}

/**
 * @desc Set the Deferred Account Code based on the Bill Format
 * @author lcovey
*/
function setDeferredAcctCodeByBillFormat() {

  billFormat = document.getElementById('customfield_10920');
  deferredAcctCode = document.getElementById('customfield_15010');

  if ( (billFormat) && (deferredAcctCode) ) {  
    billFormat.onchange=function() {
      if (billFormat.options[billFormat.selectedIndex].value == "10760") {    //FIXD
        AJS.$("#customfield_15010").val("13501");  //YES
      } else {
        AJS.$("#customfield_15010").val("13502");  //NO
      }
    };
  }
}

/**
 * @desc Disable ProposalNumber and RevisionNumber on certain screens
 * @author lcovey
*/
function disableProposalNumberAndRevNumber() {
  var proposalNumber = document.getElementById('customfield_10102');
  var revisionNumber = document.getElementById('customfield_14600');
  var transitionForm = document.getElementById('issue-workflow-transition');
  var transitionSubmitButton = document.getElementById('issue-workflow-transition-submit'); 

  if ( (transitionForm) && (transitionSubmitButton) && (proposalNumber) && (revisionNumber) ) {
    if (transitionSubmitButton.value.indexOf("AS - General Info") != "-1") {
      revisionNumber.disabled = true;
      proposalNumber.disabled = true;
    }
  }
}

/**
 * @desc bind Indirect Calc to Type of Indirect
 * @author lcovey
*/
function setIndirectCalcByTypeOfIndirect() {
  var typeOfIndirect = document.getElementById('customfield_10928');
  var indirectCalc = document.getElementById('customfield_10930');

  if ( (typeOfIndirect) && (indirectCalc) ) {
    typeOfIndirect.onchange=function() {
      if (typeOfIndirect.options[typeOfIndirect.selectedIndex].value == "10778") {    //Full Indirect
        AJS.$("#customfield_10930").val("10785");  //MTDC
      } else if (typeOfIndirect.options[typeOfIndirect.selectedIndex].value == "10783") {    //Not Allowed - Sponsor Policy
        AJS.$("#customfield_10930").val("13002");  //None
      } else  {
        AJS.$("#customfield_10930").val("-1");  //Blank
      }
    };
    
  }
}

/**
 * @desc set the onchange event for the BILLING, BILLINGCYCLE, and SPONSOR CATEGORY fields
 * @author lcovey
*/
function setBillingBindings() {

  var billingBillable = document.getElementById('customfield_11906-1');
  var billingNonBillable = document.getElementById('customfield_11906-2');
  var billingCycle = document.getElementById('customfield_10917');
  var sponsorCategory = document.getElementById('customfield_10902');
  var loc = document.getElementById('customfield_10918');
 
  if (billingBillable) {
    billingBillable.onclick=function() {
      updateCycle();
      updateBill();
      updatePaym();
      warnOnBillableAndBillingCycleIncompatibleValues();
    };
  }
 
  if (billingNonBillable) {
    billingNonBillable.onclick=function() {
      updateCycle();
      updateBill();
      updatePaym();
      warnOnBillableAndBillingCycleIncompatibleValues();
    };
  } 

  if (billingCycle) {
    billingCycle.onchange=function() {
      updateCycle();
      updateBill();
      updatePaym();
      warnOnBillableAndBillingCycleIncompatibleValues();
      warnOnBillingCycleAndLOCIncompatibleValues();
    };
  }

  if (sponsorCategory) {
    sponsorCategory.onchange=function() {
      updateCycle();
      updateBill();
      updatePaym();
    };
  }

  if (loc) {
    loc.onchange=function() {
      updateBill();
      warnOnBillingCycleAndLOCIncompatibleValues();
    };
  }
}

/**
 * @desc Some values of Billing and BillingCycle are incompatible with one another.  Warn the user, but do not prevent them from setting said values
 * @author lcovey
*/
function warnOnBillableAndBillingCycleIncompatibleValues() {

  var billingBillable = document.getElementById('customfield_11906-1');
  var billingCycle = document.getElementById('customfield_10917');
  
  if ( (billingBillable) && (billingCycle) ) {
    if ( (billingCycle.options[billingCycle.selectedIndex].value == "10749") && (billingBillable.checked) ){
      alert("WARNING: Billing is set to BILLABLE, and Billing Cycle is set to ADVANCE - FUNDS.  These are typically incompatible values.");
    }
  }
}

/**
 * @desc If LOG# is set, Billing Cycle should be LoC
*/
function warnOnBillingCycleAndLOCIncompatibleValues() {

  var billingCycle = document.getElementById('customfield_10917');
  var loc = document.getElementById('customfield_10918');

  if ( (loc) && (billingCycle) ) {
    if ( (billingCycle.options[billingCycle.selectedIndex].value != "10750") && (loc.options[loc.selectedIndex].value != "-1") ) { //Billing Cycle: LOC and LOC not none
      alert("WARNING: Billing Cycle is not set to Letter Of Credit, but an LOC # has been set!");
    }
  }
}
/**
 * @desc set the CYCLE field based on the values in Billing and Billing Cycle
 * @author lcovey
*/
function updateCycle() {

  var cycle = document.getElementById('customfield_15203');
  var billingBillable = document.getElementById('customfield_11906-1');
  var billingNonBillable = document.getElementById('customfield_11906-2');
  var billingCycle = document.getElementById('customfield_10917');

  var newValue = "-1"; //set the default value to blank
  if ( (billingBillable) && (billingNonBillable) && (cycle) && (billingCycle) ) {
    if (billingBillable.checked) { //Billing: BILLABLE
      if (billingCycle.options[billingCycle.selectedIndex].value == "10744") {        //Billing Cycle: 6 months from last bill/semi-annually
        newValue = "13712";  //CYCLE:6
      } else if (billingCycle.options[billingCycle.selectedIndex].value == "10745") { //Billing Cycle: Irregular
        newValue = "13713";  //CYCLE:I
      } else if (billingCycle.options[billingCycle.selectedIndex].value == "10746") { //Billing Cycle: Monthly
        newValue = "13714";  //CYCLE:M
      } else if (billingCycle.options[billingCycle.selectedIndex].value == "10747") { //Billing Cycle: Non-Standard Qtr
        newValue = "13715";  //CYCLE:N
      } else if (billingCycle.options[billingCycle.selectedIndex].value == "10748") { //Billing Cycle: Quarterly
        newValue = "13716";  //CYCLE:Q
      }

    }

     AJS.$("#customfield_15203").val(newValue);
  }
}

/**
 * @desc set the BILL field based on the values in Billing and Billing Cycle
 * @author lcovey
*/
function updateBill() {

  var bill = document.getElementById('customfield_15202');
  var billingBillable = document.getElementById('customfield_11906-1');
  var billingNonBillable = document.getElementById('customfield_11906-2');
  var billingCycle = document.getElementById('customfield_10917');
  var loc = document.getElementById('customfield_10918');

  var newValue = "-1"; //set the default value to blank
  if ( (bill) && (billingBillable) && (billingNonBillable) && (billingCycle) && (loc) ) {

    if (billingBillable.checked) {           //Billing: BILLABLE
        newValue ="13711";    //BILL:Y
    } else if (billingNonBillable.checked) {    //Billing: NON-BILLABLE

        if (billingCycle.options[billingCycle.selectedIndex].value == "10750") {         //Billing Cycle: LOC 
          newValue = "13708";  //BILL:1
        } else if (billingCycle.options[billingCycle.selectedIndex].value == "10751") {  //Billing Cycle: LoG
          newValue = "13709";  //BILL:L
        } else if (billingCycle.options[billingCycle.selectedIndex].value == "10749") {  //Billing Cycle: Advance Funds
          newValue = "13710";  //BILL:8
        } else if (loc.options[loc.selectedIndex].value != "-1") {                       //LOC# is not None
          newValue = "13708";  //BILL:1
        }

    }

    AJS.$("#customfield_15202").val(newValue);
  }

}

/**
 * @desc set the PAYM field based on the values in Billing, Billing Cycle, and Sponsor Category
 * @author lcovey
*/
function updatePaym() {

  var paym = document.getElementById('customfield_15201');
  var billingBillable = document.getElementById('customfield_11906-1');
  var billingCycle = document.getElementById('customfield_10917');
  var sponsorCategory = document.getElementById('customfield_10902');

  var newValue = "-1"; //set the default value to blank

  if ( (paym) && (billingBillable) && (billingCycle) && (sponsorCategory) ) {

    //set PAYM based on Billing
    if (billingBillable.checked) {  //Billing: BILLABLE

       if (sponsorCategory.options[sponsorCategory.selectedIndex].value == "10706") {     //Sponsor Category: 7-Federal
         newValue = "13705";  //PAYM:03
       } else if (sponsorCategory.options[sponsorCategory.selectedIndex].value != "-1") { //Sponsor Category: anything other than none/blank
         newValue = "13706";  //PAYM:04
       }

    } 

    //set PAYM based on BILLING CYCLE
    if (billingCycle.options[billingCycle.selectedIndex].value == "10751") {        //Billing Cycle: LoG
      newValue = "13707";  //PAYM:99
    } else if (billingCycle.options[billingCycle.selectedIndex].value == "10749") { //Billing Cycle: Advance Funds

      if (sponsorCategory.options[sponsorCategory.selectedIndex].value == "10706") {     //Sponsor Category: 7-Federal
        newValue = "13703";  //PAYM:01
      } else if (sponsorCategory.options[sponsorCategory.selectedIndex].value != "-1") { //Sponsor Category: anything other than none/blank
        newValue = "13704";  //PAYM:02
      }

    }

    AJS.$("#customfield_15201").val(newValue);
  }

}
