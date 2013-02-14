<script type="text/javascript">

/**
*	@author dtrainer
*	@desc adds 'PHS' & 'COI Other' fields for FCOI to array and checks if they are clicked, disabling 
*	the remaining fields
*/

function setFcoiAvail(){

	fcoi = ['customfield_11902-1','customfield_11902-2'];
	
	for(var i=0;i < fcoi.length;i++){
		var field = document.getElementById(fcoi[i]);
			var fieldToKeep = fcoi[i];	
		if(field != null){
			field.onclick = function(){ //when a field from the array has been clicked, pass fields into function setFieldAvailability()
			setFieldAvailability(fcoi,this);
			};
		}
	}
}
</script>
