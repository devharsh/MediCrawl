$document.ready(function(){

    $("#srchbtn").on("Click", function(e){
        e.preventDefault();

        let query = $("#searchquery").val();
        console.log(query)

        let url = "";
        if(query !== ""){
            $.ajax({
                url: url, 
                method: "GET",
                dataType: "json",

                beforeSend: function(){
                    $("#loader").show();
                },
                complete: function(){
                    $("#loader").hide();
                },
                success: function(med){
                    console.log(med);
                },
                error: function(){
                    console.log("error");
                }
            });
        }
        else{
            console.log("Please enter something");
        }
        console.log(url)

    });

});