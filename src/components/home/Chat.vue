<template>
  <div class="chat container">
    <div v-if="profile" class="card">
      <h2 class="deep-purple-text center">Group Chat ({{ profile.alias }})</h2>
      <form v-on:submit.prevent="addComment">
        <div class="field">
          <label for="comment">Add a comment</label>
          <input type="text" name="comment" v-model="newComment">
          <p v-if="feedback" class="red-text center">{{ feedback }}</p>
        </div>
      </form>
      <ul class="comments collection">
        <li v-for="(comment, index) in comments" v-bind:key="index">
          <div class="deep-purple-text">{{comment.from}}</div>
          <div class="gray-text text-darken-2" id="commentContent">{{comment.content}}
            <span id='displayTime'>{{comment.displayTime}}</span>
          </div>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
  name: 'Chat',
  data: function(){
    return{
      profile: null,
      newComment:null, 
      feedback:null,
      user:null,
      comments:[],
      groupid:null
    }
  },
  created(){
    let ref = db.collection('users')

    //get current user
    ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log('doc.data():',doc.data())
        this.user = doc.data(),
        this.user.id = doc.id
      })
    })

    //profile data
    console.log('this.$route.params.id:', this.$route.params.id);
    ref.doc(this.$route.params.id).get()
    .then(user => {
      // console.log('user.data():',user.data())
      this.profile = user.data()
    })

    //comments
    db.collection('comments').where('to', '==', 'group' )
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type =='added'){
          // console.log('change.doc.data():',change.doc.data());
          var changeTime = change.doc.data().time;
          var d = new Date(changeTime);
          // console.log('d:',d)
          var year = d.getFullYear();
          var month = d.getMonth() + 1;
          var date = d.getDate();
          var hours = d.getHours();
          var minutes = d.getMinutes();
          var messageTime = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes;
          // console.log('messageTime:',messageTime)
          this.comments.unshift({
            from: change.doc.data().from,
            time: change.doc.data().time,
            displayTime: messageTime,
            content:change.doc.data().content
          })
        }
      })
      this.comments.sort(function (a, b) {
        return b.time - a.time;
      });
    })

  },
  methods:{
    addComment(){
      if(this.newComment){
        this.feedback = null
        //insert group id
        db.collection('comments').add({
          //to: this.$route.params.id,
          to: 'group',
          from: this.user.alias,
          content:this.newComment,
          time:Date.now()
        }).then(() => {
          this.newComment = null
        })
      }
      else {
        this.feedback = 'You must enter a comment to add it'
      }
    }
  }
}
</script>

<style>
.chat .card{
  padding: 20px;
  margin-top: 60px;
}
.chat h2{
  font-size: 2em;
  margin-top: 0;
}
.chat li{
  padding: 10px;
  border-bottom: 1px solid #eee
}
#commentContent{
  color:#3d3d3d;
}
#displayTime{
  margin-left:20px;
  color:gray;
}
</style>