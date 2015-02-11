var ScoreBoard = (function(elem){
    if(!elem)return;
    var _selTemp = elem.querySelector("li.template").cloneNode(true);
    
    function _getTemplate(){
        return _selTemp.cloneNode(true);
    }
    
    function _getPLayerName(id){
        if(id===0) return "Neutral";
        
        return "Player "+ id;
    }
    
    function _sortArrayByScore(arr){
        arr.sort(function(a,b){
            return a.totalPwr < b.totalPwr;
        });
    }
    
    function _showScore(scores){
        _sortArrayByScore(scores);
        elem.innerHTML = "";
        for(var i = 0; i<scores.length;i++){
            if(scores[i].nbCell>0){
                var el = _getScoreByPlayer(scores[i]);
                elem.appendChild(el);
            }

        }
    }
    
    function _getScoreByPlayer(dataPlayer){
        var el = _getTemplate();
        var playerColor = UiConf.players[dataPlayer.player].mainColor;
        
        el.className = "playerInfo pl" +dataPlayer.player;
        
        var scorVal = el.querySelector(".scoreValue");
        scorVal.innerHTML = dataPlayer.percentagePwr;
        scorVal.parentNode.setAttribute("style","color:"+playerColor+";");
        el.querySelector(".playerName").innerHTML = _getPLayerName(dataPlayer.player);
        el.querySelector(".nbCell").innerHTML = dataPlayer.nbCell;
        el.querySelector(".nbPoint").innerHTML = dataPlayer.totalPwr;
        
        return el;
    }
    
    return {
      showScore:_showScore
    };
    
})(document.querySelector("#scoreBoard"));