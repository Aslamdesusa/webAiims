$(window).bind("load", function(){
	$.ajax({
		type: 'GET',
		url: 'http://localhost:8080/get/all/emails',
		dataType: 'json',
		success: function(data){
			var trHTML = '';
			for (var i = 0; i < data.data.length; i += 1) {
            	trHTML = "<tr id=" + data.data[i]._id + "><td id='1'> "+ data.data[i]._id +" </td><td id='2' data-id1="+ data.data[i].emailaddress + ">" + data.data[i].emailaddress +"</td><td id='3' data-id2="+data.data[i].companyname+ ">"+data.data[i].companyname+ "</td><td><button data-id=" + data.data[i]._id + " style='font-size: 12px; padding-right: 10px; padding: 2px !important; outline: none;' type='button' class='btn btn-danger btn-lg delete' data-toggle='modal' id='dl'>Delete</button></td></tr>"
	        	$('#updatetable').append(trHTML);
            }     
	    }
	});
})





$(document).ready(function(){
	$('#AddEmail').click(function(){

		var emailModel = {}
		var emailaddress = $('#emailid').val();
		var companyname = $('#companyname').val();

		emailModel.emailaddress = emailaddress;
		emailModel.companyname = companyname;
		console.log(emailModel);

			$.ajax({
				url : "http://127.0.0.1:8080/post/email/address/by/super/admine",
				type : "POST",
				data : emailModel,
				success : function(json){
					alert('email successfully added');
					location.reload();
				},
				error : function(err){
					alert("please enter valied email address");
				}  
			});
			
		})
});


// delete a specific complaint from table

$('table').on('click', '.delete', function(e){

	$(this).closest('tr').remove()
		
        e.preventDefault();
        var dataId = $(this).attr("data-id");
        console.log(dataId);
		
        $.ajax({
		    url: 'http://localhost:8080/delete/specific/emailById/'+ dataId,
		    type: 'DELETE',
		    success: function(result) {
		    	alert('Deleted Entery')
		    	console.log('Delete Entery');
		    },
			error : function(err){
				alert(err);
			}  
		});
});

$(function (){
	$('#bloding').click(function(){
			location.href = "login.html"
	});
})