<template>
  <div class="view-profile container">
    <div v-if="profile" class="card">
      <h2 class="deep-purple-text center">{{ profile.alias }}'s Profile</h2>
      <ul class="comments collection">
        <li>alias: <span class='profileClass'>{{ profile.alias }}</span></li>
        <li>email: <span class='profileClass'>{{ profile.email }}</span> </li>
        <li>current status: <span class='profileClass' v-bind:style="styleChange1">{{ currentStatus }}</span> </li>
      </ul>

    </div>
  </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
  name: 'ViewProfile',
  data: function(){
    return{
      profile: null,
      newComment:null, 
      feedback:null,
      user:null,
      comments:[],
      currentStatus:null,
      styleChange1:[],
      email:null
    }
  },
  created(){

    let ref = db.collection('users')
    let refAuthUid = firebase.auth().currentUser.uid
    // this.email = firebase.auth().currentUser.email
    // console.log('this.email:',this.email)
    
    //get current user
    ref.where('user_id', '==', refAuthUid).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log('doc.data():',doc.data())
        this.user = doc.data()
        this.user.id = doc.id
      })
    })

    //click to profile data
    console.log('this.$route.params.id:', this.$route.params.id);

    ref.doc(this.$route.params.id).get()
    .then(user => {
      console.log('user.data():',user.data())
      this.profile = user.data()
      let loginTime = user.data().loginTime;
      let logoutTime = user.data().logoutTime;
      if (loginTime === null){
        this.currentStatus = 'OFFLINE';
        this.styleChange1.push({ color:"gray" });
      } else if (loginTime !== null & logoutTime === null){
        this.currentStatus = 'ONLINE';
        this.styleChange1.push({ color:"green" });
      } else if (loginTime > logoutTime) {
        this.currentStatus = 'ONLINE';
        this.styleChange1.push({ color:"green" });
      } else if (loginTime < logoutTime) {
        this.currentStatus = 'OFFLINE';
        this.styleChange1.push({ color:"gray" });
      }
    })

    //comments
    db.collection('comments').where('to', '==', this.$route.params.id )
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type =='added'){
          // console.log('change.doc.data():',change.doc.data());
          this.comments.unshift({
            from: change.doc.data().from,
            time: change.doc.data().time,
            content:change.doc.data().content
          })
        }
      })
      this.comments.sort(function (a, b) {
        return a.time - b.time;
      });
    })
  },
  methods:{
    addComment(){
      if(this.newComment){
        this.feedback = null
        db.collection('comments').add({
          to: this.$route.params.id,
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
.view-profile .card{
  padding: 20px;
  margin-top: 60px;
}
.view-profile h2{
  font-size: 2em;
  margin-top: 0;
}
.view-profile li{
  font-size: 18px;
  padding: 10px;
  border-bottom: 1px solid #eee
}
.profileClass{
  margin-left: 10px;
  font-size: 20px;
}

</style>