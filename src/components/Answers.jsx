import Highlighter from "react-highlight-words";
import { removeStopwords } from "stopword";
import { useEffect, useState } from "react";
import { haveSummary } from "../worker";

const Answers = ({ answers1, question }) => {

  const [sum1, setSum1] = useState([]);
  const [sum2, setSum2] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  useEffect(() => {
    console.log(answers1)
    setAnswers(answers1)
  },[answers1])

  console.log(answers)

  console.log(sum1);


  const getSummary = () => {
    let count = 0;

    const int = setInterval(() => {}, 1000);

    ss1(sum1).then((res) => {
      console.log(res);
      setSum2(res);
    });
  };
  const ss1 = async (text) => await haveSummary(text);

  const displayDescription = (answer) => {
    console.log(answer)
    if (answer?.payload.full_description) {
      return answer?.payload.full_description;
    } else if (answer?.payload.content) {
      return answer?.payload.content;
    } else {
      return answer?.payload.description;
    }
  };

  const generateSummary = async (e,answer) => {
    console.log(answer)
        ss1(displayDescription(answer)).then(res => {
            console.log(res)
            let updatedAnswer = []
            answers.map(item => {
                if(item.id == answer.id) {
                    item.summary = res[0].summary_text
                }
                updatedAnswer.push(item)
            })
            setAnswers(updatedAnswer)


            // setAnswers(prev => 
            //     prev.map(ans => ans.id === answer.id ? { ...answer, summary: res[0].summary_text} : answer)
            // )
            
        }).catch(err => {
            console.log(err)
        })
  }


  const arr = question
    .replace(/[^a-zA-Z0-9]/g, " ")
    .trim()
    .split(" ");
  console.log(removeStopwords(arr));
  return (
    <div>
      {loader ? (
        <p>Loading....</p>
      ) : (
        <ul>
          {answers?.map((item) => (
            <div key={item.id} className="my-5">
              <h3>{item.payload.title}</h3>
              <div>
                <p>Similarity score: {item.score}</p>
              </div>
              <div>
                <p>Summary: {item?.summary}</p>

                <div onClick={() => setSelectedAnswer(item)} 
                className={`${selectedAnswer?.id === item.id ? 'open-answer': 'close-answer'} max-h-[20vh] overflow-auto`

                    
                }>

       
                <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={removeStopwords(arr)}
                  autoEscape={true}
                  textToHighlight={displayDescription(item)}
                  />
                  </div>
                  <button onClick={(e) => generateSummary(e,item)}>Generate Summary</button>
              </div>
              <div></div>
              <hr />
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Answers;
