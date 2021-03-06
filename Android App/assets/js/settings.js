window.isValidURL = (function() {// wrapped in self calling function to prevent global pollution

     //URL pattern based on rfc1738 and rfc3986
    var rg_pctEncoded = "%[0-9a-fA-F]{2}";
    var rg_protocol = "(http|https):\\/\\/";

    var rg_userinfo = "([a-zA-Z0-9$\\-_.+!*'(),;:&=]|" + rg_pctEncoded + ")+" + "@";

    var rg_decOctet = "(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])"; // 0-255
    var rg_ipv4address = "(" + rg_decOctet + "(\\." + rg_decOctet + "){3}" + ")";
    var rg_hostname = "([a-zA-Z0-9\\-\\u00C0-\\u017F]+\\.)+([a-zA-Z]{2,})";
    var rg_port = "[0-9]+";

    var rg_hostport = "(" + rg_ipv4address + "|localhost|" + rg_hostname + ")(:" + rg_port + ")?";

    // chars sets
    // safe           = "$" | "-" | "_" | "." | "+"
    // extra          = "!" | "*" | "'" | "(" | ")" | ","
    // hsegment       = *[ alpha | digit | safe | extra | ";" | ":" | "@" | "&" | "=" | escape ]
    var rg_pchar = "a-zA-Z0-9$\\-_.+!*'(),;:@&=";
    var rg_segment = "([" + rg_pchar + "]|" + rg_pctEncoded + ")*";

    var rg_path = rg_segment + "(\\/" + rg_segment + ")*";
    var rg_query = "\\?" + "([" + rg_pchar + "/?]|" + rg_pctEncoded + ")*";
    var rg_fragment = "\\#" + "([" + rg_pchar + "/?]|" + rg_pctEncoded + ")*";

    var rgHttpUrl = new RegExp( 
        "^"
        + rg_protocol
        + "(" + rg_userinfo + ")?"
        + rg_hostport
        + "(\\/"
        + "(" + rg_path + ")?"
        + "(" + rg_query + ")?"
        + "(" + rg_fragment + ")?"
        + ")?"
        + "$"
    );

    // export public function
    return function (url) {
        if (rgHttpUrl.test(url)) {
            return true;
        } else {
            return false;
        }
    };
})();

var errorMessage = "";


function getValue(id) {
    return document.getElementById(id)
        .value;
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}


function save() {
	var mpcserver = getValue("mpc");
	var delugeserver = getValue("deluge");
	if (isBlank(mpcserver)) {
		BootstrapDialog.alert('Please enter a host for MPC');
		return false;
	}
	
	if (isBlank(delugeserver)) {
		BootstrapDialog.alert('Please enter a host for Deluge');
		return false;
	}
	
	if (!window.isValidURL(mpcserver)) {
		BootstrapDialog.alert('Please enter a valid URL for MPC');
		return false;
	}
	
	if (!window.isValidURL(delugeserver)) {
		BootstrapDialog.alert('Please enter a valid URL for Deluge');
		return false;
	}

	localStorage.mpc = btoa(mpcserver);
	
	localStorage.deluge = btoa(delugeserver);
	
	//$(".loader").fadeIn("slow");
	
	window.location = "http://strike.io/resolve/?" + localStorage.mpc + "," +  localStorage.deluge;
}

function sendError(type) {

	$( "#error" + type ).fadeIn( "slow", function() {
    // Animation complete
  });
}

function check_available(ip){
	
}

$("#save").click(function(e){
	
    save();
});
$("#test").click(function(e){
	
    save();
});

function load() {
	var errors = false;
	var delugeActive = getParameterByName('deluge');
var mpcActive = getParameterByName('mpc');
if (mpcActive === "false") {
	errors = true;
	sendError(1);
}
if (delugeActive === "false") {
	errors = true;
	sendError(2);
}

	var mpcurl = atob(localStorage.mpc);
	 $('#mpc').val(mpcurl);
	 var delugeurl = atob(localStorage.deluge);
	  $('#deluge').val(delugeurl);
	  
	  if (errors === false) {
		  BootstrapDialog.alert('Your current settings seem to be valid.');
	  } 
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

load();