<script type="text/javascript">

/**
*	@author dtrainer
*	@desc adds 'Yes' & 'No' fields for Classified Uncontrolled to array and checks if they are clicked, disabling 
*	the remaining fields
*/

function setClassUncontrolledAvail(){

	classUncontrolled = ['customfield_14100-1','customfield_14100-2'];
	
	for(var i=0;i < classUncontrolled.length;i++){
		var field = document.getElementById(classUncontrolled[i]);
			var fieldToKeep = classUncontrolled[i];
		if(field != null){
			field.onclick = function(){ //when a field from the array has been clicked, pass fields into function setFieldAvailability()
			setFieldAvailability(classUncontrolled,this);
			}
		}
	}
}
</script>
