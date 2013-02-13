<script type="text/javascript">

/**
*	@author dtrainer
*	@desc disables functionality on 'AS-Checklist Summary' screen, making it read-only. User can still click cancel.
*/

function readOnlyChecklistSummary(){
	var transitionForm = document.getElementById('issue-workflow-transition');
	var checkListScreen = transitionForm.getElementsByTagName('workflow-transition-261-dialog');

	if (transitionForm && checkListScreen != null){

		checkListScreen.onload = function(){

		//disables all child nodes under div
			var nodes = checkListScreen.getElementsByTagName('*');
			for(var i=0; i < nodes.length; i++){
				if(nodes != null){
					var field = nodes[i];
					field.disabled=true;
				}
			}	
		}
	}
}
</script>
