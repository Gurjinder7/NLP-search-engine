import Highlighter from "react-highlight-words";
import { removeStopwords, eng } from "stopword";
import { useEffect, useState } from "react";
import SentimentScale from "./SentimentScale";

const Answers = ({ answers, question, summary = null, getSummary1 = () => {}, summaryAnswer }) => {

  const [answers1, setAnswers1] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    console.log(summaryAnswer)
    let summaryAns = []
    if(summaryAnswer){
      answers?.map((item) => {
        if(item.id === summaryAnswer.id) {
          summaryAns.push(summaryAnswer)
        } else {
          summaryAns.push(item)
        }
      })
      setAnswers1(summaryAns)
      setLoader(false)
    }
  },[summaryAnswer, answers])
  console.log(answers);

  const displayDescription = (answer) => {
    console.log(answer);
    if (answer?.payload.full_description) {
      return answer?.payload.full_description;
    } else if (answer?.payload.content) {
      return answer?.payload.content;
    } else {
      return answer?.payload.description;
    }
  };

  const generateSummary = async (e, answer) => {
    console.log(answer);

    if(answer.summary) {
      return
    }

    getSummary1(answer)
    setLoader(true)

  };


  console.log(answers);
  const arr = question
    .replace(/[^a-zA-Z0-9]/g, " ")
    .trim()
    .split(" ");
  // console.log(removeStopwords(arr));

  const customStopWords = ['news']
  return (
    <div>
     
        {loader && (
          <div className="w-screen h-screen fixed top-1/2 left-1/2 z-10">
            <div className="loader"></div>
          </div>
        )}
        <ul className={`${loader ? 'blur-sm' : ''}`}>
          {answers?.map((item) => (
            <div key={item.id} className="my-5 p-2">
              <h3 className="text-xl font-semibold">{item.payload.title}</h3>
              <div className="flex justify-between my-2">
                <p className="font-bold text-indigo-600">Similarity score: {item.score}</p>
                <p>Article link: {item?.payload?.link ? <a href={item?.payload?.link} target="_blank" className="underline"> {item?.payload?.source_id}</a> : '-'}</p>
              </div>
              <div>
                {item?.summary && (
                  <p className="font-semibold p-3 bg-gray-100 my-2">Summary: <span className="text-justify"> {item?.summary}</span></p>
                )}
                {/* <p>Sentiments:{item?.sentiment?.label} </p> */}
                {item?.sentiment && (
                  <SentimentScale sentiment={item?.sentiment} />
                  
                )}
                <div
                  onClick={() => setSelectedAnswer(item)}
                  className={`${
                    selectedAnswer?.id === item.id
                      ? "open-answer"
                      : "close-answer"
                  } max-h-[25vh] overflow-auto p-3 text-justify bg-gray-100`}
                >
                  <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={removeStopwords(arr,[...eng,...customStopWords])}
                    autoEscape={true}
                    textToHighlight={displayDescription(item)}
                    caseSensitive={true}
                  />
                </div>
                <button
                  onClick={(e) => generateSummary(e, item)}
                  className="my-3 !bg-gray-300 "
                >
                  Generate Summary
                </button>
              </div>
              <div></div>
              <hr />
            </div>
          ))}
        </ul>
      {/* )} */}
    </div>
  );
};

export default Answers;
