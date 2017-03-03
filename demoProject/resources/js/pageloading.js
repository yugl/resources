function initLoadingPage(){ 
    var loadingDiv = document.createElement("div");
    loadingDiv.id = 'PageLoading';
    loadingDiv.className = "loading-box";
    loadingDiv.innerHTML = '<div class="modal fade in modal-ajax" style="display: block;"><i class="fa fa-refresh fa-spin"></i></div>'; 
    document.body.appendChild( loadingDiv );  
};
initLoadingPage(); 


window.onload = function(){   
    if( $('#PageLoading').length > 0 ){
        $('#PageLoading').remove();   
    }; 
};