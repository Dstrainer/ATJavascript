<script type="text/javascript">

/**
*	@author dtrainer
*	@desc adds 'On Campus' & 'Off Campus' fields for Location to array and checks if they are clicked, disabling 
*	the remaining fields
*/

function locationAvail(){

	locations = ['customfield_14005-1','customfield_14005-2'];

		for(var i=0;locations.length;i++){
			var field = document.getElementById(selectedFields[i]);
			if(field != null){
				field.onclick = function(){ //when a field from the array has been clicked, pass fields into function setFieldAvailability()
				setFieldAvailability(locations,selectedFields[i]);
				}
			}
		}
}
</script>
