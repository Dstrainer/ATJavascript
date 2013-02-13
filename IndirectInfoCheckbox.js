<script type="text/javascript">
/**
*	@author dtrainer
*	@desc adds 'NCR', 'CAER', & 'Full Indirect' fields for Indirect Info to array and checks if they are clicked, disabling 
*	the remaining fields
*/

function indirectInfoAvail(){
	//pass all Indirect fields into an array
	indirectInfo = ['customfield_10932-1','customfield_10932-2','customfield_10932-3'];
	
	
		for(var i=0;indirectInfo.length;i++){
			var field = document.getElementById(selectedFields[i]);
			if(field != null){
				field.onclick = function(){ //when a field from the array has been clicked, pass fields into function setFieldAvailability()
				setFieldAvailability(indirectInfo);
				}
			}
		}
}
</script>
