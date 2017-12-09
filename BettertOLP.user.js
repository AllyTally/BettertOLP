// ==UserScript==
// @name         BettertOLP
// @namespace    https://tolp.nl/forum/index.php?topic=3809
// @version      1.4.2
// @GM_updatingEnabled true
// @description  Adds more features to the tOLP forums!
// @author       -Kiwi Alexia
// @noframes
// @run-at       document-idle
// @match        https://tolp.nl/forum/*
// @match        http://tolptheme.hol.es/*
// @match        http://distractionware.com/forum/*
// @require      https://rawgit.com/sizzlemctwizzle/GM_config/master/gm_config.js
// @require      https://tolp.nl/forum/jquery-3.2.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://rawgit.com/lokesh/lightbox2/master/src/js/lightbox.js
// @require      https://rawgit.com/hydrabolt/discord.js/webpack/discord.stable.js
// @require      https://glaceon.ca/BettertOLP/sanitize-html.js
// @require      https://twemoji.maxcdn.com/2/twemoji.min.js?2.3.1
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @resource     lightboxcss  https://rawgit.com/lokesh/lightbox2/master/src/css/lightbox.css

// ==/UserScript==
var btversion = "1.4.2";

var lightboxcsssrc = GM_getResourceText ("lightboxcss");
GM_addStyle(lightboxcsssrc);

var empicktwsrc = GM_getResourceText ("empicktw");
GM_addStyle(empicktwsrc);

var empicksrc = GM_getResourceText ("empick");
GM_addStyle(empicksrc);
//if (window.location.href.split("://")[1] === "tolp.nl/bettertolp.html") {
//    $("body").html = "<h1>Changelog:</h1><br>+Added this page";
//}


var dware = false;
var tolp = false;
var foruma = window.location.origin+window.location.pathname.split("index.php")[0];
var forum = foruma.split("://")[1];
switch(forum) {
    case "distractionware.com/forum/":
        var dware = true;
        break;
    case "tolp.nl/forum/":
        var tolp = true;
        break;
    case "tolptheme.hol.es/":
        var tolp = true;
        break;
}
var items = [
    "Never use single solid tiles.",
    "Remember to align your rooms!",
    "Don't have too much backtracking. It gets boring.",
    "Make sure your rooms are at a consistent difficulty.",
    "Use <span><a href='https://tolp.nl/forum/index.php?topic=1719.0'>Ved</a></span>!"
];
var item = items[Math.floor(Math.random()*items.length)];

var bettertolplink = "https://tolp.nl/forum/index.php?topic=3809";
function openNav() {
    document.getElementById("settingsoverlay").style.height = "100%";
    $("iframe")[0].style.height = "40%";
}

function closeNav() {
    document.getElementById("settingsoverlay").style.height = "0%";
}
function closeNav2() {
    document.getElementById("settingsoverlay").style.height = "0%";
    GM_config.close();
}
$( "body" ).prepend('<div id="settingsoverlay" class="overlay"></div>');
document.getElementById('settingsoverlay').addEventListener('click', closeNav2, false);
GM_addStyle('.overlay {height: 0%;width: 100%;position: fixed;z-index: 1;top: 0;left: 0;background-color: rgba(0,0,0, 0.9);overflow-y: hidden;transition: 0.5s;}');
GM_config.init(
    {
        'id': 'MyConfig', // The id used for this instance of GM_config
        'title': 'BettertOLP Settings',
        'fields': // Fields object
        {
            'beforeuser': // This is the id of the field
            {
                'label': 'Before usernames', // Appears next to field
                'type': 'text', // Makes this setting a text field
                'default': '[' // Default value if user doesn't change it
            },
            'afteruser': {
                'label': 'After usernames', // Appears next to field
                'type': 'text', // Makes this setting a text field
                'default': ']' // Default value if user doesn't change it
            },
            'theme': {
                'label': 'tOLP theme', // Appears next to field
                'type': 'radio', // Makes this setting a series of radio elements
                'options': ['Disabled', 'Rain', 'Lavender'], // Possible choices
                'default': 'Disabled' // Default value if user doesn't change it
            },
            'dtoken': {
                //'label': 'Discord token', // Appears next to field
                'type': 'hidden', // Makes this setting hidden
                'default': '' // Default value if user doesn't change it
            },
            'avatart':
            {
                'label': 'Avatar shape', // Appears next to field
                'type': 'select', // Makes this setting a dropdown
                'options': ['Square', 'Circle'], // Possible choices
                'default': 'Square' // Default value if user doesn't change it
            },
            'dserver':
            {
                'label': 'Discord server', // Appears next to field
                'type': 'select', // Makes this setting a dropdown
                'options': ['tOLP', 'VVVVVV'], // Possible choices
                'default': 'tOLP' // Default value if user doesn't change it
            },
            'hideip':
            {
                'label': 'Hide IP', // Appears next to field
                'type': 'checkbox', // Makes this setting a checkbox input
                'default': false // Default value if user doesn't change it
            },
            'emojiparse':
            {
                'label': 'Convert Unicode to Twitter/Discord\'s emoji', // Appears next to field
                'type': 'checkbox', // Makes this setting a checkbox input
                'default': false // Default value if user doesn't change it
            }
        },
        'events': // Callback functions object
        {
            //'init': function() { alert('onInit()'); },
            'open': function() { openNav(); },
            //'save': function() { alert('onSave()'); },
            'close': function() { closeNav(); },
            //'reset': function() { alert('onReset()'); }
        },
        'css': '#MyConfig { background: rgba(255,255,255,0.6)!important;}' // nop
    }
);

function open(){
    GM_config.open();
}
var beforeuser = GM_config.get('beforeuser');
var afteruser = GM_config.get('afteruser');
var dtoken = GM_config.get('dtoken');
var theme = GM_config.get('theme');
var avatart = GM_config.get('avatart');
var dserver = GM_config.get('dserver');
var hideip = GM_config.get('hideip');
var emojiparse = GM_config.get('emojiparse');

