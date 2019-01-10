//--------------------------------------------- Storage Object -----------------------------
var storage = {
    url: "https://api.themoviedb.org/3/",
    imgUrl: "https://image.tmdb.org/t/p/w500/",
    key: '?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=en-US',
    articleList: [],
    total_pages: '',
    current_page: 1,
	index: (this.current_page-1)*20+1,
    articleListLength: '',
    limit: 10,
    movieList: [],
    movieIdClicked: '',
    movieItem: {},
    list : document.getElementById('listM'),
    movieBackground: document.getElementById('movieBackground'),
};

	function getData(apiName, config, render, error) {
		$.ajax({
			url: storage.url + apiName + storage.key  + config,
			dataType: "json",
			success: render,
			error: error
		});
	}

//-----------------------------------------  Movies List page (GRID)
	$(window).on('load', function (e) {
		$('#movieBackground').hide();
			// Mivie List call
			render();
	});
	

	function render () {
		getData("movie/top_rated", '&page=' + storage.current_page, toStorage , error); //API request for movie list   

		
		
		$(window).on('scroll', function() {
			  var d = document.documentElement;
			  var offset = d.scrollTop + window.innerHeight;
			  var height = d.offsetHeight;

			 //console.log('offset = ' + offset);
				//console.log('height = ' + height);		
				
					if (offset === height) {									
						storage.current_page++
						console.log(storage.current_page)		
						if (storage.current_page < storage.limit) {		
							
							
							render ()	
							
						}		
						
					}	
					
	});
		
	}
	function toStorage(result, status, xhr) {			
		
		storage.articleList = storage.articleList.concat( result["results"].slice(storage.index)); // add new object to existing array
		
		storage.total_pages =  result["total_pages"];
		
		storage.articleListLength = storage.articleList.length;
		
		ArticalList();
		
	}


	function ArticalList () {
		//--------------------------  Infinite scroll  > render() while limit allows
	
		var resultHtml = $("<div class=\"row\"  id=\"articleList\">");
				
		
        for (var i = 0; i < storage.articleList.length; i++) {
			 
            var image = storage.articleList[i]["poster_path"] == null ? "Image/no-image.png" : storage.imgUrl + storage.articleList[i]["poster_path"];
            var cutString =  storage.articleList[i].overview.slice(0,200);
            storage.articleList[i].overview  = cutString.slice(0, cutString.lastIndexOf('.'))+'.';
            resultHtml.append("<div class=\"result col-12 col-sm-12 col-md-9 col-lg-3\" resourceId=\"" + storage.articleList[i]["id"] + "\">"
                + "<div class=\"card movie-card\">"
                +"<div class=\"rowMovieDiv row no-gutters\">"
                + "<div class=\"imgDiv\">"
                + "<img class=\"poster\" src=\"" + image + "\" />"
                + "<div class=\"overlayPoster\">"
                + "<div class=\"card-body\">"
                + "<h4 class=\"card-title\">" + storage.articleList[i]["title"] + "</h4>"
                + "<p class=\"card-text\">" + storage.articleList[i]["overview"] + "</p>"
                + "<p class=\"card-footer\" resourceId=\"" + storage.articleList[i]["id"] + "\">More info</p>"
                + "</div>"
                + "</div>"
                + "</div>"
                + "</div>"
                + "</div>"
            )
		resultHtml.append("</div>");
        $("#listM").html(resultHtml);
		
		
		}
		
        }
		
		// ------------------------------------------ STATUS ERROR FUNCTION -----------------------------------------------------------------
function error(xhr, status, error) {
    $("#listM").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
}

   // ------------------------------------------ RENDER SEARCH LIST FUNCTION -----------------------------------------------------------------

	$("input").on('change keyup paste', function () {
		
        var input = document.getElementById('searchMovie');
		clearSearch('searchList');
		if (input.value!="") {
        getData("search/movie", "&page=1&include_adult=false&query=" + input.value, searchToStorage, noInput);                  //  call search render
		}
	});
	function noInput () {
		clearSearch('searchList');
	}

function searchToStorage(result, status, xhr) {
	
	
    storage.movieList = result["results"];
    console.log(storage);
    renderSearch()
}
    
function renderSearch() {
	
    var searchResult = $("<div class=\"MovieList\">");

    for (var i = 0; i < storage.movieList.length; i++) {
        searchResult.append("<div class=\"col-12 col-sm-12 col-md-8 input-group \" resourceId=\"" + storage.movieList[i]["id"] + "\">" + "<h4 class=\"card-title\">" + storage.movieList[i]["title"] + "</h4></div>")
    }
    searchResult.append("</div>");
    $("#searchList").html(searchResult);
}
function clearSearch(el){
    document.getElementById(el).innerHTML = "";
};

function clearSearchValue(el){
    document.getElementById(el).value = "";
};








