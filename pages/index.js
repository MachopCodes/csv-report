import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Hero from "../Components/Hero"
import { makeStyles } from "@material-ui/core";
import axios from 'axios'
import { useSession } from 'next-auth/client';

export default function Index() {
  const useStyles = makeStyles((theme) => ({
    background: {
      backgroundImage: "url(https://fsb.zobj.net/crop.php?r=lcH6WsBNq_DsVqxgauVr2rgbho_Kx7v3_rK9jMovrdIcV01qOrU2x-ypfh4whSbi7XQ8rPPAdRl2VeoZJkYq31fiC1F5yMab7Av1pyrApZ5Pukg1SCmSrmNCq9wOcf0YB7yvrWR-t3pD1uAw)",
      backgroundSize: "625px",
      height: "1000px"
    },
  }));

  const classes = useStyles();
  const [subscription, setSubscription] = useState()
  const [user, setUser] = useState();
  const [session, loading] = useSession()

  const fetchSubscriptions = async () => {
    const result = await axios.get(`/api/subscription/${user}`);
    setSubscription(result.data)
  };
  useEffect(() => user && fetchSubscriptions(user), [user])
  useEffect(() => session && setUser(session.user.email), [session])

  return (
    <div className={classes.background}>
      <p>hello this is an app</p>
    </div>
  );
}
