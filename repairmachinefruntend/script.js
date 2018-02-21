
$('#login').click(function(){
	var userdetails = {}
	var username = $('#email').val();
	var password = $('#password').val();
					

	userdetails.username = username
	userdetails.password =  password

	$.ajax({
			url : "http://127.0.0.1:8080/auth",
			type : "POST",
			data : userdetails,
			success : function(result){
				if (result.data == "success"){
					location.href = "index2.html"
				} else {
					alert("The information that you've entered is incorrect.")
					location.reload()
				}
				
			},
			error : function(err){
				console.log(err);
				alert("You entered a wrong information !");
			}

		});	
});