<script type ="text/javascript">

/**
*	@author dtrainer
*	@desc enables/disables a field based upon which is checked 
*/

//passed fields from array
function setFieldAvailability(selectedFields){

	for(var i = 0; i < selectedFields.length; i++){
	var field = document.getElementById(selectedFields[i]);
			if (field != null ){
					if(field.checked = true){ //if field is newly checked, no change is made
					}
					else{
						field.checked = false; //if field is not newly checked, make false
					}
				}
			}
	}
}

</script>