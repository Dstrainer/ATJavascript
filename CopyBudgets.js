<script type="text/javascript">

/**
*	@author dtrainer
*	@description copies fields to next budget based on checkbox click
*/
function copyBudgetFields(budget1,newBudget){

  for(var i = 0; i < budget1.length; i++){
    budget1Field = document.getElementById(budget1[i]);
    newBudgetField = document.getElementById(newBudget[i]);
    if ( (budget1Field) && (newBudgetField) ) {  
      newBudgetField.value = budget1Field.value;
    }
  }
}

</script>