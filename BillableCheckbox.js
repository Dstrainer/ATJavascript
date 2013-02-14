<script type ="text/javascript">
/**
*	@author dtrainer
*	@desc adds 'Billable', 'NON-Billable', & 'LOG' fields for Billing to array and checks if they are clicked, disabling 
*	the remaining fields
*/

function billableAvail(){

	billable = ['customfield_11906-1','customfield_11906-2','customfield_11906-3'];

	for(var i=0;billable.length;i++){
			var field = document.getElementById(billable[i]);
			if(field != null){
				field.onclick = function(){ //when a field from the array has been clicked, pass fields into function setFieldAvailability()
				setFieldAvailability(billable,field);
				};
			}
	}
}
</script>
