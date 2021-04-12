import React, { useState} from "react";
import axios from "axios"

export default function Index() {
  const [marks, setMarks] = useState()
  const [clicked, setClicked] = useState(false)
  const handleClick = async (e) => {
    e.preventDefault()
    setClicked(!clicked)
    const res = await axios.get(`/api/csvconvert`)
    setMarks(res.data)
  }
  const mString = marks && JSON.stringify(marks).replace("\r", "")
  marks 
    ? console.log('Report Card Object: ', marks)
    : console.log('Hello! Please press the button to view the JSON Report Card')

  return (
    <div>
      <h1>Report Card File Reader</h1>
      <h3>This application will read files if they are in the public folder and correctly formatted</h3>
      <h4>files required:</h4>
      <ul>
        <li>courses.csv</li>
        <li>marks.csv</li>
        <li>students.csv</li>
        <li>tests.csv</li>
      </ul>
      <h5>Files need to be in public folder and named in that way to be read by this system</h5>
      <button onClick={handleClick}>press this to read csv files</button>
      {clicked 
      ? mString
        ? <div>
            <h2>Success! Check the console for the JSON object. </h2>
            <p>{mString}</p>
          </div>
        : <p>Loading</p>
      : <p>JSON Output:</p>
      }
    </div>
  );
}
