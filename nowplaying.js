// ==UserScript==
// @name         NowPlaying
// @namespace    https://www.simonefranco.net/
// @version      0.1
// @description  Fullscreen player experience for SoundCloud
// @author       Simone Franco
// @match        https://soundcloud.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var frame = undefined;
    var body = undefined;
    var extraButtonPanel = undefined;
    var fullscreenButton = undefined;

    var isHidden = true;

    function hideNP() {
        toggleFullscreen(false);
        frame.style.opacity = '0';
        setTimeout( () => {
            frame.style.display = 'none';
            body.style.overflow = 'default !important';
        }, 200);
        isHidden = true;
    }

    function showNP() {
        frame.style.display = 'block';
        frame.style.opacity = '1';
        body.style.overflow = 'hidden';
        toggleFullscreen(true);
        isHidden = false;
    }

    function toggleFullscreen(state) {
        if(state == false) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        }
    }

    function addFullscreenButton() {
        extraButtonPanel = document.getElementsByClassName('playbackSoundBadge__actions')[0];
        fullscreenButton = document.createElement('i');
        fullscreenButton.style.fontSize = '200%';
        fullscreenButton.style.marginTop = '-6px';
        fullscreenButton.onclick = showNP;
        fullscreenButton.textContent = "x";
        extraButtonPanel.appendChild(fullscreenButton);
    }

    setTimeout( () => {
        frame = document.createElement('iframe');
        document.getElementById('app').appendChild(frame);
        frame.style.position = 'absolute';
        frame.style.left = '0px';
        frame.style.top = '0px';
        frame.style.width = '100%';
        frame.style.height = '100%';
        frame.style.zIndex = '100000';
        frame.style.borderWidth = '0px';
        frame.style.transition = 'opacity 0.2s ease-out';
        frame.id = 'np-frame';
        frame.src = 'https://simonefranco.net/soundcloudNP';
        body = document.getElementsByTagName('body')[0];
        addFullscreenButton();
        hideNP();

        setInterval( () => {
            if (isHidden) return;
            var temp = document.querySelector("#app > div.playControls > section > div > div.playControls__elements > div.playControls__soundBadge > div > a > div > span").style.backgroundImage.slice(5, -2);
            temp = temp.replace('t50x50', 't500x500').replace('t120x120', 't500x500');
            frame.contentWindow.postMessage('NP-TITLE: ' + document.querySelector("#app > div.playControls > section > div > div.playControls__elements > div.playControls__soundBadge > div > div.playbackSoundBadge__titleContextContainer > div > a > span:nth-child(2)").textContent, '*');
            frame.contentWindow.postMessage('NP-AUTHOR: ' + document.querySelector("#app > div.playControls > section > div > div.playControls__elements > div.playControls__soundBadge > div > div.playbackSoundBadge__titleContextContainer > a").textContent, '*');
            frame.contentWindow.postMessage('NP-HEROIMAGE: ' + temp, '*');
            frame.contentWindow.postMessage('NP-PROGRESS-' + document.querySelector("#app > div.playControls > section > div > div.playControls__elements > div.playControls__timeline > div > div.playbackTimeline__timePassed > span:nth-child(2)").textContent + '-' + document.querySelector("#app > div.playControls > section > div > div.playControls__elements > div.playControls__timeline > div > div.playbackTimeline__duration > span:nth-child(2)").textContent, '*');
            if (document.querySelector("#app > div.playControls > section > div > div.playControls__elements > button.playControl.sc-ir.playControls__control.playControls__play").classList.contains('playing')) {
                frame.contentWindow.postMessage('NP-ISPLAYING', '*');
            } else {
                frame.contentWindow.postMessage('NP-NOTPLAYING', '*');
            }
        }, 500);

        setInterval( () => {
            if (document.querySelector("#app > div.playControls > section > div > div.playControls__elements > div.playControls__soundBadge > div > div.playbackSoundBadge__actions > i") == null) {
                addFullscreenButton();
            }
        }, 500);

    }, 1000);

    window.addEventListener("message", function(event) {
        if (event.data.startsWith('NP-CLOSE')) {
            hideNP();
        }
        else if (event.data.startsWith('NP-PLAY')) {
            document.querySelector("#app > div.playControls > section > div > div.playControls__elements > button.playControl.sc-ir.playControls__control.playControls__play").click();
        }
        else if (event.data.startsWith('NP-PREVIOUSSONG')) {
            document.querySelector("#app > div.playControls > section > div > div.playControls__elements > button.skipControl.sc-ir.playControls__control.playControls__prev.skipControl__previous").click();
        }
        else if (event.data.startsWith('NP-NEXTSONG')) {
            document.querySelector("#app > div.playControls > section > div > div.playControls__elements > button.skipControl.sc-ir.playControls__control.playControls__next.skipControl__next").click();
        }
    });

})();