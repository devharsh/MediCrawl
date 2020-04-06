$(document).ready(function () {

    let url = "http://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=25cf6990c95247b7b648d903acac736d";
  
    $.ajax({
      url: url,
      method: "GET",
      dataType: "JSON",
  
      beforeSend: function () {
        $(".progress").show();
      },
  
      complete: function () {
        $(".progress").hide();
      },
  
      success: function (newsdata) {
        let output = "";
        let latestNews = newsdata.articles;
        
        for (var i in latestNews) {
          output += `
            <div class="col l4 m6 s12">
            <div class="card medium hoverable">
              <div class="card-image">
                <img src="${latestNews[i].urlToImage}" class="responsive-img" alt="${latestNews[i].title}">
              </div>
              <div class="card-content">
                <span class="card-title activator"><i class="material-icons right">more_vert</i></span>
                <h6 class="truncate">Title: <a href="${latestNews[i].url}" title="${latestNews[i].title}">${latestNews[i].title}</a></h6>
                <p><b>Author</b>: ${latestNews[i].author} </p>
                <p><b>News source</b>: ${latestNews[i].source.name} </p>
                <p><b>Published</b>: ${latestNews[i].publishedAt} </p>
              </div>
  
              <div class="card-reveal">
                <span class="card-title"><i class="material-icons right">close</i></span>
                <p><b>Description</b>: ${latestNews[i].description}</p>
              </div>
  
              <div class="card-action">
                <a href="${latestNews[i].url}" target="_blank" class="btn">Read More</a>
              </div>
             </div>
            </div>
          `;
        }
  
        if (output !== "") {
          $("#newsResults").html(output);
        }
  
      },
  
      error: function () {
        let errorMsg = `<div class="errorMsg center">Some error occured</div>`;
        $("#newsResults").html(errorMsg);
      }
    })
  
  });