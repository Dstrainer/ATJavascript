<script type="text/javascript">

readOnlyChecklistSummary();

/**
*	@author dtrainer
*	@desc disables functionality on 'AS-Checklist Summary' screen, making it read-only. 
*	User can still click cancel.
*/

function readOnlyChecklistSummary(){

	field = ['customfield_10605','customfield_10607','customfield_10610','customfield_10613',
				'customfield_10800','customfield_10806','customfield_10822','customfield_10827',
				'customfield_10700','customfield_10702','customfield_10704','customfield_10708',
				'customfield_10717'];
	
	var transitionForm = document.getElementById('issue-workflow-transition');
	var transitionSubmitButton = document.getElementById('issue-workflow-transition-submit'); 
	
	if ((transitionForm) && (transitionSubmitButton)){
		if (transitionSubmitButton.value.indexOf("AS - Checklist Summary" != "-1") ){
			
			for(var i=0; i < field.length; i++){
			var selectedField = document.getElementById(field[i]);
				if(selectedField){					
					selectedField.disabled=true;
				};
			}	
		}
	}
}
</script>