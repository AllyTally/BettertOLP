// ==UserScript==
// @name         BettertOLP
// @namespace    https://tolp.nl/forum/index.php?topic=3809
// @version      1.1
// @GM_updatingEnabled true
// @description  Adds more features to the tOLP forums!
// @author       -Kiwi Alexia
// @match        https://tolp.nl/forum/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==
var btversion = 1.1;

var items = [
    "Never use single solid tiles.",
    "Remember to align your rooms!",
    "Don't have too much backtracking. It gets boring.",
    "Make sure your rooms are at a consistent difficulty."
];
var item = items[Math.floor(Math.random()*items.length)];
$( "#boardindex_table" ).prepend("Tips: " + item + "<br><br>");

var bettertolplink = "https://tolp.nl/forum/index.php?topic=3809";
function openNav() {
    document.getElementById("settingsoverlay").style.height = "100%";
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
            //'theme': {
            //    'label': 'Theme', // Appears next to field
            //    'type': 'radio', // Makes this setting a series of radio elements
            //    'options': ['Blue', 'Mint', 'Red', 'Dark'], // Possible choices
            //    'default': 'Blue' // Default value if user doesn't change it
            //},
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
            }
        },
        'events': // Callback functions object
        {
            //'init': function() { alert('onInit()'); },
            'open': function() { openNav(); },
            //'save': function() { alert('onSave()'); },
            'close': function() { closeNav(); },
            //'reset': function() { alert('onReset()'); }
        }
    }
);

function open(){
    GM_config.open();
}
var beforeuser = GM_config.get('beforeuser');
var afteruser = GM_config.get('afteruser');
var dtoken = GM_config.get('dtoken');
//var theme = GM_config.get('theme');
var avatart = GM_config.get('avatart');

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
function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

//Shoutbox
//Add shoutbox bar
$("#main_content_section").append('<div class="shout cat_bar"><h3 class="catbg">Discord Shoutbox (Logging in...)</h3></div>');
//Add content
$("#main_content_section").append('<span class="clear upperframe"><span></span></span><div class="shout"><div class="roundframe"><div class="innerframe"><p>Logging in... (This may take some time.)</p><div class="message-wrap"></div><div class="dinput"></div><br><br></div></div></div></div><span class="lowerframe"><span></span></span><center><span>Token: <div class="tokenin"></div></span></center>');
//Set some css for the scrollbar
$('.message-wrap').css("overflow-y", "scroll");
$('.message-wrap').css("height", "100px");
$(".tokenin").append('<input type="password" placeholder="Discord token here" class="tokeninput"/>');
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
loadScript("https://rawgit.com/hydrabolt/discord.js/webpack/discord.master.js",
           function() {
    const client = new Discord.Client();
    var channelvar;
    var guildvar;
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        guildvar = client.guilds.find("name", "tOLP");
        if (guildvar === null) {
            $("#main_content_section .shout h3")[0].textContent = "Discord Shoutbox (Error!)";
            $("#main_content_section .shout .roundframe .innerframe p")[0].textContent = "You're not on the tOLP discord server.";
        } else {
            channelvar = guildvar.channels.array()[0];
            $("#main_content_section .shout h3")[0].textContent = "Discord Shoutbox (" + client.user.tag + ")";
            $("#main_content_section .shout .roundframe .innerframe p")[0].textContent = "Logged in!";


            $(".dinput").append('<input type="text" placeholder="Message #general" class="search"/>');
            $('body').on("keydown", '.search', function(e) {
                if(e.which == 13) {
                    if ($(".search")[0].value !== "") {
                        channelvar.send($(".search")[0].value);
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
                $("#main_content_section .shout .roundframe .innerframe .message-wrap").append('<span class="message" id="' + msg.id + '"><span class="author" style="color:' + color + ';">' + displayname + '</span><span>: <span class="content">' + escapeHTML(msg.cleanContent, true).autoLink() + '</span><span class="edited" style="color:#AAA; font-size: 70%;"></span></span></span><br>');
                if (msg.attachments.array()[0] !== undefined) {
                    if (checkURL(msg.attachments.array()[0].url)) {
                        //$('.shoutboximg').css("max-width", "%50");
                        //$('.shoutboximg').css("max-height", "%50");
                        $("#main_content_section .shout .roundframe .innerframe .message-wrap").append('<img style="max-width: 50%" src="' + msg.attachments.array()[0].url + '"><br>');
                        var img = document.getElementById('imageid');
                        //or however you get a handle to the IMG
                        //var width = img.clientWidth;
                        //var height = img.clientHeight;
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
                $("#" + oldmsg.id + " .content")[0].textContent = newmsg.content;
                $(".edited")[0].textContent = " (edited)";
            }
        }
    });
    client.login(dtoken).catch(e => {
        $("#main_content_section .shout h3")[0].textContent = "Discord Shoutbox (Error!)";
        $("#main_content_section .shout .roundframe .innerframe p")[0].textContent = "There was an error logging in. If you haven't already, set your token in the settings tab.";

    });
    function output(error, token) {
        if (error) {
            console.log(`There was an error logging in: ${error}`);
            return;
        } else
            console.log(`Logged in. Token: ${token}`);
    }
});


try {
    var str = $("h4")[0].firstChild.textContent;
    var username = str.substring(0, str.length-1);
    $(".username h4")[0].firstChild.textContent = beforeuser + username + afteruser;
} catch (e) {}

//$(".reset .copyright a")[3].textContent = $(".reset .copyright a")[3].textContent + "\nHey Vsauce, Michael here.";
$("#footer_section .frame ul").append('<li><a href="' + bettertolplink + '">BettertOLP v' + btversion + ' by Alexia.</a></li>');
(function() {
    'use strict';
    GM_addStyle('.poster h4 a::before {content:"' + beforeuser + '"} .poster h4 a::after {content:"' + afteruser + '"}');
    // GM_addStyle('.copyright a:nth-of-type(3)::after {content:"BettertOLP by Alexia"; display: block; white-space: pre-wrap;}');
    switch(avatart) {
        case "Circle":
            GM_addStyle('img.avatar {border-radius: 50%;}');
            break;
    }
    //switch(theme) {
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
    //}
})();
function asdf(){
    if (document.body.scrollTop > 100){
        $('.header_nav').css('position','fixed').css('top','0');
        $('.showunreadposts').show();
    } else {
        $('.header_nav').css('position','static');
        $('.showunreadposts').hide();
    }
}
setInterval(asdf,1);

$(".header_nav")[0].style.zIndex = "99";

$("#main_menu ul").append('<li id="button_settings" class="firstlevel"><a class="firstlevel settingspane"><span class="last firstlevel">Settings</span></a></li>');
$( ".settingspane" ).click(function() {
    open();
});

$(".header_nav_content #main_menu ul").append('<li class="showunreadposts"><a href="https://tolp.nl/forum/index.php?action=unread">Unread</a></li>');

var poster = $(".poster");
for (var i = 0; i < poster.length; i++) {
    if ($(".poster h4")[i].textContent.trim() === "Kiwi Alexia ♡") {
        $('<li class="btcreator">BettertOLP Creator</li>').insertAfter($(".poster ul .postgroup")[i]);
    }
}

//for (var i = 0; i < poster.length; i++) {
//    if ($(".poster h4")[i].textContent.trim() === "Kiwi Alexia ♡") {
//        $('<li class="btcreator">BettertOLP Creator</li>').insertAfter($(".poster ul .postgroup")[i]);
//    }
//}

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