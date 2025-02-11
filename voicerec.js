

  let recorder;
  let audioPlayer = document.getElementById('audioPlayer');
  
  document.getElementById('recordButton').onclick = function () {
	  alert('1');
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        recorder = new RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/wav',
        });
        recorder.startRecording();
        document.getElementById('stopButton').disabled = false;
        this.disabled = true;
      });
  };

  document.getElementById('stopButton').onclick = function () {
    recorder.stopRecording(function () {
      let audioURL = recorder.toURL();
      audioPlayer.src = audioURL;
      // Convert audio to Blob (for uploading)
      let audioBlob = recorder.getBlob();
      uploadAudio(audioBlob);
    });
  };

 function uploadAudio(audioBlob) {
    const apiUrl = "https://api-inference.huggingface.co/models/openai/whisper-large-v3";
    
    // Create a FormData object to send the file as multipart/form-data
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav"); // Assuming the audio is in WAV format

    // Set up the request headers
    const headers = {
        "Authorization": "Bearer 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",
    };

    // Set up the fetch request to upload the audio file
    fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: formData, // Send the FormData containing the audio file
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
	    alert(data["text"]);
    })
    .catch(error => {
        console.error("Error uploading audio:", error);
    });
}

  function uploadAudioToAPI(audioBlob) {
    let formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'authorization': 'YOUR_ASSEMBLYAI_API_KEY',  // Replace with your API key
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.upload_url) {
        getTranscription(data.upload_url);
      }
    })
    .catch(error => {
      console.error('Error uploading audio:', error);
    });
  }

  function getTranscription(audioUrl) {
    fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'authorization': 'YOUR_ASSEMBLYAI_API_KEY',  // Replace with your API key
      },
      body: JSON.stringify({ audio_url: audioUrl }),
    })
    .then(response => response.json())
    .then(data => {
      let transcription = data.text;
      alert('Transcription: ' + transcription);
    })
    .catch(error => {
      console.error('Error getting transcription:', error);
    });
  }
