<script type="text/javascript">
/**
*	@author dtrainer
*	@desc adds 'NCR', 'CAER', & 'Full Indirect' fields for Indirect Info to array and checks if they are clicked, disabling 
*	the remaining fields
*/

function setIndirectInfoAvail(){
	
	indirectInfo = ['customfield_10932-1','customfield_10932-2','customfield_10932-3'];
	
	for(var i=0;i < indirectInfo.length;i++){
		var field = document.getElementById(indirectInfo[i]);
			var fieldToKeep = indirectInfo[i];
		if(field != null){
			field.onclick = function(){ 
			setFieldAvailability(indirectInfo,this);
			};
		}
	}
}
</script>
