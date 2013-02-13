<script type="text/javascript">

/**
*	@author dtrainer
*	@desc adds 'PHS' & 'COI Other' fields for FCOI to array and checks if they are clicked, disabling 
*	the remaining fields
*/

function fcoiAvail(){

	fcoi = ['customfield_11902-1','customfield_11902-2'];
	for(var i=0;indirectInfo.length;i++){
			var field = document.getElementById(selectedFields[i]);
			if(field != null){
				field.onclick = function(){ //when a field from the array has been clicked, pass fields into function setFieldAvailability()
				setFieldAvailability(fcoi);
				}
			}
	}
}
</script>