(function() {
    var autoLink,
        slice = [].slice;

    autoLink = function() {
        var callback, k, linkAttributes, option, options, pattern, v;
        options = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        pattern = /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
        if ((options.length <= 0)) {
            return this.replace(pattern, "$1<a href='$2'>$2</a>");
        }
        option = options[0];
        callback = option.callback;
        linkAttributes = ((function() {
            var results;
            results = [];
            for (k in option) {
                v = option[k];
                if (k !== 'callback') {
                    results.push(" " + k + "='" + v + "'");
                }
            }
            return results;
        })()).join('');
        return this.replace(pattern, function(match, space, url) {
            var link;
            link = (typeof callback === "function" ? callback(url) : void 0) || ("<a href='" + url + "'" + linkAttributes + ">" + url + "</a>");
            return "" + space + link;
        });
    };

    String.prototype.autoLink = autoLink;

}).call(this);

var ESC_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

function escapeHTML(s, forAttribute) {
    return s.replace(forAttribute ? /[&<>'"]/g : /[&<>]/g, function(c) {
        return ESC_MAP[c];
    });
}

//Shoutbox

if (dserver === "tOLP") {
    dserverid = "153368829160849408";
} else if (dserver === "VVVVVV") {
    dserverid = "332236951472308225";
}
//if (window.location.href.split("://")[1] === "tolp.nl/forum/index.php" || window.location.href.split("://")[1]=== "tolp.nl/forum/" || window.location.href.split("://")[1] === "distractionware.com/forum/index.php" || window.location.href.split("://")[1]=== "distractionware.com/forum/forum/") {
if (window.location.href.split("://")[1] === "tolp.nl/forum/index.php" || window.location.href.split("://")[1]=== "tolp.nl/forum/") {
    $("#main_content_section").append('<div id="draggable"></div>');
    //Add shoutbox bar
    $("#main_content_section #draggable").append('<div class="shout cat_bar"><h3 class="catbg">Discord Shoutbox (Logging in...)</h3></div>');
    //Add content
    $("#main_content_section #draggable").append('<span class="clear upperframe"><span></span></span><div class="shout"><div class="roundframe"><div class="innerframe"><p>Logging in... (This may take some time.)</p><div class="message-wrap"></div><div class="dinput"></div><br><br></div></div></div></div><span class="lowerframe"><span></span></span><center><span>Token: <div class="tokenin"></div></span></center>');
    //Set some css for the scrollbar
    $('.message-wrap').css("overflow-y", "scroll");
    $('.message-wrap').css("height", "100px");
    $(".tokenin").append('<input type="password" placeholder="Discord token here" class="tokeninput" autocomplete=off/>');
    $('.tokeninput').css("width", "100%");
    $('.tokeninput').css("text-align", "center");
    $(".tokeninput")[0].value = GM_config.get('dtoken');
    $('body').on("keydown", '.tokeninput', function(e) {
        if(e.which == 13) {
            GM_config.fields.dtoken.value = $(".tokeninput")[0].value;
            GM_config.save();
            GM_config.fields.dtoken.reload();
            alert("You may need to reload the page for your token to be set.");
        }
    });
    //Load discord.js
    const client = new Discord.Client();
    var channelvar;
    var guildvar;
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        guildvar = client.channels.find("id", dserverid);
        if (guildvar === null) {
            $("#main_content_section .shout h3")[0].textContent = "Discord Shoutbox (Error!)";
            $("#main_content_section .shout .roundframe .innerframe p")[0].textContent = "You're not on the selected discord server.";
        } else {
            channelvar = guildvar;
            $("#main_content_section .shout h3")[0].textContent = "Discord Shoutbox (" + client.user.tag + ")";
            $("#main_content_section .shout .roundframe .innerframe p")[0].textContent = "Logged in!";


            $(".dinput").append('<input type="text" placeholder="Message #general" class="search" autocomplete=off/>');
            $('body').on("keydown", '.search', function(e) {
                if(e.which == 13) {
                    if ($(".search")[0].value !== "") {
                        //console.log($(".search")[0].value);
                        channelvar.send($(".search")[0].value);
                        //channelvar.send("testing shoutbox");
                        $(".search")[0].value = "";
                    }
                }
            });
        }
    });
    client.on('message', msg => {
        function checkURL(url) {
            return(url.match(/\.(jpeg|jpg|gif|png)$/) !== null);
        }
        if (guildvar !== null) {
            if (msg.channel.id === channelvar.id) {
                var color = msg.member.displayHexColor;
                var displayname;
                if (msg.member.nickname !== null) {
                    displayname = "<abbr title='" + msg.author.username + "'>" + escapeHTML(msg.member.nickname, true) + "</abbr>";
                } else {
                    displayname = escapeHTML(msg.author.username, true);
                }
                $("#main_content_section .shout .roundframe .innerframe .message-wrap").append('<span class="message" id="' + msg.id + '"><span class="author" style="color:' + color + ';">' + displayname + '</span><span>: <span class="mcontent">' + escapeHTML(msg.cleanContent, true).autoLink() + '</span><span class="edited" style="color:#AAA; font-size: 70%;"></span></span></span><br>');
                if (msg.attachments.array()[0] !== undefined) {
                    if (checkURL(msg.attachments.array()[0].url)) {
                        //$('.shoutboximg').css("max-width", "%50");
                        //$('.shoutboximg').css("max-height", "%50");
                        $("#main_content_section .shout .roundframe .innerframe .message-wrap").append('<!--<a href="'+msg.attachments.array()[0].url+'">--><a href="' + msg.attachments.array()[0].url + '" data-lightbox="' + msg.id + '" data-title="Open original"><img id="imageid" style="max-height: 70%" src="' + msg.attachments.array()[0].url + '"></a><!--</a>--><br>');
                        var img = document.getElementById('imageid');
                        //or however you get a handle to the IMG
                        //var width = img.clientWidth;
                        //var height = img.clientHeight;
                        img.maxHeight = "50%";
                    }
                }
                var y = $(".message-wrap").scrollTop();  //your current y position on the page
                $(".message-wrap").scrollTop(y+17);
            }
        }
    });
    client.on('messageUpdate', (oldmsg, newmsg) => {
        if (guildvar !== null) {
            if (oldmsg.channel.id === channelvar.id) {
                if (oldmsg.content != newmsg.content) {
                    $("#" + oldmsg.id + " .mcontent")[0].textContent = newmsg.content;
                    $("#" + oldmsg.id + " .edited")[0].textContent = " (edited)";
                }
            }
        }
    });
    client.login(dtoken).catch(e => {
        $("#main_content_section .shout h3")[0].textContent = "Discord Shoutbox (Error!)";
        $("#main_content_section .shout .roundframe .innerframe p")[0].textContent = "There was an error logging in. If you haven't already, set your token in the settings tab.";

    });
}

