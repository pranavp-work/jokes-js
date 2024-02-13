const button = document.getElementById('button');
const audioElement = document.getElementById('audio');

// VoiceRSS Javascript SDK
const VoiceRSS = {
    // Method for initiating speech synthesis
    speech: function(settings) {
        // Validate the settings object
        this._validate(settings);
        // Initiate the request
        this._request(settings);
    },

    // Method for validating settings
    _validate: function(settings) {
        // Check if settings object exists
        if (!settings) throw "The settings are undefined";
        // Check if API key is provided
        if (!settings.key) throw "The API key is undefined";
        // Check if text to be synthesized is provided
        if (!settings.src) throw "The text is undefined";
        // Check if language is provided
        if (!settings.hl) throw "The language is undefined";

        // Check if codec is specified and supported by the browser
        if (settings.c && settings.c.toLowerCase() !== "auto") {
            var codecSupported = false;
            switch (settings.c.toLowerCase()) {
                case "mp3":
                    codecSupported = (new Audio()).canPlayType("audio/mpeg").replace("no", "");
                    break;
                case "wav":
                    codecSupported = (new Audio()).canPlayType("audio/wav").replace("no", "");
                    break;
                case "aac":
                    codecSupported = (new Audio()).canPlayType("audio/aac").replace("no", "");
                    break;
                case "ogg":
                    codecSupported = (new Audio()).canPlayType("audio/ogg").replace("no", "");
                    break;
                case "caf":
                    codecSupported = (new Audio()).canPlayType("audio/x-caf").replace("no", "");
                    break;
            }
            if (!codecSupported) throw "The browser does not support the audio codec " + settings.c;
        }
    },

    // Method for sending request to VoiceRSS API
    _request: function(settings) {
        var request = this._buildRequest(settings);
        var xhr = this._getXHR();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText.indexOf("ERROR") === 0) {
                    throw xhr.responseText;
                }
                // new Audio(xhr.responseText).play();
                audioElement.src = xhr.responseText;
                audioElement.play();
            }
        };
        xhr.open("POST", "https://api.voicerss.org/", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.send(request);
    },

    // Method for building request parameters
    _buildRequest: function(settings) {
        var codec = settings.c && settings.c.toLowerCase() !== "auto" ? settings.c : this._detectCodec();
        return "key=" + (settings.key || "") +
               "&src=" + (settings.src || "") +
               "&hl=" + (settings.hl || "") +
               "&v=" + (settings.v || "") +
               "&r=" + (settings.r || "") +
               "&c=" + (codec || "") +
               "&f=" + (settings.f || "") +
               "&ssml=" + (settings.ssml || "") +
               "&b64=true";
    },

    // Method for detecting supported audio codec by the browser
    _detectCodec: function() {
        var audio = new Audio();
        if (audio.canPlayType("audio/mpeg").replace("no", "")) {
            return "mp3";
        } else if (audio.canPlayType("audio/wav").replace("no", "")) {
            return "wav";
        } else if (audio.canPlayType("audio/aac").replace("no", "")) {
            return "aac";
        } else if (audio.canPlayType("audio/ogg").replace("no", "")) {
            return "ogg";
        } else if (audio.canPlayType("audio/x-caf").replace("no", "")) {
            return "caf";
        } else {
            return "";
        }
    },

    // Method for creating XMLHttpRequest object
    _getXHR: function() {
        try {
            return new XMLHttpRequest();
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml3.XMLHTTP");
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (e) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {}
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
        throw "The browser does not support HTTP request";
    }
};


// function test() {
//     VoiceRSS.speech({
//         key: 'ee04669ffbf1466fbfb07f626497355f',
//         src: 'Hello, world!',
//         hl: 'en-us',
//         v: 'Linda',
//         r: 0, 
//         c: 'mp3',
//         f: '44khz_16bit_stereo',
//         ssml: false
//     });
// }

// test();

// Get Jokes from Joke API
async function getJokes() {
    let joke = '';
    const apiUrl = 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.setup) {
            joke = `${data.setup} ... ${data.delivery}`;
        } else {
            joke = data.joke;
        }

        console.log(joke);

    } catch(error) {
        console.log("No Jokes Today!", error);
    }
}

getJokes();