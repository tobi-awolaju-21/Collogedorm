//voice chat shiii

let options = 
{
    // Pass your App ID here.
    appId: '1220131dc0434406a1462622e90a13af',
    // Set the channel name.
    channel: 'Deyplay',
    // Pass your temp token here.
    token: null,
    // Set the user ID.
    uid: null,
};

let channelParameters =
{
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
    // A variable to hold the remote user id.
  remoteUid: null,
};
async function startBasicCall()
{
  // Create an instance of the Agora Engine
  const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });
  
  // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
  agoraEngine.on("user-published", async (user, mediaType) =>
  {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType);
    console.log("subscribe success");
    addView("audience", user.uid,user.uid);


    // Subscribe and play the remote audio track.
    if (mediaType == "audio")
    {
      channelParameters.remoteUid=user.uid;
      // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Play the remote audio track. 
      channelParameters.remoteAudioTrack.play();
      showMessage("Remote user connected: " + user.uid);
    }

    // Listen for the "user-unpublished" event.
    agoraEngine.on("user-unpublished", user =>
    {
      console.log(user.uid + "has left the channel");
      //change this to a sync firebase shii in the future
      removeView("audience", user.uid);
      showMessage(user.uid + "has left the channel");
    });
  });

  window.onload = function ()
  {
    // Listen to the Join button click event.
    document.getElementById("join").onclick = async function ()
    {
      // Join a channel.
      await agoraEngine.join(options.appId, options.channel, options.token, options.uid);
      showMessage("Joined channel: " + options.channel);
      // Create a local audio track from the microphone audio.
      channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Publish the local audio track in the channel.
      await agoraEngine.publish(channelParameters.localAudioTrack);
      console.log("Publish success!");
      addView("hosts", "Host","Host");
    }
    
    // Listen to the Leave button click event.
    document.getElementById('leave').onclick = async function ()
    {
      // Destroy the local audio track.
      channelParameters.localAudioTrack.close();
      // Leave the channel
      await agoraEngine.leave();
      console.log("You left the channel");
      // Refresh the page for reuse
      window.location.reload();
    }
  }
}


//this function updates our Ui
function showMessage(text){
  document.getElementById("message").textContent = text;
}


//add view
function addView(targetView, Id, Name) {
  // Find the target div with the class "audience"
  const audienceDiv = document.querySelector('.' + targetView);

  // Create a new div element for the view
  const viewDiv = document.createElement("div");

  // Generate a unique ID for the view (you can use a custom logic to generate unique IDs)
  viewDiv.id = Id;

  // Add the view HTML to the new div element, including the dynamic "Name" parameter
  viewDiv.innerHTML = `
 
  <div class="avater">
            <div class="pipe">
                <img src="./images.jpg" style="width: 50px; height: 50px; border-radius:50%;">
                
                <div class="hand" style="margin-top: 30px; margin-left: -10px; opacity: 100%;">🖐</div>
            </div>
            <div style="color: gray;">${Name}</div>
        </div>
`;

  // Append the new view div to the "audience" div
  audienceDiv.appendChild(viewDiv);

  return viewDiv; // Return the view div for future reference
}

function removeView(targetView, Id) {
  // Find the target div with the class "audience"
  const audienceDiv = document.querySelector(".audience");

  // Find the view div with the specified unique ID
  const viewToRemove = document.getElementById(Id);

  if (viewToRemove) {
      // If the view exists, remove it from the "audience" div
      audienceDiv.removeChild(viewToRemove);
  } else {
      console.error("View not found:", Id);
  }
}







startBasicCall();



// Calculate the number of columns based on the display width
const container = document.querySelector('.audience');
const screenWidth = window.innerWidth;
const columnWidth = 90; // Set your desired column width

const columns = Math.floor(screenWidth / columnWidth);

container.style.gridTemplateColumns = `repeat(${columns}, ${columnWidth}px)`;


 // JavaScript to toggle the chat popup
 const togglePopupButton = document.getElementById("togglePopup");
 const chatPopup = document.getElementById("chatPopup");

 togglePopupButton.addEventListener("click", function () {
     if (chatPopup.style.display === "block") {
         chatPopup.style.display = "none";
     } else {
         chatPopup.style.display = "block";
     }
 });

 

