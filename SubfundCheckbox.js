<script type= "text/javascript">
/**
*	@author dtrainer
*	@desc adds 'Create Subfund' or 'Increase Existing Subfund' fields for Subfund to array and checks if they are clicked, disabling 
*	the remaining fields
*/

function setSubfundAvail(){

	subfund = ['customfield_13500-1','customfield_13501-1'];
	
	for(var i=0;i < subfund.length;i++){
		var field = document.getElementById(subfund[i]);
			var fieldToKeep = subfund[i];
		if(field != null){
			field.onclick = function(){ 
			setFieldAvailability(subfund,this);
			};
		}		
	}
}
</script>
