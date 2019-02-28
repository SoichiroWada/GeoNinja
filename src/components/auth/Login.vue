<template>
  <div class="login container">
      <div class="google-map" id="map"></div>
      <form v-on:submit.prevent="login" class="card-panel">
          <h2 class="center deep-purple-text">Login</h2>
            <div class="field">
                <label for="email">Email:</label>
                <input type="email" name="email" v-model="email">
            </div>
            <div class="field">
                <label for="password">Password:</label>
                <input type="password" name="password" v-model="password">
            </div>
            <p v-if="feedback" class="red-text center">{{ feedback }}</p>
            <div class="field">
                <button class="btn deep-purple">Longin</button>
            </div>
      </form>
  </div>
</template>

<script>
import db from '@/firebase/init.js'
import firebase from 'firebase'

export default {
  name: 'Login',
  data: function(){
      return {
            email: null,
            password: null,
            feedback: null,
            lat: 36.1417,
            lng: 137.5839
      }
  },
  methods: {
      login(){
          if(this.email && this.password){
              firebase.auth().signInWithEmailAndPassword(this.email, this.password)
              .then(() => {
                    let uid = firebase.auth().currentUser.uid
                    db.collection('users').where('user_id', '==', uid).get()
                    .then(snapshot => {
                        snapshot.forEach((doc) => {
                            db.collection('users').doc(doc.id).update({
                                loginTime: Date.now()
                            })
                        })
                    }).then(()=>{
                        console.log('login successfully')
                    })
                //   console.log('uid:',uid)
                //   console.log('login user:',user)
                  this.$router.push({ name:'GMap' })
              }).catch(err=> {
                  this.feedback = err.message
              })
              this.feedback = null
          }else{
              this.feedback = 'Please fill in both fields'
          }
      },
        renderMap(){
          const map = new google.maps.Map(document.getElementById('map'), {
              center: { lat: this.lat, lng: this.lng },
              zoom: 7,
              maxZoom: 15,
              minZoom: 3,
              streetViewControl: false
          })
      }
  },
    mounted(){
        this.renderMap()
    }
}
</script>

<style>

.login{
  max-width: 400px;
  margin-top: 60px;
}
.login h2{
  font-size: 2.4em;
}
.login .field{
  margin-bottom: 16px;
}

</style>
