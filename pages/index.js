import React, { useState} from "react";
import axios from "axios"

export default function Index() {
  const [marks, setMarks] = useState()
  const handleClick = async (e) => {
    e.preventDefault()
    const res = await axios.get(`/api/csvconvert`)
    setMarks(res.data)
  }
    console.log('data: ', marks)

  return (
    <div>
      <p>hello this is an app</p>
      <button onClick={handleClick}>press this to read csv files</button>
    </div>
  );
}