try {
    var str = $("h4")[0].firstChild.textContent;
    var username = str.substring(0, str.length-1);
    $(".username h4")[0].firstChild.textContent = beforeuser + username + afteruser;
} catch (e) {}

//$(".reset .copyright a")[3].textContent = $(".reset .copyright a")[3].textContent + "\nHey Vsauce, Michael here.";
$("#footer_section .frame ul").append('<li><a href="' + bettertolplink + '">BettertOLP v' + btversion + ' by Alexia.</a></li>');

GM_addStyle('.poster h4 a::before {content:"' + beforeuser + '"} .poster h4 a::after {content:"' + afteruser + '"}');
// GM_addStyle('.copyright a:nth-of-type(3)::after {content:"BettertOLP by Alexia"; display: block; white-space: pre-wrap;}');
switch(avatart) {
    case "Circle":
        GM_addStyle('img.avatar {border-radius: 50%;}');
        break;
}
if (tolp) {
    switch(theme) {
        case "Rain":
            //<td class="normal nowrap"><small><span>Views: </span><span>559,902,130</span><br><span>Time: </span><span><span data-nomodify="">2017-08-21 17:33:47</span></span></small></td><td class="normal center"><small>17 users online: <img src="/images/coin.gif" alt="o" title="User donated $8.00">&nbsp;<a href="/?p=profile&amp;id=6549" style="color: #97acef;" class="un">1UPdudes</a>, <a href="/?p=profile&amp;id=8691" style="color: #f185c9;" class="un">Akaginite</a>, <img src="/images/coin.gif" alt="o" title="User donated $5.00">&nbsp;<a href="/?p=profile&amp;id=9964" style="color: #701820;" class="un">Blind Devil</a>, <a href="/?p=profile&amp;id=1980" style="color: #7c60b0;" class="un">Conal</a>, <a href="/?p=profile&amp;id=32234" style="color: #7c60b0;" class="un">Flap master</a>, <a href="/?p=profile&amp;id=306" style="color: #7c60b0;" class="un">Golden Yoshi</a>, <img src="/images/coin.gif" alt="o" title="User donated $50.00">&nbsp;<a href="/?p=profile&amp;id=3471" style="color: #9E197F;" class="un">imamelia</a>, <a href="/?p=profile&amp;id=768" style="color: #7c60b0;" class="un">Kaijyuu</a>, <a href="/?p=profile&amp;id=27645" style="color: #97acef;" class="un">Luansilva12</a>, <a href="/?p=profile&amp;id=27129" style="color: rgb(0, 210, 210);" class="un">Luigi_master1</a>, <img src="/images/coin.gif" alt="o" title="User donated $5.50">&nbsp;<a href="/?p=profile&amp;id=28554" style="color: #97acef;" class="un">Mathos</a>, <img src="/images/coin.gif" alt="o" title="User donated $5.00">&nbsp;<a href="/?p=profile&amp;id=20309" style="color: #E80055;" class="un">Mirann</a>, <img src="/images/coin.gif" alt="o" title="User donated $5.00">&nbsp;<a href="/?p=profile&amp;id=2512" style="color: #744496;" class="un">Nameless</a>, <a href="/?p=profile&amp;id=23778" style="color: #97acef;" class="un">NGB</a>, <a href="/?p=profile&amp;id=27479" style="color: #97acef;" class="un">ThalesMangaka</a>, <a href="/?p=profile&amp;id=9" style="color: #97acef;" class="un">trackftv</a>, <a href="/?p=profile&amp;id=16921" style="color: #7c60b0;" class="un">Wind Fish</a> - Guests: 36 - Bots: 213</small></td><td class="normal right nowrap"><small>Users: 32,234 (1,476 active)<br>Latest: <a href="/?p=profile&amp;id=32234" style="color: #7c60b0;" class="un">Flap master</a></small></td>
            $(`<table cellpadding="3" cellspacing="3" width="100%"><tr>
<td height="50">
<table cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000;">
<tbody><tr>
</tr>
<tr>
<td>
<table cellpadding="0" cellspacing="0" width="100%" class="text" style="border-bottom: 1px solid #000000;">
<tbody><tr>
<td class="normal nowrap"><small><span>BettertOLP Version ` + btversion + `</span><br><span>Time: </span><span><span class="currenttime"></span></span></small></td><td class="normal center"><small><span class=usernum></span> online: <span class=membersonline></span>- Guests: <span class="guestcount"></span> - Bots: <span class="botcount"></span></small></td><td class="normal right nowrap"><small>Users: <span class="usercount"></span> (<span class="perconline"></span> online)<br>Latest: <span class="latestmember"></span></small></td>
</tr>
</tbody></table>
</td>
</tr>
<tr>
</tr>
<tr>
<td>
<table cellpadding="0" cellspacing="0" width="100%" class="text" style="border-bottom: 1px solid #000000;">
<tbody><tr>
<td class="rope">Tip: ` + item + `</td><td class="rope right nowrap">Logged in as <span class="musername"></script>.</td>

</tr>
</tbody></table>
</td>
</tr>
<tr>
</tr>
</tbody></table>
</td>
</tr></table>`).insertAfter($(".header")[0]);
            var currentdate = new Date();
            var datetime = currentdate.getDate() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getFullYear() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            $(".currenttime")[0].textContent = datetime;
            var musername = $(".floatleft")[0].textContent.trim().split(" |")[0].split("Hello ")[1];
            $(".musername")[0].textContent = musername;
            var get1 = $.get( foruma + "SSI.php?ssi_function=whosOnline", function( data ) {
                $(".membersonline").html(data);
                //console.log($(".membersonline"));
                var memberlist = [];
                for (var i = 0; i < $(".membersonline a").length; i++) {
                    memberlist.push($(".membersonline a")[i]);
                    //console.log($(".membersonline a")[i]);
                }
                //stuff
                var guests;
                var str = $(".membersonline")[0].textContent;
                var regex = /([0-9]+) Guests?/;
                var match = regex.exec(str);
                if (match !== null) {
                    guests = match[1];
                } else {
                    guests = 0;
                }
                $(".guestcount")[0].textContent = guests;
                var userson = $(".membersonline")[0].textContent.trim().split(", ")[1].split(" (")[0].toLowerCase();
                $(".usernum")[0].textContent = userson;

                var str2 = $(".membersonline")[0].textContent.trim().split("\n")[0];
                var regex2 = /([0-9]+) Spiders?/;
                var match2 = regex2.exec(str2);
                var botsonline;
                if (match2 !== null) {
                    botsonline = match2[1];
                } else {
                    botsonline = 0;
                }
                $(".botcount")[0].textContent = botsonline;
                $(".membersonline").html("");
                for (var a = 0; a < memberlist.length; a++) {
                    $(".membersonline").append(memberlist[a]);
                    if (a !== memberlist.length - 1) {
                        $(".membersonline").append(", ");
                    } else {
                        $(".membersonline").append(" ");
                    }
                }
            });
            var get2 = $.get( foruma + "SSI.php?ssi_function=latestMember", function( data ) {
                $(".latestmember").html(data);
                $(".latestmember").html($(".latestmember a"));
            });
            var get3 = $.get( foruma + "SSI.php?ssi_function=boardStats", function( data ) {
                $(".usercount").html(data);
                $(".usercount").html($(".usercount a"));
            });
            $.when(get1, get2, get3).done(function() {
                var outOff = $(".usercount")[0].textContent;
                var value = $(".usernum")[0].textContent.split(" ")[0];
                var resulta = (value * 100) / outOff;
                var result = Math.round(resulta);
                $(".perconline")[0].textContent = result.toString() + '%';
            });
            $('#wrapper').attr('style','width: 100%');
            $('table.table_list tr').each(function(){
                if($(this).children('td:empty').length === $(this).children('td').length){
                    $(this).remove(); // or $(this).hide();
                }
            });
            GM_addStyle('blockquote.bbc_standard_quote, blockquote.bbc_alternate_quote {color: #d6d6d6;}');
            GM_addStyle('.windowbg, #preview_body {color: #fff;}');
            GM_addStyle('.cat_bar, .catbg, .title_barIC, .titlebg {background-image: none!important;}');
            GM_addStyle('.title_bar, tr.catbg th.first_th, .catbg, .catbg2, tr.catbg td, tr.catbg2 td, tr.catbg th, tr.catbg2 th {background-image: none!important;}');
            GM_addStyle('body, td, th, tr {color: #fff;}');
            GM_addStyle('.windowbg2 {color: #fff;}');
            GM_addStyle('.stickybg2, .stickybg {background: rgba(130, 90, 90, 0.30);}');
            GM_addStyle('blockquote.bbc_standard_quote {background-color: rgba(119, 119, 119, 0.3);}');
            GM_addStyle('blockquote.bbc_alternate_quote {background-color: rgba(103, 103, 103, 0.30);}');
            GM_addStyle('.catbg, .catbg2, tr.catbg td, tr.catbg2 td, tr.catbg th, tr.catbg2 th {background: hsla(225, 30%, 35%, 0.65);}');
            GM_addStyle('tr.catbg th.first_th {background: hsla(225, 30%, 35%, 0.65);}');
            GM_addStyle('tr.catbg th.last_th {background: hsla(225, 30%, 35%, 0.65);}');
            GM_addStyle('h4.titlebg, h3.titlebg {background: none;padding-bottom: 0px;}');
            GM_addStyle('div.title_bar {background: hsla(225, 30%, 25%, 0.65);padding-right: 9px;margin-right: 0px;margin-bottom: 0px;}');
            GM_addStyle('.spoiler_head, .cspoiler_head {background-color: hsla(225, 30%, 25%, 0.65); border: none;}');
            GM_addStyle('.spoiler_body, .cspoiler_body {background-color: hsla(225, 30%, 25%, 0.65); border: none;}');
            GM_addStyle('.cspoiler_head {margin: 2px 0 2px 0; cursor: pointer; position: relative; display: inline-block; padding: 2px 5px 2px 5px; color: #ccc; text-align: center; font: bold 12px Calibri, Verdana, Arial, sans-serif; border-radius: 5px;}');
            GM_addStyle('.cspoiler_body {margin: 0; display: none; width: auto; padding: 5px; color: #ccc; border-radius: 5px;}');
            GM_addStyle('.description, .description_board, .plainbox {border: none; background: hsla(225, 30%, 25%, 0.65);}');
            GM_addStyle('#forumposts .cat_bar {margin: 0 0 0 0;}');
            GM_addStyle('span.topslice, span.botslice, span.topslice span, span.botslice span {background: none!important;}');
            GM_addStyle('input, button, select, textarea {background: hsla(225, 30%, 25%, 0.65);}');
            GM_addStyle('div.title_barIC h4.titlebg {background: none;}');
            GM_addStyle('div.title_barIC {background: hsla(225, 30%, 25%, 0.65);}');
            GM_addStyle('.roundframe {background: none; border-left: none; border-right: none;}');
            GM_addStyle('span.upperframe, span.upperframe span, span.lowerframe, span.lowerframe span {background: none;}');
            GM_addStyle('.buttonlist ul li a span {background: none;}');
            GM_addStyle('.buttonlist ul li a {color: #99FF99; background: none;}');
            GM_addStyle('.buttonlist ul li a:hover span {background: none;}');
            GM_addStyle('.buttonlist ul li a:hover {background: none;}');
            GM_addStyle('.windowbg, #preview_body {background-color: hsla(225, 40%, 12%, 0.7);}');
            GM_addStyle('#forumposts .windowbg, #preview_body {border: 1px solid #000000; border-top: none;}');
            GM_addStyle('.header {width: 95%; margin: auto;}');
            GM_addStyle(".table_list {background-color: black;border-spacing: 1px;}");
            GM_addStyle('.windowbg2 {background-color: hsla(225, 40%, 12%, 0.7); border: 1px solid #000000;}');
            GM_addStyle('#forumposts .windowbg2 {border-top: none;}');
            GM_addStyle('tr.windowbg td, tr.windowbg2 td, tr.approvebg td, tr.highlight2 td {background-color: hsla(225, 40%, 12%, 0.7);}');
            GM_addStyle('h3.catbg a:link, h3.catbg a:visited, h4.catbg a:link, h4.catbg a:visited, h3.catbg, .table_list tbody.header td, .table_list tbody.header td a {color: #6B8AC7;}');
            GM_addStyle('h4.catbg, h4.catbg2, h3.catbg, h3.catbg2, .table_list tbody.header td.catbg {background: none;}');
            GM_addStyle('div.cat_bar {background: hsla(225, 30%, 25%, 0.65);margin-right: 0px;}');
            GM_addStyle('#content_section {background: rgba(0,0,0,0);padding: 0 10px;}');
            GM_addStyle('td.normal {background: hsla(225, 40%, 18%, 0.7);}');
            GM_addStyle('td.normal {padding: 2px 4px !important;}');
            GM_addStyle('td.rope {padding: 4px 5px 4px; background: hsla(225, 40%, 12%, 0.7);}');
            GM_addStyle('.right {text-align: right;}');
            GM_addStyle('.center {text-align: center;}');
            GM_addStyle('.nowrap {white-space: nowrap;}');
            //GM_addStyle('body {background: #14192A url(https://www.smwcentral.net/html/rainscheme/rainbg.jpg)!important}');
            GM_addStyle('body {background: #14192A url(https://i-need-hugs.in-my.life/790e0e.jpg)!important}');
            GM_addStyle('.table_list tbody.content td.info a.subject, a.new_win:link, a.new_win:visited, a:link, a:visited, a {color: hsl(225, 50%, 65%); font-weight: bold!important; text-decoration: none!important;}');
            GM_addStyle('a:hover  {color: hsl(225, 50%, 90%)!important;}');
            GM_addStyle('.header_topbar {background: hsla(225, 30%, 35%, 0.65); border: 1px solid #000000; border-bottom: none;}');
            GM_addStyle('.header_main {background: hsla(225, 40%, 18%, 0.7); border: 1px solid #000000; border-top: none;}');
            GM_addStyle('.header_nav {background: hsla(225, 40%, 12%, 0.7); border: 1px solid #000000; border-top: none;}');
            GM_addStyle('.lockedbg2, .userlockedbg2, .lockedbg, .userlockedbg {background: #ff19193d;}');
            GM_addStyle('ul#menu_nav li.backLava {background-image: url(https://i-need-hugs.in-my.life/22a296.png);}');
            GM_addStyle('ul.topnav li a {text-shadow: none;}');
            GM_addStyle('.quick_search_token_submit_input {background: hsla(225, 30%, 35%, 1) url(https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/vertex_image/quick_search_token_icon.png);}');
            GM_addStyle('.quick_search_token_submit_input:hover {background: hsla(225, 30%, 35%, 1) url(https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/vertex_image/quick_search_token_icon.png);}');
            GM_addStyle('a.subject {color: #788ed0!important;}');
            GM_addStyle('table.table_grid td {border-bottom: 1px solid #000;border-right: 1px solid #000;}');
            break;
        case "Default":
            $( "#boardindex_table" ).prepend("Tips: " + item + "<br><br>");
            break;
            //    case "Mint":
            //        GM_addStyle('.header_main {background: url(https://atlas.is-pretty.sexy/c563cb.png)}');
            //        GM_addStyle('.header_nav {background: url(https://atlas.is-pretty.sexy/6535e8.png)}');
            //        GM_addStyle('ul#menu_nav li.backLava {background-image: url(https://i.imgur.com/ESzz8Yz.png)}');
            //        GM_addStyle('.header_topbar {background: url(https://atlas.is-pretty.sexy/2c2a56.png)}');
            //        GM_addStyle('.button_submit, .quick_search_token_submit_input {background-color: #2aa969}');
            //        GM_addStyle('body {background-color: #a0c6a8}');
            //        GM_addStyle('a.subject {color: #2aa969!important} ');
            //        GM_addStyle('.cat_bar, .catbg, .title_barIC, .titlebg {background-image: url(https://atlas.is-pretty.sexy/507f23.png)!important}');
            //        GM_addStyle('.button_strip_markread, .button_strip_markread span.last {background-image: url(https://atlas.is-pretty.sexy/49e643.png)!important}');
            //        GM_addStyle('.buttonlist ul li a, .buttonlist ul li a span {background-image: url(https://atlas.is-pretty.sexy/49e643.png)!important}');
            //        GM_addStyle('a.new_win:link, a.new_win:visited, a:link, a:visited {color: #33663e}');
            //        GM_addStyle('.poster h4 a {color: #269d62}');
            //        GM_addStyle('ul.topnav li ul.subnav {background: #055933;border: 1px solid #042f15}');
            //        GM_addStyle('ul.topnav li ul.subnav li {border-top: 1px solid #1c854b;border-bottom: 1px solid #16663d}');
            //        GM_addStyle('html ul.topnav li ul.subnav li:hover {background: #0d7136}');
            //        GM_addStyle('blockquote.bbc_standard_quote {background-color: #cff5cc}');
            //        GM_addStyle('blockquote.bbc_alternate_quote {background-color: #d9f9ce}');
            //        GM_addStyle('.dropmenu li a.firstlevel:hover span.firstlevel, .dropmenu li:hover a.firstlevel span.firstlevel, .dropmenu li a.firstlevel:hover, .dropmenu li:hover a.firstlevel, .dropmenu li a.active span.firstlevel, .dropmenu li a.active, .dropmenu li ul {background-image: url(https://atlas.is-pretty.sexy/ba1a28.png)}');
            //        GM_addStyle('.dropmenu li li a:hover, .dropmenu li li:hover>a {background: #188668}');
            //        GM_addStyle('.title_bar, tr.catbg th.first_th, .catbg, .catbg2, tr.catbg td, tr.catbg2 td, tr.catbg th, tr.catbg2 th {background-image: url(https://atlas.is-pretty.sexy/507f23.png)!important}');
            //        $(".new_posts").attr("src","https://atlas.is-pretty.sexy/bb6116.gif");
            //        $('img[src="https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/english-utf8/new.gif"]').attr("src","https://atlas.is-pretty.sexy/bb6116.gif");
            //        $('img[src="https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/on.png"]').attr("src","https://atlas.is-pretty.sexy/98a1f5.png");
            //        $('img[src="https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/new_some.png"]').attr("src","https://atlas.is-pretty.sexy/905f8b.png");
            //        break;
            //    case "Red":
            //        GM_addStyle('tr.catbg, .header_main, .header_nav, ul#menu_nav li.backLava, .header_topbar, .cat_bar, .title_barIC, .button_strip_markread, .buttonlist ul li a {filter: hue-rotate(150deg)}');
            //        GM_addStyle('.catbg, ul#menu_nav li.backLava, .button_strip_markread span.last, .titlebg, .buttonlist ul li a span {filter: hue-rotate(350deg)}');
            //        GM_addStyle('a.new_win:link, a.new_win:visited, a:link, a:visited {color: #633}');
            //        GM_addStyle('.table_list tbody.content td.info a.subject {color: #9d2626}');
            //        GM_addStyle('body {background-color: #c6a0a0}');
            //        $(".new_posts").attr("src","https://atlas.is-pretty.sexy/bb6116.gif");
            //        $('img[src="https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/english-utf8/new.gif"]').css({filter: "hue-rotate(150deg)"});
            //        $('img[src="https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/on.png"]').css({filter: "hue-rotate(150deg)"});
            //        $('img[src="https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/new_some.png"]').css({filter: "hue-rotate(150deg)"});
            //        break;
            //    case "Dark":
            //        //GM_addStyle('tr.catbg, .header_main, .header_nav, ul#menu_nav li.backLava, .header_topbar, .cat_bar, .title_barIC, .button_strip_markread, .buttonlist ul li a {filter: hue-rotate(150deg)}');
            //        //GM_addStyle('.catbg, ul#menu_nav li.backLava, .button_strip_markread span.last, .titlebg, .buttonlist ul li a span {filter: hue-rotate(350deg)}');
            //        GM_addStyle('a.new_win:link, a.new_win:visited, a:link, a:visited {color: #ececec;}');
            //        GM_addStyle('.table_list tbody.content td.info a.subject {color: #9d2626}');
            //        GM_addStyle('body {background-color: rgb(60, 60, 60)}');
            //        GM_addStyle('#content_section {background: #5a5a5a}');
            //        GM_addStyle('body, td, th, tr {color: #fff}');
            //        GM_addStyle('tr.windowbg td, tr.windowbg2 td, tr.approvebg td, tr.highlight2 td {background-color: #676767}');
            //        GM_addStyle('.table_list tbody.content td.info a.subject {color: #ccffc9!important}');
            //        GM_addStyle('.table_list tbody.content td.children {color: #d0d0d0}');
            //        GM_addStyle('.windowbg, #preview_body {background-color: #777777}');
            //        GM_addStyle('.roundframe {background: #888888}');
            //        GM_addStyle('.header_main {background: url(https://atlas.is-pretty.cool/c02c39.png)}');
            //        GM_addStyle('.header_nav {background: url(https://atlas.is-pretty.cool/993716.png)}');
            //        GM_addStyle('ul#menu_nav li.backLava {background-image: url(https://i.imgur.com/ESzz8Yz.png)}');
            //        GM_addStyle('.header_topbar {background: url(https://atlas.is-pretty.cool/f7785d.png)}');
            //        GM_addStyle('.cat_bar, .catbg, .title_barIC, .titlebg {background-image: url(https://atlas.is-pretty.cool/9feaac.png)!important}');
            //$(".new_posts").attr("src","https://atlas.is-pretty.sexy/bb6116.gif");
            //$('img[src="https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/english-utf8/new.gif"]').css({filter: "hue-rotate(150deg)"});
            //$('img[src="https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/on.png"]').css({filter: "hue-rotate(150deg)"});
            //$('img[src="https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/new_some.png"]').css({filter: "hue-rotate(150deg)"});
            //        break;
        case "Lavender":
            GM_addStyle('body {background-color: #aaa0c6;');
            GM_addStyle('a:link, a:visited {color: #7b577d;}');
            GM_addStyle('a.subject {color: #9c2aa9!important;}');
            GM_addStyle('.header_main {background: url(https://i-need-hugs.in-my.life/d9085c.png)}');
            GM_addStyle('.header_nav {background: url(https://i-need-hugs.in-my.life/15c411.png)}');
            GM_addStyle('.header_topbar {background: url(https://i-need-hugs.in-my.life/57c0b8.png)}');
            GM_addStyle('ul#menu_nav li.backLava {background-image: url(https://i-need-hugs.in-my.life/a09235.png);}');
            GM_addStyle('ul.topnav li a {text-shadow: none;}');
            GM_addStyle('.quick_search_token_submit_input {background: #8f7cb3 url(https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/vertex_image/quick_search_token_icon.png);}');
            GM_addStyle('.quick_search_token_submit_input:hover {background: #8f7cb3 url(https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/vertex_image/quick_search_token_icon.png);}');
            GM_addStyle('.catbg, .catbg2, tr.catbg td, tr.catbg2 td, tr.catbg th, tr.catbg2 th, .catbg, .catbg2, tr.catbg td, tr.catbg2 td, tr.catbg th, tr.catbg2 th, .cat_bar, .catbg, .title_barIC, .titlebg {background-image: url(https://i-need-hugs.in-my.life/e63f05.png)!important}');
            GM_addStyle('.button_strip_markread, .button_strip_markread span.last {background-image: url(https://i-need-hugs.in-my.life/96c70d.png)!important}');
            GM_addStyle('.dropmenu li ul, .buttonlist ul li a, .buttonlist ul li a span, .dropmenu li a.firstlevel:hover span.firstlevel, .dropmenu li:hover a.firstlevel span.firstlevel, .dropmenu li a.firstlevel:hover, .dropmenu li:hover a.firstlevel, .dropmenu li a.active span.firstlevel, .dropmenu li a.active, .dropmenu li ul {background-image: url(https://i-need-hugs.in-my.life/96c70d.png)!important}');
            GM_addStyle('blockquote.bbc_standard_quote {background-color: #e3ccf5;}');
            GM_addStyle('.poster h4 a {color: #a54dc7;}');
            GM_addStyle('blockquote.bbc_alternate_quote {background-color: #eacef9;}');
            GM_addStyle('.dropmenu li li a:hover, .dropmenu li li:hover>a {background: #b98bc1;}');
            GM_addStyle('table.table_grid thead tr.catbg th {background-image: url(https://i-need-hugs.in-my.life/e63f05.png)!important;}');
            $('img[src="https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/english-utf8/new.gif"]').attr("src","https://i-need-hugs.in-my.life/ca657f.png");
            $( "#boardindex_table" ).prepend("Tips: " + item + "<br><br>");
            break;
    }
}
if (tolp) {
GM_addStyle(`.sticky {
position: fixed;
top: 0;
left: 0px;
}`);
var $window = $(window),
    $stickyEl = $('.header_nav'),
    elTop = $stickyEl.offset().top;
$window.scroll(function() {
    $stickyEl.toggleClass('sticky', $window.scrollTop() > elTop);
    if ($window.scrollTop() > elTop) {
        $('.showunreadposts').show();
    } else {
        $('.showunreadposts').hide();
    }
});
}

