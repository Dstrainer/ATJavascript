<script type= "text/javascript">
/**
*	@author dtrainer
*	@desc adds 'Create Subfund' or 'Increase Existing Subfund' fields for Subfund to array and checks if they are clicked, disabling 
*	the remaining fields
*/

function subfundAvail(){

	subfund = ['customfield_13500-1','customfield_13501-1'];
	
	for(var i=0;indirectInfo.length;i++){
			var field = document.getElementById(selectedFields[i]);
			if(field != null){
				field.onclick = function(){ //when a field from the array has been clicked, pass fields into function setFieldAvailability()
				setFieldAvailability(subfund);
				}
			}		
	}
}
</script>
