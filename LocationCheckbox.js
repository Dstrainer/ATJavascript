<script type="text/javascript">

/**
*	@author dtrainer
*	@desc adds 'On Campus' & 'Off Campus' fields for Location to array and checks if they are clicked, disabling 
*	the remaining fields
*/
function setLocationAvail(){

	var locations = ['customfield_14005-1','customfield_14005-2','customfield_14005-3'];

	for(var i=0;i < locations.length;i++){
	  var field = document.getElementById(locations[i]);
          var fieldToKeep = locations[i];
	  if(field){
	    field.onclick = function(){ 
	      setFieldAvailability(locations,this);
	    };
	  }
	}
}
</script>
