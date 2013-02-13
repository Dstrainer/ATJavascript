<script type="text/javascript">

/**
*	@author dtrainer
*	@description copies fields to next budget based on checkbox click
*/
function copyBudgets(infoBox,budget1,newBudget){

	if(infoBox.check == true){
		budget1.value = newBudget.value;
		else{
		newBudget.value = '';
		}
	}
}




</script>