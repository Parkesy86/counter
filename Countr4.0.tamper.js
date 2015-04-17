// ==UserScript==
// @name AnaliasCountr Chat V4
// @version	Chat 1.3.0
// @description	script to be used only in DreamOfAnalia's room
// @include	http://www.myfreecams.com/*
// @match http://www.myfreecams.com/*
// ==/UserScript==
//polyfill for unsafeWindow on Chrome
if (navigator.userAgent.match(/chrome/i)) {
    unsafeWindow = (function () {
        var el = document.createElement('p');
        el.setAttribute('onclick', 'return window;');
        return el.onclick();
    } ());
}
//for some reason @match doesn't appear to work properly in Chrome, so check it here
if (0 === window.location.href.indexOf('http://www.myfreecams.com/mfc2/static/player.html')) {
    var maStyles = [
        '    #ma-alert ',
        '    {',
        '    	    position: absolute; ',
        '    	    top: 2px; ',
        '    	    width: 35%; ',
        '    	    height: 30px; ',
        '    	    left: 0; ',
        '    	    right: 0; ',
        '    	    margin-left: auto; ',
        '    	    margin-right: auto; ',
        '    	    background: White; ',
        '    	    text-align: center; ',
        '    	    font-family: Trebuchet MS; ',
        '    	    -moz-border-radius: 10px; ',
        '    	    -webkit-border-radius: 10px;',
        '    	    line-height:1.75em; ',
        '    	    display:none;',
        '    } ',
        '    .processed {color: #66CCFF; font-style:italic} ',
        '    .hidden {display: none;} ',
        '    .show {display:block}',
        '   #ma-menu ',
        '    {',
        '        position:absolute; ',
        '        top:0; ',
        '        right:0;',
        '        background-color:White;',
        '        -moz-border-radius-bottomleft: 10px; ',
        '        -webkit-border-bottom-left-radius: 10px; ',
        '        width: 200px;',
        '        font-family: Trebuchet MS;',
        '        text-align: center; ',
        '        z-index:1001;',
        '    } ',
        '    #ma-menu:hover #ma-nav {display:block;} ',
        '    #ma-nav {display:none;padding:0;margin:0;text-align:left;list-style:none;font-size: smaller;padding: 2px 10px 10px;}',
        '    #ma-menu table {width:100%; border-collapse:collapse}',
        '    #ma-menu table td {font-size:x-small}',
        '    #ma-menu a {text-decoration:underline; color:black; cursor: pointer}',
        '    #ma-menu select {font-size: x-small; display: inline}',
        '    #ma-menu hr {padding:0;margin:3px}'
    ];
    GM_addStyle(maStyles.join('\n'));
    var MAssist = (function () {
        var htmlSetup = false, currentModelID = "", findPlayer, currentModelName, killRegex, startRegex, minusRegex, plusRegex, postRegex, helpRegex;
        var countDown, contributors = [], isCountDownActive, tipRegex, alertTimeout, highestTip = 0, stopRegex, UpdateTopic, lastRegex;
        var parsing = false, parseQueue = [], autoPostActive = false, postCountTimeout = null, killPosting = false, getlastRegex, spamRegex, checkHelperRegex;
        var spanHighestTip, spanCurrentModel, helper = [], spanMenuCount, spanTopContrib, divAlert, txtInput, btnSend, aAutoPost, aPostCurrentCount, soundDiv, playWar2Regex;
        var Topic1, Topic2, Topic3, Topic4, Topic5, T1, T2, T3, T4, T5, SpankSpec, FlashSpec, VidTrp,VidAmt, SnapSpec, VidSgl, VidDbl, Vid1, Vid2, Vid3, Vid4, Vid5, Vid6, Vid7, Vid8;
        var mfcLoadPlayer, TwitMsg, VidMsg, gameRegex, chanceGuessed = [], addgameRegex, toggleGuessRegex, highTipRegex, addHighRegex, bannedRemoveRegex;
        var countrRegex, gamearray, VarVid, topicVar2 = false, nopeRegex, stopGamesRegex, helpers = [], ParkMsg, ModelMsg, banned = [];
        var addBannedRegex, topicValRegex, SpecialRegex, ShowRegex, Show1, Show2, Show3, Show4, Show5, toggleNoRegex, postNo;
        var playWarRegex, isHelperAssigned, assignHelperRegex, removeHelperRegex, isGuessActive, StopTopicRegex, SpinRegex, isSpinActive, SpinPrize;
        var BlackJackPrize, WarPrize, GuessPrize, BlackJackTip, WarTip, chance, BlackJackPrizeAssigned, WarPrizeAssigned, GuessPrizeAssigned;
        var isWarActive, Dealer, Player, isBlackJackActive, BlackJackWinnerRegex, SpinTip, SpinPrizeAssigned, setGamePrizeRegex, setGameTipRegex;
        var DealerSet, DealerHand, DealerHand2, PlayerHand, PlayerHand2, BlkJkRd1, BlkJkRd2, startGameRegex, BlkJk1Regex, BlkJk2Regex;

        function init() {
            setTimeout(function () {
                mfcLoadPlayer = unsafeWindow.LoadPlayer;
                unsafeWindow.LoadPlayer = myLoadPlayer;
            }, 500);
            //default sound to enabled
            localStorage['mfca_soundEnabled'] = localStorage['mfca_soundEnabled'] ? localStorage['mfca_soundEnabled'] : 'enabled';
            localStorage['mfca_friendSound'] = localStorage['mfca_friendSound'] ? localStorage['mfca_friendSound'] : 0;
            //fire the modelchanged event if this is a popup
            if (opener) {
                setTimeout(function () {
                    modelChanged(location.search.match(/broadcaster_id=(\d+)/)[1]);
                }, 1000);
            }
        }
        function myLoadPlayer(sAction, hOptions) {
            var modelId = hOptions ? hOptions['broadcaster_id'] : location.search.match(/broadcaster_id=(\d+)/)[1];
            //            try {
            mfcLoadPlayer(sAction, hOptions);
            modelChanged(hOptions ? hOptions['broadcaster_id'] : null);
            //            } catch (e) {
            //                console.log(e);
            //                console.log(sAction);
            //                console.log(hOptions);
            //                //popupwindow
            //                mfcLoadPlayer('', { broadcaster_id: modelId });
            //                modelChanged(modelId);
            //            }
        }
        function setupHTML() {
            if (htmlSetup)
                return;
            //set up the menu header
            var divMenu = document.createElement('div');
            divMenu.setAttribute('id', 'ma-menu');
            var txtMenuText = document.createTextNode('AnaliasCountr Chat V4');
            spanMenuCount = document.createElement('span');
            spanMenuCount.setAttribute('id', 'menuCount');
            divMenu.appendChild(txtMenuText);
            divMenu.appendChild(spanMenuCount);
            //set up menu children
            var hr = document.createElement('hr');
            var br = document.createElement('br');
            //create the nav menu
            var divNav = document.createElement('div');
            divNav.setAttribute('id', 'ma-nav');
            divMenu.appendChild(divNav);
            //create the currentModel span
            spanCurrentModel = document.createElement('span');
            spanCurrentModel.setAttribute('id', 'currentModel');
            divNav.appendChild(document.createTextNode('Model: '));
            divNav.appendChild(spanCurrentModel);
            //create set countdown link
            var countdownFieldSet = document.createElement('fieldset');
            var countdownLegend = document.createElement('legend');
            countdownLegend.innerHTML = 'Countdown';
            countdownFieldSet.appendChild(countdownLegend);
            var aSetCountdown = document.createElement('a');
            aSetCountdown.setAttribute('id', 'setCountDown');
            var txtSetCountdown = document.createTextNode('Set Countdown');
            aSetCountdown.appendChild(txtSetCountdown);
            aSetCountdown.addEventListener('click', startCountDown);
            countdownFieldSet.appendChild(aSetCountdown);
            countdownFieldSet.appendChild(br.cloneNode(true));
            //create post current count link
            aPostCurrentCount = document.createElement('a');
            aPostCurrentCount.setAttribute('id', 'postCurrentCount');
            aPostCurrentCount.setAttribute('class', 'hidden');
            var txtPostCurrentCount = document.createTextNode('Post Current Count');
            aPostCurrentCount.appendChild(txtPostCurrentCount);
            aPostCurrentCount.addEventListener('click', postCurrentCount);
            countdownFieldSet.appendChild(aPostCurrentCount);
            //create autopost link
            aAutoPost = document.createElement('a');
            aAutoPost.setAttribute('id', 'autoPost');
            aAutoPost.setAttribute('class', 'hidden');
            var txtAutoPost = document.createTextNode('Disable AutoPost');
            aAutoPost.appendChild(txtAutoPost);
            aAutoPost.addEventListener('click', toggleAutoPost);
            countdownFieldSet.appendChild(aAutoPost);
            divNav.appendChild(countdownFieldSet);
            //create highest tip span
            var statsFieldSet = document.createElement('fieldset');
            var statsLegend = document.createElement('legend');
            statsLegend.innerHTML = 'Stats';
            statsFieldSet.appendChild(statsLegend);
            spanHighestTip = document.createElement('span');
            spanHighestTip.setAttribute('id', 'highestTip');
            //create top contributor span
            spanTopContrib = document.createElement('span');
            spanTopContrib.setAttribute('id', 'topContributor');
            statsFieldSet.appendChild(createTable([['Tip', spanHighestTip], ['Contrib', spanTopContrib]]));
            divNav.appendChild(statsFieldSet);
            //create sound management
            var soundsFieldSet = document.createElement('fieldset');
            var soundsLegend = document.createElement('legend');
            soundsLegend.innerHTML = 'Sounds';
            soundsFieldSet.appendChild(soundsLegend);
            var aToggleSound = document.createElement('a');
            var spanSoundToggle = document.createElement('span');
            spanSoundToggle.setAttribute('id', 'soundToggleText');
            spanSoundToggle.innerHTML = localStorage['mfca_soundEnabled'] == 'enabled' ? 'Disable Sound' : 'Enable Sound';
            aToggleSound.appendChild(spanSoundToggle);
            aToggleSound.addEventListener('click', toggleSound);
            soundsFieldSet.appendChild(aToggleSound);
            var selectFriendSound = document.createElement('select');
            selectFriendSound.innerHTML = '<option value=\'0\'>Model Chime</option><option value=\'1\'>User Chime</option><option value=\'2\'>Tip Chime</option>';
            selectFriendSound.setAttribute('id', 'selectFriendSound');
            selectFriendSound.addEventListener('change', configFriendSound);
            selectFriendSound.selectedIndex = localStorage['mfca_friendSound'] ? localStorage['mfca_friendSound'] : 0;
            selectFriendSound.setAttribute('class', localStorage['mfca_soundEnabled'] == 'enabled' ? 'show' : 'hidden');
            soundDiv = document.createElement('div');
            soundDiv.setAttribute('id', 'soundConfig');
            soundDiv.appendChild(document.createTextNode('Online:  '));
            soundDiv.appendChild(selectFriendSound);
            soundsFieldSet.appendChild(soundDiv);
            divNav.appendChild(soundsFieldSet);
            //create the alert div
            divAlert = document.createElement('div');
            divAlert.setAttribute('id', 'ma-alert');
            //add menu and alert to the body
            var body = document.querySelector('body');
            var chat = document.querySelector("#chat_box");
            chat.insertBefore(divMenu, chat.firstChild);
            body.appendChild(divAlert);
            htmlSetup = true;
        }
        gamearray = [" guessing game", " war game", " BlackJack", " Spin The Wheel"];

        //game functions
        function play1stHand(BlkJk1, msgSpan) {
            var poster;
            var CardValue = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster == "Parkesy86") || (poster === currentModelName) || (poster === helper) || (poster == "TestCounter") || (poster == "HoleeeSheeet")) {
                    if (isBlackJackActive) {
                        Dealer = currentModelName;
                        Player = BlkJk1[1];
                        //Card value 1 for Model
                        var Val1Mod = Math.floor((Math.random() * 13), +1);
                        //Card value 2 for Model
                        var Val2Mod = Math.floor((Math.random() * 13), +1);
                        //Card value 1 for Player
                        var Val1P = Math.floor((Math.random() * 13), +1);
                        //Card value 2 for Player
                        var Val2P = Math.floor((Math.random() * 13), +1);
                        //Get the hand values
                        PlayerHand = (Val1P + Val2P);
                        DealerHand = (Val1Mod + Val2Mod);
                        postChatMessage("Shuffling the deck.....:deckshuffle");
                        postCountTimeout = setTimeout(function () {
                            postCountTimeout = null;
                            postChatMessage(Player + " has a hand of " + PlayerHand);
                            postChatMessage(Dealer + " has a hand of " + DealerHand);
                            postCountTimeout = setTimeout(function () {
                                if ((PlayerHand === 21) || (DealerHand === 21)) {
                                    if ((PlayerHand === 21) && (DealerHand === 21)) {
                                        postChatMessage("Its a draw! re=shuffling deck and dealing again");
                                        BlkJkRd1 = true;
                                        PlayAltHand();
                                    }
                                    else if (DealerHand === 21) {
                                        postChatMessage(Dealer + " has BlackJack, " + Player + " has " + PlayerHand + " Dealer wins!");
                                    }
                                    else if (PlayerHand === 21) {
                                        if (BlackJackPrizeAssigned) {
                                            postChatMessage(Player + " has BlackJack and has won " + BlackJackPrize);
                                        }
                                        else {
                                            postChatMessage(Player + " has BlackJack");
                                        }
                                    }
                                }
                                else if ((PlayerHand >= 22) || (DealerHand >= 22)) {
                                    if (PlayerHand >= 22) {
                                        postChatMessage(Player + " bust");
                                    }
                                    else {
                                        postChatMessage(Dealer + " bust " + Player + " wins");
                                        {
                                            if (BlackJackPrizeAssigned) {
                                                postChatMessage(Player + " has beat the dealer and won " + BlackJackPrize);
                                            }
                                            else {
                                                postChatMessage(Player + " has beat the dealer");
                                            }
                                        }
                                    }
                                }
                                else if (DealerHand <= 21) {
                                    if (DealerHand >= 16) {
                                        postChatMessage(Dealer + " has to stick");
                                        DealerSet = true;
                                        BlkJkRd1 = true;
                                        postChatMessage(Player + " would you like another card? just type: 'draw! 1' & I will draw another card for you");
                                    }
                                    else {
                                        BlkJkRd1 = true;
                                        postChatMessage("Who would you like another card? just type: 'draw! 1' & I will draw another card for you");
                                    }
                                }
                                else {
                                    postChatMessage("I don't know how I ended at the end of round 1 with dealer: " + DealerHand + " & Player " + PlayerHand)
                                }
                            }, 6000);
                        }, 6000);
                    }
                    else {
                        postChatMessage("BlackJack isn't turned on");
                    }
                }
            }
        }
        function PlayAltHand(BlkJk2, msgSpan) {
            var poster;
            var cardchoice = BlkJk2[1];
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper) || (poster === Player)) {
                    if (isBlackJackActive) {
                        if (BlkJkRd1) {
                            var CardValues = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"];
                            if ((PlayerHand === 0) || (DealerHand === 0)) {
                                postChatMessage("No values set for player or dealer, idk how I got to round2")
                            }
                            else if (DealerSet) {
                                if (poster === Player) {
                                    //Card value 1 for Player
                                    var Val3P = Math.floor((Math.random() * 13), +1);
                                    //Get the hand values
                                    PlayerHand2 = (Val3P + PlayerHand);
                                    DealerHand2 = DealerHand;
                                    postCountTimeout = setTimeout(function () {
                                        postChatMessage(Player + " has a hand of " + PlayerHand2);
                                        postChatMessage(Dealer + " has the same hand " + DealerHand2);
                                    }, 6000);
                                    postCountTimeout = setTimeout(function () {
                                        if (PlayerHand2 === 21) {
                                            if (BlackJackPrizeAssigned) {
                                                postChatMessage(Player + " has BlackJack and has won " + BlackJackPrize);
                                            }
                                            else {
                                                postChatMessage(Player + " has BlackJack");
                                            }
                                        }
                                        else if ((PlayerHand2 >= 22) || (DealerHand2 >= 22)) {
                                            if (PlayerHand2 >= 22) {
                                                postChatMessage(Player + " bust");
                                            }
                                            else {
                                                postChatMessage(Dealer + " bust " + Player + " wins");
                                                {
                                                    if (BlackJackPrizeAssigned) {
                                                        postChatMessage(Player + " has beat the dealer and won " + BlackJackPrize);
                                                    }
                                                    else {
                                                        postChatMessage(Player + " has beat the dealer");
                                                    }
                                                }
                                            }
                                        }
                                        else if (DealerHand2 <= 21) {
                                            if (DealerHand2 >= 16) {
                                                postChatMessage(Dealer + " has to stick");
                                                DealerSet = true;
                                                BlkJkRd2 = true;
                                                postChatMessage(Player + " would you like another card? just type: 'draw! 1' & I will draw another card for you");
                                            }
                                            else {
                                                BlkJkRd2 = true;
                                                postChatMessage("Who would you like another card? just type: 'draw! 1' & I will draw another card for you");
                                            }
                                        }
                                        else {
                                            postChatMessage("I don't know how I ended at the end of round 2 with dealer: " + DealerHand2 + " & Player " + PlayerHand2)
                                        }
                                    }, 9000);
                                }
                                else if ((poster === currentModelName) || (poster == "TestCounter") || (poster == "Parkesy86") || (poster === helper)) {
                                    if (poster === Player) {
                                        postChatMessage("Only the house can draw cards for itself");
                                    }
                                    postChatMessage("Dealer can not draw another card, house has to stand on hands over 16");
                                }
                                else {
                                    postChatMessae("I'm Sorry, I can't do that");
                                }
                            }
                            else {
                                if (poster === Player) {
                                    var Val3P = Math.floor((Math.random() * 13), +1);
                                    //Get the hand values
                                    PlayerHand2 = (Val3P + PlayerHand);
                                    DealerHand2 = DealerHand;
                                    postChatMessage(Player + " now has a hand of " + PlayerHand2);
                                    postCountTimeout = setTimeout(function () {
                                        if (PlayerHand2 === 21) {
                                            if (BlackJackPrizeAssigned) {
                                                postChatMessage(Player + " has 21 and has won " + BlackJackPrize);
                                                BlkJkRd1 = false;
                                                Player = '';
                                            }
                                            else {
                                                postChatMessage(Player + " has 21 & won");
                                            }
                                        }
                                        else if ((PlayerHand2 >= 22) || (DealerHand2 >= 22)) {
                                            if (PlayerHand2 >= 22) {
                                                postChatMessage(Player + " bust");
                                                BlkJkRd1 = false;
                                                Player = '';
                                            }
                                            else {
                                                postChatMessage(Dealer + " bust " + Player + " wins");
                                                BlkJkRd1 = false;
                                            if (BlackJackPrizeAssigned) {
                                                        postChatMessage(Player + " has beat the dealer and won " + BlackJackPrize);
                                                        BlkJkRd1 = false;
                                                        Player = '';
                                                    }
                                                    else {
                                                        postChatMessage(Player + " has beat the dealer");
                                                        BlkJkRd1 = false;
                                                        Player = '';
                                                    }
                                                }
                                            }
                                        else {
                                            postChatMessage("who wants to draw? just type: 'draw! 1' & I will draw a card for you");
                                            DealerHand = DealerHand2;
                                            PlayerHand = PlayerHand2;
                                        }
                                    }, 9000);
                                }
                                else if ((poster === currentModelName) || (poster == "TestCounter") || (poster == "Parkesy86") || (poster == "HoleeeSheeet") || (poster === helper)) {
                                    //card value 3 for model
                                    var Val3Mod = Math.floor((Math.random() * 13), +1);
                                    //Get the hand values
                                    PlayerHand2 = PlayerHand;
                                    DealerHand2 = (Val3Mod + DealerHand);
                                    postCountTimeout = setTimeout(function () {
                                        postChatMessage(Player + " has a hand of " + PlayerHand2);
                                        postChatMessage(Dealer + " has a hand of " + DealerHand2);
                                    }, 6000);
                                    postCountTimeout = setTimeout(function () {
                                        if ((PlayerHand2 === 21) || (DealerHand2 === 21)) {
                                            if ((PlayerHand2 === 21) && (DealerHand2 === 21)) {
                                                postChatMessage("Its a draw! re=shuffling deck and dealing again");
                                                BlkJkRd1 = true;
                                                Player = '';
                                                DealerHand = 0;
                                                PlayerHand = 0;
                                                postChatMessage("BlackJack " + Player + " x");
                                            }
                                            else if (DealerHand2 === 21) {
                                                postChatMessage(Dealer + " has BlackJack, " + Player + " has " + PlayerHand + " Dealer wins!");
                                                BlkJkRd1 = false;
                                                Player = '';
                                                DealerHand = 0;
                                                PlayerHand = 0;
                                            }
                                            else if (PlayerHand2 === 21) {
                                                if (BlackJackPrizeAssigned) {
                                                    postChatMessage(Player + " has 21 and has won " + BlackJackPrize);
                                                    BlkJkRd1 = false;
                                                    Player = '';
                                                    DealerHand = 0;
                                                    PlayerHand = 0;
                                                }
                                                else {
                                                    postChatMessage(Player + " has 21");
                                                    Player = '';
                                                    DealerHand = 0;
                                                    PlayerHand = 0;
                                                    BlkJkRd1 = false;
                                                }
                                            }
                                        }
                                        else if ((PlayerHand2 >= 22) || (DealerHand2 >= 22)) {
                                            if (PlayerHand2 >= 22) {
                                                postChatMessage(Player + " bust");
                                                BlkJkRd1 = false;
                                                Player = '';
                                                DealerHand = 0;
                                                PlayerHand = 0;
                                            }
                                            else {
                                                postChatMessage(Dealer + " bust " + Player + " wins");
                                                BlkJkRd1 = false;
                                                Player = '';
                                                DealerHand = 0;
                                                PlayerHand = 0;
                                                if (BlackJackPrizeAssigned) {
                                                    postChatMessage(Player + " has beat the dealer and won " + BlackJackPrize);
                                                }
                                                else {
                                                    postChatMessage(Player + " has beat the dealer");
                                                }
                                            }
                                        }
                                        else if (DealerHand2 <= 21) {
                                            if (DealerHand2 >= 16) {
                                                postChatMessage(Dealer + " has to stick");
                                                DealerSet = true;
                                                BlkJkRd1 = true;
                                                DealerHand = DealerHand2;
                                                postChatMessage(Player + " would you like another card? just type: 'draw! 1' & I will draw another card for you");
                                            }
                                            else {
                                                BlkJkRd1 = true;
                                                DealerHand = DealerHand2;
                                                PlayerHand = PlayerHand2;
                                                postChatMessage("Who would you like another card? just type: 'draw! 1' & I will draw another card for you");
                                            }
                                        }
                                        else {
                                            postChatMessage("I don't know how I ended at the end of round 2 with dealer: " + DealerHand2 + " & Player " + PlayerHand2)
                                        }
                                    }, 9000);
                                }
                                else {
                                    postChatMessage("I'm sorry only the house, or helpers can draw house card");
                                }
                            }
                        }
                    }
                    else {
                        postChatMessage("BlackJack isn't turned on");
                    }
                }
            }
        }
        function setGameTips(gametip, msgSpan) {
            var tipval = parseInt(gametip[2]);
            var game = gametip[1];
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    if (game == "war") {
                        WarTip = tipval;
                        postChatMessage("War tip has been set by " + poster + " to " + tipval);
                    }
                    else if (game == "blackjack") {
                        BlackJackTip = tipval;
                        postChatMessage("BlackJack tip has been set by " + poster + " to " + tipval);
                    }
                    else if (game == "spin") {
                        SpinTip = tipval;
                        postChatMessage("Spin tip has been set by " + poster + " to " + tipval);
                    }
                    else {
                        postChatMessage("I'm sorry but " + game + " isn't listed in my catalogue");
                    }
                }
            }
        }
        function startGame(gameval, msgSpan) {
            var game = gameval[2];
            var command = gameval[1];
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    if (game == "blackjack") {
                        if (command == "start") {
                            if (isBlackJackActive) {
                                postChatMessage("I can't start a new game of BlackJack until this one has been cancelled");
                            }
                            else if (BlackJackTip > 0) {
                                if (BlackJackPrizeAssigned) {
                                    isBlackJackActive = true;
                                    postChatMessage("BlackJack game has been started, tip " + BlackJackTip + " to play a hand & win " + BlackJackPrize);
                                }
                                else {
                                    isBlackJackActive = true;
                                    postChatMessage("BlackJack game has been started, tip " + BlackJackTip + " to play a hand, no prize is set for winning ");
                                }
                            }
                            else {
                                if (BlackJackPrizeAssigned) {
                                    isBlackJackActive = true;
                                    postChatMessage("BlackJack game has been started, no tip value set to play a hand & win " + BlackJackPrize);
                                }
                                else {
                                    isBlackJackActive = true;
                                    postChatMessage("BlackJack game has been started, tip no tip value set to play to play a hand, no prize is set for winning ");
                                }
                            }
                        }
                        else if (command == "stop") {
                            isBlackJackActive = false;
                            BlackJackPrize = [];
                            BlackJackPrizeAssigned = false;
                            BlackJackTip = 0;
                            postChatMessage(game + " has been stopped & values cleared");
                        }
                    }
                    if (game == "guess") {
                        if (command == "start") {
                            if (isGuessActive) {
                                postChatMessage("I can't start a new game of guess the number until the current one has been cancelled");
                            }
                            else {
                                if (GuessPrizeAssigned) {
                                    isGuessActive = true;
                                    chance = Math.floor((Math.random() * 100) + 1);
                                    postChatMessage("Guessing game has been started, tip between 1-100 to guess a number & win " + GuessPrize);
                                }
                                else {
                                    isGuessActive = true;
                                    chance = Math.floor((Math.random() * 100) + 1);
                                    postChatMessage("Guessing game has been started, tip between 1-100 to guess a number, no prize has been assigned");
                                }
                            }
                        }
                        if (command == "stop") {
                            GuessPrize = [];
                            GuessPrizeAssigned = false;
                            chance = 0;
                            postChatMessage(game + " has been stopped & values cleared");
                        }
                    }
                    if (game == "war") {
                        if (command == "start") {
                            if (isWarActive) {
                                postChatMessage("I can't start a new game of war until the current one has been cancelled");
                            }
                            else if (WarTip > 0) {
                                if (WarPrizeAssigned) {
                                    isWarActive = true;
                                    postChatMessage("War game has been started, tip " + WarTip + " to play war & win " + WarPrize);
                                }
                                else {
                                    isWarActive = true;
                                    postChatMessage("War game has been started, tip " + WarTip + " to play war (no prize for winning)")
                                }
                            }
                            else {
                                if (WarPrizeAssigned) {
                                    isWarActive = true;
                                    postChatMessage("War game has been started but no tip value stated to play, you can play manually or set WarTip value");
                                }
                                else {
                                    isWarActive = true;
                                    postChatMessage("War game has been started but no tip value or prize has been set, you can play manually or set these values");
                                }
                            }
                        }
                        else if (command == "stop") {
                            isWarActive = false;
                            WarPrize = [];
                            WarPrizeAssigned = false;
                            WarTip = 0;
                            postChatMessage(game + " has been stopped & values cleared");
                        }
                    }
                    if (game == "spin") {
                        if (command == "start") {
                            if (isSpinActive) {
                                postChatMessage("I can't start a new game of Spin The Wheel until this one has been cancelled");
                            }
                            else if (SpinTip > 0) {
                                if (SpinPrizeAssigned) {
                                    isSpinActive = true;
                                    postChatMessage("Spin The Wheel has been started, tip " + SpinTip + " to play a hand & win " + SpinPrize);
                                }
                                else {
                                    isSpinActive = true;
                                    postChatMessage("Spin The Wheel has been started, tip " + SpinTip + " to play a hand, no prize is set for winning ");
                                }
                            }
                            else {
                                if (SpinPrizeAssigned) {
                                    isSpinActive = true;
                                    postChatMessage("Spin The Wheel has been started, no tip value set to play a hand & win " + SpinPrize);
                                }
                                else {
                                    isSpinActive = true;
                                    postChatMessage("Spin The Wheel has been started, no tip value set to play to play a hand");
                                }
                            }
                        }
                        else if (command == "stop") {
                            isSpinActive = false;
                            SpinPrizeAssigned = false;
                            SpinTip = 0;
                            postChatMessage(game + " has been stopped & values cleared");
                        }
                    }
                }
                else if (poster == "AnaliasCountr") {
                    postChatMessage(":spyou Countr, you should know better!");
                }
                else {
                    postChatMessage(":mno " + poster + " you are not allowed to " + command + game);
                    ParkMsg = poster + " tried to " + command + game;
                    postToPark(ParkMsg);
                }
            }

        }
        function setPrizes(gamePrize, msgSpan) {
            var game = gamePrize[1];
            var gameprz = gamePrize[2];
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    if (game == "war") {
                        WarPrizeAssigned = true;
                        WarPrize = gameprz;
                        postChatMessage("War prize has been set to " + WarPrize);
                    }
                    else if (game == "guess") {
                        GuessPrizeAssigned = true;
                        GuessPrize = gameprz;
                        postChatMessage("Guessing game prize has been set to " + GuessPrize);
                    }
                    else if (game == "blackjack") {
                        BlackJackPrizeAssigned = true;
                        BlackJackPrize = gameprz;
                        postChatMessage("Blackjack prize set to " + BlackJackPrize);
                        postChatMessage("I may run a test hand....");
                    }
                    else if (game == "spin") {
                        SpinPrizeAssigned = true;
                        postChatMessage("Spin prize has been set to " + SpinPrize);
                    }
                }
                else {
                    postChatMessage("Sorry, you can not set game prizes");
                }
            }
        }
        function SpinTheWheel(contributor) {
            if (isSpinActive) {
                var WheelVal1 = ["Free Spin", "Spank", "Flash", "Truth", "Dare", "Ban A Basic", "20% off any video", "Free Picture Gallery", "Free SnapChat For 1 month"];
                var WheelSpin1 = Math.floor((Math.random() * 9), +1);
                var SpinPlayer = contributor;
                var SpinPrize = WheelVal1[WheelSpin1];

                if (SpinPrize == "Spank") {
                    var WheelVal2 = ["Player", "Model"];
                    var WheelSpin2 = Math.floor((Math.random() * 2), +1);
                    var SpinValue = WheelVal2[WheelSpin2];
                    if (SpinValue == "Player") {
                        postChatMessage(Player + "'s spin result is " + SpinPlayer + " has to " + SpinPrize + " themselves");
                    }
                    else if (SpinValue == "Model") {
                        postChatMessage(Player + "'s spin result is " + currentModelName + " has to " + SpinPrize + " themselves");
                    }
                }
                else if (SpinPrize == "Flash") {
                    var WheelVal2 = ["Player", "Model"];
                    var WheelSpin2 = Math.floor((Math.random() * 2), +1);
                    var SpinValue = WheelVal2[WheelSpin2];
                    if (SpinValue == "Player") {
                        postChatMessage(SpinPlayer + "'s spin result is " + SpinPlayer + " has to " + SpinPrize + " for " + currentModelName);
                    }
                    else if (SpinValue == "Model") {
                        postChatMessage(SpinPlayer + "'s spin result is " + currentModelName + " has to " + SpinPrize + " for " + Player);
                    }
                }
                else if (SpinPrize == "Truth") {
                    var WheelVal2 = ["Player", "Model"];
                    var WheelSpin2 = Math.floor((Math.random() * 2), +1);
                    var SpinValue = WheelVal2[WheelSpin2];
                    if (SpinValue == "Player") {
                        postChatMessage(SpinPlayer + "'s spin result is " + SpinPlayer + " has to answer " + SpinPrize + "fully a question from " + currentModelName);
                    }
                    else if (SpinValue == "Model") {
                        postChatMessage(SpinPlayer + "'s spin result is " + currentModelName + " has to answer " + SpinPrize + "fully a question from " + SpinPlayer);
                    }
                }
                else if (SpinPrize == "Dare") {
                    var WheelVal2 = ["Player", "Model"];
                    var WheelSpin2 = Math.floor((Math.random() * 2), +1);
                    var SpinValue = WheelVal2[WheelSpin2];
                    if (SpinValue == "Player") {
                        postChatMessage(SpinPlayer + "'s spin result is " + SpinPlayer + " has to do a " + SpinPrize + " from " + currentModelName);
                    }
                    else if (SpinValue == "Model") {
                        postChatMessage(SpinPlayer + "'s spin result is " + currentModelName + " has to do a " + SpinPrize + " from " + SpinPlayer);
                    }
                }
                else if (SpinPrize == "Free Spin"){
                    postChatMessage(SpinPlayer + "'s spin result is " + SpinPrize);
                    contributor = SpinPlayer;
                    postChatMessage("Spinning the wheel again......");
                    postCountTimeout = setTimeout(function () {
                        SpinTheWheel(contributor);
                    }, 10000);
                }
                else {
                    postChatMessage(SpinPlayer + "'s spin result is " + SpinPrize);
                }
            }
            else {
                postChatMessage("Spin the wheel is not active, I have reset the Spin The Wheel Tip Value back to 0");
                SpinTip = 0;
            }
        }
        function ManualSpinTheWheel(Spin, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    var WheelVal1 = ["Free Spin", "Spank", "Flash", "Truth", "Dare", "Ban A Basic", "20% off any video", "Free Picture Gallery", "Free SnapChat For 1 month"];
                    var WheelSpin1 = Math.floor((Math.random() * 9), +1);
                    var SpinPlayer = Spin[1];
                    var SpinPrize = WheelVal1[WheelSpin1];
                    if (SpinPrize == "Spank") {
                        var WheelVal2 = ["Player", "Model"];
                        var WheelSpin2 = Math.floor((Math.random() * 2), +1);
                        var SpinValue = WheelVal2[WheelSpin2];
                        if (SpinValue == "Player") {
                            postChatMessage(SpinPlayer + "'s spin result is " + SpinPlayer + " has to " + SpinPrize + " themselves");
                        }
                        else if (SpinValue == "Model") {
                            postChatMessage(SpinPlayer + "'s spin result is " + currentModelName + " has to " + SpinPrize + " themselves");
                        }
                    }
                    else if (SpinPrize == "Flash") {
                        var WheelVal2 = ["Player", "Model"];
                        var WheelSpin2 = Math.floor((Math.random() * 2), +1);
                        var SpinValue = WheelVal2[WheelSpin2];
                        if (SpinValue == "Player") {
                            postChatMessage(SpinPlayer + "'s spin result is " + SpinPlayer + " has to " + SpinPrize + " for " + currentModelName);
                        }
                        else if (SpinValue == "Model") {
                            postChatMessage(SpinPlayer + "'s spin result is " + currentModelName + " has to " + SpinPrize + " for " + SpinPlayer);
                        }
                    }
                    else if (SpinPrize == "Truth") {
                        var WheelVal2 = ["Player", "Model"];
                        var WheelSpin2 = Math.floor((Math.random() * 2), +1);
                        var SpinValue = WheelVal2[WheelSpin2];
                        if (SpinValue == "Player") {
                            postChatMessage(SpinPlayer + "'s spin result is " + SpinPlayer + " has to answer " + SpinPrize + "fully a question from " + currentModelName);
                        }
                        else if (SpinValue == "Model") {
                            postChatMessage(SpinPlayer + "'s spin result is " + currentModelName + " has to answer " + SpinPrize + "fully a question from " + SpinPlayer);
                        }
                    }
                    else if (SpinPrize == "Dare") {
                        var WheelVal2 = ["Player", "Model"];
                        var WheelSpin2 = Math.floor((Math.random() * 2), +1);
                        var SpinValue = WheelVal2[WheelSpin2];
                        if (SpinValue == "Player") {
                            postChatMessage(SpinPlayer + "'s spin result is " + SpinPlayer + " has to do a " + SpinPrize + " from " + currentModelName);
                        }
                        else if (SpinValue == "Model") {
                            postChatMessage(SpinPlayer + "'s spin result is " + currentModelName + " has to do a " + SpinPrize + " from " + SpinPlayer);
                        }
                    }
                    else if (SpinPrize == "Free Spin"){
                        postChatMessage(SpinPlayer + "'s spin result is " + SpinPrize);
                        contributor = SpinPlayer;
                        isSpinActive = true;
                        postChatMessage("Spinning the wheel again......");
                        postCountTimeout = setTimeout(function () {
                            SpinTheWheel(contributor);
                        }, 10000);
                    }
                    else {
                        postChatMessage(SpinPlayer + "'s spin result is " + SpinPrize);
                    }
                }
            }
        }
        function findBlackJackWinner(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster == "DreamOfAnalia") || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    if (isBlackJackActive) {
                        if (BlkJkRd2) {
                            if (PlayerHand > DealerHand) {
                                if (BlackJackPrizeAssigned) {
                                    postChatMessage(Player + " has beat the house in round 2 with " + PlayerHand2 + " over " + DealerHand2 + " & won " + BlackJackPrize);
                                }
                                else {
                                    postChatMessage(Player + " has beat the house in round 2 with " + PlayerHand2 + " over " + DealerHand2);
                                }
                            }
                            else if (DealerHand > PlayerHand) {
                                postChatMessage("House wins with " + DealerHand2 + " over " + PlayerHand2);
                            }
                        }
                        else if (BlkJkRd1) {
                            if (PlayerHand > DealerHand) {
                                if (BlackJackPrizeAssigned) {
                                    postChatMessage(Player + " has beat the house in round 1 with " + PlayerHand + " over " + DealerHand + " & won " + BlackJackPrize);
                                }
                                else {
                                    postChatMessage(Player + " has beat the house in round 1 with " + PlayerHand + " over " + DealerHand);
                                }
                            }
                            else if (DealerHand > PlayerHand) {
                                postChatMessage("House wins with " + DealerHand + " over " + PlayerHand);
                            }
                        }
                        else {
                            postChatMessage("BlackJack is active but no hands have been drawn.");
                        }
                    }
                    else {
                        postChatMessage("BlackJack game has not been started");
                    }
                }
            }
        }
        function stopAllGames(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    GuessPrize = 0;
                    GuessPrizeAssigned = false;
                    isGuessActive = false;
                    chance = 0;
                    WarPrize = 0;
                    WarPrizeAssigned = false;
                    isWarActive = false;
                    WarTip = 0;
                    isBlackJackActive = false;
                    isSpinActive = false;
                    BlackJackTip = 0;
                    SpinTip = 0;
                    BlackJackPrize = 0;
                    BlackJackPrizeAssigned = false;
                    SpinPrizeAssigned = false;
                    postChatMessage("Success, all games, prizes and amounts have been cancelled");
                }
                else {
                    postChatMessage("I'm sorry " + poster + " you can't stop all the games");
                    ParkMsg = poster + " tried to stop the war game";
                    postToPark(ParkMsg);
                }
            }
        }
        function clearGame(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    chanceGuessed = [];
                    chance = Math.floor((Math.random() * 100) + 1);
                    postChatMessage("game data has been reset by " + poster);
                    ModelMsg = " new value is " + chance;
                    postToModel(ModelMsg);
                }
                else {
                    postChatMessage(":nono I'm sorry " + poster + " you can not remove guessing game data");
                    ParkMsg = poster + " tried to clear game data";
                    postToPark(ParkMsg);
                }
            }
        }
        function playWar(contributor) {
            if (isWarActive) {
                var suits = ["Diamonds", "Clubs", "Hearts", "Spades"];
                var CardVal = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"];
                var PlayerSuitVal = Math.floor((Math.random() * 4), 0);
                var PlayerSuit = suits[PlayerSuitVal];
                var PlayerCardAmt = Math.floor((Math.random() * 13), +1);
                var PlayerCardVal = CardVal[PlayerCardAmt];
                var ModelSuitVal = Math.floor((Math.random() * 4), 0);
                var ModelSuit = suits[ModelSuitVal];
                var ModelCardAmt = Math.floor((Math.random() * 13), +1);
                var ModelCardVal = CardVal[ModelCardAmt];
                var PlayerCard = (PlayerCardVal + " of " + PlayerSuit);
                var ModelCard = (ModelCardVal + " of " + ModelSuit);
                postChatMessage(contributor + " your card is " + PlayerCard);
                postChatMessage(currentModelName + " your card is " + ModelCard);
                if (ModelCardAmt === PlayerCardAmt) {
                    postChatMessage(":wowo It's a stalemate, drawing again!!");
                    postCountTimeout = setTimeout(function () {
                        postCountTimeout = null;
                        playWar(contributor);
                    }, 10000);
                }
                else if (ModelCardAmt > PlayerCardAmt) {
                    postChatMessage(":winner is " + currentModelName);
                }
                else if (PlayerCardAmt > ModelCardAmt) {
                    if(warPrizeAssigned) {
                        postChatMessage(":winner is " + contributor);
                        postChatMessage(contributor + " you won " + warPrize);
                    }
                    else {
                        postChatMessage(":winner is " + contributor);
                    }
                }
            }
        }
        function startWarForTwo(warForTwo, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                var war1 = warForTwo[1];
                var war2 = warForTwo[2];
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    postChatMessage("shuffling deck, please wait....... :deckshuffle ");
                    postCountTimeout = setTimeout(function () {
                        postCountTimeout = null;
                        startWar2(war1, war2);
                    }, 10000);
                }
                else {
                    postChatMessage("I'm sorry " + poster + " you can't start the two player war game");
                    ParkMsg = poster + " tried to start the two player war game with users " + war1 + ", " + war2;
                    postToPark(ParkMsg);
                }
            }
        }
        function startWar2(war1, war2) {
            //get the values of the shuffle
            var suits = ["Diamonds", "Clubs", "Hearts", "Spades"];
            var CardVal = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"];
            var PlayerSuitVal = Math.floor((Math.random() * 4), 0);
            var PlayerSuit = suits[PlayerSuitVal];
            var PlayerCardAmt = Math.floor((Math.random() * 13), +1);
            var PlayerCardVal = CardVal[PlayerCardAmt];
            var ModelSuitVal = Math.floor((Math.random() * 4), 0);
            var ModelSuit = suits[ModelSuitVal];
            var ModelCardAmt = Math.floor((Math.random() * 13), +1);
            var ModelCardVal = CardVal[ModelCardAmt];
            var PlayerCard = (PlayerCardVal + " of " + PlayerSuit);
            var ModelCard = (ModelCardVal + " of " + ModelSuit);
            //post the results to chat
            postChatMessage(war1 + " your card is " + PlayerCard);
            postChatMessage(war2 + " your card is " + ModelCard);
            if (ModelCardVal === PlayerCardVal) {
                postChatMessage(":wowo It's a stalemate, drawing again!!");
                postCountTimeout = setTimeout(function () {
                    postCountTimeout = null;
                    startWar2(war1, war2);
                }, 10000);
            }
            else if (ModelCardVal > PlayerCardVal) {
                postChatMessage(":winner is " + war2);
            }
            else if (PlayerCardVal > ModelCardVal) {
                postChatMessage(":winner is " + war1);
            }
        }
        function manWar(contributor) {
            //get the values of the shuffle
            var suits = ["Diamonds", "Clubs", "Hearts", "Spades"];
            var CardVal = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"];
            var PlayerSuitVal = Math.floor((Math.random() * 4), 0);
            var PlayerSuit = suits[PlayerSuitVal];
            var PlayerCardAmt = Math.floor((Math.random() * 13), +1);
            var PlayerCardVal = CardVal[PlayerCardAmt];
            var ModelSuitVal = Math.floor((Math.random() * 4), 0);
            var ModelSuit = suits[ModelSuitVal];
            var ModelCardAmt = Math.floor((Math.random() * 13), +1);
            var ModelCardVal = CardVal[ModelCardAmt];
            var PlayerCard = (PlayerCardVal + " of " + PlayerSuit);
            var ModelCard = (ModelCardVal + " of " + ModelSuit);
            //post the results to chat
            postChatMessage(contributor + " your card is " + PlayerCard);
            postChatMessage(currentModelName + " your card is " + ModelCard);
            if (ModelCardVal === PlayerCardVal) {
                postChatMessage(":wowo It's a stalemate, drawing again!!");
                postCountTimeout = setTimeout(function () {
                    postCountTimeout = null;
                    playWar(contributor);
                }, 10000);
            }
            else if (ModelCardVal > PlayerCardVal) {
                postChatMessage(":winner is " + currentModelName);
            }
            else if (PlayerCardVal > ModelCardVal) {
                if(WarPrizeAssigned) {
                    postChatMessage(":winner is " + contributor);
                    postChatMessage(contributor + " you won " + WarPrize);
                }
                else {
                    postChatMessage(":winner is " + contributor);
                }
            }
        }
        function manualWar(msgSpan, play) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    var contributor = play[1];
                    if (isWarActive) {
                        postChatMessage("shuffling deck, please wait....... :deckshuffle ");
                        postCountTimeout = setTimeout(function () {
                            postCountTimeout = null;
                            manWar(contributor);
                        }, 10000);
                    }
                    else {
                        postChatMessage("I'm sorry " + poster + " war is not currently running")
                    }
                }
                else {
                    postChatMessage("I'm sorry only helpers or " + currentModelName + " can manually play war");
                    ParkMsg = poster + " tried to manually play 1 person war";
                    postToPark(ParkMsg);
                }
            }
        }
        function postGameValues(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    if (isWarActive) {
                        if (WarPrizeAssigned) {
                            postChatMessage("war is active to play tip: " + WarTip);
                            postChatMessage("war prize is: " + WarPrize);
                        }
                        else {
                            postChatMessage("war is active to play, no prize set for winners, to play tip: " + WarTip);
                        }
                    }
                    if (isSpinActive){
                        postChatMessage("Spin The Wheel is active to play, tip: " + SpinTip + " for your chance to win");
                    }
                    if (isBlackJackActive){
                        if (BlackJackPrizeAssigned){
                            postChatMessage("BlackJack is active to play, tip: " + BlackJackTip);
                            postChatMessage("BlackJack prize is: " + BlackJackPrize);
                        }
                        else {
                            postChatMessage("BlackJack is active to play, no prize set for winners, to play tip: " + BlackJackTip);
                        }
                    }
                    if (isGuessActive) {
                        if (GuessPrizeAssigned) {
                            postChatMessage("/pm " + poster + " the random number for today is " + chance + " whoever tips this wins (max 1 person)");
                            postChatMessage(currentModelName + "'s Random Number Game, simply tip an amount between 1-100 and if it matches the random number you win (max 1 person per game)");
                            postChatMessage("prize for guessing the correct number is: " + GuessPrize);
                            postChatMessage("numbers guessed so far are: " + chanceGuessed.sort());
                        }
                        else {
                            postChatMessage("/pm " + poster + " the random number for today is " + chance + " whoever tips this wins (max 1 person)");
                            postChatMessage(currentModelName + "'s Random Number Game, simply tip an amount between 1-100 and if it matches the random number you win (max 1 person per game)");
                            postChatMessage("no prize has been set for winning the guessing game");
                            postChatMessage("numbers guessed so far are: " + chanceGuessed.sort());
                        }
                    }
                    else {
                        postChatMessage("no other games are currently running, start games by turning them on with chat commands");
                    }
                }
                else {
                    if (isWarActive) {
                        if (WarPrizeAssigned) {
                            postChatMessage("war is active to play tip: " + WarTip);
                            postChatMessage("war prize is: " + WarPrize);
                        }
                        else {
                            postChatMessage("war is active to play, no prize set for winners, to play tip: " + WarTip);
                        }
                    }
                    if (isGuessActive) {
                        if (GuessPrizeAssigned) {
                            postChatMessage(currentModelName + "'s Random Number Game, simply tip an amount between 1-100 and if it matches the random number you win (max 1 person per game)");
                            postChatMessage("prize for guessing the correct number using tip amount is: " + GuessPrize);
                            postChatMessage("numbers guessed so far are: " + chanceGuessed.sort());
                        }
                        else {
                            postChatMessage(currentModelName + "'s Random Number Game, simply tip an amount between 1-100 and if it matches the random number you win (max 1 person per game)");
                            postChatMessage("no prize has been set for winning the guessing game");
                            postChatMessage("numbers guessed so far are: " + chanceGuessed.sort());
                        }
                    }
                    if (isSpinActive){
                        postChatMessage("Spin The Wheel is active to play, tip: " + SpinTip + " for your chance to win");
                    }
                    if (isBlackJackActive){
                        if (BlackJackPrizeAssigned){
                            postChatMessage("BlackJack is active to play, tip: " + BlackJackTip);
                            postChatMessage("BlackJack prize is: " + BlackJackPrize);
                        }
                        else {
                            postChatMessage("BlackJack is active to play, no prize set for winners, to play tip: " + BlackJackTip);
                        }
                    }
                    else {
                        postChatMessage("no other games are currently running, start games by turning them on with chat commands");
                    }
                }
            }
        }
        function handleGame(addgame, msgSpan){
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    var amount = parseInt(addgame[1]);
                    if (isGuessActive) {
                        if (amount >= 101) {
                            postChatMessage("I'm sorry, the maximum amount for the game is 100, to change please contact Parkesy");
                        }
                        else if (amount === chance) {
                            postChatMessage(":uhuh we have a winner, please start a new game if you would like to run another one");
                            isGuessActive = false;
                        }
                        else {
                            if (chanceGuessed.indexOf(amount) == -1) {
                                chanceGuessed.push(amount);
                                postChatMessage(amount + " has been added to numbers guessed but is not a winner");
                            }
                            else {
                                postChatMessage(amount + " has already been guessed");
                                postChatMessage("numbers guessed so far are: " + chanceGuessed.sort());
                            }
                        }
                    }
                    else {
                        postChatMessage("I'm sorry " + poster + " the game is not currently running, please start a new one if you wish to run a game");
                    }
                }
                else {
                    postChatMessage(":mno I'm sorry " + poster + " guesses need to be the value of a tip");
                    ParkMsg = poster + " tried to play guessing game without tipping";
                    postToPark(ParkMsg);
                }
            }
        }

        //Controlling topics and variables
        function toggleTopicVar(TVar, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                var TopicMaster = parseInt(TVar[1]);
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet")) {
                    var posty = poster;
                    if (TopicMaster === 4999){
                        postChatMessage("Topic amounts have been set, sample topic is being generated :waitloading");
                        Topic1 = 4999;
                        Topic2 = 1999;
                        Topic3 = 1999;
                        Topic4 = 1999;
                        Topic5 = 1999;
                        T1 = (Topic1 + Topic2 + Topic3 + Topic4 + Topic5);
                        T2 = (Topic2 + Topic3 + Topic4 + Topic5);
                        T3 = (Topic3 + Topic4 + Topic5);
                        T4 = (Topic4 + Topic5);
                        T5 = Topic5;
                        isCountDownActive = true;
                        countDown = T1;
                        autoPostActive = true;
                        showCurrentCountDown();
                        topicVar2 = true;
                        postCountTimeout = setTimeout(function () {
                            postCountTimeout = null;
                            TopicX(posty);
                            postCurrentCount();
                        }, 10000);
                    }
                    else if (TopicMaster === 2555){
                        postChatMessage("Topic amounts have been set, sample topic is being generated :waitloading");
                        Topic1 = 2555;
                        Topic2 = 2555;
                        Topic3 = 1999;
                        Topic4 = 1999;
                        Topic5 = 1999;
                        T1 = (Topic1 + Topic2 + Topic3 + Topic4 + Topic5);
                        T2 = (Topic2 + Topic3 + Topic4 + Topic5);
                        T3 = (Topic3 + Topic4 + Topic5);
                        T4 = (Topic4 + Topic5);
                        T5 = Topic5;
                        isCountDownActive = true;
                        countDown = T1;
                        autoPostActive = true;
                        showCurrentCountDown();
                        topicVar2 = false;
                        postCountTimeout = setTimeout(function () {
                            postCountTimeout = null;
                            TopicX(posty);
                            postCurrentCount();
                        }, 10000);
                    }
                    else {
                        postChatMessage("I'm sorry " + poster + " I can't auto-generate that topic");
                    }
                }
                else {
                    postChatMessage("I'm sorry " + poster + " you cant set topics values");
                }
            }
        }
        function assignShows(show, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet")) {
                    var SValue = parseInt(show[2]);
                    var SType = show[1];
                    if (SValue === 1) {
                        Show1 = SType;
                        postChatMessage(Show1 + " has been set as show 1");
                    }
                    else if (SValue === 2) {
                        Show2 = SType;
                        postChatMessage(Show2 + " has been set as show 2");
                    }
                    else if (SValue === 3) {
                        Show3 = SType;
                        postChatMessage(Show3 + " has been set as show 3");
                    }
                    else if (SValue === 4) {
                        Show4 = SType;
                        postChatMessage(Show4 + " has been set as show 4");
                    }
                    else if (SValue === 5) {
                        Show5 = SType;
                        postChatMessage(Show5 + " has been set as show 5");
                    }
                    else if (SValue === 9) {
                        postChatMessage("shows set to " + Show1 + ", " + Show2 + ", " + Show3 + ", " + Show4 + ", " + Show5)
                    }
                    else {
                        postChatMessage("I'm sorry but " + SValue + " is unassignable");
                    }
                }
                else {
                    postChatMessage("I'm sorry " + poster + " you can not set show types");
                }
            }
        }
        function toggleSpecials(SVar, msgSpan) {
            var poster;
            var postie;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet")) {
                    var val = SVar[1];
                    var control = val.toLowerCase();
                    var ctrlval = parseInt(SVar[2]);
                    var ctrlvaltxt = SVar[2];
                    if (control == "spank"){
                        SpankSpec = ctrlval;
                        if (SpankSpec > 0) {
                            postChatMessage("Spank value has been set to " + SpankSpec);
                        }
                        else {
                            SpankSpec = 99;
                            postChatMessage("Spank value set to default value of " + SpankSpec);
                        }
                    }
                    else if (control == "flash") {
                        FlashSpec = ctrlval;
                        if (FlashSpec > 0) {
                            postChatMessage("Flash value has been set to " + FlashSpec);
                        }
                        else {
                            FlashSpec = 100;
                            postChatMessage("Flash value has been set to default " + FlashSpec);
                        }
                    }
                    else if (control == "snap") {
                        SnapSpec = ctrlval;
                        if (SnapSpec > 0) {
                            postChatMessage("SnapChat value has been set to " + SnapSpec);
                        }
                        else {
                            SnapSpec = 1717;
                            postChatMessage("SnapChat value has been set to default " + SnapSpec);
                        }
                    }
                    else if (control == "vidsgl") {
                        VidSgl = ctrlval;
                        if (VidSgl > 0) {
                            postChatMessage("Single Vid value has been set to " + VidSgl);
                        }
                        else {
                            VidSgl = 500;
                            postChatMessage("Single Vid value has been set to default " + VidSgl);
                        }
                    }
                    else if (control == "viddbl") {
                        VidDbl = ctrlval;
                        if (VidDbl > 0) {
                            postChatMessage("Multi Vid value has been set to " + VidDbl);
                        }
                        else {
                            VidDbl = 999;
                            postChatMessage("Multi Vid value has been set to default " + VidDbl)
                        }
                    }
                    else if (control == "vidtrp") {
                        VidTrp = ctrlval;
                        if (VidDbl > 0){
                            postChatMessage("Non topic Vid value has been set to " + VidTrp);
                        }
                        else {
                            postChatMessage("Non topic Vid value has been set to default " + VidTrp)
                        }
                    }
                    else if (control == "vidamt") {
                        VidAmt = ctrlval;
                        postChatMessage("vid qty in topic has been set to " + VidAmt);
                    }
                    else if (control == "varvid") {
                        VarVid = ctrlvaltxt;
                        postChatMessage("video type set to " + VarVid);

                    }
                    else {
                        postChatMessage("I'm sorry " + poster + " but " + control + " is not a recognised command prompt");
                    }
                }
                else {
                    postChatMessage("Sorry you don't have relevant authorisation to change topic specials");
                }
            }
        }
        function postLastTopic(msgSpan)  {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    var topictextmsg = UpdateTopic;
                    if(null == topictextmsg){
                        postChatMessage(":oops no previous topic has been posted and recorded");
                    }
                    else {
                        postChatMessage(topictextmsg);
                    }
                }
                else if (poster == "AnaliasCountr") {
                    postChatMessage(":mno countr, you know better!!");
                }
                else {
                    postChatMessage(":wowo " + poster + " you have a topic?, what was it? :mpervy");
                    ParkMsg = poster + " tried to request topic";
                    postToPark(ParkMsg);
                }
            }
        }
        function updatedTopic(topic, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if (poster == "AnaliasCountr") {
                    //parse the values
                    var Topic = parseInt(topic[1]);
                    UpdateTopic = (Topic);
                }
            }
        }
        function stopCount(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    isCountDownActive = false;
                    autoPostActive = false;
                    countDown = 0;
                    postCurrentCount();
                    showCurrentCountDown();
                    postChatMessage("count has been stopped and cleared by " + poster);
                }
                else if (poster == "AnaliasCountr") {
                    postChatMessage("");
                }
                else {
                    postChatMessage(":mno I'm sorry " + poster + " you can't stop countr :evillaughing");
                    ParkMsg = poster + " tried to stop the countr";
                    postToPark(ParkMsg);
                }
            }
        }
        function startVarCount(start, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                var topicNumb = parseInt(start[1]);
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    if (isCountDownActive) {
                        postChatMessage("I'm sorry " + poster + " countdown is already running, please cancel before starting a new one")
                    }
                    else{
                        if (topicNumb === 1) {
                            countDown = T1;
                            showCurrentCountDown();
                            isCountDownActive = true;
                            autoPostActive = true;
                            postCurrentCount();
                            postChatMessage("make sure to follow " + currentModelName + " on Twitter");
                            postChatMessage("all videos available on http://profiles.myfreecams.com/" + currentModelName);
                            postChatMessage(poster + " has started a new topic to the value of " + (countDown - T2));
                        }
                        else if (topicNumb === 2) {
                            countDown = T2;
                            showCurrentCountDown();
                            isCountDownActive = true;
                            autoPostActive = true;
                            postCurrentCount();
                            postChatMessage("make sure to follow " + currentModelName + " on Twitter");
                            postChatMessage("all videos available on http://profiles.myfreecams.com/" + currentModelName);
                            postChatMessage(poster + " has started a new topic to the value of " + (countDown - T3));
                        }
                        else if (topicNumb === 3) {
                            countDown = T3;
                            showCurrentCountDown();
                            isCountDownActive = true;
                            autoPostActive = true;
                            postCurrentCount();
                            postChatMessage("make sure to follow " + currentModelName + " on Twitter");
                            postChatMessage("all videos available on http://profiles.myfreecams.com/" + currentModelName);
                            postChatMessage(poster + " has started a new topic to the value of " + (countDown - T4));
                        }
                        else if (topicNumb === 4) {
                            countDown = T4;
                            showCurrentCountDown();
                            isCountDownActive = true;
                            autoPostActive = true;
                            postCurrentCount();
                            postChatMessage("make sure to follow " + currentModelName + " on Twitter");
                            postChatMessage("all videos available on http://profiles.myfreecams.com/" + currentModelName);
                            postChatMessage(poster + " has started a new topic to the value of " + (countDown - T5));
                        }
                        else if (topicNumb === 5) {
                            countDown = T5;
                            showCurrentCountDown();
                            isCountDownActive = true;
                            autoPostActive = true;
                            postCurrentCount();
                            postChatMessage("make sure to follow " + currentModelName + " on Twitter");
                            postChatMessage("all videos available on http://profiles.myfreecams.com/" + currentModelName);
                            postChatMessage(poster + " has started a new topic to the value of " + countDown);
                        }
                    }
                }
                else if (poster == "AnaliasCountr") {
                    postChatMessage("");
                }
                else {
                    postChatMessage("I'm sorry " + poster + " you are not allowed to start topics");
                    ParkMsg = poster + " tried to start topic " + topicNumb;
                    postToPark(ParkMsg);
                }
            }
        }
        function minusCountDown(minus, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                var minusamt = parseInt(minus[1]);
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    if (isCountDownActive){
                        var remain = countDown - minusamt;
                        if (countDown >= (1 + T2)) {
                            if (remain <= T2){
                                postChatMessage("I'm sorry but I can not clear topics, please use the stop function the start topic 2 to begin next countdown");
                            }
                            else {
                                countDown = remain;
                                ModelMsg = poster + " has reduced the topic, which is now " + (countDown - T2);
                                postToModel(ModelMsg);
                                postCurrentCount();
                                showCurrentCountDown();
                            }
                        }
                        else if (countDown >= (1 + T3)) {
                            if (remain <= T3){
                                postChatMessage("I'm sorry but I can not clear topics, please use the stop function the start topic 3 to begin next countdown");
                            }
                            else {
                                countDown = remain;
                                ModelMsg = poster + " has reduced the topic, which is now " + (countDown - T3);
                                postToModel(ModelMsg);
                                postCurrentCount();
                                showCurrentCountDown();
                            }
                        }
                        else if (countDown >= (1 + T4)) {
                            if (remain <= T4){
                                postChatMessage("I'm sorry but I can not clear topics, please use the stop function the start topic 4 to begin next countdown");
                            }
                            else {
                                countDown = remain;
                                ModelMsg = poster + " has reduced the topic, which is now " + (countDown - T4);
                                postToModel(ModelMsg);
                                postCurrentCount();
                                showCurrentCountDown();
                            }
                        }
                        else if (countDown >= (1 + T5)) {
                            if (remain <= T5){
                                postChatMessage("I'm sorry but I can not clear topics, please use the stop function the start topic 5 to begin next countdown");
                            }
                            else {
                                countDown = remain;
                                ModelMsg = poster + " has reduced the topic, which is now " + (countDown - T5);
                                postToModel(ModelMsg);
                                postCurrentCount();
                                showCurrentCountDown();
                            }
                        }
                        else if (countDown >= 1) {
                            if (remain <= 0){
                                postChatMessage("I'm sorry but I can not clear topics, please use the stop function to cancel countdown");
                            }
                            else {
                                countDown = remain;
                                ModelMsg = poster + " has reduced the topic, which is now " + (countDown);
                                postToModel(ModelMsg);
                                postCurrentCount();
                                showCurrentCountDown();
                            }
                        }
                        else {
                            ModelMsg = poster + " i tried to reduce the count but something went wrong";
                            postCurrentCount();
                            showCurrentCountDown();
                        }
                    }
                    else {
                        postChatMessage(":hide sorry, " + poster + " no countdown is currently running");
                    }
                }
                else if (poster == "AnaliasCountr") {
                    postChatMessage("");
                }
                else {
                    postChatMessage(":mno I'm sorry " + poster + " you are not authorised to deduct from topic");
                    ParkMsg = poster + " tried to remove " + minusamt + " from topic";
                    postToPark(ParkMsg);
                }
            }
        }
        function plusCountDown(plus, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                var plusamt = parseInt(plus[1]);
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    if (isCountDownActive){
                        var range = countDown + plusamt;
                        if (countDown >= (1 + T2)){
                            if ((countDown + plusamt) >= (T1 + 1)){
                                postChatMessage("I'm sorry, that will take it over the original topic amount, reduce request by " + (T1 - range));
                            }
                            else {
                                countDown = range;
                                ModelMsg = poster + " has increased the topic, which is now " + (countDown - T2);
                                postToModel(ModelMsg);
                                postCurrentCount();
                                showCurrentCountDown();
                            }
                        }
                        else if (countDown >= (1 + T3)){
                            if ((countDown + plusamt) >= (T2 + 1)){
                                postChatMessage("I'm sorry, that will take it over the original topic amount, reduce request by " + (T2 - range));
                            }
                            else {
                                countDown = range;
                                ModelMsg = poster + " has increased the topic, which is now " + (countDown - T3);
                                postToModel(ModelMsg);
                                postCurrentCount();
                                showCurrentCountDown();
                            }
                        }
                        else if (countDown >= (1 + T4)){
                            if ((countDown + plusamt) >= (T3 + 1)){
                                postChatMessage("I'm sorry, that will take it over the original topic amount, reduce request by " + (T3 - range));
                            }
                            else {
                                countDown = range;
                                ModelMsg = poster + " has increased the topic, which is now " + (countDown - T4);
                                postToModel(ModelMsg);
                                postCurrentCount();
                                showCurrentCountDown();
                            }
                        }
                        else if (countDown >= (1 + T5)){
                            if ((countDown + plusamt) >= (T4 + 1)){
                                postChatMessage("I'm sorry, that will take it over the original topic amount, reduce request by " + (T4 - range));
                            }
                            else {
                                countDown = range;
                                ModelMsg = poster + " has increased the topic, which is now " + (countDown - T5);
                                postToModel(ModelMsg);
                                postCurrentCount();
                                showCurrentCountDown();
                            }
                        }
                        else if (countDown >= 1){
                            if ((countDown + plusamt) >= T5){
                                postChatMessage("I'm sorry, that will take it over the original topic amount, reduce request by " + (T5 - range));
                            }
                            else {
                                countDown = range;
                                ModelMsg = poster + " has increased the topic, which is now " + (countDown);
                                postToModel(ModelMsg);
                                postCurrentCount();
                                showCurrentCountDown();
                            }
                        }
                        else {
                            postChatMessage(poster + " i tried to increased the count but something went wrong");
                        }
                    }
                    else {
                        postChatMessage(":hide sorry, " + poster + " no countdown is currently running so I couldn't increase");
                    }
                }
                else if (poster == "AnaliasCountr") {
                    postChatMessage("");
                }
                else {
                    postChatMessage(":mno I'm sorry " + poster + " you are not authorised to increase the topic");
                    ParkMsg = poster + " tried to increase topic by " + plusamt;
                    postToPark(ParkMsg);
                }
            }
        }
        function StopTopic(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster === helper) || (poster == "TestCounter") || (poster == "HoleeeSheeet")) {
                    if (countDown >= (T2 + 1)) {
                        countDown = T2;
                        postCurrentCount();
                    }
                    else if (countDown >= (T3 + 1)) {
                        countDown = T3;
                        postCurrentCount();
                    }
                    else if (countDown >= (T4 + 1)) {
                        countDown = T4;
                        postCurrentCount();
                    }
                    else if (countDown >= (T5 + 1)) {
                        countDown = T5;
                        postCurrentCount();
                    }
                    else if (countDown >= 1) {
                        countDown = 0;
                        isCountDownActive = false;
                        autoPostActive = false;
                    }
                }
            }
        }

        //Requesting info from countr
        function assignHelper(helpAsgn, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                var control = helpAsgn[1];
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter")) {
                    if (isHelperAssigned) {
                        postChatMessage("helper is already assigned to " + helper + " please remove as helper before reassigning");
                    }
                    else {
                        if (control === banned) {
                            postChatMessage(control + " is banned from being helper, please choose someone else or contact Park to reset");
                            postChatMessage("/pm " + control + " I'm sorry but you are banned for requesting information you shouldn't");
                            ParkMsg = control + " tried to assign " + banned + " as helper but they are banned";
                            postToPark(ParkMsg);
                        }
                        else {
                            helper = control;
                            postChatMessage(helper + " has been successfully assigned as helper and can now control :countr");
                            isHelperAssigned = true;
                            helpers.push(helper);
                            ParkMsg = "helpers assigned so far today have been " + helpers;
                            postToPark(ParkMsg);
                        }
                    }
                }
                else {
                    postChatMessage("I'm sorry " + poster + " but you can not assign helpers");
                    ParkMsg = poster + " tried to assign helper as " + control;
                    postToPark(ParkMsg);
                }
            }
        }
        function postHighTip(msgSpan){
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet")) {
                    postChatMessage("/pm " + poster + " tip info as requested " + spanHighestTip.innerHTML);
                    ParkMsg = poster + " has requested highest tip information " + spanHighestTip.innerHTML;
                    postToPark(ParkMsg);
                }
                else if (poster === helper) {
                    postChatMessage("helper removed from countr");
                    postChatMessage("/pm " + helper + " this request is beyond your capabilities, the operator has been notified!");
                    ModelMsg = "helper tried to request information they shouldn't, as such has been removed as helper and banned for 24hrs";
                    postToModel(ModelMsg);
                    isHelperAssigned = false;
                    if (banned.indexOf(helper) == -1) {
                        banned.push(helper);}
                    ParkMsg = helper + " tried to request highest tip information";
                    postToPark(ParkMsg)
                }
                else {
                    postChatMessage(poster + " I'm sorry only the model can request this information");
                    ParkMsg = poster + " tried to add to request highest tipper information ";
                    postToPark(ParkMsg);
                }
            }
        }
        function postTopic(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            poster = nameSpan.innerHTML.replace(/:/, '');
            if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster === helper)) {
                if (isCountDownActive) {
                    if (topicVar2) {
                        if (countDown >= (1 + T2)) {
                            postChatMessage("Hi Guys! " + (countDown - T2) + "tk Nakkey, " + SpankSpec + " Spank/" + FlashSpec + " Flash, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + VidSgl + ", TY Guys")
                        }
                        else if (countDown >= (1 + T3)) {
                            postChatMessage("Hi Guys! " + (countDown - T3) + "tk "  + Show3 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + " vid " + VidSgl + ", TY Guys")
                        }
                        else if (countDown >= (1 + T4)) {
                            postChatMessage("Hi Guys! " + (countDown - T4) + "tk "  + Show4 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + " vid " + VidSgl + ", TY Guys")
                        }
                        else if (countDown >= (1 + T5)) {
                            postChatMessage("Hi Guys! " + (countDown - T5) + "tk "  + Show5 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + " vid "+ VidSgl + ", TY Guys")
                        }
                        else {
                            postChatMessage("Hi Guys! You Rock!, " + SpankSpec + " Spank, " + SnapSpec + "tk SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile)" + VarVid + " Vid " + VidSgl + ", TY Guys");
                        }
                    }
                    else {
                        if (countDown >= (1 + T2)) {
                            postChatMessage("Hi Guys! " + (countDown - T2) + "yk " + Show1 + " Off, " + SpankSpec + " Spank/" + FlashSpec + " Flash, " + SnapSpec + " SnapChat 4ever, " + VidAmt + "Vids " + VidDbl + "(choose from profile) " + VarVid + " vid " + VidSgl + ", TY Guys")
                        }
                        else if (countDown >= (1 + T3)) {
                            postChatMessage("Hi Guys! " + (countDown - T3) + "tk "  + Show2 + " Off, " + SpankSpec + " Spank/" + FlashSpec + " Flash, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + " vid " + VidSgl + ", TY Guys")
                        }
                        else if (countDown >= (1 + T4)) {
                            postChatMessage("Hi Guys! " + (countDown - T4) + "tk "  + Show3 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + "vid " + VidSgl + ", TY Guys")
                        }
                        else if (countDown >= (1 + T5)) {
                            postChatMessage("Hi Guys! " + (countDown - T5) + " "  + Show4 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + " vid " + VidSgl + ", TY Guys")
                        }
                        else if (countDown >= 1) {
                            postChatMessage("Hi Guys! " + countDown + "tk "  + Show5 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + " vid " + VidSgl + ", TY Guys")
                        }
                    }
                }
            }
        }
        function TopicX(posty) {
            if ((posty === currentModelName) || (posty == "Parkesy86") || (posty == "TestCounter") || (poster === helper)) {
                if (isCountDownActive) {
                    if (topicVar2) {
                        if (countDown >= (1 + T2)) {
                            postChatMessage("Hi Guys! " + (countDown - T2) + "yk Nakkey, " + SpankSpec + " Spank/" + FlashSpec + " Flash, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + " Vid " + VidSgl + ", TY Guys")
                        }
                        else if (countDown >= (1 + T3)) {
                            postChatMessage("Hi Guys! " + (countDown - T3) + "tk " + Show3 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile)" + VarVid + " Vid " + VidSgl + ", TY Guys")
                        }
                        else if (countDown >= (1 + T4)) {
                            postChatMessage("Hi Guys! " + (countDown - T4) + "tk " + Show4 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + VidSgl + ", TY Guys")
                        }
                        else if (countDown >= (1 + T5)) {
                            postChatMessage("Hi Guys! " + (countDown - T5) + "tk " + Show5 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + VidSgl + ", TY Guys")
                        }
                        else {
                            postChatMessage("Hi Guys! You Rock!, " + SpankSpec + " Spank, " + SnapSpec + "tk SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + VidSgl + ", TY Guys");
                        }
                    }
                    else {
                        if (countDown >= (1 + T2)) {
                            postChatMessage("Hi Guys! " + (countDown - T2) + "tk " + Show1 + " Off, " + SpankSpec + " Spank/" + FlashSpec + " Flash, " + SnapSpec + " SnapChat 4ever, " + VidAmt + " Vids " + VidDbl + "(choose from profile) " + VarVid + VidSgl + ", TY Guys");
                        }
                        else if (countDown >= (1 + T3)) {
                            postChatMessage("Hi Guys! " + (countDown - T3) + "tk " + Show2 + " Off, " + SpankSpec + " Spank/" + FlashSpec + " Flash, " + SnapSpec + " SnapChat 4ever, 2 Vids " + VidDbl + "(choose from profile) " + VarVid + VidSgl + ", TY Guys");
                        }
                        else if (countDown >= (1 + T4)) {
                            postChatMessage("Hi Guys! " + (countDown - T4) + "tk " + Show3 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, 2 Vids " + VidDbl + "(choose from profile) " + VarVid + VidSgl + ", TY Guys");
                        }
                        else if (countDown >= (1 + T5)) {
                            postChatMessage("Hi Guys! " + (countDown - T5) + "tk " + Show4 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, 2 Vids " + VidDbl + "(choose from profile) " + VarVid + VidSgl + ", TY Guys");
                        }
                        else if (countDown >= 1) {
                            postChatMessage("Hi Guys! " + countDown + "tk " + Show5 + " show, " + SpankSpec + " Spank, " + SnapSpec + " SnapChat 4ever, 2 Vids " + VidDbl + "(choose from profile) " + VarVid + VidSgl + ", TY Guys");
                        }
                    }
                }
            }
        }
        function checkHelper(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet")) {
                    if (isHelperAssigned) {
                        postChatMessage("helper is currently designated to " + helper);
                    }
                    else {
                        postChatMessage("Helper is not currently assigned");
                    }
                }
                else if (poster === helper) {
                    postChatMessage(helper + " you are currently designated as helper");
                }
                else {
                    postChatMessage("I'm sorry " + poster + " you are unable to see who the helper is");
                    ParkMsg = poster + " tried to see who was room helper ";
                    postToPark(ParkMsg);
                }
            }
        }
        function postCountrInfo(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    postChatMessage("/pm " + poster + " currently running countr which covers topics " + Topic1 + ", " + Topic2 + ", " + Topic3 + ", " + Topic4 + ", " + Topic5);
                    postChatMessage("/pm " + poster + " countr also includes the following games: " + gamearray.sort() + " if you want help type 'countr! help'");
                }
                else {
                    postChatMessage("I'm sorry " + poster + " you can not request countr infomation");
                    ParkMsg = poster + " tried to request countr information";
                    postToPark(ParkMsg);
                }
            }
        }
        function postHelp(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper)) {
                    postChatMessage("/pm " + poster + " for a full list of countr commands visit: http://www.dropbox.com/s/5bpw6kexul7q7zt/AnaliasCountr.docx?dl=0");
                    postChatMessage(":countrhelp");
                }
                else if (poster == "AnaliasCountr"){
                    postChatMessage("");
                }
                else {
                    postChatMessage("I'm sorry " + poster + " I can't help you :giggle3");
                    ParkMsg = poster + " tried to get countr help";
                    postToPark(ParkMsg);
                }
            }
        }

        //General countr operations
        function postCurrentCount() {
            //if there is a cooldown active, queue a post and leave
            if (null !== postCountTimeout) {
                postCountQueued = true;
                return;
            }
            //post the count to chat
            if (countDown >= (1+T2)){
                ModelMsg = (countDown - T2);
                postToModel(ModelMsg);
            }
            else if (countDown >= (1 + T3)) {
                ModelMsg = (countDown - T3);
                postToModel(ModelMsg);
            }
            else if (countDown >= (1 + T4)) {
                ModelMsg = (countDown - T);
                postToModel(ModelMsg);
            }
            else if (countDown >= (1 + T5)) {
                ModelMsg = (countDown - T5);
                postToModel(ModelMsg);
            }
            else if (countDown >= 1) {
                ModelMsg = countDown;
                postToModel(ModelMsg);
            }
            else {
                postChatMessage("/pm DreamOfAnalia  " + " no count running, use commands to start a new one :D");
            }
            postCountQueued = false;
            if (!autoPostActive)
                aPostCurrentCount.setAttribute('class', 'hidden');
            //start a cooldown
            postCountTimeout = setTimeout(function () {
                postCountTimeout = null;
                if (postCountQueued && isCountDownActive)
                    postCurrentCount();
                if (!autoPostActive)
                    aPostCurrentCount.setAttribute('class', 'show');
            }, 5000);
        }
        function toggleAutoPost() {
            if (!autoPostActive) {
                setElementText(aAutoPost, 'Disable AutoPost');
                //aPostCurrentCount.setAttribute('class', 'hidden');
                autoPostActive = true;
            }
            else {
                setElementText(aAutoPost, 'Enable AutoPost');
                //aPostCurrentCount.setAttribute('class', 'show');
                autoPostActive = false;
            }
        }
        function postChatMessage(msg) {
            if (killPosting)
                return;

            txtInput.value = msg;
            btnSend.click();
        }
        function showCurrentCountDown() {
            //maAlert("TestCounter: " + countDown + " tokens left on countdown.");
            setElementText(spanMenuCount, " (" + countDown + ")");
        }
        function maAlert(text) {
            clearTimeout(alertTimeout);
            setElementText(divAlert, text);
            showElement(divAlert);
            alertTimeout = setTimeout(function () {
                hideElement(divAlert);
            }, 5000);
        }
        function parseChatMessage() {
            parseQueue = parseQueue.concat(Array.prototype.slice.call(document.querySelectorAll("#chat_box span.chat"), 0));

            if (parsing)
                return;

            parsing = true;
            while (parseQueue.length > 0) {
                //get the last message
                var msg = parseQueue.pop();
                //if this has already been processed, leave
                if ("true" === msg.getAttribute('ma-processed'))
                    continue;
                // startregex?
                var start = msg.innerHTML.match(startRegex);
                if (start)
                    startVarCount(start, msg);
                //ManualSpin
                var Spin = msg.innerHTML.match(SpinRegex);
                if (Spin)
                    ManualSpinTheWheel(Spin, msg);
                //SpecialsRegex?
                var SVar = msg.innerHTML.match(SpecialRegex);
                if (SVar)
                    toggleSpecials(SVar, msg);
                //topicValRegex?
                var TVar = msg.innerHTML.match(topicValRegex);
                if (TVar)
                    toggleTopicVar(TVar, msg);
                //1st Hand Regex?
                var BlkJk1 = msg.innerHTML.match(BlkJk1Regex);
                if (BlkJk1)
                    play1stHand(BlkJk1, msg);
                //Alernate Hand?
                var BlkJk2 = msg.innerHTML.match(BlkJk2Regex);
                if (BlkJk2)
                    PlayAltHand(BlkJk2, msg);
                //StartGame?
                var gamePrize = msg.innerHTML.match(startGameRegex);
                if (gamePrize)
                    startGame(gamePrize, msg);
                //set game tips
                var gametip = msg.innerHTML.match(setGameTipRegex);
                if (gametip)
                    setGameTips(gametip, msg);
                //set game prizes
                var gamePrize = msg.innerHTML.match(setGamePrizeRegex);
                if (gamePrize)
                    setPrizes(gamePrize, msg);
                //Find BlackJack winner
                var winner = msg.innerHTML.match(BlackJackWinnerRegex);
                if (winner)
                    findBlackJackWinner(msg);
                //assignHelpRegex?
                var helpAsgn = msg.innerHTML.match(assignHelperRegex);
                if (helpAsgn)
                    assignHelper(helpAsgn, msg);
                //ShowRegex?
                var show = msg.innerHTML.match(ShowRegex);
                if (show)
                    assignShows(show, msg);
                //StopTopicRegex??
                var stptop = msg.innerHTML.match(StopTopicRegex);
                if (stptop)
                    StopTopic(msg);
                //countrRegex?
                var countrversion = msg.innerHTML.match(countrRegex);
                if (countrversion)
                    postCountrInfo(msg);
                //addgameRegex?
                var addgame = msg.innerHTML.match(addgameRegex);
                if (addgame)
                    handleGame(addgame, msg);
                //minusregex?
                var minus = msg.innerHTML.match(minusRegex);
                if (minus)
                    minusCountDown(minus, msg);
                //spamRegex
                var spam = msg.innerHTML.match(spamRegex);
                if (spam)
                    removeSpam(msg);
                //toggleGuessRegex?
                var newgame = msg.innerHTML.match(toggleGuessRegex);
                if (newgame)
                    clearGame(msg);
                //plusregex?
                var plus = msg.innerHTML.match(plusRegex);
                if (plus)
                    plusCountDown(plus, msg);
                //postregex?
                var post = msg.innerHTML.match(postRegex);
                if (post)
                    postTopic(msg);
                //helpregex?
                var helpme = msg.innerHTML.match(helpRegex);
                if (helpme)
                    postHelp(msg);
                //stopregex?
                var stp = msg.innerHTML.match(stopRegex);
                if (stp)
                    stopCount(msg);
                //gameRegex?
                var game = msg.innerHTML.match(gameRegex);
                if (game)
                    postGameValues(msg);
                //is this topic update?
                var topic = msg.innerHTML.match(lastRegex);
                if (topic)
                    updatedTopic(topic, msg);
                //getlastRegex
                var last = msg.innerHTML.match(getlastRegex);
                if (last)
                    postLastTopic(msg);
                //is this a tip?
                var tip = msg.innerHTML.match(tipRegex);
                if (tip)
                    handleTip(tip, msg);
                //playWarRegex?
                var play = msg.innerHTML.match(playWarRegex);
                if (play)
                    manualWar(msg, play);
                //removeHelperRegex?
                var helpRmv = msg.innerHTML.match(removeHelperRegex);
                if (helpRmv)
                    removeHelper(helpRmv, msg);
                //checkHelperRegex?
                var chkHelp = msg.innerHTML.match(checkHelperRegex);
                if (chkHelp)
                    checkHelper(msg);
                //two player war?
                var warForTwo = msg.innerHTML.match(playWar2Regex);
                if (warForTwo)
                    startWarForTwo(warForTwo, msg);
                //stopGamesRegex?
                var stpGames = msg.innerHTML.match(stopGamesRegex);
                if (stpGames)
                    stopAllGames(msg);
                //highTipRegex?
                var highTip = msg.innerHTML.match(highTipRegex);
                if (highTip)
                    postHighTip(msg);
                //addHighRegex?
                var addHighest = msg.innerHTML.match(addHighRegex);
                if (addHighest)
                    addHighTip(addHighest, msg);
                //bannedRemoveRegex?
                var banner = msg.innerHTML.match(bannedRemoveRegex);
                if (banner)
                    removeBanned(banner, msg);
                //addBannedRegex?
                var bana = msg.innerHTML.match(addBannedRegex);
                if (bana)
                    addBanned(bana, msg);
                //toggleNoRegex?
                var nah = msg.innerHTML.match(toggleNoRegex);
                if (nah)
                    toggleNo(nah, msg);
                //nooeRegex?
                var nada = msg.innerHTML.match(nopeRegex);
                if (nada)
                    postNope(msg);
                //check for kill switch msg
                var killMsg = msg.innerHTML.match(killRegex);
                if (killMsg)
                    handleKill(msg);

                //indicate we've processed this msg
                msg.setAttribute("ma-processed", "true");
            }
            parsing = false;
        }
        function toggleNo(nah, msgSpan) {
            var cmdr = nah[1];
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster === helper) || (poster == "TestCounter") || (poster == "HoleeeSheeet")) {
                    if (cmdr == "on") {
                        if (postNo) {
                            postChatMessage("I am already set to post :doano");
                        }
                        else {
                            postChatMessage("I will watch for them :mlooking");
                            postNo = true;
                        }
                    }
                    else if (cmdr == "off") {
                        if (postNo) {
                            postChatMessage("I'm not looking :covereyess");
                            postNo = false;
                        }
                        else {
                            postChatMessage(":hide was I supposed to be looking?");
                        }
                    }
                }
            }
        }
        function postNope(msgSpan) {
            if (postNo){
                var poster;
                //is the message from the model?
                var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
                if (nameSpan) {
                    poster = nameSpan.innerHTML.replace(/:/, '');
                    if (poster === currentModelName) {}
                    else {
                        postChatMessage(":doano " + poster);
                    }
                }
            }
            else{}
        }
        function addBanned(bana, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            var banee = bana[1];
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if (poster == "Parkesy86") {
                    if (banned.indexOf(banee) == -1) {
                        banned.push(banee);
                        postChatMessage(banee + " successfully add to countr banlist and will unable to be room helper");
                        ParkMsg = banee + " has been banned from countr";
                        postToPark(ParkMsg);
                    }
                    else {
                        postChatMessage(banee + " already appears to be on countrs ban list");
                        ParkMsg = banee + " is already banned from countr";
                    }
                }
                else if (poster === "DreamOfAnalia"){
                    if (banned.indexOf(banee) == -1) {
                        banned.push(banee);
                        postChatMessage(banee + " successfully add to countr banlist and the room");
                        postChatMessage("/ban " + banee);
                        ParkMsg = banee + " has been banned from countr";
                        postToPark(ParkMsg);
                    }
                    else {
                        postChatMessage(banee + " already appears to be on countrs ban list");
                        ParkMsg = banee + " is already banned from countr";
                        postToPark(ParkMsg);
                    }
                }
                else {
                    postChatMessage(poster + "I'm sorry but you can't ban people, nice try though");
                }
            }
        }
        function removeBanned(banner, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            var banee = banner[1];
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if (poster == "Parkesy86") {
                    var a = banned.indexOf(banee);
                    if (0 > a) {
                        postChatMessage("I'm sorry but " + banee + " is not on my ban list, check PM for ban list");
                        ParkMsg = (banned.sort());
                        postToPark(ParkMsg);
                    }
                    else {
                        banned = [];
                        postChatMessage("Success " + banee + " has been removed from the countr ban list and can be assigned as a helper");
                        ParkMsg = banned + " is the new list of banned people";
                        postToPark(ParkMsg);
                    }
                }
                else if (poster == "DreamOfAnalia") {
                    postChatMessage("I'm sorry " + poster + " you can't remove people from countr's ban list");
                    ParkMsg = poster + " has tried to remove " + banee + " from the ban list";
                    postToPark(ParkMsg);
                }
                if (banned.indexOf(poster) >= 0) {
                    postChatMessage(poster + " you were banned for trying to gain information you shouldn't and are now trying to do it again!");
                    ParkMsg = banned + " has tried to remove themselves from the ban list";
                    postToPark(ParkMsg);
                }
                else if (poster === helper) {
                    postChatMessage("/pm " + helper + " this request is beyond your capabilities, the operator has been notified!");
                    postChatMessage("helper tried to request information they shouldn't, as such has been removed as helper and banned for 24hrs");
                    isHelperAssigned = false;
                    if (banned.indexOf(poster) == -1) {
                        banned.push(poster)
                    }
                    ParkMsg = poster + " tried to unban " + banee;
                    postToPark(ParkMsg);
                }
            }
        }
        function addHighTip(addHighest, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                var amount = parseInt(addHighest[2]);
                var contributor = addHighest[1];
                poster = nameSpan.innerHTML;
                if ((poster == "PM from DreamOfAnalia") || (poster == "PM from Parkesy86") || (poster == "PM from TestCounter")) {
                    postChatMessage(poster + " highest tipper has been updated");
                    addContributor(contributor, amount);
                    ParkMsg = poster + " has added " + contributor + " to highest tip with " + amount;
                    postToPark(ParkMsg);
                    if (amount > highestTip) {
                        highestTip = amount;
                        setElementText(spanHighestTip, contributor + " (" + highestTip + ")");
                    }
                }
                else if (poster == ("PM from " + helper)) {
                    if (banned.indexOf(helper) == -1) {
                        banned.push(helper);}
                    postChatMessage("helper removed from countr");
                    postChatMessage("/pm " + helper + " this request is beyond your capabilities, the operator has been notified!");
                    postChatMessage("/pm DreamOfAnalia helper tried to request information they shouldn't, as such has been removed as helper and banned for 24hrs");
                    isHelperAssigned = false;
                    ParkMsg = helper + " tried to add highest tip information";
                    postToPark(ParkMsg)
                }
                else {
                    postChatMessage(poster + " I'm sorry only the model can update from ninja's");
                    ParkMsg = poster + " tried to add to highest tip with " + amount + ", " + contributor;
                    postToPark(ParkMsg);
                }
            }
        }
        function postToPark(ParkMsg) {
            postChatMessage("/pm parkesy86 " + ParkMsg)
        }
        function postToModel(ModelMsg) {
            postChatMessage("/pm " + currentModelName + " ," + ModelMsg);
        }
        function removeHelper(helpRmv, msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                var removeVal = helpRmv[1];
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter")) {
                    if (isHelperAssigned) {
                        if (removeVal === helper) {
                            isHelperAssigned = false;
                            helper = [];
                            postChatMessage("helper has been removed and can no longer control :countr");
                        }
                        else {
                            postChatMessage(removeVal + " is not designated as helper, " + helper + " is designated as helper");
                        }
                    }
                    else {
                        postChatMessage("helper is not assigned");
                    }
                }
                else if (poster === helper) {
                    postChatMessage("I'm sorry " + helper + " you can not remove yourself as helper");
                }
                else {
                    postChatMessage("I'm sorry " + poster + " you can not remove helpers");
                    ParkMsg = poster + " tried to remove " + removeVal + " from helper, helper is actually " + helper;
                    postToPark(ParkMsg);
                }
            }
        }
        function removeSpam(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = ((msgSpan.parentNode.querySelector('a span.name_model')) || (msgSpan.parentNode.querySelector('a span.name_premium')));
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if ((poster === currentModelName) || (poster == "Parkesy86") || (poster == "TestCounter") || (poster == "HoleeeSheeet") || (poster === helper) || (poster == "AnaliasPrince") || (poster == "AnaliasWes") || (poster == "AnaliasPony") || (poster == "")) {
                    postChatMessage("/pm " + poster + " removing spam as requested ");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(".");
                    postChatMessage(":nocrude");
                }
            }
        }
        function handleKill(msgSpan) {
            var poster;
            //is the message from the model?
            var nameSpan = msgSpan.parentNode.querySelector('a span.name_model') || msgSpan.parentNode.querySelector('a span.name_premium');
            if (nameSpan) {
                poster = nameSpan.innerHTML.replace(/:/, '');
                if (currentModelName === poster) {
                    killPosting = true;
                    localStorage['mfca_killposting_' + currentModelName] = 'true';
                }
            }
        }
        function startCountDown() {
            if (isCountDownActive) {
                if (!confirm("You already have a countdown running.  Override?")) {
                    return;
                }
            }
            var newCountDown = prompt("countdown calculated using 'Topic1-5' in the script", T1);
            if (null === newCountDown) {
                return; //canceled out
            }
            if (NaN !== parseInt(newCountDown)) {
                countDown = newCountDown;
                isCountDownActive = true;
                showCurrentCountDown();
                postCurrentCount();
                aAutoPost.setAttribute('class', 'show');
                aPostCurrentCount.setAttribute('class', 'show');
            }
        }
        var postCountQueued = false;

        //Handling tips & countsdowns
        function handleTip(tip, tipSpan) {
            if (tipSpan.getAttribute('class').indexOf('chat_system') === -1) return;
            //parse the values
            var amount = parseInt(tip[2]);
            var contributor = tip[1];
            //calculate countdown values if needed
            if (isGameActive) {
                if (isGuessActive) {
                    if (amount === chance) {
                        postChatMessage(":uhuh we have a winner " + contributor);
                        postChatMessage("/pm DreamOfAnalia  " + contributor + " has won the guessing game with the value " + amount);
                        adjustCountDown(amount, contributor);
                        chance = 0;
                        chanceGuessed = [];
                        guessPrizeAssigned = false;
                        ParkMsg = "winner of chance was " + contributor;
                        postToPark(ParkMsg);
                        if(isCountDownActive) {
                            adjustCountDown(amount);
                        }
                    }
                    else {
                        if (chanceGuessed.indexOf(amount) == -1) {
                            chanceGuessed.push(amount);
                        }
                        if (isCountDownActive) {
                            adjustCountDown(amount);
                        }
                    }
                }
                if (amount === WarTip) {
                    if (isWarActive) {
                        postChatMessage("shuffling deck, please wait....... :deckshuffle ");
                        postCountTimeout = setTimeout(function () {
                            postCountTimeout = null;
                            playWar(contributor);
                        }, 10000);
                    }
                    if (isCountDownActive) {
                        adjustCountDown(amount);
                    }
                }
                if (amount === BlackJackTip) {
                }
                if (amount === SpinTip) {
                    SpinTheWheel(contributor);
                    if(isCountDownActive) {
                        adjustCountDown(amount);
                    }
                }
            }
            else if (isCountDownActive) {
                if (amount === SpankSpec) {
                    adjustTopicSpecials(amount, contributor);
                }
                else if (amount === FlashSpec) {
                    adjustTopicSpecials(amount, contributor);
                }
                else if (amount === SnapSpec) {
                    adjustTopicSpecials(amount, contributor);
                }
                else if (amount === VidSgl) {
                    adjustTopicSpecials(amount, contributor);
                }
                else if (amount === VidDbl) {
                    adjustTopicSpecials(amount, contributor);
                }
                else if (amount === Vid1) {
                    adjustVideoSpecials(amount, contributor);
                }
                else if (amount === Vid2) {
                    adjustVideoSpecials(amount, contributor);
                }
                else if (amount === Vid3) {
                    adjustVideoSpecials(amount, contributor);
                }
                else if (amount === Vid4) {
                    adjustVideoSpecials(amount, contributor);
                }
                else if (amount === Vid5) {
                    adjustVideoSpecials(amount, contributor);
                }
                else if (amount === Vid6) {
                    adjustVideoSpecials(amount, contributor);
                }
                else if (amount === Vid7) {
                    adjustVideoSpecials(amount, contributor);
                }
                else if (amount === Vid8) {
                    adjustVideoSpecials(amount, contributor);
                }
                else {
                    adjustCountDown(amount);
                }
            }
            //add stats
            if (amount > highestTip) {
                highestTip = amount;
                setElementText(spanHighestTip, contributor + " (" + highestTip + ")");
            }
            addContributor(contributor, amount);
            setElementText(spanTopContrib, contributors[0].contributor + " (" + contributors[0].amount + ")");
            //modify the tip span so we can visually see it was processed
            tipSpan.setAttribute('class', 'processed');
        }
        function adjustTopicSpecials(amount, contributor) {
            if (amount === SpankSpec) {
                postChatMessage("/pm DreamOfAnalia  a da o palma pentru " + contributor);
                postChatMessage(":doaspank1 " + contributor);
            }
            else if (amount === VidDbl) {
                postChatMessage("/pm DreamOfAnalia vid sale for " + contributor);
                postChatMessage(":cclap " + contributor);
            }
            else if (amount === VidSgl) {
                postChatMessage("/pm DreamOfAnalia g/g vid for " + contributor);
                postChatMessage(":cclap " + contributor);
            }
            else if (amount === VidTrp) {
                postChatMessage("/pm DreamOfAnalia vid sale 2 for " + contributor);
            }
            else if (amount === FlashSpec) {
                postChatMessage("/pm DreamOfAnalia expune pentru " + contributor);
                postChatMessage(":lppa " + contributor);
                adjustCountDown(amount);
            }
            else if (amount === SnapSpec) {
                postChatMessage("/pm DreamOfAnalia SnapChat prentru " + contributor);
            }
        }
        function adjustVideoSpecials(amount, contributor) {
            if (amount === Vid1) {
                postChatMessage("/pm DreamOfAnalia " + contributor + " a trimis pentru film #1 or #2 or #3");
                postChatMessage(":cclap " + contributor);
            }
            else if (amount === Vid2) {
                postChatMessage("/pm DreamOfAnalia " + contributor + " a trimis pentru film #4");
                postChatMessage(":cclap " + contributor);
            }
            else if (amount === Vid3) {
                postChatMessage("/pm DreamOfAnalia " + contributor + " a trimis pentru film #7");
                postChatMessage(":cclap " + contributor);
            }
            else if (amount === Vid4) {
                postChatMessage("/pm DreamOfAnalia " + contributor + " a trimis pentru film #8");
                postChatMessage(":cclap " + contributor);
            }
            else if (amount === Vid5) {
                postChatMessage("/pm DreamOfAnalia " + contributor + " a trimis pentru films #5 or #9 or #10");
                postChatMessage(":cclap " + contributor);
            }
            else if (amount === Vid6) {
                postChatMessage("/pm DreamOfAnalia " + contributor + " a trimis pentru film #11");
                postChatMessage(":cclap " + contributor);
            }
            else if (amount === Vid7) {
                postChatMessage("/pm DreamOfAnalia " + contributor + " a trimis pentru film #12");
                postChatMessage(":cclap " + contributor);
            }
            else if (amount === Vid8) {
                postChatMessage("/pm DreamOfAnalia " + contributor + " a trimis pentru film #6");
                postChatMessage(":cclap " + contributor);
            }
        }
        function adjustCountDown(amount) {
            if (countDown >= T1) {
                updateCountDown1(amount)
            }
            else if (countDown >= T2) {
                updateCountDown2(amount)
            }
            else if (countDown >= T3) {
                updateCountDown3(amount)
            }
            else if (countDown >= T4) {
                updateCountDown3(amount)
            }
            else if (countDown >= T5) {
                updateCountDown4(amount)
            }
            else {
                updateCountDown5(amount)
            }
        }
        function updateCountDown1(amount) {
            countDown = countDown - amount;
            if ((countDown - T2) <= 0) {
                maAlert("Topic 1 Complete!");
                countDown = T2;
                isCountDownActive = true;
                ModelMsg = "urmatoral topic: " + Topic2;
                postToModel(ModelMsg);
                postCurrentCount();
                postChatMessage(TwitMsg);
                postChatMessage(VidMsg);
                autoPostActive = true;
            }
            else {
                showCurrentCountDown();
                //post the count if auto post is active
                if (autoPostActive)
                    postCurrentCount();
            }
        }
        function updateCountDown2(amount) {
            countDown = countDown - amount;
            if ((countDown - T3) <= 0) {
                maAlert("Topic 2 Complete!");
                countDown = T3;
                isCountDownActive = true;
                ModelMsg = "urmatoral topic: " + Topic3;
                postToModel(ModelMsg);
                postCurrentCount();
                postChatMessage(TwitMsg);
                postChatMessage(VidMsg);
                autoPostActive = true;
            }
            else {
                showCurrentCountDown();
                //post the count if auto post is active
                if (autoPostActive)
                    postCurrentCount();
            }
        }
        function updateCountDown3(amount) {
            countDown = countDown - amount;
            if ((countDown - T4) <= 0){
                maAlert("Topic 3 Complete!");
                countDown = T4;
                isCountDownActive = true;
                ModelMsg = "urmatoral topic: " + Topic2;
                postToModel(ModelMsg);
                postCurrentCount();
                postChatMessage(TwitMsg);
                postChatMessage(VidMsg);
                autoPostActive = true;
            }
            else {
                showCurrentCountDown();
                //post the count if auto post is active
                if (autoPostActive)
                    postCurrentCount();
            }
        }
        function updateCountDown4(amount) {
            countDown = countDown - amount;
            if ((countDown - T5) <= 0) {
                maAlert("Topic 4 Complete!");
                countDown = T5;
                isCountDownActive = true;
                ModelMsg = "urmatoral topic: " + Topic2;
                postToModel(ModelMsg);
                postCurrentCount();
                postChatMessage(TwitMsg);
                postChatMessage(VidMsg);
                autoPostActive = true;
            }
            else {
                showCurrentCountDown();
                //post the count if auto post is active
                if (autoPostActive)
                    postCurrentCount();
            }
        }
        function updateCountDown5(amount) {
            countDown = countDown - amount;
            if (countDown <= 0) {
                maAlert("Topic 5 Complete!");
                countDown = 0;
                isCountDownActive = true;
                ModelMsg = "urmatoral topic: 0";
                postToModel(ModelMsg);
                postCurrentCount();
                postChatMessage(TwitMsg);
                postChatMessage(VidMsg);
                autoPostActive = false;
                window.close();
            }
            else {
                showCurrentCountDown();
                //post the count if auto post is active
                if (autoPostActive)
                    postCurrentCount();
            }
        }
        function addContributor(contributor, amount) {
            var bFound = false;
            for (var i = 0; i < contributors.length; i++) {
                if (contributors[i].contributor === contributor) {
                    contributors[i].amount += amount;
                    bFound = true;
                }
            }
            if (!bFound) {
                contributors.push({ contributor: contributor, amount: amount });
            }
            contributors.sort(function (a, b) { return b.amount - a.amount; });
        }
        function modelChanged(modelId) {
            setupHTML();
            //make sure we entered a models room (and not a lounge or the homepage)
            if (undefined !== unsafeWindow.t.g_hLoungeIds[modelId] || null == modelId) {
                document.querySelector('#ma-menu').setAttribute('class', 'hidden');
                return;
            }
            currentModelName = unsafeWindow.t.g_hUsers[modelId]["username"];
            document.querySelector('#ma-menu').setAttribute('class', 'show');
            tipRegex = "(.[^:]+) has tipped $$model$$ (.*) tokens.".replace("$$model$$", currentModelName);
            killRegex = "^the soap is a lye$";
            //simple topic controls
            minusRegex = /minus! (.*)/i;
            plusRegex = /plus! (.*)/i;
            postRegex = /topic! please/i;
            startRegex = /start! topic ([1-5])/i;
            helpRegex = /countr! help/i;
            stopRegex = /countr! stop/i;
            lastRegex = /Topic: (.[^:]+) TY Guys/i;
            countrRegex = /which version!/i;
            getlastRegex = /my topic!/i;
            ShowRegex = /Show! (.[^:]+) for (.*)/i;
            topicValRegex = /Set! T1 (.*)/i;
            SpecialRegex = /adjust (spank|flash|vidsgl|viddbl|snap|vidtrp|vidamt|varvid) (.*)/i;
            highTipRegex = /highest! tip?/i;
            StopTopicRegex = /next! topic/i;
            //GameRegex
            gameRegex = /game! is/i;
            stopGamesRegex = /stop all!/i;
            startGameRegex = /(start|stop) (war|guess|blackjack|spin)!/i;
            setGameTipRegex = /set (war|blackjack|spin)(.*) tip!/i;
            setGamePrizeRegex = /(war|guess|blackjack|spin) prize is (.[^:]+) x/i;
            //Guessing Game
            toggleGuessRegex = /clear guess! game/i;
            addgameRegex = /add (.*) to numbers!/i;
            //BlackJack Game
            BlackJackWinnerRegex = /BlackJack winner is!/i;
            BlkJk1Regex = /blackjack for (.[^:]+) x/i;
            BlkJk2Regex = /draw! 1/i;
            //Spin The Wheel Game
            SpinRegex = /Spin for (.[^:]+) x/i;
            //War Game
            playWar2Regex = /war! for two (.[^:]+) vs (.[^:]+)/i;
            playWarRegex = /play war! (.[^:]+) me/i;
            //Advanced Countr commands
            assignHelperRegex = /helper is (.[^:]+) please/i;
            removeHelperRegex = /remove (.[^:]+) from helper/i;
            checkHelperRegex = /!who is helper!/i;
            addHighRegex = /(.[^:]+) with (.*) highest tip/i;
            bannedRemoveRegex = /remove! (.[^:]+) from ban list/i;
            addBannedRegex = /add (.[^:]+) to countr! ban/i;
            toggleNoRegex = /no command (on|off)/i;
            spamRegex = /!spam!/i;
            //Lookout through chat
            nopeRegex = /(babe[ !?"':,]|baby[ !?"':,]| bb[ !?"':,]|anal[ !?"':,]|skype[ !?"':,]|group[ !?"':,]|mmmmm[ !?"':,])/i;
            //set prizes
            BlackJackPrize = [];
            WarPrize = [];
            GuessPrize = [];
            SpinPrize = [];
            //set game values
            SpinTip = 0;
            BlackJackTip = 0;
            WarTip = 0;
            chance = 0;
            //set assigned values
            SpinPrizeAssigned = false;
            BlackJackPrizeAssigned = false;
            WarPrizeAssigned = false;
            GuessPrizeAssigned = false;
            //set game activation status
            isSpinActive = false;
            isWarActive = false;
            isGuessActive = false;
            isBlackJackActive = false;
            //set blackjack dealer and hand info
            DealerSet = false;
            DealerHand = '';
            DealerHand2 = '';
            PlayerHand = '';
            PlayerHand2 = '';
            BlkJkRd1 = false;
            BlkJkRd2 = false;
            //assign guess game
            chanceGuessed = [];
            //Set Editable variables
            VidDbl = 555;
            SpankSpec = 99;
            VidSgl = 500;
            SnapSpec = 1717;
            FlashSpec = 100;
            Show1 = " Bra ";
            Show2 = " Panties ";
            Show3 = " Ice ";
            Show4 = " Oil ";
            Show5 = " Cream ";
            VidTrp = 0;
            VidAmt = 2;
            VarVid = "G/G";
            Vid1 = 0;
            Vid2 = 0;
            Vid3 = 0;
            Vid4 = 0;
            Vid5 = 0;
            Vid6 = 0;
            Vid7 = 0;
            Vid8 = 0;
            topicVar2 = false;
            postNo = false;
            banned = [];
            helpers = [];
            countDown = 0;
            helper = [];
            isCountDownActive = false;
            highestTip = 0;
            parsing = false;
            parseQueue = [];
            setElementText(spanHighestTip, 0);
            setElementText(spanTopContrib, 'none');
            setElementText(spanCurrentModel, currentModelName);
            setElementText(spanMenuCount, "");
            contributors = [];
            txtInput = document.querySelector('#message_input');
            btnSend = document.querySelector('#send_button');
            clearTimeout(postCountTimeout);
            autoPostActive = false;
            setElementText(aAutoPost, 'Enable AutoPost');
            aAutoPost.setAttribute('class', 'hidden');
            aPostCurrentCount.setAttribute('class', 'hidden');
            killPosting = localStorage['mfca_killposting_' + currentModelName] === 'true' ? true : false;
            //setup the parser
            document.querySelector('#chat_box').addEventListener('DOMNodeInserted', parseChatMessage);
        }
        function setElementText(e, text) {
            e.innerHTML = text;
        }
        function showElement(e, style) {
            e.style.display = style ? style : 'inline';
        }
        function hideElement(e) {
            e.style.display = 'none';
        }
        function formatCurrency(num) {
            num = isNaN(num) || num === '' || num === null ? 0.00 : num;
            return parseFloat(num).toFixed(2);
        }
        function toggleSound() {
            var soundEnabled = localStorage['mfca_soundEnabled'] ? localStorage['mfca_soundEnabled'] : 'disabled';
            if ('disabled' === soundEnabled) {
                document.querySelector('#soundToggleText').innerHTML = 'Disable Sounds';
                soundDiv.setAttribute('class', 'show');
                localStorage['mfca_soundEnabled'] = 'enabled';
            } else {
                document.querySelector('#soundToggleText').innerHTML = 'Enable Sounds';
                soundDiv.setAttribute('class', 'hidden');
                localStorage['mfca_soundEnabled'] = 'disabled';
            }
        }
        function configFriendSound(e) {
            var element = e.srcElement ? e.srcElement : e.target;
            localStorage['mfca_friendSound'] = element.value;
        }
        return {
            init: init
        }
    })();
    MAssist.init();
}
//set up the audio file
if (0 === window.location.href.indexOf('http://www.myfreecams.com/mfc2/static/top.html')) {
    //these are the sounds in base64
    var mfcTip = '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';
    var mfcFriendLogin = 'T2dnUwACAAAAAAAAAADSXgAAAAAAACoqjl0BHgF2b3JiaXMAAAAAAkSsAAAAAAAAgDgBAAAAAAC4AU9nZ1MAAAAAAAAAAAAA0l4AAAEAAACtBiCYD0T/////////////////qQN2b3JiaXM0AAAAQU87IGFvVHVWIFsyMDExMDIyN10gKGJhc2VkIG9uIFhpcGguT3JnJ3MgbGliVm9yYmlzKQAAAAABBXZvcmJpcyFCQ1YBAAABABhjVClGmVLSSokZc5QxRplikkqJpYQWQkidcxRTqTnXnGusubUghBAaU1ApBZlSjlJpGWOQKQWZUhBLSSV0EjonnWMQW0nB1phri0G2HIQNmlJMKcSUUopCCBlTjCnFlFJKQgcldA465hxTjkooQbicc6u1lpZji6l0kkrnJGRMQkgphZJKB6VTTkJINZbWUikdc1JSakHoIIQQQrYghA2C0JBVAAABAMBAEBqyCgBQAAAQiqEYigKEhqwCADIAAASgKI7iKI4jOZJjSRYQGrIKAAACABAAAMBwFEmRFMmxJEvSLEvTRFFVfdU2VVX2dV3XdV3XdSA0ZBUAAAEAQEinmaUaIMIMZBgIDVkFACAAAABGKMIQA0JDVgEAAAEAAGIoOYgmtOZ8c46DZjloKsXmdHAi1eZJbirm5pxzzjknm3PGOOecc4pyZjFoJrTmnHMSg2YpaCa05pxznsTmQWuqtOacc8Y5p4NxRhjnnHOatOZBajbW5pxzFrSmOWouxeaccyLl5kltLtXmnHPOOeecc84555xzqhenc3BOOOecc6L25lpuQhfnnHM+Gad7c0I455xzzjnnnHPOOeecc4LQkFUAABAAAEEYNoZxpyBIn6OBGEWIacikB92jwyRoDHIKqUejo5FS6iCUVMZJKZ0gNGQVAAAIAAAhhBRSSCGFFFJIIYUUUoghhhhiyCmnnIIKKqmkoooyyiyzzDLLLLPMMuuws8467DDEEEMMrbQSS0211VhjrbnnnGsO0lpprbXWSimllFJKKQgNWQUAgAAAEAgZZJBBRiGFFFKIIaaccsopqKACQkNWAQCAAAACAAAAPMlzREd0REd0REd0REd0RMdzPEeUREmUREm0TMvUTE8VVdWVXVvWZd32bWEXdt33dd/3dePXhWFZlmVZlmVZlmVZlmVZlmVZgtCQVQAACAAAgBBCCCGFFFJIIaUYY8wx56CTUEIgNGQVAAAIACAAAADAURzFcSRHciTJkixJkzRLszzN0zxN9ERRFE3TVEVXdEXdtEXZlE3XdE3ZdFVZtV1Ztm3Z1m1flm3f933f933f933f933f93UdCA1ZBQBIAADoSI6kSIqkSI7jOJIkAaEhqwAAGQAAAQAoiqM4juNIkiRJlqRJnuVZomZqpmd6qqgCoSGrAABAAAABAAAAAAAomuIppuIpouI5oiNKomVaoqZqriibsuu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6LhAasgoAkAAA0JEcyZEcSZEUSZEcyQFCQ1YBADIAAAIAcAzHkBTJsSxL0zzN0zxN9ERP9ExPFV3RBUJDVgEAgAAAAgAAAAAAMCTDUixHczRJlFRLtVRNtVRLFVVPVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVNU3TNE0gNGQlABAFAEA5bLHm3hthmHIUc2mMU45qUJFCylkNKkIKMYm9VcwxJzHHzjHmpOWcMYQYtJo7pxRzkgKhISsEgNAMAIfjAJJmAZKlAQAAAAAAAICkaYDmeYDmeQAAAAAAAAAgaRqgeR6geR4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI6mAZrnAZrnAQAAAAAAAIDmeYAnmoAnigAAAAAAAABgeR7giR7giSIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI6mAZrnAZonAgAAAAAAAIDleYBnioDniQAAAAAAAACgeR7giSLgiSIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIAABwCAAAuh0JAVAUCcAIBDcSwJAAAcx7EsAABwHMmyAADAsizPAwAAy7I8DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAADAgAMAQIAJZaDQkJUAQBQAgEExNA3IsmUBl2UBNA2gaQBPBHgeQDUBgAAAgAIHAIAAGzQlFgcoNGQlABAFAGBQFEuyLM+DpmmaKELTNE0UoWmeZ5rQNM8zTYii55kmPM/zTBOmKYqqCkRRVQUAABQ4AAAE2KApsThAoSErAYCQAACDo1iWpnme54miaaoqNM3zRFEUTdM0VRWa5nmiKIqmaZqqCk3zPFEURdNUVVWFpnmeKIqiaaqqq8LzRFE0TdM0VdV14XmiaIqmaZqq6roQRVE0TdNUVdd1XSCKpmmaquq6rgtE0TRNVVVdV5aBKJqmaaqq68oyME3TVFXXdV1ZBpimqrqu68oyQFVd13VlWZYBqqqqrivLsgxwXdd1XVm2bQCu67qybNsCAAAOHAAAAoygk4wqi7DRhAsPQKEhKwKAKAAAwBimFFPKMCYhpBAaxiSEFEIlJaWUSqkgpFJSKRWEVFIqJaOSUmopZRBSKSmVCkIppZVUAADYgQMA2IGFUGjISgAgDwCAIEQpxhhzTkqpFGPOOSelVIox55yTUjLGmHPOSSkZY8w556SUjDnnnHNSSsacc845KaVzzjnnnJRSSuecc05KKSWEzjknpZTSOeecEwAAVOAAABBgo8jmBCNBhYasBABSAQAMjmNZmqZpnmeKmmRpmud5niiapiZJmuZ5nieKpsnzPE8URdE0VZPneZ4oiqJpqirXFUXRNE1VVVWyLIqiaJqqqqowTdNUVVd1XZimKaqqq8ouZNk0VdV1ZRm2bZqq6rqyDFRXVV3XloGrqqps2rIAAPAEBwCgAhtWRzgpGgssNGQlAJABAEAQgpBSCiGlFEJKKYSUUggJAAAYcAAACDChDBQashIASAUAAAyRUkoppZTSOCWllFJKKaVxTEoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKQUALlU4AOg+2LA6wknRWGChISsBgFQAAMAYhRiDUEprFUKMOSelpdYqhBhzTkpKreWMOQchpdZiy51zDEIprcXYU+mclJRai7GnFDoqKbUWW++9pJJaay3G3nsKKdTWWoy991ZTay3GGnvvObYSS6wx9t57j7XF2GLsvfceW0u15VgAAGaDAwBEgg2rI5wUjQUWGrISAAgJACCMUUopxpxzzjnnpJSMMeYchBBCCKGUkjHHnIMQQgghlFIy5pyDEEIIJYRSSsacgw5CCCWEUlLqnHMQQgihhFBKKZ1zDkIIIYRQSkqpcxBCCCGEEEopJaXUOQghlBBCCCmllEIIIYQQQgghlZJSCCGEEEIopZRUUgohhBBCCKWEUlJKKYUQSgghhFBSSimlUkoJIYQQSkoppRRKCCGUEEJKKaWUSgkhhBBKSKmklFJJIYQQQggFAAAcOAAABBhBJxlVFmGjCRcegEJDVgIAUQAAEIISQkktAkgpJq2GSDknrdYSOaQcxRoippSTlkIGmVJMSgktdIxJSym2EjpIqeYcUwgpAAAAggCAABNAYICg4AshIMYAAAQhMkMkFFbBAoMyaHCYBwAPEBESAUBigiLt4gKzDHBBF3cdCCEIQQgqbwAFJODghBueeMMTbmQSTVEYAwEAAAAAYACABwAAhAKIiGjmKiwuMDI0Njg6PD5ABAAAAACACwA+AACQECAiopmrsLjAyNDY4Ojw+AAJAAAEEAAAAAAAAQQgICAAAAAAABAAAAAgIE9nZ1MAAMBLAAAAAAAA0l4AAAIAAABSCXr4GCahnM9yXUX/Fc3O0tfN29jTz9HCzdHRyaTU1wQn9dwXpZhBB5RylNhHyRIDSljCf/fhjMgiSPq3LvZ9fUkA+qn9339HGRAgKAQi/0/t//47ykAECApCfggJKSSKkBRSjD4MIVDClxL+mBKjRCElXEoI6nZmo8SElBAJSqiEB+Ao0RHOKgslHJIBBPg+NlsBwyX2gSHAJYJNUMIBeyf9S+kSEcmiVPvTlwwGGfngpIQyQkqDhFVP2OZmlqxArb98l1xK+r37bGAfCgFwCrvdAJjgUQKBD9fYpEPBCgAxcAD+qf3ff7sMCEABv0/t//7bZUAAGvhoVhktCyn+xwAUHuojbnHzrYePQvjuYYnoIzdJAtKvxKCEo0Sfl0uC2JCfjjnSudttIeHklei4TOMQH4YSIf0uES4pEM/RxpA2m+kjS4FwnyQm0+8IEEa/HUAG1ng26B7EnIUdVyac6hpei/Ec5AjRWDQpiPi+LYAIemBVdpyoURAjqQEaAAH2qf3nn0kGBKiKSeT/qf2fv10mJGCAl98R0pCoQFEhxNFwCABIcljfDIezsxFuN//TTS+4iU/7s8PZ7MX+XEfHZ27btu1Dx5fmd7p5cmhbS2nSl6acbjnhf3kkBPs7vXuX9P47JHmsD8PwwfqQJBBCJEm6ZZRMSkVfQmYeknRTxYvx37mtf5JUKScJwOeCGYyK6tCXAE7WZJn+/3kPcIkB6k9rjEsEQdBLCbEYDz2sCiUqdAUaBV9IlG0HLIZx6HdvK2p1gNkBkNzn7gAYACik0ty2pTQ07g5oxxzlcFLWL9cOAQDWexnWmTiKkKN6WYPR0lpBPPSoXXKv/94hCiIKBJE/PL8t3T89qe83jpL6FzXGUmrPUHjDEjpp1e177Qm+LhFDfTJduNzscT9q/7yPL/L/9MqLB+2atSjpjJUhDAD8TFH0nymG2oF+v98XlVoTTTRR28FCmVGZNGm8kCliB2WZivFJk5oLmWxbrdBBC6p4PJo5EomKgWAX7PVdWYwZpCHsjDnP26sqTWKJJ5kWV6R8dBqjJdGlruRBdrpEUzPt0dRMa4cAADtlIBsCOwG1HlYngKkhFDKAAkKEICwBYLDkNjFpWTQrHLdoYdwNw+FqmRJUXHBzcU3SfoQlS0sQsQya+/2OpDyb6+lH+/X1TySey8jbLVUk5dzvdyTlGa+nH+3H13+ReB4jzzNX5MFuKNvtdlsbAMA3IAFMkQDTzWmDqVcBAB8CANSRGICMsmmknvgVAKADOD4I+AAaRszHSogkRMNISBBPTEggI4FQKjI4hqggZBmrFxciIQNYODExITExFg0ciUbiscRIjERZFhgDAADIImzLQlYMilYUNQBA1MXLadmWq6etnsGozvVcF0hjs50yhxmbcXVsOhYUlrMUqw8evTJXVvedh+Mwhzk0x3cBON7f4wQBHloBgiIeb9u1lAyGigoAAFw+ACAajalikEZDAACAeW8AQIxpCgAQZwcA6AKkwRYAAA6g0RiYTeiqFAC+C/5JTGBdB2oxjbtfuCP9P6rdb4+kpEy74J/EBNZ1YBbTuP6CO9L/o9r99g4rCQD5AAA+AYBKDSJlAjyAHpJAK6MYgV8BABjyBADUAQ0Z1MAEiJEBoAEAAAAoRBQzAAAAAAAATosyAAAgTHrYFMgSAAAAACBK1ZWgcy5zvaeGIwYCuBnuDk9hYEIBADgA4B9YACABDkjYHlxfIgcHJEEAGDVuURp2dyoiAAAA8BugBQCAwSChABCnAwC0AkCMyQIAQFa7IgAAQMhrjQMAHizetE3Kvn7hkdLpU4vM/2h2HnOIECzetFXKvn4twqV9q0Xmf5SKvk+BgzoAAL4AQLUSAMBXAAykAn2iQOADxeQiANCVAIA0MmgBSAYAIMIAaAAAAAA4RgUAIAFAFpEBAAADAAANG44HiXM8DgAAkGIAAACSsgAAACgLQUjTZNGAAYdYl/pjCLgkvNmwAQCwCgDclbZpkSrgtUUA0GYAQLg+iyvrQaSEAEADgKhvAABvAgAAUysAzJmdogAgwgEAWgGA5lkAYAVAs5rKCQBeXN7ktJVzs9Fgm3+fS2R++toX7w4DFpefdSvnOFrQ/O+9ROanr33x/m5AdQAAfDgAgEQyACZNSOSgDwMAgN0BA5BGBi1ABRDxAUApAACoYWIAAAAAWRMAAAAAVlSlRBKZ5iaTpWGYKIqK4Z5BDAEBAABcVu5dBQgAxZZi8R883sViCwwAQKwsbWsoKgVEAGj+YHPCNQMACJcEYIMoMQRyiQAA/K+I6VWTOg0AAJzAAHo1DQAAAH82DwDgWgCgbQDQ7EADAADGpwUAAMyMiXYpAAAePF7cVmay7H98J9/+rRTZHmXXvvxBhYPHi9vKTFb9j+/k628Pke1Rduzj91SCb0AKDRHBZ0oBQE3lIDEh1JMECAOBxdCvAADILGnIEKggg4j5BBs5yhFEsCSihARCMcZGbe+tUDQAAGAHQUIUUZQAoIo2iSRJsjn5+UkIjTQA1RldQpTvmpm/lwIgb5BMowWARLqeLABhcLRTixkQE89xZ4t2sg/DgQAAgKa7AAAiWUbgHGgAgLcVpAEAjVMCAOCMQQBiJQ0AADQAcDZAAoCSZAa2ZAUAAJ6MXswqQxLuNpPHL5qRrd8yin38HoSS0YtZZUgZ7jaTxy+aka3fMop9/B6E+M4EUKukdFQ2kgZAGEhiBG4UjU0DAMh0ig8ClkHEyBwMwdFSiNEEQUIkjMcjSrABAQCAy5mGWBkjMQUAAyBtRJIQSdNBNRMp0Haw+XlpSxEAWbE0QwnQXelVRQCoQdJRAQCRbkYAFrAmYEwcvpUEIAFM5P1CuGMJAIhRoH8BRGIAvUwACqwEAACcHQDMHgVoAPjrBsBZBk4FAMgdEKFfAAC+rHbikBpz6d/J1/+qRKpL8mfk8ychvKx24pAa89C/ky//qkWqS/Jn5POdCJFcWINjI5kAJEZUm0YFAGGgJ4oR+CDKsgEA1DANMWQUQYQYExgHCZGoCEkMgmLiGAAAQCGggKMNAAAA4MR4YxgJESkAACA/kvzIy29OmmaajUyazclkm0EH6cAKFAVIM5GfZNLQiIoGMFcTADCVMUkEkjMcJfwJoIRqAsDwWIYAUEnuoFUAYA6B7moDAATF8mzMjBig/TUxYfMpwAkAkMUgkDwAQMyc7gIAQLtUJAC+jPZmlxGrvf1L3v/qjmxPNfL4kSyBy2hvVhmx1tu/5PmvPSPba0Bi5PE+WgJdCZOQJwCQNZMfKQAAQAIAqKVDN4qGOgCoCxLNh0OGQCNiiCCyBAU4QmKiGhsi0RBZVrBsAcGgFgEAAADYCl0xFlsSAAAARtFSBtGkNJImSZrmuTMAEFnG6Xg8NJoGgGVlBACs5i8CAEwkBFPUqe51vQURgC0BcoYKII6yL2ICGCDuHQA0qwph7EIBAADODyICqFYAAJMHKIAYrQAA6BgBwGsBQFeiAGChBQC+fO5ulivO7ODJ/OUTdevffRl5vQ8h8vK5u1mu2LeDJ/0X3VG3/l3LyOstWAJcaOUkDwN9vgCBNFIAAIAEAIg60QjcSLUBANQFCaeG4gMZIhpiBEDYBInRmFBiaEAOEwkM4JgBAAAIgjioBQAAAEDMtsGSLQAAAFBAEBhAm6R0QE5WdIAGAABhZQoAgG8wmQAAyQQniBjRRRwAgAEwxurjnD48IMRqBTgAjdsCwLgegMCANAAAmPYGEAVqRBIAbQPAeA8AgA5ZFEKeAADAEgEAIP4BnnzufpXXz2yrStYvmlH7/70dI4+3ECInn7tf5fUzW6qS9Ytm1P5/b8fI410MkfkGoYkIUYUbsNDj50diyMaGBEACAKgh0NCNoVYCgBoLH4IMMkQcIgTYgEARQiQCOC4ZQCiCIiGGEIIFAACAUBAhhiYqYgAApCUnJz8rhV8AACwZAgBAzmBzCwCMA7IBAJwJpRoA0LxZUI9IsH6khNzHB9A08wEkg0YBACIGWUFajAAAuBTgge5kCzBiBQD4EgCAyioA4H4NAEDHBgAAFw8A/qze40UO1rltHZP9WykKd/7tr5HwPkQIz+k1XuRgndvWeXJ/W4rCnX/7NRLexQiBb6Be1FDCDdjE8AVIpJEYNG2ilADCwAaUoRtFYwAAH341BBkCjYAGIUaWFaIUgmUAEhQzIBRNCgAAgLClBFCUIgoCAAAAUKKjYQxBBgMAUCJtmpdkGvUgAQB2iQ1gAHAOmttSCnRgDshGHyYwBCjRpzQdJBT4xAAyroYAgFqVVwDQGBgAAAgDzAVs3h2AuIUBlgIRAwDAWwI3UAEA+wCtOQD+rL6aXR7zHe/u+/eR4+3yvvo1ShYYP6uvZpfHfMe7+/595Hi73Fe/RhJGgTHygiybFki4M7AuYANpJAbVppkJIDrko0Y9YDENGWRQhQACA1JqRQkAUEJCVAA4MQoAAJgEW8iyCQEBAAAAECqE0mZ1NsMuCwEAIpLBRAAAgHdgThoIgAANgP3j/kW+QEqEkonRTV9SbIMViBuWldkCACqaHwkUAxkAuNwoEHkAhDfg4wGuB7oDgDcAEKtXAAC8ZgDgAP6svpsuT6rj2e+EX8Tbcm/Xn5HXmwjFz+q7afKkup79Tvh1iLfl3q4/I48fOBQjHwDAwwTC4SsASBEAAMJAywKqKwB1YWFjCiOwABoiCICoCQBIVFQCwAolgwAAALUMAAAAUFgrUUIZQQgAAABkSgkAggydS8dVAXB1FzcT3BXyEwAAmskftAAAkJ+kKQBkAQjiREy0XSFxogIgACSK/ofq3zaKfowxfgAKAKDLxGoAgDIAPCuDgnEuwNkAHwDIC4DUAcDlAQAgqxMAkAe+jL64LgdlbRrdN/FvG1F3/dceRt7fy6CwjL66JgdlNY3um/i3z6i7fvc/Rt7fRFBACoFK1FGFOxsYLwYAwYvEgmjaCABhoA+joRuplwCgLiwsyBAjg8gghxhix2A5GhGDDRDGgygAkBjKANGkjQEAAAAQSUXCsGN0AAAAAADbkcBWktoYAAAAZMsCwKrpH9eYKgIIANCsIF8BIDijLjRjuYowoMTSj8ZZaACGAEDEIFZotwRAFARTKIC3Bbi1FRoH5gQiAMD5BgCg8gUAEP0BAD48nnWRR5x1ujtZ336ibv6r2zDy+SgKJR4ez7rKI2a7u2cyv31H3fRX5zDyehCFEiMvKDRkyBJuwMJ60AOkkWIAACQAQEXCKHLQjbJSAQA1NQJkkA8CgggBxjIZ0dEyBuQAWwA4RIDiSVo2ACgnAAAAkB442CUGDABQtDWmczJ8tx8AAJDXgQDAPTAtAOCNhhTf6SCiNgc81BAF4OADXmAApfN9AMDNAppMPasE8OcBHQcBABjKYG7gR46AXufQLgooANjhoD0AgHYZAwBAfAQA/huubpTNabP/S+a33VG3/r2Dkc93yAL4DVc3yuaU2f8l89vuqLN/72Dk8x0KyHyhHZvcgIGWFwmApJACAACEgTaGRqCuPqCmGkTIYAQYEcSCAMdlpCBiAMWiUQBE3ACWEogAAAAAgEMDygAAAGBwPIBYrACDAYBCpCsrhmizBoDCLUNjiAIIxhiIOFzEQ1QUwBfYAGBMzO0MJP2UCJBMAADr0wLEoPlBAB4B0oHRAmAUECuBeSMNYLBSJoICAPA2wIFlJQEA9gYAT2dnUwAEDqEAAAAAAADSXgAAAwAAAHKDTO4WxsjKzMrAw7++ura4u7C3t7a4vMigZx4cjm6XU0+66/9k/wVn1F36OjPyehMBOTgc3S6nnnTq/+T+BWfUXfo6N/L5iAMy8gJZD0rwCSoByHAopAAAAGGgB8sI1N0B1AA+CJBBjQgjRgDAOOJocBBAcAAA5ABqAAAAABFX3E4IuhYYACgSNnvnbLoMEgAAhLysAgAgm5MXBdelOkYBIRijhmnaDUQrDgQAnwLhlJAH0RfifTAIgAMA1Q2ijYGDBSvLAgAGOFvB13sH4AEyApLBAACgKxEAmuYJAAB8A15cLv6UU5/q6Zm8v61F3fy7i5GvtyAoLhe/lVPv7O6ZPL+tRN3yu8PI51sAeYGoV0lwR2AdeqQAAAAJAJDHqQjV1QPUMHUHQDDUCCJGAABMJ0THIAEoMWYLwAjUAgAAAEBY8mAnaSEBABAiAAAAFJKsjBmMMwAAmgxWAQAQmUGyAoB3CdIAJBPeBNtJ/1LEUABYDwAwQ5TQiTx83KdNSROAFgCSTp0CAPwKAyAVcB5w6xwcoMYIUAEA4Pw9+FgAok0HNAoA0M8Cnnye01ae9hzP9e//HyneBtNXU0kPOJBIPs9pK097juf69/+PFG+D6aup5AccSPANVCp1MuDOBoIvQB9ppAgAAGFgRZGD6moDaogaRMggMsQUIogJYCxkGQAcOgyFkRMFAADgBCWALAAAAAAUhrIUBBIAAAAiKtI0M2ApAAA6DrOAAcCbl4kAACD2ANRQ6g7ddsQQgAIAxlVwKWaghAMcLgnwfAARyWARgIEHAHLlAYAEYFUBNQ5AKAbCAQBAG4NywFgAgGIEAOcaAJ6MnvxNzvUd3/zvn48Sc3d9VSryJkLK5PMYb3Ke77jrv78fKd6Grq/zSjpxkQKrAwDgA4g6QBa8/EiMVB4nAOIyVFcPsFjUXQACZIgwYg4BBIACALBnMABZBRo/dVkAKExMCw0AAEoxAAAApUVnoy6dawKUE2LDEcVw+hUsAkikOgAAdHzqSwoAjFOmAIhIhXwDAIOuYHHgAI4SAw4YXGJG/1DgIEFbAdFMPjgAAIglBnYjmAYYsgWAnGYLiAEAKj8SA4D7BQAARwCcAZ58nuNd4FzwmvHfP3uKuuu+/oyEB1QkxsnnOd7lnP/PjP//uWPUXe2rZyTcUJEYIy+IsqFCgg9BEQlwgpSA4DVpUQEtyFR8CDJEGGFA0CAEAtlrmyFJAOiTCwM+MwAAQJkPawAAIEQnpNWkx+7ZNUtnAgAuRwAyALkZmAUAANndD2y2qmddWQ1ghQOASOfLDSMDNGocGpd+QuIHKCEBOCaFe5rEClMAwAHEoxUAoAsHALQyTAAAXAHjAnB2AGTuoQADCilfAQAbAAReXJ7jXZ64Z++qhE9Rt/0dYiS9hYiyuDzHu7yxb9+dEj1D1E2/I42kNxlJIi+SatbIgIeBFj/SSEUCksAqQ3W1AT4WNQQZZAhCCAgudutiyQJAmZoEAAWjECOKqxAABgAAQhWLmem2gCwAgGqhQ2KUZQMAYP8cAIAAiJycZQGAf/lMFQCw3MvemKMdGFAYKZ3AuSTgiDSZAAI3C0g7pgUA6GAFUpcLAAAkB4gBoI4AJgFOQUgBALh/hZ0NdEEB4gH+K+56lz2f51v//e9jRN3pt2EkOZGF4Vfc9S573s+3/vv/lxF1p9+GkeSGA2fkhUjVIAuoR6CNND/ygqwDQBIYZaiuANTQIyN8IDIEFAKIbQExyihKACQSBMJYCXYAQogWtgAAAERgAgVJxCUAAKhCG1lNYwGG6V4uoQVoMmgLALKalwQAADKmKQqBUwCCUmD9wKYvCUlm5yeAA74B0vxMAADQLgBAfgcAgB6D8ALQVQE8AtMIAAC2AZ6xAQDwewGATwBe2+16khG97fUv0dcz6va/bkbCo/RU2+16lBFtnfUv8W+dqNv/ulXyowiUXeiloJ6FpUcaKQAAQBjoK0N1JWCxIEOMAR8YEUQWGKIkxmNxxY0AHMYTEIAdAVkBAACAaShx6KLQoQEAqEINHJBGSOsU+qeZRaoUmHMFADgHyQYAoPN3GIJlidNUBCADQA3Al0qCgBIDBnkTPoBeA3T5AAwAAESXU+ADANIQQH5Ab+WBtlsBAOMFug5ALQAAW+EBAB7LbXKUFtXO+pf0b+2olQ+GkfQxBOVYbpdNmrd21r+kf9uJWv3BMvK4haDsQisF9SwM0ibyAE2bSgDCQFhAdQWghh4TPlBDChEijGQRxmJSEFoAocLQtoAEoxi1GIwBAABAYbuwQBBJsAwAQKpFSScnjT6APUnz8oYCkE5KAQDj6qoCACEIoV4BAQsr11g7SpSKAawATGsgankBAIJmBADMAUBwYN4yQBgDwCRgCSAUAAIQFgAA2qUAAGAsNQA+u11FkhFRnt3f98cz6q6fWsmPKDTPblfhZUSVu/v7fHyj7upTrPQQzsgLImsRooArABwNiUFjNRKAMJCiGKqrD6hRiylkMIwIATYMo0jEMUIoAAAAjCI0wcE2AAAAQD0e4KCxjNkGAJiZ0IW9kgM6IDNoCCSD5bxvB+s9Bui3wA2MAlqIApM9AHTdgH5j8O+uBOhfgMbyaQAA0IEOAIQVAHoW0DHASS5ApRVHWwCggasGwOoQAABo+ABe2x3NKD16m/49Pu6oG10CbMnHoFzbHc0oPXqb/j0+7qgbXSZsyVtw5gsZcAMGFmkOKdkBxNHQoobwIcgQMBgRxEAYyomxQLFYCIBQEABgh1h2PJqYAQYmEgxDVyLbCoiUm4//hDWgIGIAAOB1AcF2xSESAMIg2QUCgHPZcEGU0COBIOFIAB0iO8gAIAIABTRZNguA5wAAhj0tAADJA7HATXgDIFwATgO6AMALcAKAZQwABK8VAF7rnfQkI+KY4d/70446qRVZ8UdQrPWOepJRdczw9/m0o066LLLij6CIvCCzMRJwJwPBSyElC6iogBY++VDIEGBEEBEEIigIhYCQAIiBMQTEZREqGgnAIKjOkJKVpKvVAKSKbWSLKdYIAEn+sgbCSgNSCNLtAGeBkABWV9IMAE6Xv7rSb0+GZEoiAYgqwFcTgwaQBAGnQGRZUgCtwDKMAQDgEkCWAsz4AOB3BeQTAwBd5QHQuQIAiACeC25uK2Od69T3748SdZdLv1byA/KQC27ulLH20anf359a1F0u/WrlB4/IS5JRL4mAj6AKkIG0iTRVhhYN1F0AhRFhRBgRBCYohKgIMVqAHGMAjLEdyAAAAFWigwxjh2kkADqbN1MQtABNB5sBAIw1AqA2gPfLiDYGHQACHfsQJoWOS9IA6QqQUyqRSZbIo4SzXbLdZYAjmpuXBpCGRHtOEIhFUVIAWgFdBVwEIEsAxAAALB2sAJgjAQAHngtucSuz3T/P/Pf7XaJucPnLihw45YJb3Mps988z//18l6gTLn9ZkQMn5AUKdSLgBiws0kgjXRcZQ8aHYMgHcQgA0RHJDiICgINoYgCAg6AhoBmn8QCAvKOf0Z1SAKSD5CwAnAMAQLA8apSiqdy8KgJCB7H0TrupLrMAFKUaxJpqMCuhMIlDAWCcP3e2JXJhwoDwhAEAYK7RAgCAM+Atg50FHhuqSwEAQBgkgC4AvAs+243xJi16+ea//32keFsu61TwGYVnuzHepEUv3/zvv48Ub8vLbDtnEEZeIBpKAtyRGJOeoxdoRByuBgEyEBEFITbggGIgyAJwLCEiAIiFUycSQzKOy2oEgFbUlAxzHEAAZFxZAIBzdRUAGsYRUeXE+QHsi1mHiAAxRiFfpBEAkGW0A8CU7Js+QEKASJbZDokn9U5cNr4zljAiQBKYM0gEAAhYBwBagAJBAQDIypwxYAEAkAAYJQDeunXulDLbND3/+WhR3Rn9SngLQq1b504ps63p+d/HiOq+9FElPEohvoFsQJHwCWoAGUgjTVG6QGRBpvnEMGICIcBAMCGgaAHgGAGBItloBKHyxsskFAgRfTK+b1oIAWgysGYAvMtPFwDRsGWJr0pWC0EHhSqCLMcyTiEACC4UbNHiJ9jo9wI4AFqLQdp0koggrXJc1ADmAgCoVQHmHBUAQDseppIPWiCKFgAA2hVW4c4BAP4BYAW+qnVxl9Travn798szqnMqrog3aWHSqvVpl9zravn799Mz6sypuCIepSWICxmT3ACBNemRpvQILMiqQYQMREDBGGPbCEcFAE6MJtoWQLighER+M9kIiwF6aaNj0mhCi0CXZUwA4lsZAoAeDP3GQGDQFlAMEoSCFWmXxAoAwKzA3Wjt/YhdBykAuq6XTJqXq6IhiGgoBngTgMeGJ5YtAGgAFjCh0wNEcwIAwPsAmBEAQBE0ICAGAL6q9WWRMOo6/f3763fU6EuBiniQFiarWl8WCaOu09+/v35Hjb4UqIgHaSGCvCDVESWQJ6gDRCCNNNKULhBY+Gg+iDBAhigk2BYExRCJABK2og0Qo5ZUW8bRcs4YAvhqa+HsDgoQHcABIGKQFADgJE2DINLBSgEoSlRBV1XpSgMAuKAwiGBlgRIZcgAQb0zaQZNotDRCKARALUMAALAnGsg4AQCAuQQeADsAAABZKdBFAAUAEgBxkACeqq1u/FZcrX9+zjP69+lSkUPGJFVb3fituFr//Kxn9O+LtlgyY8Jv03NIIxBSEI2MISMYIoMEQtDR6swhXbUScyaJtB1MdmCOTH4IbQfJzc2JtjJpujIBUQyNMXq1pEmBZHEAmPNwAMBujA2oTPPzqmDOUYxToC4YQKQ+JV6VV0Ur4VPptZpcn8ZLHmgCIIAsmiLLSqdhBimAADzlAADReAKPBgCAH+AT4TYzAApfGgDkBLoRAHQd8GziAJ6p/XNf5BYOpIarX6b2722RXSKAWMDfsWUpS7kQHw4B6NEwKzNfyMTSZNHi+aQunTA9RSyTmzulgTmZyR28SyfMci3KduUL1fVV5sFTVm5xsuS4+RzM6tabUuxVboakI3VSp9y76ty4r1ur6vNxcjl3Mx+dZhkZcY7hda/XEOuXgaNfBiBAiRxGCQ8haFhwERwtamZqG3f35JD8YZdUj1NSllKlfp/WBpuc8KwCPcD7rGhUL3nBgSiw4XO/IEeT/Eey2hgAhQYAPqr9338muaqBggL+o9r/9c8oV4hAQgF/xI6UUooFKhY/BB7ySB/2O4++LY9UFd8+CuJhPKx3gQpaohJGyAwofRwMlAghcInZPswg6CeAUcKSJQaASKn1AcYAIEoI6G5+gsu1hxH5CZMGQqYvgE8+rvaDz8AlA0ipZHxgLs5175axNhhgJQJSikH7QBg4aQZWhwH0AeIwADRA4yCXA+gGBT6q/f/8esjJJMAB43ej2v/Pr6ecdAZssPA7AAAYo0UchzHGEAMoRIBTBt8rgM/gx1k+g0E42f2rvFeLED9fSpYwSkvsV7I0IAKfoSw0fAYAdKQIMECkAKwkvQCLBg6gsi1WABsgAAk=';
    var mfcModelLogin = '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';
    var sounds = [mfcModelLogin, mfcFriendLogin, mfcTip];
    //set up an HTML5 audio tag for playing sounds
    var audioTag = document.createElement('audio');
    document.body.appendChild(audioTag);
    //create the alert div for visual announcements
    var onlineDiv = document.createElement('div');
    onlineDiv.setAttribute('id', 'online-alert');
    onlineDiv.setAttribute('class', 'hidden');
    document.body.appendChild(onlineDiv);
    var tstStyles = [
        '    #online-alert ',
        '    {',
        '    	    position: absolute; ',
        '    	    top: 20px; ',
        '    	    width: 35%; ',
        '    	    height: 30px; ',
        '    	    left: 0; ',
        '    	    right: 0; ',
        '    	    margin-left: auto; ',
        '    	    margin-right: auto; ',
        '    	    background: White; ',
        '    	    text-align: center; ',
        '    	    font-family: Trebuchet MS; ',
        '    	    -moz-border-radius: 10px; ',
        '    	    -webkit-border-radius: 10px;',
        '    	    line-height:1.75em; ',
        '    } ',
        '    .hidden {display: none;} ',
        '    .show {display:block}'
    ];
    var GM_addStyle = function (s) {

    };
    GM_addStyle(tstStyles.join('\n'));
    //display/hide alert messages
    var onlineAlertTimeout;
    function onlineAlert(text) {
        clearTimeout(onlineAlertTimeout);
        onlineDiv.innerHTML = text;
        onlineDiv.setAttribute('class', 'show');
        onlineAlertTimeout = setTimeout(function () { onlineDiv.setAttribute('class', 'hidden'); }, 5000);
    }
    //setup friend management
    var onlineFriends = [], initialPop = false;
    setInterval(function () {
        //get the current friends list
        //        var currentFriends = Array.prototype.map.call(document.querySelectorAll('#friends #online_friends_list div[id^="online_friend_"]>a>span'), function (element) {
        //            return element.innerHTML;
        //        });
        var currentFriends = [];
        var g_hUsers = unsafeWindow.g_hUsers;
        for (key in g_hUsers) {
            if (g_hUsers[key] && g_hUsers[key]['friend'] == true) //filter for friends
                if (g_hUsers[key]['state'] != 127 && g_hUsers[key]['access_level'] == 4) //filter unknown video state
                    currentFriends.push(key);
        }
        //wait until we have an actual friends list
        if (!currentFriends || currentFriends.length === 0)
            return;
        //leave if this is the first time we got friends
        if (!initialPop) {
            initialPop = true;
            onlineFriends = currentFriends;
            return;
        }
        //see if there are any changes
        if (!compareArrays(currentFriends, onlineFriends)) {
            //compile new people
            var offlineMsg;
            var offline = diff(onlineFriends, currentFriends).map(function (item) { return g_hUsers[item]['username']; });
            if (offline.length > 0)
                offlineMsg = offline.join(", ") + " went offline.";
            //compile people that left
            var onlineMsg;
            var online = diff(currentFriends, onlineFriends).map(function (item) { return g_hUsers[item]['username']; });
            if (online.length > 0)
                onlineMsg = online.join(", ") + " came online.";
            //perform visual alert
            if (onlineMsg && offlineMsg)
                onlineAlert(onlineMsg + "  " + offlineMsg);
            else
                onlineAlert(onlineMsg ? onlineMsg : offlineMsg);
            //perform audio alert
            playOnlineSound();
            //save the current online list
            onlineFriends = currentFriends;
        }
    }, 1000);
    function playOnlineSound(type) {
        var soundEnabled = localStorage['mfca_soundEnabled'] ? localStorage['mfca_soundEnabled'] : 'disabled';
        if ('enabled' === soundEnabled) {
            var friendSound = parseInt(['mfca_friendSound'] ? localStorage['mfca_friendSound'] : 0, 10);
            audioTag.setAttribute('src', 'data:audio/ogg;base64,' + sounds[friendSound]);
            audioTag.play();
        }
    }
}
function createTable(spec) {
    var table = document.createElement('table');
    for (var row = 0; row < spec.length; row++) {
        var tr = document.createElement('tr');
        for (var cell = 0; cell < spec[row].length; cell++) {
            var td = document.createElement('td');
            if ("string" === typeof (spec[row][cell])) {
                td.appendChild(document.createTextNode(spec[row][cell]));
            } else {
                td.appendChild(spec[row][cell]);
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}
function compareArrays(orig, compare) {
    //if the lengths are not the same, the arrays are not the same
    if (orig.length != compare.length) return false;

    for (var i = 0; i < compare.length; i++) {
//        if (isArray(orig[i])) { //likely nested array
//            if (!compareArrays(orig[i], compare[i])) return false;
//            else continue;
//        }
        if (orig[i] != compare[i]) return false;
    }
    return true;
}
function diff(orig, compare) {
    return orig.filter(function (i) { return !(compare.indexOf(i) > -1); });
}
function isArray(obj){
    return toString.call(obj) === "[object Array]";
}
