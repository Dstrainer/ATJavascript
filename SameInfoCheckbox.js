<script type="text/javascript">
/**
*	@author dtrainer
*	@description copies fields to next budget based on checkbox click
*/
function setFieldsOnChangeEvents(budget1Fields,focusedBudget,checkBox){

  var checkBoxElement = document.getElementById(checkBox);
  if (checkBoxElement) {
    checkBoxElement.onclick = function() {
      if (checkBoxElement.checked == true) {
        copyBudgetFields(budget1Fields,focusedBudget);
      }
    };	

  }	
}

</script>