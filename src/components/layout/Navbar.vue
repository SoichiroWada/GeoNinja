<template>
  <div class="navbar">
      <nav class="deep-purple darken-1">
          <div class="container">
              <router-link v-bind:to="{ name:'GMap' }" class="brand-logo left">Geo Ninja</router-link>
              <ul class="right">
                  <li v-if="user"><a>login as: {{ userName }} ({{ user.email }})</a></li>
                  <li v-if="user"><a v-on:click="routingToChat">Chat</a></li>
                  <li v-if="!user"><router-link v-bind:to="{ name:'Signup' }">Signup</router-link></li>
                  <li v-if="!user"><router-link v-bind:to="{ name:'Login' }">Login</router-link></li>
                  <li v-if="user"><a v-on:click="logout">Logout</a></li>
              </ul>
          </div>
      </nav>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Navbar',
    data: function(){
        return {
            user: null,
            userName: null,
            docId:null
        }
    },
    methods: {
        logout(){

            let uid = firebase.auth().currentUser.uid
            db.collection('users').where('user_id', '==', uid).get()
            .then(snapshot => {
                snapshot.forEach((doc) => {
                    db.collection('users').doc(doc.id).update({
                        logoutTime: Date.now()
                    })
                })
            }).then(()=>{
                console.log('logout recorded successfully')
            })

            firebase.auth().signOut().then(() => {
                this.$router.push({ name:'Login' })
            })
        },
        routingToChat(){
            this.$router.push({name: 'Chat', params: { id: this.docId }})
        }
    },
    created(){
        //let user = firebase.auth().currentUser
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                this.user = user
                // console.log('this.user by onAuthStateChanged:',this.user)

                //get current user
                let ref = db.collection('users')
                let refAuthUid = firebase.auth().currentUser.uid

                ref.where('user_id', '==', refAuthUid).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                    this.userName = doc.data().alias,
                    this.docId = doc.id
                    // console.log('doc.id:',doc.id)
                    // console.log('doc.data():',doc.data())
                    // console.log('doc.data().alias:',doc.data().alias)
                    })
                })
            } else {
                this.user = null
            }
        })
    }
}
</script>

<style>

.brand-logo{
    margin-left: 4%;
}
#button {
    margin-left: 50%;;
}

</style>
