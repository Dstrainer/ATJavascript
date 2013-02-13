<script type="text/javascript">
/**
*	@author dtrainer
*	@description copies fields to next budget based on checkbox click
*/
function setFieldsOnChangeEvents(budget1Fields,focusedBudget){

sameInfoBoxes = ['customfield_11600-1','customfield_11711-1','customfield_12908-1',
				'customfield_12909-1','customfield_12910-1','customfield_12911-1',
				'customfield_12913-1','customfield_12914-1','customfield_12915-1'];
				
	for(var i = 0; i < budget1Fields.length; i++){
		field1 = document.getElementById(budget1Fields[i]);
		field2 = document.getElementById(focusedBudget[i]);
		checkBox = sameInfoBoxes[i];
			if ((field1 != null) && (field2 != null)) {
				checkBox.onchange = function(){//if checkbox is clicked copy fields from budget one to focusedBudget
				copyBudgets(checkBox,field1,field2);
				}
			}
	}	
}

</script>