  const config = {
    apiKey: "AIzaSyCvZLpze_m5wy6a8ZMXDzqmwl-TyH3_1fE",
    authDomain: "vue-firebase-54c91.firebaseapp.com",
    databaseURL: "https://vue-firebase-54c91.firebaseio.com",
    projectId: "vue-firebase-54c91",
    storageBucket: "vue-firebase-54c91.appspot.com",
    messagingSenderId: "57952284770"
  };

  firebase.initializeApp(config);

  const database = firebase.database()

  const messagesRef = database.ref('messages')
  
  console.log(messagesRef);
  new Vue({
    el: "#chat",
    data: {
      messages: [],
      messageText: '',
      nickname: 'hootlex',
      editingMessage: null
    },
    methods: {
      storeMessage () {
        messagesRef.push({text: this.messageText, nickname: this.nickname})
        this.messageText = ''
      },
      deleteMessage (message) {
        messagesRef.child(message.id).remove()
      },
      editMessage (message) {
        this.editingMessage = message
        this.messageText = message.text
      },
      cancelEditing () {
        this.editingMessage = null
        this.messageText = ''
      },
      updateMessage () {
        messagesRef.child(this.editingMessage.id).update({text: this.messageText})
        this.cancelEditing()
      }
    },
    created () {
      // value = snapshot.val() | key = snapshot.key
      messagesRef.on('child_added', snapshot => {
      // "use strict";
      // this.messages.push({...snapshot.val(), id: snapshot.key}); // For ES6

      var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

      this.messages.push(_extends({}, snapshot.val(), { id: snapshot.key }));

        if (snapshot.val().nickname !== this.nickname) {
          nativeToast({
              message: `New message by ${snapshot.val().nickname}`,
              type: 'success'
          })
        }
      })
      messagesRef.on('child_removed', snapshot => {
        const deletedMessage = this.messages.find(message => message.id === snapshot.key)
        const index = this.messages.indexOf(deletedMessage)
        this.messages.splice(index, 1)
        if (snapshot.val().nickname !== this.nickname) {
          nativeToast({
              message: `Message deleted by ${snapshot.val().nickname}`,
              type: 'warning'
          })
        }
      })
      messagesRef.on('child_changed', snapshot => {
        const updatedMessage = this.messages.find(message => message.id === snapshot.key)
        updatedMessage.text = snapshot.val().text
        if (snapshot.val().nickname !== this.nickname) {
          nativeToast({
              message: `Message edited by ${snapshot.val().nickname}`,
              type: 'info'
          })
        }
      })
    }
  })