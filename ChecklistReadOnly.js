<script type="text/javascript">

readOnlyChecklistSummary();

/**
*	@author dtrainer
*	@desc disables functionality on 'AS-Checklist Summary' screen, making it read-only. 
*	User can still click cancel. **THIS CODE WAS NOT USED DUE TO JIRA RESTRICTIONS**
*/

function readOnlyChecklistSummary(){

	var transitionForm = document.getElementById('issue-workflow-transition');
	var transitionSubmitButton = document.getElementById('issue-workflow-transition-submit'); 
	if ((transitionForm) && (transitionSubmitButton)){
		if (transitionSubmitButton.value.indexOf("AS - Checklist Summary") != -1) {
			transitionSubmitButton.disabled=true;
		}
	}
}
</script>