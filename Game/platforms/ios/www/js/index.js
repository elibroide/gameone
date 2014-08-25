/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.start();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    start: function() {
        // socketiotest.js
        var socket = io("http://127.0.0.1:3000");
        var name = "";

        function writeText(name, text){
            $('#gameonetext').append("<li><strong>" + name + ":</strong> " + text + "</li>");
        }
        function clearText(){
            $('#tbxSend').val('');
        }
        writeText('System', 'Start');

        socket.on('message', function(message, err){
             writeText(message.name, message.text);
        });
        socket.on('connected', function(){
            writeText('System', 'Hi, please enter your name');
        });
        socket.on('disconnected', function(){
            if(!name){
                writeText('System', 'You are disconnected, enter your name please');
                return;
            }
            socket.emit("username", { name: name });
        });
        socket.on('userDisconnected', function(data){
            writeText('System', data.name + ' has disconnected');
        });

        $("#btnSend").on("click", function(){
            var text = $("#tbxSend").val();
            if(!text){
                $("#tbxSend").attr('placeholder', 'please write something');
                return;           
            }
            if(name){
                socket.emit("message", { text: text });
                clearText();
            }
            else{
                name = text;
                socket.emit("username", { name: text });
                clearText();
            }
        });
        $("#tbxSend").keyup(function(event){
            if(event.keyCode == 13){
                event.preventDefault();
                $("#btnSend").click();
            }
        });
    }
};