//setInterval(asdf,1);
if (tolp) {
    $(".header_nav")[0].style.zIndex = "99";
}
if (tolp) {
    $("#main_menu .topnav").append('<li id="button_settings" class="firstlevel"><a class="firstlevel settingspane"><span class="last firstlevel">Settings</span></a></li>');
} else {
    $("#main_menu ul#menu_nav.dropmenu").append('<li id="button_settings" class="firstlevel"><a class="firstlevel settingspane"><span class="last firstlevel">Settings</span></a></li>');
}

$(".settingspane").click(function() {
    open();
});

$(".header_nav_content #main_menu ul").append('<li class="showunreadposts"><a href="https://tolp.nl/forum/index.php?action=unread">Unread</a></li>');
$('.showunreadposts').hide();
var poster = $(".poster");
for (var i = 0; i < poster.length; i++) {
    if ($(".poster h4")[i].textContent.trim() === "Kiwi Alexia ♡") {
        $('<li class="btcreator">BettertOLP Creator</li>').insertAfter($(".poster ul .postgroup")[i]);
        //}
        if (tolp) {
            if ($(".poster")[i] !== undefined) {
                var icons = $(".poster")[i].children[1].children[7].children[0].children;
            }
        }
    }
    if (tolp) {
        if ($(".post_wrapper")[i] !== undefined) {
            var sig = $(".post_wrapper")[i].children[2].children[2];
            if (sig !== undefined) {
                if (sig.children[sig.children.length-2] !== undefined) {
                    if (sig.children[sig.children.length-2].textContent === "btsig") {
                        sig.innerHTML = sanitizeHtml(sig.children[sig.children.length-1].textContent, {allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'center', 'span', 'svg', 'rect', 'defs', 'g', 'path', 'mask', 'circle', 'use', 'style' ]),allowedAttributes: {
                            a: [ 'href', 'name', 'target' ],
                            img: [ 'src' ],
                            '*': [ 'color', 'bgcolor', 'style', 'class', 'id']
                        },});
                    }
                }
            }
        }
    }
}

