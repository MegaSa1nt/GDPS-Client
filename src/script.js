gDs = "https://yourgdps.com/database/dashboard"; // Your GDPS link to dashboard (doesn't work with default Cvolton's dashboard)
gName = "GDPS"; // Your GDPS name
document.getElementById("gdpsname").innerHTML = gName;
function update(ask = false, err = '') {
 	cook = [];
 	document.getElementById("playdiv").classList.remove("no-gdps");
 	sd = new XMLHttpRequest();
 	sd.open("GET", gDs+"/download/updater.php", true);
 	sd.onload = function () {
 		result = JSON.parse(sd.response);
		cookie = document.cookie.split(";");
		cookie.forEach((penis) => {
			variable = penis.split("=");
			cook[variable[0].trim()] = variable[1];
		});
		if((result.time && result.time > cook["update"]) || err == "-1") {
			if(ask) {
				if(cook["update"] == 0) text.innerHTML = "Download GDPS!";
				else if(err == "-1") text.innerHTML = "GDPS wasn't found! Download it?";
				else text.innerHTML = "GDPS updated!";
				document.getElementById("pbtn").setAttribute("onclick", "update(false, '-1')");
				document.getElementById("pimg").setAttribute("src", "res/svg/dl.svg");
				document.getElementById("playdiv").classList.remove("dl");
			} else {
				window.dontupdate = true;
				document.getElementById("pbtn").setAttribute("onclick", "javascript:void");
				document.getElementById("pimg").setAttribute("src", "res/svg/load.svg");
				document.getElementById("playdiv").classList.add("spin");
				if(cook["update"] == 0 || err == -1) text.innerHTML = "Installing GDPS...";
				else text.innerHTML = "Updating GDPS...";
				dl = new XMLHttpRequest();
				dl.open("GET", gDs+"/download/updater.php?dl=1", true);
				dl.responseType = 'blob';
				prog = document.getElementById("progress");
				prog.value = "0";
				document.getElementById("prdiv").style.opacity="1";
				dl.onprogress = function (event) {
					prog.max = event.total;
					prog.value = event.loaded;
					document.getElementById("ploaded").innerHTML = Math.round(event.loaded/104857.6)/10 + " MB";
					document.getElementById("ptxt").innerHTML = "Downloading..."
					document.getElementById("pmax").innerHTML = Math.round(event.total/104857.6)/10 + " MB";
				}
				dl.onload = function () {
					document.getElementById("ploaded").innerHTML = "";
					document.getElementById("ptxt").innerHTML = "Extracting..."
					document.getElementById("pmax").innerHTML = "";
					prog.value = l = 0;
					jsZip = new JSZip();
					async function fullZip() { 
						const files = await dl.response.arrayBuffer();
						jsZip.loadAsync(files).then(async function (zip) {
							for (const filename of Object.keys(zip.files)) {
								prog.max = Object.keys(zip.files).length;
								if(Object.keys(zip.files).length % 10 == 1) document.getElementById("pmax").innerHTML = Object.keys(zip.files).length+" file";
								else if(Object.keys(zip.files).length % 10 > 1 && Object.keys(zip.files).length % 10 < 5 && Object.keys(zip.files).length % 10 != 0) document.getElementById("pmax").innerHTML = Object.keys(zip.files).length+" files";
								else document.getElementById("pmax").innerHTML = Object.keys(zip.files).length+" files";
								plsdata = zip.files[filename].async('uint8array').then(async function (plsdatapls) {
									await zipFile(plsdatapls, filename);
									window.gc();
									l++;
									prog.value = l;
									if(l % 10 == 1) document.getElementById("ploaded").innerHTML = l +" file";
									else if(l % 10 > 1 && l % 10 < 5 && l % 10 != 0) document.getElementById("ploaded").innerHTML = l +" files";
									else document.getElementById("ploaded").innerHTML = l +" files";
									if(l >= Object.keys(zip.files).length) {
										window.gc();
										if(cook["gdhm"] == 0) {
											window.__TAURI__.fs.removeDir(".GDHM", {recursive: true});
											window.__TAURI__.fs.removeDir("locales", {recursive: true});
											window.__TAURI__.fs.removeDir("ffmpeg", {recursive: true});
											window.__TAURI__.fs.removeFile("ToastedMarshmellow.dll");
											window.__TAURI__.fs.removeFile("RoastedMarshmellow.dll");
											window.__TAURI__.fs.removeFile("libGLESv2.dll");
											window.__TAURI__.fs.removeFile("resources.pak");
											window.__TAURI__.fs.removeFile("icudtl.dat");
											window.__TAURI__.fs.removeFile("msacm32.dll");
											window.__TAURI__.fs.removeFile("chrome_elf.dll");
											window.__TAURI__.fs.removeFile("chrome_100_percent.pak");
											window.__TAURI__.fs.removeFile("chrome_200_percent.pak");
											window.__TAURI__.fs.removeFile("client.exe");
										}
										window.dontupdate = false;
										document.getElementById("pimg").setAttribute("src", "res/svg/play.svg");
										document.getElementById("prdiv").style.opacity="0";
										text.innerHTML = "";
										window.__TAURI__.window.appWindow.requestUserAttention(2);
										document.getElementById("pbtn").setAttribute("onclick", "play()");
										document.getElementById("playdiv").classList.add("dl");
										document.getElementById("playdiv").classList.remove("spin");
										document.cookie = "update="+result.time+"; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
									}
								});
							}
						})
					}
					fullZip();
				}
				dl.send();
			}
		} 
	}
	sd.send();
}
function zipFile(fileData, filename) {
    return new Promise(resolve => {
		plol = filename.split("/");
		pstr = "";
		if(plol[1]) for(i = 0; i < plol.length; i++) {
			if(plol[i] == plol[plol.length-1]) continue;
			if(i > 0) pstr = pstr+"/"+plol[i];
			else pstr = plol[i];
		}
		window.__TAURI__.fs.createDir(pstr, {recursive: true});
		prog.value = l;
		if(l % 10 == 1) document.getElementById("ploaded").innerHTML = l +" file";
		else if(l % 10 > 1 && l % 10 < 5 && l % 10 != 0) document.getElementById("ploaded").innerHTML = l +" files";
		else document.getElementById("ploaded").innerHTML = l +" files";
		if(fileData.length <= 5242880) window.__TAURI__.fs.writeBinaryFile(filename, fileData, {dir: window.__TAURI__.fs.BaseDirectory.Resource}).then(re => {
			window.gc();
			resolve(true);
		}).catch(e =>{resolve(true)});
		else {
			arrayb = fileData.buffer;
			resolve(sendArrayBufferToRust(filename, arrayb));
		}
    })
}
function clientUpdate(ask = false) {
	cook = [];
	document.getElementById("playdiv").classList.remove("no-gdps");
	sd = new XMLHttpRequest();
	sd.open("GET", gDs+"/download/updater.php", true);
	sd.onload = function () {
		result = JSON.parse(sd.response);
		cookie = document.cookie.split(";");
		cookie.forEach((penis) => {
			variable = penis.split("=");
			cook[variable[0].trim()] = variable[1];
		});
		if(result.client && result.client > cook["client"]) {
			if(ask) {
				text.innerHTML = "Client update!";
				document.getElementById("pbtn").setAttribute("onclick", "clientUpdate()");
				document.getElementById("pimg").setAttribute("src", "res/svg/dl.svg");
				document.getElementById("playdiv").classList.remove("dl");
			} else {
				window.dontupdate = true;
				document.getElementById("pbtn").setAttribute("onclick", "javascript:void");
				document.getElementById("pimg").setAttribute("src", "res/svg/load.svg");
				document.getElementById("playdiv").classList.remove("dl");
				document.getElementById("playdiv").classList.add("spin");
				text.innerHTML = "Updating client...";
				dl = new XMLHttpRequest();
				dl.open("GET", gDs+"/download/updater.php?dl=updater", true);
				dl.responseType = 'blob';
				prog = document.getElementById("progress");
				prog.value = "0";
				document.getElementById("prdiv").style.opacity="1";
				dl.onprogress = function (event) {
					prog.max = event.total;
					prog.value = event.loaded;
					document.getElementById("ploaded").innerHTML = Math.round(event.loaded/104857.6)/10 + " MB";
					document.getElementById("ptxt").innerHTML = "Downloading..."
					document.getElementById("pmax").innerHTML = Math.round(event.total/104857.6)/10 + " MB";
				}
				dl.onload = function () {
					document.getElementById("ploaded").innerHTML = "";
					document.getElementById("ptxt").innerHTML = "Installing..."
					document.getElementById("pmax").innerHTML  = "";
					file = dl.response.arrayBuffer();
					file.then(res=>{filel = new Uint8Array(res)}).then(res=>{
						window.__TAURI__.fs.writeBinaryFile("GDPS-Updater.exe", filel).then(res=>{
							document.cookie = "client="+result.client+"; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
							document.getElementById("ploaded").innerHTML = "";
							document.getElementById("ptxt").innerHTML = "Restarting..."
							document.getElementById("pmax").innerHTML = "";
							prog.value = 0;
							window.__TAURI__.shell.open("GDPS-Updater.exe").then(res=>{
								window.dontupdate = false;
								prog.value = prog.max;
								window.__TAURI__.process.exit(0);
							});
						})
					})
				}
				dl.send();
			}
		} else update(true);
	}
	sd.send();
}
function updateUser() {
	cook = [];
	document.getElementById("loaddiv").style.opacity = "1";
	document.getElementById("loaddiv").style.visibility = "initial";
	if(document.cookie.length) {
		cookie = document.cookie.split(";");
		cookie.forEach((penis) => {
			variable = penis.split("=");
			cook[variable[0].trim()] = variable[1];
		});
	}
	if(!cook["update"]) document.cookie = "update=0; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
	if(!cook["client"]) document.cookie = "client=0; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
	if(cook["auth"] && cook["auth"] != "no") {
		user = cook["user"];
		color = cook["color"];
		id = cook["id"];
		auth = cook["auth"];
		warn = cook["warn"];
		document.getElementById("lbtn").setAttribute("onclick", "settings()");
		document.getElementById("licon").setAttribute("src", "res/svg/gear.svg");
		document.getElementById("licon").setAttribute("title", "Settings");
		document.getElementById("user").innerHTML = user;
		document.getElementById("user").style.color = "rgb("+color+")";
		document.getElementById("div").classList.remove("show");
		chk = new XMLHttpRequest();
		chk.open("GET", gDs+"/login/api.php?auth="+auth, true);
		chk.onload = function () {
			result = JSON.parse(chk.response);
			if(result.success) {
				document.getElementById("user").innerHTML = result.user;
				document.getElementById("user").setAttribute("onclick", 'window.__TAURI__.shell.open("'+gDs+'/profile/'+result.user+'")');
				document.getElementById("user").style.color = "rgb("+result.color+")";
				document.getElementById("user").style.cursor = "pointer";
				document.cookie = "user="+result.user+"; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
				document.cookie = "color="+result.color+"; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
			} else logoutbtn();
			document.getElementById("loaddiv").style.opacity = "0";
			document.getElementById("loaddiv").style.visibility = "hidden";
			if(typeof warn == "undefined") {
				document.getElementById("warndiv").style.opacity = "1";
				document.getElementById("warndiv").style.visibility = "initial";
			}
		}
		chk.send();
	} else {
		document.getElementById("lbtn").setAttribute("onclick", "show()");
		document.getElementById("licon").setAttribute("src", "res/svg/login.svg");
		document.getElementById("licon").setAttribute("title", "Login");
		document.getElementById("user").innerHTML = "guest";
		document.getElementById("user").style.cursor = "auto";
		document.getElementById("user").setAttribute("onclick", '');
		document.getElementById("user").style.color = "rgb(255,255,255)";
		document.getElementById("loaddiv").style.opacity = "0";
		document.getElementById("loaddiv").style.visibility = "hidden";
	}
	if(!window.dontupdate) clientUpdate(true);
}
function logoutbtn() {
	document.cookie = "user=no; path=/; expires=Fri, 31 Dec 0000 23:59:59 GMT";
	document.cookie = "color=no; path=/; expires=Fri, 31 Dec 0000 23:59:59 GMT";
	document.cookie = "id=no; path=/; expires=Fri, 31 Dec 0000 23:59:59 GMT";
	document.cookie = "auth=no; path=/; expires=Fri, 31 Dec 0000 23:59:59 GMT";
	document.getElementById("stgdiv").style.opacity = "0";
	document.getElementById("stgdiv").style.visibility = "hidden";
	ltext.style.color = "#ffffff";
	ltext.innerHTML = "Войдите в аккаунт";
	updateUser();
}
function loginbtn() {
	fd = new FormData(document.getElementById("form"));
	sd = new XMLHttpRequest();
	sd.open("POST", gDs+"/login/api.php", true);
	sd.onload = function () {
		result = JSON.parse(sd.response);
		if(result.success) {
			document.cookie = "user="+result.user+"; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
			document.cookie = "color="+result.color+"; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
			document.cookie = "id="+result.id+"; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
			document.cookie = "auth="+result.auth+"; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
			updateUser();
		} else {
			ltext.style.color = "#ffbbbb";
			if(result.error == "-1") ltext.innerHTML = "Wrong password!";
			if(result.error == "-2") ltext.innerHTML = "Activate your account!";
			if(result.error == "-3") ltext.innerHTML = "Something went wrong!";
		}
	}
	if(fd.get("userName").length && fd.get("password").length) sd.send(fd);
}
function play() {
	text.innerHTML = "Loading...";
	exists = window.__TAURI__.fs.exists(gName+".exe").then((result) => {
		success = result;
		if(success) {
			text.style.color = "#bbffbb";
			window.__TAURI__.shell.open(gName+".exe").then(res=>{
				text.innerHTML = "GDPS is opened!";
				setTimeout(function(){text.innerHTML = "";}, 2000);
			});
		} else {
			if(!window.dontupdate) update(true, "-1");
		}
	});
}
function show() {
 	document.getElementById("div").classList.toggle("show");
}
function settings() {
	if(document.getElementById("stgdiv").style.opacity == 1) {
		document.getElementById("stgdiv").style.opacity = "0";
		document.getElementById("stgdiv").style.visibility = "hidden";
		document.getElementById("lbtn").style.opacity = "1";
	} else {
		document.getElementById("stgdiv").style.opacity = "1";
		document.getElementById("stgdiv").style.visibility = "initial";
		document.getElementById("lbtn").style.opacity = "0";
	}
}
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + ' ' + month + ' ' + year;
  return time;
}
async function sendArrayBufferToRust(path, arrayBuffer) {
  const chunkSize = 1024 * 1024 * 5; 
  const numChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);
  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, arrayBuffer.byteLength);
    const chunk = arrayBuffer.slice(start, end);
    if (!(window.__TAURI__.tauri.invoke("append_chunk_to_file", {path: path, chunk: Array.from(new Uint8Array(chunk))}))) {
      console.log("error");
      return false;
    }
	window.gc();
  }
  return true;
}
function warning(answer) {
	if(answer) {
		document.cookie = "warn=1; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
		document.getElementById("warndiv").style.opacity = "0";
		document.getElementById("warndiv").style.visibility = "hidden";
	} else window.__TAURI__.process.exit(0);
}