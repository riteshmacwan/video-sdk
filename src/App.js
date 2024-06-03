import logo from './logo.svg';
import './App.css';
import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

function ParticipantView(props) {
  const micRef = useRef(null)
  const { webcamStream, micStream, micOn, webcamOn, isLocal, displayName } = useParticipant(props.participantId)

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track)
      return mediaStream
    }
  }, [webcamStream, webcamOn])

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track)

        micRef.current.srcObject = mediaStream;
        micRef.current.play().catch((error) => console.log("videoElem.current.play() failed", error))
      } else {
        micRef.current.srcObject = null
      }
    }
  }, [micStream, micOn])

  return (
    <div>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          height={"300px"}
          width={"300px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function MeetingView() {
  const [joined, setJoined] = useState(null)

  const { join, participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined('JOINED')
    }
  })

  const joinMeeting = () => {
    setJoined("JOINING");
    join()
  }
  return (<div className='container'>
    {joined && joined == 'JOINED' ? (<div>
      {[...participants.keys()].map((participantId) => (
        <ParticipantView
          participantId={participantId}
          key={participantId}
        />
      ))}
    </div>) : joined && joined == 'JOINING' ? (<p>Joining the meeting...</p>) : (<button onClick={joinMeeting}>Join meeting</button>)}

  </div>)
}

function App() {
  return (
    <div className="App">
      Ritesh macwan
      <MeetingProvider
        config={{
          meetingId: "k1nf-t06u-ppjv",
          micEnabled: true,
          webcamEnabled: true,
          name: "riteshmacwan's Org"
        }}
        token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJiYzZiNjNjZi01ZWNkLTQwZTctOGIzYy00NTYyNTQxNzYxZjkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcxNjg3NjQ4MCwiZXhwIjoxNzE2OTYyODgwfQ.8FunHffQ9H8NdPAWSpE__aHeflvALo3HAhSFYP8ews0'>

        <MeetingView />
      </MeetingProvider>
    </div>
  );
}

export default App;