//var ret = GM_xmlhttpRequest({
//  method: "GET",
//  url: "https://glaceon.ca/Signatures/uploads/Kiwi+Alexia+%2526%25239825%253B.css",
//  onload: function(res) {
//    GM_log(res.responseText);
//  }
//});

//var windowbg = $(".windowbg");

//var posters = [];
//for (var i = 0; i < $(".poster").length; i++) {
//    posters.push($(".poster h4 a")[i].href.replace("https://tolp.nl/forum/index.php?action=profile;u=",""));
//}

$(document).ready(function()
                  {
    $('.cspoiler').hide();
    $('.cspoiler_head').click(function()
                              {
        var titel = this.innerHTML;
        //if(titel.indexOf("<!--") != -1 && titel.indexOf("-->") != -1)
        //{
        //  var stac = titel.indexOf("<!--");
        //  var endc = titel.indexOf("-->");
        //  var textone = titel.substr(0,stac); // textone should be between the comment tags
        //  var texttwo = titel.substr(stac+4,(titel.length - 7 - stac)); // texttwo should be the new button label
        //  this.innerHTML = texttwo + "<!--" + textone + "-->";
        //}
        $(this).next('.cspoiler_body').slideToggle(450);
    });
});

$( ".post_wrapper" ).wrap( "<div class='collapsepost'></div>" );
$(".collapsepost").prepend("<a href='#'><center class='tgp'>Toggle Post</center></a>");
$('.tgp').click(function(event){
    event.preventDefault();
    $('.post', $( this ).parent().parent()).toggle();
    $('.moderatorbar', $( this ).parent().parent()).toggle();
    $('.poster', $( this ).parent().parent()).toggle();
    $('.postarea', $( this ).parent().parent()).toggle();
});

