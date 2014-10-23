<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Case List</title>
    <meta name="description" content="List of recent cases happened.">
    <meta name="author" content="">
    <link href="resources/css/bootstrap.min.css" rel="stylesheet">
    <link href="resources/css/templatemo_justified.css" rel="stylesheet">
    <link href="resources/css/bootstrap-combined.min.css" rel="stylesheet">
    <link href="resources/css/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css" media="screen">
     
    <script type="text/javascript" src="resources/js/jquery-1.11.1.js"></script>
    <script type="text/javascript" src="resources/js/util.js"></script>
	<script type="text/javascript" src="resources/js/main.js"></script>
	<script type="text/javascript" src="resources/js/bootstrap-datetimepicker.min.js"></script>
	<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=Qwo4QaYk0ezPv1I1RwSiELjU"></script>
  </head>

  <body>

    <div id="container" class="container">
       <h1>Car Insurance Management System</h1>
        <ul class="nav nav-justified">
          <li><a href=".">Case List</a></li>
          <li class="active"><a href="#">Add a Case</a></li>
          <li><a href="map">Map</a></li>
        </ul>

      	<div class="row space30"> <!-- row 1 begins -->
      	    <div class="col-md-6">
                <form role="form" id="submitform" method="POST" data-id='${jsonObject.id}'>
                  <div class="form-group">
                    <label for="ownerName1">Owner Name 1:</label>
                    <input name="ownerName1" type="text" class="form-control" id="ownerName1" value='${jsonObject.ownerName1}' placeholder="Enter car owner name 1">
                  </div>
                  <div class="form-group">
                    <label for="ownerName2">Owner Name 2:</label>
                    <input name="ownerName2" type="text" class="form-control" id="ownerName2" value='${jsonObject.ownerName2}' placeholder="Enter car owner name 2">
                  </div>
                  <div class="form-group">
                    <label for="carNumber1">Car Plate Number 1:</label>
                    <input name="carNumber1" type="text" class="form-control" id="carNumber1" value='${jsonObject.carNumber1}' placeholder="Enter the car plate number 1">
                  </div>
                  <div class="form-group">
                    <label for="carNumber2">Car Plate Number 2:</label>
                    <input name="carNumber2" type="text" class="form-control" id="carNumber2" value='${jsonObject.carNumber2}' placeholder="Enter the car plate number 2">
                  </div>
                  <div class="form-group">
	    			  <div id="datetimepicker" class="input-append date">
	    			  	<label for="dateTime">Date Time:</label>
	      				<input type="text" name="dateTime" id="dateTime" value='${jsonObject.dateTime}' placeholder="Enter the date and time"></input>
	      				<span class="add-on">
	        				<i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
	      				</span>
	    			 </div>
	    		  </div>
                  <div class="form-group">
                    <label for="latitude">Latitude:</label>
                    <input name="latitude" type="text" class="form-control" id="latitude" value='${jsonObject.latitude}' disabled="disabled">
                  </div>
                  <div class="form-group">
                    <label for="longitude">Longitude:</label>
                    <input name="longitude" type="text" class="form-control" id="longitude" value='${jsonObject.longitude}' disabled="disabled">
                  </div>
                  <div class="form-group">
                    <label for="acc_description">Description:</label>
                  	<textarea name="acc_description" rows="5" class="form-control" id="acc_description" value='${jsonObject.acc_description}' 
                  	placeholder="Enter the accident description">${jsonObject.acc_description}</textarea>
				  </div>
                </form>
                <button class="btn btn-default" onclick="saveChange(submitform)">Submit</button>
                <button class="btn btn-default" onclick="deleteItem(submitform)">Delete</button>
                <button class="btn btn-default" onclick="addAnother(submitform)">Add Another</button>
           </div>
           
            <div class="col-md-6">
           	  <h2>Accident location</h2>
           	  <div id="status"></div>
              <div style="width:300px;height:200px;border:1px solid gray;margin:30px auto" id="mymapcontainer"></div>
            </div>
            
            <div class="col-md-6">
           	  <h2>Photos</h2>
              <div id="attachments">
              	<c:forEach var="item" items="${jsonObject.attachements}" varStatus="status">
        			<br><div><img height="250px" width="250px" src=" ${item.url} " alt='Image' /></div>
				</c:forEach>
              </div>
              <div id="picStatus"></div>
	          <div id="uploadbtnarea">
	             <input class="btn btn-default" type="file" name="file"  width="200px" id="upload_file" value="">
	             <input class="btn btn-default" type="submit" value="Upload" onClick='uploadFile(upload_file, submitform, attachments)'>
	          </div>
            </div>
            
     	</div> <!-- /row 1 -->

      <!-- Site footer -->
      <div class="footer">
      	<div id="loadingImage"></div>	
        <p>Copyright @ 2014 IBM | <a href="http://www.ibm.com/" title="IBM">IBM</a> </p>
      </div>
      <script type="text/javascript">
      	window.onload = function() {
          if(navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(updateLocation);
          }
      	};

      	function updateLocation(position) {
          	var latitude = position.coords.latitude;
          	var longitude = position.coords.longitude;
          	if(!latitude || !longitude) {
          	    document.getElementById("status").innerHTML = "HTML5 Geolocation is supported in your browser, but location is currently not available.";
          	    return;
          	}

          	var map = new BMap.Map("mymapcontainer");                    
             
          	//document.getElementById("status").innerHTML = "longitude:"+longitude + " latitude:"+latitude;
          	var longitudeFormValue = document.getElementById("longitude").value;
          	var latitudeFormValue = document.getElementById("latitude").value;
          	if (longitudeFormValue != null && longitudeFormValue != ""
          			&& latitudeFormValue != null && latitudeFormValue != ""){
          		
          	}else{
          		var newvalue = longitude+ (Math.random() * 10);
          		longitudeFormValue = newvalue;
          		document.getElementById("longitude").value = newvalue;
          		
              	var newvalue2 = latitude + (Math.random() * 10);
              	latitudeFormValue = newvalue2;
              	document.getElementById("latitude").value = newvalue2;
          	}
          	document.getElementById("status").innerHTML = "longitude:"+longitudeFormValue + " latitude:"+latitudeFormValue+"<br>";
        	
          	var point = new BMap.Point(longitudeFormValue, latitudeFormValue); 
          	
         	map.centerAndZoom(point, 13);                            
          	var marker = new BMap.Marker(point);                      
          	map.addOverlay(marker);                     
      };
	</script>
	<script type="text/javascript">
      $('#datetimepicker').datetimepicker({
        format: 'MM/dd/yyyy hh:mm',
        language: 'en',
        pickDate: true,
        pickTime: true,
        hourStep: 1,
        minuteStep: 15,
        secondStep: 30,
        inputMask: true
      });
    </script>
    </div> 
  </body>
</html>