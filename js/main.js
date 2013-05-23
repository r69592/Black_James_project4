/*

James Black
VFW : 1305
Project 3

*/
window.addEventListener("DOMContentLoaded", function() {
   
    
    // My get id function.
    function ge(x) {
         var elementId = document.getElementById(x);
         return elementId;
    }


    // Toggle on/off function.        
    function toggleControls(n) {
        switch(n) {
            case "on":
                ge("choreForm").style.display = "none";
                ge("clearStorage").style.display = "inline";
                ge("displayData").style.display = "none";
                ge("addNewChore").style.display = "inline";
                break;
            case "off":
                ge("choreForm").style.display = "block";
                ge("clearStorage").style.display = "inline";
                ge("displayData").style.display = "inline";
                ge("addNewChore").style.display = "none";
                ge("items").style.display = "none";
                break;
            default:
            return false;
        };
    }
         
    
    // Make Select Field With js.
    function makeField() {
        var formTag = ge("form"), 
            selectLi = ge("select"),
            makeSelect = document.createElement("select");
            makeSelect.setAttribute("id", "area");
        for(var i=0, j=myTypeArray.length; i<j; i++){
            var makeOption = document.createElement("option");
            var optText = myTypeArray[i];
            makeOption.setAttribute("value", optText);
            makeOption.innerHTML = optText;
            makeSelect.appendChild(makeOption);
        }
        selectLi.appendChild(makeSelect);
    }
   
     // Get radio answer function.         
    function getSelectedRadio() {
        var radios = document.forms[0].difficulty;
        for(var i=0; i < radios.length; i++) {
            if (radios[i].checked) {
                difficultyValue = radios[i].value;
            }
        }
    }
       
    // Show storage.
    function showData(){
        toggleControls("on");
        var makeDiv = document.createElement("div");
        makeDiv.setAttribute("id", "items");
        var makeList = document.createElement("ul");
        makeDiv.appendChild(makeList);
        document.body.appendChild(makeDiv);
        ge("items").style.display = "block";
        for (var i=0, len=localStorage.length; i<len; i++) {
            var makeLi = document.createElement("li");
            var linksLi =document.createElement("li");
            makeList.appendChild(makeLi);
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            var obj = JSON.parse(value);
            var makeSublist = document.createElement("ul");
            makeLi.appendChild(makeSublist);
            for (var n in obj) {
                var makeSubli = document.createElement("li");
                makeSublist.appendChild(makeSubli);
                var optSubText = obj[n][0]+" "+obj[n][1];
                makeSubli.innerHTML = optSubText;
                makeSublist.appendChild(linksLi);
            }
            makeItemLinks(localStorage.key(i), linksLi); 
        }
    }
    

    // Make Item Links.
    function makeItemLinks(key, linksLi){
        var editLink  = document.createElement("a");
        editLink.href = "#";
        editLink.key  = key;
        var editText  = "Edit Chore";
        editLink.addEventListener("click", editItem);
        editLink.innerHTML = editText;
        linksLi.appendChild(editLink);

        var breakTag = document.createElement("br");
        linksLi.appendChild(breakTag);

        var deleteLink  = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.key  = key;
        var deleteText  = "Delete Chore";
        deleteLink.addEventListener("click", deleteItem);
        deleteLink.innerHTML = deleteText;
        linksLi.appendChild(deleteLink);

    }   

    // My edit item link function....
    function editItem (){
        var value = localStorage.getItem(this.key);
        var item  = JSON.parse(value);

        toggleControls("off");

        // Get Elements By Id....
        ge("chore").value = item.chore[1];
        ge("area").value  =item.area[1];

        var radios = document.forms[0].difficulty;
        for (var i=0; i<radios.length; i++){
            if (radios[i].value == "Easy" && item.difficulty[1] == "Easy"){
                radios[i].setAttribute("checked", "checked");
            }else if (radios[i].value == "Medium" && item.difficulty[1] == "Medium"){
                radios[i].setAttribute("checked", "checked");
            }else if (radios[i].value == "Hard" && item.difficulty[1] == "Hard"){
                radios[i].setAttribute("checked", "checked");
            }
        }
        ge("importance").value = item.importance[1];
        ge("choreDate").value  = item.choreDate[1];
        ge("notes").value      = item.notes[1];

        //remove listener.
        saveButton.removeEventListener("click", saveData);
        ge("saveButton").value = "Edit Chore";
        var editSubmit = ge("saveButton");
        editSubmit.addEventListener("click", validate);
        editSubmit.key = this.key;
    }
 
    function deleteItem () {
        var ask = confirm("Are you sure you want to delete this chore?");
        if (ask) {
            localStorage.removeItem(this.key);
            alert("Chore was deleted");
            window.location.reload();
        }else{
            alert("Chore was NOT deleted.");
        }
    }

    // Validate function.
    function validate (e) {
        var getArea      = ge("area");
        var getChore     = ge("chore");

        //error reset
        errMsg.innerHTML        = "";
        getArea.style.border    = "1px solid black";
        getChore.style.border   = "1px solid black";

        //get error messages
        // Select validation.
        var messageAry = [];
        if (getArea.value === "--Choose A Location--"){
            var choreError = "Please choose a chore location.";
            getArea.style.border = "1px solid red";
            messageAry.push(choreError);
        }
        // Chore Discription validation.
        if(getChore.value === ""){
            var getChoreError = "Please enter a chore.";
            getChore.style.border = "1px solid red";
            messageAry.push(getChoreError);
        }
        console.log(getChore);

        if (messageAry.length >= 1) {
            for (var i=0, j=messageAry.length; i < j; i++){
                var txt = document.createElement("li");
                txt.innerHTML = messageAry[i];
                errMsg.appendChild(txt);
            }
            e.preventDefault();
            return false;
        }else{
            saveData(this.key);
            window.location.reload();
        }
    }


    // Save data
    function saveData (key) {
        if (!key){
            var id = Math.floor(Math.random()*1000001);
        }else{
                id = key;
        }
        getSelectedRadio();
        var item            = {};
            item.chore      = ["Chore", ge("chore").value];
            item.area       = ["Chore Location", ge("area").value];
            item.difficulty = ["difficulty", difficultyValue];
            item.importance = ["importance", ge("importance").value];
            item.choreDate  = ["Chore Date", ge("choreDate").value];
            item.notes      = ["Notes", ge("notes").value];
            localStorage.setItem(id, JSON.stringify(item));
            alert("Chore Saved!");
    }

    
    // Clear storage.
    var clearStorage = function() {
        if (localStorage.length === 0){
            alert("Storage is empty.");
        }else {
            localStorage.clear();
            alert("All chores have been deleted!");
            window.location.reload();
            return false;
        }
    }
    
    
    // My array for dropdown menu.
    var myTypeArray = ["--Choose A Location--", "laundry", "kitchen", "bathroom", "living room", "beddroom", "yard"],
        difficultyValue,
        errMsg = ge("errors");
    ;
    makeField();
   
        
    // Set link & Submit.    
    var showStorage = ge("displayData");
    showStorage.addEventListener("click", showData);
    var clearStorageLink = ge("clearStorage");
    clearStorageLink.addEventListener("click", clearStorage);
    var saveButton     = ge("saveButton");
    saveButton.addEventListener("click", validate);

    
});