if (hideip) {
    var ip = $(".moderatorbar a.help");
    for (var i = 0; i < ip.length; i++) {
        if (ip[i].textContent !== "Logged") {
            ip[i].textContent = "IP hidden from view";
        }
    }
}
var avydict = {
    "-Kiwi Alexia ♡": "https://i.imgur.com/7BLq6bv.gif",
    "starspire": "https://tolp.nl/forum/index.php?action=dlattach;attach=1298;type=avatar",
    "fraZ0R": "https://tolp.nl/forum/index.php?action=dlattach;attach=1321;type=avatar",
    "crazya": "https://tolp.nl/forum/index.php?action=dlattach;attach=1036;type=avatar",
    "Format": "https://tolp.nl/forum/index.php?action=dlattach;attach=1323;type=avatar",
    "@Kreator": "https://tolp.nl/forum/index.php?action=dlattach;attach=727;type=avatar",
    "Info Teddy": "https://tolp.nl/forum/index.php?action=dlattach;attach=1253;type=avatar",
    "Dav999": "https://tolp.nl/forum/index.php?action=dlattach;attach=1148;type=avatar",
    "TheJonyMyster": "https://tolp.nl/forum/index.php?action=dlattach;attach=150;type=avatar",
    "MBCollector672": "https://tolp.nl/forum/index.php?action=dlattach;attach=260;type=avatar",
    "Coralized2578": "https://tolp.nl/forum/index.php?action=dlattach;attach=1116;type=avatar",
    "M3TR0": "https://tolp.nl/forum/index.php?action=dlattach;attach=1281;type=avatar",
    "Shiny K": "https://tolp.nl/forum/index.php?action=dlattach;attach=1288;type=avatar",
    "SoulBlayzR": "https://tolp.nl/forum/index.php?action=dlattach;attach=1319;type=avatar",
    "Trdjn": "http://distractionware.com/forum/index.php?action=dlattach;attach=5829;type=avatar",
    "PJBottomz": "http://distractionware.com/forum/index.php?action=dlattach;attach=901;type=avatar",
    "Lenare": "http://distractionware.com/forum/index.php?action=dlattach;attach=4694;type=avatar",
    "RikkianGD": "http://distractionware.com/forum/index.php?action=dlattach;attach=5782;type=avatar",
    "uugr": "http://distractionware.com/forum/index.php?action=dlattach;attach=5664;type=avatar",
    "Terry": "http://distractionware.com/forum/index.php?action=dlattach;attach=2;type=avatar",
    "mrytp": "http://distractionware.com/forum/index.php?action=dlattach;attach=5709;type=avatar",
    "Mr. Pixelator": "http://distractionware.com/forum/index.php?action=dlattach;attach=5835;type=avatar",
    "MopeDude": "http://distractionware.com/forum/index.php?action=dlattach;attach=5836;type=avatar",
    "SteveGamer68": "http://distractionware.com/forum/index.php?action=dlattach;attach=5386;type=avatar",
    "undefined": "https://tolp.nl/forum/Themes/Vertex-Theme2-0-2-v1-2/images/abm_avatar.gif"
};

