<script type = "text/javascript">
/**
*	@author dtrainer
*	@description copies fields to next budget based on checkbox click
*/

function copyBudget1Fields(){
	
	budget1 = ['customfield_10500','customfield_10212','customfield_10105','customfield_10003',
			   'customfield_10927','customfield_11007','customfield_11008'];
	budget2 = ['customfield_12000','customfield_12007','customfield_11708','customfield_11709',
			   'customfield_11605','customfield_11607','customfield_11608'];
	budget3 = ['customfield_11710','customfield_12008','customfield_11714','customfield_11715',
		      'customfield_11713','customfield_11717','customfield_11718'];
	budget4 = ['customfield_12916','customfield_13005','customfield_13012','customfield_13106',
			   'customfield_13113','customfield_13129','customfield_13136'];
	budget5 = ['customfield_12917','customfield_13006','customfield_13100','customfield_13107',
			   'customfield_13114','customfield_13130','customfield_13137'];
	budget6 = ['customfield_12918','customfield_13007','customfield_13101','customfield_13108',
			   'customfield_13115','customfield_13131','customfield_13138'];
	budget7 = ['customfield_13001','customfield_13008','customfield_13102','customfield_13109',
			   'customfield_13117','customfield_13132','customfield_13139'];
	budget8 = ['customfield_13002','customfield_13009','customfield_13103','customfield_13110',
			   'customfield_13118','customfield_13133','customfield_13140'];
	budget9 = ['customfield_13003','customfield_13010','customfield_13104','customfield_13111',
			   'customfield_13119','customfield_13134','customfield_13141'];
	budget10 = ['customfield_13004','customfield_13011','customfield_13105','customfield_13112',
				'customfield_13120','customfield_13135','customfield_13142'];
			
	setFieldsOnChangeEvents(budget1,budget2,'customfield_11600-1');
	setFieldsOnChangeEvents(budget1,budget3,'customfield_11711-1');
	setFieldsOnChangeEvents(budget1,budget4,'customfield_12908-1');
	setFieldsOnChangeEvents(budget1,budget5,'customfield_12909-1');
	setFieldsOnChangeEvents(budget1,budget6,'customfield_12910-1');
	setFieldsOnChangeEvents(budget1,budget7,'customfield_12911-1');
	setFieldsOnChangeEvents(budget1,budget8,'customfield_12913-1');
	setFieldsOnChangeEvents(budget1,budget9,'customfield_12914-1');
	setFieldsOnChangeEvents(budget1,budget10,'customfield_12915-1');


}

<script>