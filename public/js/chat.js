// https://github.com/socketio/socket.io/tree/master/examples/chat
$(function(){
    var FADE_TIME = 150;
    var TYPING_TIMER_LENGTH = 400;
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    var $window = $(window);
    var $playerNameInput = $(".playerNameInput");
    var $messages = $(".messages");
    var $inputMessage = $(".inputMessage");

    var $loginPage = $(".loginPage");
    var $chatPage = $(".chatPage");
    var $gameDiv = $("#gameDiv");

    var playerName;
    var connected = false;
    var typing = false;
    var lastTypingTime;
    var $currentInput = $playerNameInput.focus();

    var socket = io();

    function addParticipantsMessage (data) {
        var message = '';
        if (data.playerCount === 1) {
            message += "there's 1 player";
        } else {
            message += "there are " + data.playerCount + " players";
        }
        log(message);
    }

    function setPlayerName () {
        playerName = cleanInput($playerNameInput.val().trim());

        // If the username is valid
        if (playerName) {
            $loginPage.fadeOut();
            $gameDiv.show();
            $chatPage.show();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();

            // Tell the server your username
            socket.emit('addPlayer', playerName);
        }
    }

    function sendMessage () {
        var message = $inputMessage.val();
        // Prevent markup from being injected into the message
        message = cleanInput(message);
        // if there is a non-empty message and a socket connection
        if (message && connected) {
            $inputMessage.val('');
            addChatMessage({
                playerName: playerName,
                message: message
            });
            // tell server to execute 'new message' and send along one parameter
            socket.emit('newMessage', message);
        }
    }

    function log (message, options) {
        var $el = $('<li>').addClass('log').text(message);
        addMessageElement($el, options);
    }

    function addChatMessage (data, options) {
        // Don't fade the message in if there is an 'X was typing'
        var $typingMessages = getTypingMessages(data);
        options = options || {};
        if ($typingMessages.length !== 0) {
            options.fade = false;
            $typingMessages.remove();
        }

        var $playerNameDiv = $('<span class="playerName"/>')
            .text(data.playerName)
            .css('color', getPlayerNameColor(data.playerName));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = $('<li class="message"/>')
            .data('playerName', data.playerName)
            .addClass(typingClass)
            .append($playerNameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    function addChatTyping (data) {
        data.typing = true;
        data.message = 'is typing';
        addChatMessage(data);
    }

    function removeChatTyping (data) {
        getTypingMessages(data).fadeOut(function () {
            $(this).remove();
        });
    }

    function addMessageElement (el, options) {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    function cleanInput (input) {
        return $('<div/>').text(input).text();
    }

    function updateTyping () {
        if (connected) {
            if (!typing) {
                typing = true;
                socket.emit('typing');
            }
            lastTypingTime = (new Date()).getTime();

            setTimeout(function () {
                var typingTimer = (new Date()).getTime();
                var timeDiff = typingTimer - lastTypingTime;
                if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                    socket.emit('stopTyping');
                    typing = false;
                }
            }, TYPING_TIMER_LENGTH);
        }
    }

    function getTypingMessages (data) {
        return $('.typing.message').filter(function (i) {
            return $(this).data('playerName') === data.playerName;
        });
    }

    function getPlayerNameColor (playerName) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < playerName.length; i++) {
            hash = playerName.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    $window.keydown(function (event) {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (playerName) {
                sendMessage();
                socket.emit('stopTyping');
                typing = false;
            } else {
                setPlayerName();
            }
        }
    });

    $inputMessage.on('input', function() {
        updateTyping();
    });

    $loginPage.click(function () {
        $currentInput.focus();
    });

    $inputMessage.click(function () {
        $inputMessage.focus();
    });

    socket.on('login', function (data) {
        connected = true;
        // Display the welcome message
        var message = "Welcome to the Galactic Conquest Chat System– ";
        log(message, {
            prepend: true
        });
        addParticipantsMessage(data);
    });

    socket.on('newMessage', function (data) {
        addChatMessage(data);
    });

    socket.on('playerAdded', function (data) {
        log(data.playerName + ' joined');
        addParticipantsMessage(data);
    });

    socket.on('playerLeft', function (data) {
        log(data.playerName + ' left');
        addParticipantsMessage(data);
        removeChatTyping(data);
    });

    socket.on('typing', function (data) {
        addChatTyping(data);
    });

    socket.on('stopTyping', function (data) {
        removeChatTyping(data);
    });
});