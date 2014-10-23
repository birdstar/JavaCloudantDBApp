// index.js

var REST_DATA = 'api/favorites';

var KEY_ENTER = 13;
var defaultItems = [
	
];

function loadItems(){
	xhrGet(REST_DATA, function(data){
		
		//stop showing loading message
		stopLoadingMessage();
		
		var receivedItems = data.body || [];
		var items = [];
		var i;
		// Make sure the received items have correct format
		for(i = 0; i < receivedItems.length; ++i){
			var item = receivedItems[i];
			if(item && 'id' in item){
				items.push(item);
			}
		}
		var hasItems = items.length;
		if(!hasItems){
			items = defaultItems;
		}
		for(i = 0; i < items.length; ++i){
			addItem(items[i], !hasItems);
		}
		if(!hasItems){
			var table = document.getElementById('notes');
			var nodes = [];
			for(i = 0; i < table.rows.length; ++i){
				nodes.push(table.rows[i].firstChild.firstChild);
			}
			function save(){
				if(nodes.length){
					saveChange(nodes.shift(), save);
				}
			}
			save();
		}
	}, function(err){
		console.error(err);
	});
}

function startProgressIndicator(row)
{	
	row.innerHTML="<td class='content'>Uploading file... <img height=\"50\" width=\"50\" src=\"resources/images/loading.gif\"></img></td>";	
}

function removeProgressIndicator(row)
{
	row.innerHTML="<td class='content'>uploaded...</td>";
}

function addNewRow(table)
{
	var newRow = document.createElement('tr');
	table.appendChild(newRow);
	return table.lastChild;
}

function uploadFile(node)
{
	
	var file = node.previousSibling.files[0];
	
	//if file not selected, throw error
	if(!file)
	{
		alert("File not selected for upload... \t\t\t\t \n\n - Choose a file to upload. \n - Then click on Upload button.");
		return;
	}
	
	var row = node.parentNode.parentNode;
	
	var form = new FormData();
	form.append("file", file);
	
	var id = row.getAttribute('data-id');
	
	var queryParams = "id=" + (id==null?-1:id);
	queryParams+= "&name="+row.firstChild.firstChild.value;
	queryParams+= "&carnumber="+row.firstChild.firstChild.nextSibling.value;
	queryParams+= "&cartype="+row.firstChild.firstChild.nextSibling.nextSibling.value;
	queryParams+="&value="+row.firstChild.nextSibling.firstChild.firstChild.firstChild.firstChild.firstChild.value;
	
	
	var table = row.firstChild.nextSibling.firstChild;	
	var newRow = addNewRow(table);	
	
	getloc();
	
	startProgressIndicator(newRow);
	
	xhrAttach(REST_DATA+"/attach?"+queryParams, form, function(item){		
		console.log('attached: ', item);
		row.setAttribute('data-id', item.id);
		removeProgressIndicator(row);
		setRowContent(item, row);
	}, function(err){
		console.error(err);
	});
}

var attachButton = "<br><input type=\"file\" name=\"file\" id=\"upload_file\"><input width=\"100\" type=\"submit\" value=\"Upload\" onClick='uploadFile(this)'>";

function setRowContent(item, row)
{
		var innerHTML = "<td class='content'>" +
				"<table border=\"0\">" +
				"<tr>"+
				"<textarea id='nameText' onkeydown='onKey(event)'>"+item.name+"</textarea>" +
				"</tr>"+
				"<tr>"+
				"<textarea id='carPlateNumberText' onkeydown='onKey(event)'>"+item.carnumber+"</textarea>" +
				"</tr>"+
				"<tr>"+
				"<textarea id='carTypeText' onkeydown='onKey(event)'>"+item.cartype+"</textarea>" +
				"</tr>"+
				"</table>"+
						"</td><td class='content'><table border=\"0\">";	
		
		var valueTextArea = "<textarea id='valText' onkeydown='onKey(event)' placeholder=\"Enter a description...\"></textarea>";		
		if(item.value)
		{
			valueTextArea="<textarea id='valText' onkeydown='onKey(event)'>"+item.value+"</textarea>";
		}
		
		innerHTML+="<tr border=\"0\" ><td class='content'>"+valueTextArea+"</td></tr>" + "<tr border=\"0\" ><td class='content'><div style='width:200px;height:100px;border:1px solid gray;margin:30px auto' id='container'></div></td></tr>";
		          
		
		var attachments = item.attachements;
		if(attachments && attachments.length>0)
		{
			
			for(var i = 0; i < attachments.length; ++i){
				var attachment = attachments[i];
				if(attachment.content_type.indexOf("image/")==0)
				{
					innerHTML+= "<tr border=\"0\" ><td class='content'>"+attachment.key+"<br><img height=\"100\" width=\"200\" src=\""+attachment.url+"\" onclick='window.open(\""+attachment.url+"\")'></img></td></tr>" ;


				} else if(attachment.content_type.indexOf("audio/")==0)
				{
					innerHTML+= "<tr border=\"0\" ><td class='content'>"+attachment.key+"<br><AUDIO  height=\"50\" width=\"200\" src=\""+attachment.url+"\" controls></AUDIO></td></tr>" ;


				} else if(attachment.content_type.indexOf("video/")==0)
				{
					innerHTML+= "<tr border=\"0\" ><td class='content'>"+attachment.key+"<br><VIDEO  height=\"100\" width=\"200\" src=\""+attachment.url+"\" controls></VIDEO></td></tr>" ;


				} else if(attachment.content_type.indexOf("text/")==0 || attachment.content_type.indexOf("application/")==0)
				{
					innerHTML+= "<tr border=\"0\" ><td class='content'><a href=\""+attachment.url+"\" target=\"_blank\">"+attachment.key+"</a></td></tr>" ;

				} 
			}	
			
		}
		
		row.innerHTML = innerHTML+"</table>"+attachButton+"</td><td class='deleteBtn' onclick='deleteItem(this)' title='delete me'></td>";
	
}

