



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
	
	
	$(document).on('click', "#moreInfo", (function() {
						storage.movieIdClicked = this.className
						console.log(storage.movieIdClicked)				 
						//console.log(storage.movieItem)
						}) );	
	$(document).on('click', "#moreInfo", function (e) {
		$('#list').hide();
		$('#listM').hide();
		
		$('#movieBackground').show();
			// Mivie List call
		getData("movie/"+storage.movieIdClicked, "", movieToStorage , error); //API request for movie list 	
		
	//	https://api.themoviedb.org/3/movie/372058?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=en-US
	});
	
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
	
	function render () {
		getData("movie/top_rated", '&page=' + storage.current_page, toStorage , error); //API request for movie list 		
	}
	
	function toStorage(result, status, xhr) {			
		
		storage.articleList = storage.articleList.concat( result["results"].slice(storage.index)); // add new object to existing array	
		storage.total_pages =  result["total_pages"];		
		storage.articleListLength = storage.articleList.length;		
		ArticalList();		
	}

function movieToStorage(result, status, xhr) {			
		
		storage.movieItem = result; // add new object to existing array	
		moviePage();		
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
                + "<p class=\"card-footer\"><button id=\"moreInfo\"  class=\"" + storage.articleList[i]["id"] + "\">More info</button></p>"
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

function moviePage(){   
	
			 
            var imageMovie = storage.imgUrl + storage.movieItem["poster_path"];
            var backgroundImage = storage.movieItem["backdrop_path"];
			storage.movieBackground.style.display = 'block';
			storage.movieBackground.style.background = `url('https://image.tmdb.org/t/p/w500${backgroundImage}') no-repeat`;
			storage.movieBackground.style.backgroundSize = "cover"; 
            var resultHtml = (
			"<div class=\"container\">" 
				+ "<div class=\"row\" id=\"movie\">"			
					+ "<div class=\"col-12 col-sm-12 col-md-12 col-lg-12 my-3\">"
						+ "<button class=\"btn btn-outline-info my-2 my-sm-0\">Back to Movie List</button>"
					+ "</div>"
					+ "<div class=\"col-12 col-sm-4 col-md-4 col-lg-5 col-xl-4\">"
						+"<img class=\"imgAboutSrc\" src=\"" + imageMovie + "\">"
					+ "</div>"
			   + "<div class=\"col-12 col-sm-8 col-md-8 col-lg-7 col-xl-8 d-flex flex-column \">"
					+ "<h4 class=\"card-title\">" + storage.movieItem["title"] + "</h4>"
					+ "<p class=\"card-text\">" + storage.movieItem["overview"] + "</p>"               
					+"</div>"
				+"</div>"
			+"</div>"
            )
        $("#aboutMovie").html(resultHtml);
}

 