if (dware) {
    postlist = $(".table_grid tbody tr");
    postlist.map((e) => {
        if (postlist[e].children[2].children[0].children[1].childElementCount === 2) {
            memb = postlist[e].children[2].children[0].children[1].children[0].textContent;
            if (avydict[memb] !== undefined) {
                postlist[e].children[1].children[0].setAttribute("src", avydict[memb]);
                postlist[e].children[1].children[0].setAttribute("style", "max-width:50px;");
                postlist[e].children[1].setAttribute("style", "padding: 0px;");
            } else {
                postlist[e].children[1].children[0].setAttribute("src", avydict["undefined"]);
                postlist[e].children[1].children[0].setAttribute("style", "max-width:50px;");
                postlist[e].children[1].setAttribute("style", "padding: 0px;");
            }
        } else {
            //postlist[e].children[0].children[1].textContent.trim()
            postlist[e].children[1].children[0].setAttribute("src", avydict["undefined"]);
            postlist[e].children[1].children[0].setAttribute("style", "max-width:50px;");
            postlist[e].children[1].setAttribute("style", "padding: 0px;");
        }
    });
}

//$('#draggable').draggable();
var msgarray = $(".inner");
if (emojiparse) {
    GM_addStyle('.emoji {width: 32px; height: 32px;}');
    var getmap = $.get("https://glaceon.ca/BettertOLP/simplemap.json", function( data ) {
        obj = data;
    });
    $.when(getmap).done(function() {
        for (var e = 0; e < msgarray.length; e++) {
            var s =  msgarray[e].innerHTML;
            array = s.match(/:(\w+):/g);
            if (array !== null) {
                for (var item = 0; item < array.length; item++) {
                    msgarray[e].innerHTML = s.replace(array[item], obj[array[item].substring(1, array[item].length-1)]);
                }
            }
            msgarray[e].innerHTML = twemoji.parse(msgarray[e].innerHTML,   function(icon, options) {
                return 'https://twemoji.maxcdn.com/2/' + "svg" + '/' + icon + '.svg';
            });
        }
    });
    $('body').on("keydown", 'textarea#message.editor', function(e) {
        value = $("textarea#message.editor")[0].value;
        array = value.match(/:(\w+):/g);
        if (array !== null) {
            for (var item = 0; item < array.length; item++) {
                $("textarea#message.editor")[0].value = value.replace(array[item], obj[array[item].substring(1, array[item].length-1)]);
            }
        }
    });
    $('body').on("keydown", '.quickReplyContent textarea', function(e) {
        value = $(".quickReplyContent textarea")[0].value;
        array = value.match(/:(\w+):/g);
        if (array !== null) {
            for (var item = 0; item < array.length; item++) {
                $(".quickReplyContent textarea")[0].value = value.replace(array[item], obj[array[item].substring(1, array[item].length-1)]);
            }
        }
    });
}