function addItem(item, isNew){
	
	var row = document.createElement('tr');
	var id = item && item.id;
	if(id){
		row.setAttribute('data-id', id);
	}
	
	if(item) // if not a new row
	{
		setRowContent(item, row);
	}
	else //if new row
	{
		row.innerHTML = "<td class='content'>" +
							
							"<table border=\"0\">" +
								"<tr border=\"0\">" +
									"<textarea id='nameText' onkeydown='onKey(event)' placeholder=\"Enter the owner name\">" +
									"</textarea>" +
								"</tr>" +
								"<tr border=\"0\">" +
									"<textarea id='carPlateNumberText' onkeydown='onKey(event)' placeholder=\"Enter the car plate number\">" +
									"</textarea>" +
								"</tr>" +
								"<tr border=\"0\">" +
									"<textarea id='carTypeText' onkeydown='onKey(event)' placeholder=\"Enter the car type\">" +
									"</textarea>" +
								"</tr>" +
							"</table>" +
						"</td>" +
						"<td class='content'>" +
							"<table border=\"0\">" +
								"<tr border=\"0\">" +
									"<td class='content'>" +
										"<textarea id='valText'  onkeydown='onKey(event)' placeholder=\"Enter a description...\">" +
										"</textarea>" +
									"</td>" +
								"</tr>" +
							"</table>"+
							attachButton+
						"</td>" +
						"<td class='deleteBtn' onclick='deleteItem(this)' title='delete me'>" +
						"</td>";
	}

	var table = document.getElementById('notes');
	table.lastChild.appendChild(row);
	row.isNew = !item || isNew;
	
	if(row.isNew)
	{
		var textarea = row.firstChild.firstChild;
		textarea.focus();
	}
	
}

function deleteItem(deleteBtnNode){
	var row = deleteBtnNode.parentNode;
	row.parentNode.removeChild(row);
	if(row.getAttribute('data-id'))
	{
		xhrDelete(REST_DATA + '?id=' + row.getAttribute('data-id'), function(){
		}, function(err){
			console.error(err);
		});
	}	
}


function onKey(evt){
	
	if(evt.keyCode == KEY_ENTER && !evt.shiftKey){
		
		evt.stopPropagation();
		evt.preventDefault();
		var nameV, valueV;
		var row ; 		
		
		if(evt.target.id=="nameText")
		{
			row = evt.target.parentNode.parentNode;
			nameV = evt.target.value;
			valueV = row.firstChild.nextSibling.firstChild.firstChild.firstChild.firstChild.firstChild.value ;
			
		}
		else
		{
			row = evt.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
			nameV = row.firstChild.firstChild.value;
			valueV = evt.target.value;
		}
		
		var data = {
				name: nameV,
				value: valueV
			};			
		
			if(row.isNew){
				delete row.isNew;
				xhrPost(REST_DATA, data, function(item){
					row.setAttribute('data-id', item.id);
				}, function(err){
					console.error(err);
				});
			}else{
				var requestParam = '?id=' + row.getAttribute('data-id')+"&name="+nameV+"&value="+valueV;
				xhrPut(REST_DATA+requestParam, data, function(){
					console.log('updated: ', data);
				}, function(err){
					console.error(err);
				});
			}
		
	
		if(row.nextSibling){
			row.nextSibling.firstChild.firstChild.focus();
		}else{
			addItem();
		}
	}
}

function saveChange(contentNode, callback){
	var row = contentNode.parentNode.parentNode;
	
	var data = {
		name: row.firstChild.firstChild.value,
		value:row.firstChild.nextSibling.firstChild.value		
	};
	
	if(row.isNew){
		delete row.isNew;
		xhrPost(REST_DATA, data, function(item){
			row.setAttribute('data-id', item.id);
			callback && callback();
		}, function(err){
			console.error(err);
		});
	}else{
		data.id = row.getAttribute('data-id');
		xhrPut(REST_DATA, data, function(){
			console.log('updated: ', data);
		}, function(err){
			console.error(err);
		});
	}
}



function toggleAppInfo(){
	var node = document.getElementById('appinfo');
	node.style.display = node.style.display == 'none' ? '' : 'none';
}


function showLoadingMessage()
{
	document.getElementById('loadingImage').innerHTML = "Loading data "+"<img height=\"100\" width=\"100\" src=\"resources/images/loading.gif\"></img>";
}
function stopLoadingMessage()
{
	document.getElementById('loadingImage').innerHTML = "";
}

function getloc() {
    if(navigator.geolocation) {
//        document.getElementById("status").innerHTML = "HTML5 Geolocation is supported in your browser.";
        navigator.geolocation.getCurrentPosition(updateLocation);
    }else{
    	document.getElementById("container").innerHTML = "HTML5 Geolocation is not supported in your browser.";
    }
};

function updateLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    if(!latitude || !longitude) {
        document.getElementById("status").innerHTML = "HTML5 Geolocation is supported in your browser, but location is currently not available.";
        return;
    }

    var map = new BMap.Map("container");                     // 创建Map实例
    var point = new BMap.Point(longitude, latitude);        // 创建点坐标
    map.centerAndZoom(point, 15);                            // 初始化地图,设置中心点坐标和地图级别。
    var marker = new BMap.Marker(point);                        // 创建标注
    map.addOverlay(marker);                                    //将标注添加到地图中
};

showLoadingMessage();
//updateServiceInfo();
loadItems();

