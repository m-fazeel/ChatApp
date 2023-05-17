import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useSocket } from "../context/socket.context";
import RoomsContainer from "../containers/Rooms";
import MessagesContainer from "../containers/Messages";
import { useEffect, useRef } from "react";

export default function Home() {
  const { socket, username, setUsername } = useSocket();
  const usernameRef = useRef<HTMLInputElement | null>(null);

  function handleSetUsername() {
    const value = usernameRef.current?.value;
    if (!value) {
      return;
    }
    setUsername(value);
    localStorage.setItem("username", value);
  }

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.value = localStorage.getItem("username") || "";
    }
  }, []);

  return (
    <div className={styles.stars}>


      <Head>
        <title>ChatApp</title>
        {/* Setup favicon next to the title. It is in the public folder */}
        <link rel="icon" href="/favicon.png" type="x-icon" />


        {/* <meta name="description" content="Homepage" /> */}
      </Head>
            
          {/* <div className={styles.twinkling}></div> */}
          {/* <div className={styles.clouds}></div> */}
      {!username && (
  
        <div className={styles.usernameWrapper}>
          
          <div className={styles.headingdiv}>
            <h1 className={styles.heading}>Connect Anonymously!!</h1>
            <h2 className={styles.heading2}>Enter your anonymous name to join </h2>
          </div>
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png" alt="" className={styles.imag}></img>
          <div className={styles.usernameInner}>
            <input placeholder="Username" ref={usernameRef} />
            <button className="cta" onClick={handleSetUsername}>
              START
            </button>
          </div>
          
        </div>
      )}
      {username && (
        <div className={styles.container}>
          <RoomsContainer />
          <MessagesContainer />
        </div>
      )}
    </div>
  );
}
