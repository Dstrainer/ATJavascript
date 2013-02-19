<script type ="text/javascript">

/**
*	@author dtrainer
*	@desc enables/disables a field based upon which is checked 
*/

//passed fields from array
function setFieldAvailability(selectedFields, keptField){

	for(var i = 0; i < selectedFields.length; i++){
	  var field = document.getElementById(selectedFields[i]);
          if ( (field) && (keptField) && (field.value != keptField.value) ){
		field.checked = false;
          }
	}
}


</script>